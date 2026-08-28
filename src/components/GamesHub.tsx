import confetti from 'canvas-confetti';
import { Award, Flame, Gamepad2, Heart, Play, RotateCcw, Shield, Sparkles, Trophy, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundFx } from '../lib/audio';
import { translatePhysicalKeyToBijoy } from '../lib/keyboardAdapters';

type GameType = 'falling-letters' | 'word-rain' | 'boss-fight';

interface FallingItem {
  id: string;
  char: string;
  x: number; // percentage 5 to 90
  y: number; // percentage 0 to 100
  speed: number;
}

interface WordItem {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
}

const SAMPLE_GLYPHS = ['ক', 'ত', 'দ', 'প', 'ম', 'ন', 'র', 'ল', 'স', 'হ', 'ব', 'গ', 'জ', 'া', 'ি', 'ু', 'ে'];
const SAMPLE_WORDS = ['বাংলাদেশ', 'কলম', 'সূর্য', 'নদী', 'স্বাধীনতা', 'বিজ্ঞান', 'শিক্ষা', 'স্বপ্ন', 'শান্তি', 'বৃষ্টি', 'আনন্দ'];
const BOSS_JUNCTS = ['ক্ষ', 'জ্ঞ', 'ষ্ণ', 'ক্ত', 'ন্ত', 'দ্ধ', 'স্থ', 'ন্ত্র', 'ষ্ট্র', 'হ্ম'];

export const GamesHub: React.FC = () => {
  const { user, addXp, recordSession } = useApp();
  const [selectedGame, setSelectedGame] = useState<GameType>('falling-letters');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);

  // Game 1 state: Falling letters
  const [fallingLetters, setFallingLetters] = useState<FallingItem[]>([]);

  // Game 2 state: Word Rain
  const [words, setWords] = useState<WordItem[]>([]);
  const [activeWordInput, setActiveWordInput] = useState('');

  // Game 3 state: Boss fight
  const [bossHp, setBossHp] = useState(500);
  const [currentBossGlyph, setCurrentBossGlyph] = useState(BOSS_JUNCTS[0]);
  const [bossAttackAnim, setBossAttackAnim] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setLives(3);
    setFallingLetters([]);
    setWords([]);
    setActiveWordInput('');
    setBossHp(500);
    setCurrentBossGlyph(BOSS_JUNCTS[Math.floor(Math.random() * BOSS_JUNCTS.length)]);
  };

  // End Game
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    soundFx.playError();

    const xpEarned = Math.round(score * 0.5);
    addXp(xpEarned);

    recordSession({
      mode: 'game',
      title: `মিনি গেম (${selectedGame})`,
      keyboardLayout: user.preferredKeyboard,
      netWpm: Math.round(score / 10),
      accuracy: 95,
      durationSeconds: 60,
      xpEarned
    });
  }, [score, selectedGame, user.preferredKeyboard, addXp, recordSession]);

  // Game 1 Loop: Falling letters
  useEffect(() => {
    if (!isPlaying || selectedGame !== 'falling-letters') return;

    // Spawn letters interval
    const spawnInterval = setInterval(() => {
      const char = SAMPLE_GLYPHS[Math.floor(Math.random() * SAMPLE_GLYPHS.length)];
      const newItem: FallingItem = {
        id: `fall-${Date.now()}-${Math.random()}`,
        char,
        x: Math.floor(Math.random() * 80) + 10,
        y: 0,
        speed: 0.6 + Math.random() * 0.5 + score * 0.001
      };
      setFallingLetters((prev) => [...prev, newItem]);
    }, 1200);

    // Animation frame loop
    const loop = () => {
      setFallingLetters((prev) => {
        const updated: FallingItem[] = [];
        let lostLife = false;

        for (const item of prev) {
          const nextY = item.y + item.speed;
          if (nextY >= 92) {
            lostLife = true;
          } else {
            updated.push({ ...item, y: nextY });
          }
        }

        if (lostLife) {
          soundFx.playError();
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) endGame();
            return nextL;
          });
        }
        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      clearInterval(spawnInterval);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, selectedGame, score, endGame]);

  // Key Listener for Falling Letters
  useEffect(() => {
    if (!isPlaying || selectedGame !== 'falling-letters') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Alt' ||
        e.key === 'Meta' ||
        e.key === 'CapsLock' ||
        e.key === 'Tab' ||
        e.key === 'Escape' ||
        e.code?.startsWith('Shift')
      ) {
        return;
      }

      let charTyped = e.key;
      if (user.preferredKeyboard === 'bijoy' || user.preferredKeyboard === 'jatiya') {
        charTyped = translatePhysicalKeyToBijoy(e.key, e.code, e.shiftKey);
      }

      setFallingLetters((prev) => {
        // Find lowest matching letter on screen
        let matchIdx = -1;
        let maxY = -1;
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].char === charTyped && prev[i].y > maxY) {
            maxY = prev[i].y;
            matchIdx = i;
          }
        }

        if (matchIdx !== -1) {
          soundFx.playKeyClick();
          setScore((s) => s + 20 + combo * 2);
          setCombo((c) => c + 1);
          return prev.filter((_, idx) => idx !== matchIdx);
        } else {
          // Miss
          setCombo(0);
          return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, selectedGame, user.preferredKeyboard, combo]);

  // Boss Battle Key Listener
  const handleBossInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value;
    if (val.includes(currentBossGlyph)) {
      soundFx.playKeyClick();
      setBossAttackAnim(true);
      setTimeout(() => setBossAttackAnim(false), 200);

      const nextHp = Math.max(0, bossHp - 50);
      setBossHp(nextHp);
      setScore((s) => s + 50);
      setCombo((c) => c + 1);
      (e.target as HTMLInputElement).value = '';

      if (nextHp <= 0) {
        // Boss Defeated!
        soundFx.playSuccessFanfare();
        try {
          confetti({ particleCount: 120, spread: 80 });
        } catch {
          // Ignore
        }
        setScore((s) => s + 500);
        setIsPlaying(false);
        setGameOver(true);
      } else {
        // Next glyph
        const remaining = BOSS_JUNCTS.filter((g) => g !== currentBossGlyph);
        setCurrentBossGlyph(remaining[Math.floor(Math.random() * remaining.length)]);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b-2 border-[#141210] pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Gamepad2 className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000]">
              GAMIFIED ARCADE & COMBAT &bull; বাংলা আর্কেড
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            বাংলা টাইপিং আর্কেড গেমস
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-2xl leading-relaxed">
            একঘেয়ে ড্রিল বাদ দিয়ে রিয়েলটাইম আর্কেড চ্যালেঞ্জে আঙুলের ক্ষিপ্রতা ও পেশিশক্তি বাড়ান।
          </p>
        </div>

        {/* Game Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FCFBF8] p-1 border-2 border-[#141210]/30 text-xs font-tiro font-bold rounded-xs shadow-2xs">
          {[
            { id: 'falling-letters', label: '১. ঝরে পড়া বর্ণ' },
            { id: 'boss-fight', label: '২. যুক্তাক্ষর বস ফাইট' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedGame(tab.id as GameType);
                setIsPlaying(false);
                setGameOver(false);
              }}
              className={`px-3 py-1.5 transition-colors cursor-pointer rounded-xs ${
                selectedGame === tab.id
                  ? 'bg-[#141210] text-[#F5F2EB]'
                  : 'text-[#141210]/70 hover:bg-[#EDE9DF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 shadow-2xs p-6 sm:p-8 flex flex-col gap-6 rounded-xs">
        {/* Game HUD */}
        <div className="flex items-center justify-between border-b border-[#141210]/15 pb-4">
          <div className="flex items-center gap-6 font-mono text-sm">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#141210]/60 block">
                SCORE
              </span>
              <span className="text-2xl font-bold text-[#141210]">{score}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-amber-800 block">
                COMBO
              </span>
              <span className="text-2xl font-bold text-amber-900">{combo}x</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-5 h-5 ${
                  heart <= lives ? 'text-[#8B0000] fill-[#8B0000]' : 'text-[#141210]/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* GAME 1: Falling Letters Canvas */}
        {selectedGame === 'falling-letters' && (
          <div className="relative w-full h-[400px] bg-[#EDE9DF]/50 border-2 border-[#141210]/20 overflow-hidden flex flex-col justify-between p-4 rounded-xs">
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-[#FCFBF8]/95 backdrop-blur-xs flex flex-col items-center justify-center gap-4 z-10 p-6 text-center">
                <Gamepad2 className="w-12 h-12 text-[#8B0000]" />
                <h3 className="text-2xl font-tiro font-bold text-[#141210]">
                  ঝরে পড়া বর্ণ (Falling Letters)
                </h3>
                <p className="text-xs font-tiro text-[#141210]/75 max-w-sm">
                  ওপর থেকে বর্ণ নিচে পড়ার আগেই কীবোর্ডে সঠিক কী চাপুন। ভুল চাপলে বা বর্ণ নিচে পড়লে হার্ট কমবে।
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold uppercase tracking-wider hover:bg-[#8B0000] transition-all flex items-center gap-2 cursor-pointer shadow-xs rounded-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>গেম শুরু করুন (START)</span>
                </button>
              </div>
            )}

            {/* Falling Characters Elements */}
            {isPlaying && (
              <>
                <div className="absolute inset-0 pointer-events-none">
                  {fallingLetters.map((item) => (
                    <div
                      key={item.id}
                      className="absolute px-3 py-1.5 bg-[#FFFFFF] border-2 border-[#141210] shadow-md font-tiro text-2xl font-bold text-[#141210] rounded-xs transition-transform duration-75"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`
                      }}
                    >
                      {item.char}
                    </div>
                  ))}
                </div>

                {/* Ground Danger Line */}
                <div className="absolute bottom-4 left-0 right-0 border-b-2 border-dashed border-[#8B0000]/60 flex justify-center">
                  <span className="bg-[#8B0000]/10 text-[#8B0000] text-[9px] font-mono uppercase px-2 py-0.5 font-bold rounded-xs">
                    DANGER THRESHOLD
                  </span>
                </div>
              </>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-[#FCFBF8]/95 flex flex-col items-center justify-center gap-4 z-10 text-center p-6">
                <Trophy className="w-12 h-12 text-amber-600" />
                <h3 className="text-3xl font-tiro font-bold text-[#141210]">
                  গেম সমাপ্ত!
                </h3>
                <div className="font-mono text-xl font-bold text-[#141210]">
                  সর্বমোট স্কোর: {score} XP
                </div>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold uppercase tracking-wider hover:bg-[#8B0000] transition-all flex items-center gap-2 cursor-pointer rounded-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>আবার খেলুন (Play Again)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 2: Juktakkhor Boss Fight */}
        {selectedGame === 'boss-fight' && (
          <div className="relative w-full min-h-[400px] bg-[#EDE9DF]/50 border-2 border-[#141210]/20 p-6 sm:p-10 flex flex-col items-center justify-between gap-6 rounded-xs">
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-[#FCFBF8]/95 backdrop-blur-xs flex flex-col items-center justify-center gap-4 z-10 p-6 text-center">
                <Shield className="w-12 h-12 text-[#8B0000]" />
                <h3 className="text-2xl font-tiro font-bold text-[#141210]">
                  যুক্তাক্ষর বস ফাইট (Boss Combat)
                </h3>
                <p className="text-xs font-tiro text-[#141210]/75 max-w-sm">
                  বস মনস্টার জটিল যুক্তাক্ষর ছুড়ছে। সঠিক যুক্তবর্ণ দ্রুত টাইপ করে বসকে পরাস্ত করুন!
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold uppercase tracking-wider hover:bg-[#8B0000] transition-all flex items-center gap-2 cursor-pointer shadow-xs rounded-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>যুদ্ধ শুরু করুন (START COMBAT)</span>
                </button>
              </div>
            )}

            {isPlaying && (
              <div className="w-full flex flex-col items-center gap-6">
                {/* Boss Monster Health Bar */}
                <div className="w-full max-w-md flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-[#8B0000] uppercase">LORD JUKTAKKHOR (BOSS)</span>
                    <span className="text-[#141210]">{bossHp} / 500 HP</span>
                  </div>
                  <div className="w-full h-3 bg-[#EDE9DF] border border-[#141210]/30 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-[#8B0000] transition-all duration-200"
                      style={{ width: `${(bossHp / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Boss Glyph Spotlight */}
                <div
                  className={`w-32 h-32 bg-[#FFFFFF] border-2 border-[#141210] shadow-xl flex items-center justify-center transition-all rounded-xs ${
                    bossAttackAnim ? 'scale-90 bg-[#8B0000]/10 border-[#8B0000]' : 'scale-100'
                  }`}
                >
                  <span className="font-tiro font-bold text-6xl text-[#141210]">
                    {currentBossGlyph}
                  </span>
                </div>

                {/* Input Combat Box */}
                <div className="w-full max-w-sm flex flex-col gap-2">
                  <span className="text-[10px] font-tiro font-bold tracking-wider uppercase text-center text-[#141210]/70">
                    টাইপ করে আক্রমণ করুন:
                  </span>
                  <input
                    type="text"
                    autoFocus
                    placeholder={`টাইপ করুন '${currentBossGlyph}'...`}
                    onChange={handleBossInput}
                    className="w-full bg-[#FFFFFF] border-2 border-[#141210] p-3 text-center text-xl font-tiro font-bold focus:outline-none rounded-xs shadow-inner"
                  />
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-[#FCFBF8]/95 flex flex-col items-center justify-center gap-4 z-10 text-center p-6">
                <Trophy className="w-12 h-12 text-amber-600" />
                <h3 className="text-3xl font-tiro font-bold text-[#141210]">
                  {bossHp <= 0 ? 'বস সম্পূর্ণ পরাজিত!' : 'যুদ্ধ শেষ!'}
                </h3>
                <div className="font-mono text-xl font-bold text-[#141210]">
                  অর্জিত পয়েন্ট: {score} XP
                </div>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold uppercase tracking-wider hover:bg-[#8B0000] transition-all flex items-center gap-2 cursor-pointer rounded-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>পুনরায় যুদ্ধ (Rematch)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
