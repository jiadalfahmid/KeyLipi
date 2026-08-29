import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Download, Flame, Printer, RefreshCw, RotateCcw, Share2, Sparkles, Target, Timer, Zap, Newspaper } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { TYPING_PASSAGES, TypingPassage } from '../data/typingPassages';
import { soundFx } from '../lib/audio';
import { getKeystrokeGuidance, translatePhysicalKeyToBijoy } from '../lib/keyboardAdapters';
import { matchAvroKeystroke, transliterateAvro } from '../lib/avroPhoneticEngine';
import { calculateWpm, splitBanglaGraphemes, splitBanglaTypingTokens, canonicalizeBanglaUnicode, BIJOY_VOWEL_COMPOSITIONS } from '../lib/unicode';
import { TypingHUD } from './TypingHUD';
import { VirtualKeyboard } from './VirtualKeyboard';

export const SpeedTestArena: React.FC = () => {
  const { user, recordSession, recordWeakKey, setActiveTab } = useApp();

  // Test setup
  const [durationSeconds, setDurationSeconds] = useState<number>(60);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPassageId, setSelectedPassageId] = useState<string>('general-1');

  // Filtered passages
  const filteredPassages = useMemo(() => {
    if (selectedCategory === 'all') return TYPING_PASSAGES;
    return TYPING_PASSAGES.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const currentPassage: TypingPassage = useMemo(() => {
    return TYPING_PASSAGES.find((p) => p.id === selectedPassageId) || TYPING_PASSAGES[0];
  }, [selectedPassageId]);

  const graphemes = useMemo(() => splitBanglaGraphemes(currentPassage.text), [currentPassage]);

  // Session state
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subTokenIndex, setSubTokenIndex] = useState(0);
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [errorCount, setErrorCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pressedKeyCode, setPressedKeyCode] = useState<string | null>(null);
  const [pendingVirama, setPendingVirama] = useState(false);
  const [avroBuffer, setAvroBuffer] = useState('');

  // WPM History tick for performance graphing
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [isIdlePaused, setIsIdlePaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());

  // Sub-tokens of the current active grapheme
  const currentGrapheme = graphemes[currentIndex] || '';
  const currentSubTokens = useMemo(() => splitBanglaTypingTokens(currentGrapheme), [currentGrapheme]);
  const activeExpectedToken = currentSubTokens[subTokenIndex] || currentGrapheme;

  // Reset test
  const resetTest = useCallback(() => {
    setIsStarted(false);
    setIsFinished(false);
    setIsIdlePaused(false);
    setCurrentIndex(0);
    setSubTokenIndex(0);
    setErrorIndices(new Set());
    setErrorCount(0);
    setTotalKeystrokes(0);
    setCombo(0);
    setMaxCombo(0);
    setElapsedSeconds(0);
    setPendingVirama(false);
    setAvroBuffer('');
    setWpmHistory([]);
    lastActivityTimeRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    resetTest();
  }, [selectedPassageId, durationSeconds, resetTest]);

  // Finish test
  const finishTest = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    setIsStarted(false);
    setIsIdlePaused(false);
    soundFx.playSuccessFanfare();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {
      // Ignore
    }

    const { netWpm } = calculateWpm(currentIndex, errorCount, Math.max(1, elapsedSeconds));
    const acc = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100) : 100;
    const xp = Math.round(netWpm * 10 + acc * 2);

    recordSession({
      mode: 'speed-test',
      title: `স্পিড টেস্ট (${currentPassage.titleBn})`,
      keyboardLayout: user.preferredKeyboard,
      netWpm,
      accuracy: acc,
      durationSeconds: elapsedSeconds || durationSeconds,
      xpEarned: xp
    });
  }, [currentIndex, errorCount, elapsedSeconds, totalKeystrokes, durationSeconds, currentPassage, user.preferredKeyboard, recordSession, isFinished]);

  // Inactivity/Idle detection loop (Monkeytype style)
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const idleInterval = setInterval(() => {
      if (!isIdlePaused && Date.now() - lastActivityTimeRef.current > 3500) {
        setIsIdlePaused(true);
      }
    }, 400);

    return () => clearInterval(idleInterval);
  }, [isStarted, isFinished, isIdlePaused]);

  // Timer loop - pauses when idle
  useEffect(() => {
    if (isStarted && !isFinished && !isIdlePaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next >= durationSeconds) {
            setTimeout(() => {
              finishTest();
            }, 0);
          }
          return next;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isFinished, isIdlePaused, durationSeconds, finishTest]);

  // Monitor timer tick for WPM samples
  useEffect(() => {
    if (!isStarted || isFinished || isIdlePaused) return;

    if (elapsedSeconds > 0 && elapsedSeconds % 2 === 0) {
      const { netWpm } = calculateWpm(currentIndex, errorCount, elapsedSeconds);
      setWpmHistory((hist) => [...hist, netWpm]);
    }
  }, [elapsedSeconds, isStarted, isFinished, isIdlePaused, currentIndex, errorCount]);

  // Handle Char input
  const handleInput = useCallback(
    (inputChar: string, rawCode?: string) => {
      if (isFinished || currentIndex >= graphemes.length) return;

      lastActivityTimeRef.current = Date.now();
      if (isIdlePaused) {
        setIsIdlePaused(false);
      }

      if (!isStarted) {
        setIsStarted(true);
      }

      const expectedToken = currentSubTokens[subTokenIndex] || currentGrapheme;

      // Swaroborno auto-composition handling
      if (user.preferredKeyboard === 'bijoy' || user.preferredKeyboard === 'jatiya') {
        const swarobornoList = ['আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ঔ'];
        if (inputChar === '্' && swarobornoList.includes(expectedToken) && !pendingVirama) {
          setPendingVirama(true);
          soundFx.playKeyClick(rawCode || 'KeyG');
          setTotalKeystrokes((prev) => prev + 1);
          return;
        }

        if (pendingVirama) {
          setPendingVirama(false);
          const composed = BIJOY_VOWEL_COMPOSITIONS[`্+${inputChar}`] || inputChar;
          inputChar = composed;
        }
      }

      setTotalKeystrokes((prev) => prev + 1);

      // Check full grapheme match or sub-token match with canonicalized Unicode
      const normInput = canonicalizeBanglaUnicode(inputChar);
      const normCurrentGrapheme = canonicalizeBanglaUnicode(currentGrapheme);
      const normExpectedToken = canonicalizeBanglaUnicode(expectedToken);

      const isFullGraphemeMatch =
        normInput === normCurrentGrapheme ||
        (normCurrentGrapheme === ' ' && normInput === ' ');

      const isSubTokenMatch =
        normInput === normExpectedToken ||
        (normExpectedToken === ' ' && normInput === ' ');

      if (isFullGraphemeMatch) {
        soundFx.playKeyClick(rawCode || currentGrapheme);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);
        if (nextCombo % 10 === 0) soundFx.playComboChime(nextCombo);

        recordWeakKey(currentGrapheme, false);
        setSubTokenIndex(0);
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);

        if (nextIdx >= graphemes.length) {
          finishTest();
        }
      } else if (isSubTokenMatch) {
        soundFx.playKeyClick(rawCode || expectedToken);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);
        if (nextCombo % 10 === 0) soundFx.playComboChime(nextCombo);

        recordWeakKey(expectedToken, false);

        if (subTokenIndex + 1 >= currentSubTokens.length) {
          setSubTokenIndex(0);
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);

          if (nextIdx >= graphemes.length) {
            finishTest();
          }
        } else {
          setSubTokenIndex((prev) => prev + 1);
        }
      } else {
        soundFx.playError();
        setCombo(0);
        setErrorCount((prev) => prev + 1);
        setErrorIndices((prev) => new Set(prev).add(currentIndex));
        recordWeakKey(expectedToken, true);
      }
    },
    [
      isFinished,
      currentIndex,
      graphemes,
      currentGrapheme,
      currentSubTokens,
      subTokenIndex,
      isStarted,
      combo,
      maxCombo,
      user.preferredKeyboard,
      pendingVirama,
      recordWeakKey,
      finishTest
    ]
  );

  // Global Keydown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Finished state keyboard controls
      if (isFinished) {
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          resetTest();
          return;
        }
        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          window.print();
          return;
        }
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          setActiveTab('lesson-player');
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setActiveTab('learn');
          return;
        }
        return;
      }

      // Quick restart shortcut: Tab or Ctrl+Enter
      if (e.key === 'Tab' || (e.ctrlKey && e.key === 'Enter')) {
        e.preventDefault();
        resetTest();
        return;
      }

      // Escape key toggles pause
      if (e.key === 'Escape' && isStarted) {
        e.preventDefault();
        setIsIdlePaused((prev) => !prev);
        return;
      }

      // Duration hotkeys when test not started
      if (!isStarted) {
        if (e.key === '1') {
          setDurationSeconds(30);
          return;
        }
        if (e.key === '2') {
          setDurationSeconds(60);
          return;
        }
        if (e.key === '3') {
          setDurationSeconds(120);
          return;
        }
        if (e.key === '4') {
          setDurationSeconds(300);
          return;
        }
      }

      // If idle paused, any key resumes
      if (isIdlePaused) {
        setIsIdlePaused(false);
        lastActivityTimeRef.current = Date.now();
        if (
          e.key === 'Shift' ||
          e.key === 'Control' ||
          e.key === 'Alt' ||
          e.key === 'Meta' ||
          e.key === 'CapsLock'
        ) {
          return;
        }
      }

      // Ignore standalone modifier keys
      if (
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Alt' ||
        e.key === 'Meta' ||
        e.key === 'CapsLock' ||
        e.code?.startsWith('Shift') ||
        e.code?.startsWith('Control') ||
        e.code?.startsWith('Alt')
      ) {
        return;
      }

      setPressedKeyCode(e.code);
      setTimeout(() => setPressedKeyCode(null), 120);

      if (e.key === 'Backspace') {
        e.preventDefault();
        if (avroBuffer.length > 0) {
          setAvroBuffer((prev) => prev.slice(0, -1));
          return;
        }
        if (pendingVirama) {
          setPendingVirama(false);
          return;
        }
        if (subTokenIndex > 0) {
          setSubTokenIndex((prev) => prev - 1);
          return;
        }
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          setSubTokenIndex(0);
        }
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setAvroBuffer('');
        handleInput(' ', e.code);
        return;
      }

      if (user.preferredKeyboard === 'bijoy' || user.preferredKeyboard === 'jatiya') {
        e.preventDefault();
        const banglaChar = translatePhysicalKeyToBijoy(e.key, e.code, e.shiftKey);
        handleInput(banglaChar, e.code);
      } else {
        // Avro mode: auto register transliteration phonetically
        e.preventDefault();
        const expectedToken = currentSubTokens[subTokenIndex] || currentGrapheme;

        // If direct bangla unicode is entered
        if (e.key === expectedToken || e.key === currentGrapheme) {
          setAvroBuffer('');
          handleInput(e.key, e.code);
          return;
        }

        const res = matchAvroKeystroke(e.key, expectedToken, avroBuffer, currentGrapheme);
        if (res.isMatch) {
          setAvroBuffer('');
          handleInput(expectedToken, e.code);
        } else if (res.newBuffer.length > 0 && res.newBuffer !== avroBuffer) {
          setAvroBuffer(res.newBuffer);
          soundFx.playKeyClick(e.code);
          setTotalKeystrokes((prev) => prev + 1);
        } else {
          setAvroBuffer('');
          const transliterated = transliterateAvro(e.key);
          handleInput(transliterated || e.key, e.code);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isFinished,
    isStarted,
    isIdlePaused,
    user.preferredKeyboard,
    currentIndex,
    subTokenIndex,
    currentGrapheme,
    currentSubTokens,
    pendingVirama,
    avroBuffer,
    handleInput,
    resetTest,
    setActiveTab
  ]);

  const { netWpm, cpm } = useMemo(() => {
    return calculateWpm(currentIndex, errorCount, Math.max(1, elapsedSeconds));
  }, [currentIndex, errorCount, elapsedSeconds]);

  const accuracy = useMemo(() => {
    if (totalKeystrokes === 0) return 100;
    const acc = Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100);
    return Math.max(0, Math.min(100, acc));
  }, [totalKeystrokes, errorCount]);

  const keystrokeGuide = useMemo(() => {
    if (user.preferredKeyboard === 'avro') {
      if (!currentGrapheme) return [];
      const fullGuide = getKeystrokeGuidance(currentGrapheme, 'avro');
      if (avroBuffer.length > 0 && fullGuide.length > avroBuffer.length) {
        return fullGuide.slice(avroBuffer.length);
      }
      return fullGuide;
    }

    if (!activeExpectedToken) return [];
    const fullGuide = getKeystrokeGuidance(activeExpectedToken, user.preferredKeyboard);
    if (pendingVirama && fullGuide.length > 1) {
      return fullGuide.slice(1);
    }
    return fullGuide;
  }, [activeExpectedToken, currentGrapheme, user.preferredKeyboard, pendingVirama, avroBuffer]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header and Controls */}
      <div className="border-b-2 border-[#141210] pb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000]">
              অফিশিয়াল মূল্যায়ন &bull; দ্রুততার লড়াই
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            বাংলা টাইপিং স্পিড টেস্ট অ্যারেনা
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-2xl leading-relaxed">
            জাতীয় মানদণ্ডে গতি ও নির্ভুলতা যাচাই করুন এবং তাৎক্ষণিকভাবে মুদ্রণযোগ্য গ্যাজেট সার্টিফিকেট অর্জন করুন।
          </p>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-1 bg-[#FCFBF8] p-1.5 border-2 border-[#141210]/30 shadow-2xs font-mono text-xs">
          {[30, 60, 120, 300].map((sec) => (
            <button
              key={sec}
              onClick={() => setDurationSeconds(sec)}
              className={`px-3 py-1.5 transition-colors cursor-pointer rounded-xs ${
                durationSeconds === sec
                  ? 'bg-[#141210] text-[#F5F2EB] font-bold'
                  : 'text-[#141210]/70 hover:bg-[#EDE9DF]'
              }`}
            >
              {sec < 60 ? `${sec}s` : `${sec / 60}m`}
            </button>
          ))}
        </div>
      </div>

      {!isFinished ? (
        <div className="flex flex-col gap-6">
          {/* Passage Filter and Selection Bar */}
          <div className="bg-[#FCFBF8] p-4 border-2 border-[#141210]/30 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs font-tiro">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold uppercase tracking-wider text-[#141210]/60 text-[10px] font-mono">
                ক্যাটাগরি:
              </span>
              {['all', 'easy', 'general', 'literature', 'news', 'office', 'juktakkhor'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer font-bold ${
                    selectedCategory === cat
                      ? 'bg-[#141210] text-[#F5F2EB]'
                      : 'bg-[#EDE9DF] text-[#141210]/80 hover:bg-[#DDD8CE]'
                  }`}
                >
                  {cat === 'all'
                    ? 'সকল'
                    : cat === 'easy'
                    ? 'সহজ'
                    : cat === 'general'
                    ? 'সাধারণ'
                    : cat === 'literature'
                    ? 'সাহিত্য'
                    : cat === 'news'
                    ? 'সংবাদ'
                    : cat === 'office'
                    ? 'দাপ্তরিক'
                    : 'যুক্তাক্ষর'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[#141210]/60 text-[10px] font-mono">
                অনুচ্ছেদ:
              </span>
              <select
                value={selectedPassageId}
                onChange={(e) => setSelectedPassageId(e.target.value)}
                className="bg-[#FCFBF8] border-2 border-[#141210]/30 px-3 py-1 text-xs font-tiro font-bold focus:outline-none cursor-pointer rounded-xs"
              >
                {filteredPassages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titleBn} ({p.categoryNameBn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Typing Stage */}
          <TypingHUD
            graphemes={graphemes}
            currentIndex={currentIndex}
            errorIndices={errorIndices}
            currentInputChar=""
            wpm={netWpm}
            cpm={cpm}
            accuracy={accuracy}
            errorCount={errorCount}
            combo={combo}
            elapsedSeconds={elapsedSeconds}
            timeLimitSeconds={durationSeconds}
            keystrokeGuide={keystrokeGuide}
            subGraphemeIndex={subTokenIndex}
            subGraphemeTotal={currentSubTokens.length}
            isPaused={isIdlePaused}
            onResume={() => {
              setIsIdlePaused(false);
              lastActivityTimeRef.current = Date.now();
            }}
            showTwoLineCarousel={true}
          />

          {/* Quick Keyboard Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#EDE9DF]/70 border border-[#141210]/20 text-[11px] font-mono text-[#141210]/70 rounded-xs select-none">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[#FCFBF8] border border-[#141210]/30 rounded font-bold shadow-2xs">Tab ⇥</kbd>
                <span>রিস্টার্ট</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[#FCFBF8] border border-[#141210]/30 rounded font-bold shadow-2xs">Esc</kbd>
                <span>বিরতি / রিজিউম</span>
              </span>
              {!isStarted && (
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[#FCFBF8] border border-[#141210]/30 rounded font-bold shadow-2xs">1 - 4</kbd>
                  <span>সময় নির্ধারণ</span>
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#141210]/60 italic font-tiro">
              টাইপিং বন্ধ থাকলে স্বয়ংক্রিয় বিরতি চালু হবে
            </div>
          </div>

          {/* Virtual Keyboard */}
          <VirtualKeyboard
            layoutId={user.preferredKeyboard}
            activeKeyChar={keystrokeGuide[0]?.key || ''}
            activeKeyCode={keystrokeGuide[0]?.code}
            isShiftActive={keystrokeGuide[0]?.shift}
            pressedKeyCode={pressedKeyCode}
            onVirtualKeyPress={(char) => handleInput(char)}
          />
        </div>
      ) : (
        /* Result & Newspaper Certificate View */
        <div className="flex flex-col gap-8">
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/40 p-8 sm:p-12 shadow-md flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#141210]/20 pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000] block mb-1">
                  গতি ও মূল্যায়ন রিপোর্ট
                </span>
                <h2 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210]">
                  টেস্ট ফলাফল সারসংক্ষেপ
                </h2>
                <p className="text-xs font-tiro text-[#141210]/75 mt-1">
                  লেআউট: {user.preferredKeyboard.toUpperCase()} &bull; সময়কাল: {durationSeconds} সেকেন্ড &bull; অনুচ্ছেদ: {currentPassage.titleBn}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={resetTest}
                  className="px-4 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>পুনরায় টেস্ট [Enter ↵ / Tab ⇥]</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-[#EDE9DF] border border-[#141210]/30 text-[#141210] text-xs font-tiro font-bold hover:bg-[#DDD8CE] transition-colors flex items-center gap-1.5 cursor-pointer rounded-xs"
                >
                  <span>প্রিন্ট সার্টিফিকেট [P]</span>
                </button>
                <button
                  onClick={() => setActiveTab('learn')}
                  className="px-3.5 py-2 bg-[#EDE9DF] border border-[#141210]/30 text-[#141210] text-xs font-tiro font-bold hover:bg-[#DDD8CE] transition-colors flex items-center gap-1.5 cursor-pointer rounded-xs"
                >
                  <span>পাঠশালা ম্যাপ [Esc]</span>
                </button>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#EDE9DF] p-6 border-2 border-[#141210]/20 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#141210]/60">গতি (WPM)</span>
                <span className="text-4xl font-bold text-[#141210]">{netWpm}</span>
                <span className="text-[10px] font-tiro text-[#141210]/70">শব্দ প্রতি মিনিট</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#141210]/70">নির্ভুলতা (ACC)</span>
                <span className="text-4xl font-bold text-[#141210]">{accuracy}%</span>
                <span className="text-[10px] font-tiro text-[#141210]/70">নির্ভুলতার হার</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#141210]/60">মোট গতি (CPM)</span>
                <span className="text-4xl font-bold text-[#141210]">{cpm}</span>
                <span className="text-[10px] font-tiro text-[#141210]/70">অক্ষর প্রতি মিনিট</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#8B0000]">ভুল (Errors)</span>
                <span className="text-4xl font-bold text-[#8B0000]">{errorCount}</span>
                <span className="text-[10px] font-tiro text-[#141210]/70">ভুলের সংখ্যা</span>
              </div>
            </div>

            {/* Official Newspaper Certificate */}
            <div className="mt-4 border-4 border-double border-[#141210] p-8 sm:p-12 bg-[#FCFBF8] relative shadow-lg">
              <div className="absolute top-6 right-6 border border-[#141210]/40 bg-[#EDE9DF] px-3 py-1 text-[9px] font-mono uppercase font-bold tracking-widest text-[#141210]/70">
                যাচাইকৃত আইডি: KL-{Date.now().toString().slice(-6)}
              </div>

              <div className="text-center flex flex-col items-center gap-3 font-tiro">
                <div className="w-14 h-14 border-2 border-[#141210] flex items-center justify-center font-serif-editorial text-3xl font-bold bg-[#EDE9DF]">
                  কী
                </div>
                <div className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-[#8B0000]">
                  কীলিপি স্পর্শ টাইপিং একাডেমি
                </div>
                <h3 className="text-2xl sm:text-3xl font-tiro font-bold text-[#141210]">
                  সার্টিফিকেট অব টাইপিং কম্পিটেন্সি
                </h3>
                <p className="text-xs font-tiro text-[#141210]/80 max-w-lg leading-relaxed">
                  এতদ্বারা প্রত্যায়ন করা যাইতেছে যে, উক্ত শিক্ষার্থী বাংলা স্পর্শ টাইপিং পরীক্ষায় সন্তোষজনক দক্ষতা ও গতি প্রদর্শন করিয়াছেন:
                </p>

                <div className="my-3 border-y-2 border-[#141210]/20 py-4 w-full max-w-lg grid grid-cols-3 gap-2 font-mono text-center bg-[#EDE9DF]/40">
                  <div>
                    <span className="text-[10px] font-tiro uppercase text-[#141210]/60 font-bold block">গতি (WPM)</span>
                    <span className="text-2xl font-bold text-[#141210]">{netWpm} WPM</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-tiro uppercase text-[#141210]/60 font-bold block">নির্ভুলতা</span>
                    <span className="text-2xl font-bold text-emerald-800">{accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-tiro uppercase text-[#141210]/60 font-bold block">কীবোর্ড</span>
                    <span className="text-2xl font-bold text-[#141210]">{user.preferredKeyboard.toUpperCase()}</span>
                  </div>
                </div>

                <div className="text-[11px] font-tiro text-[#141210]/60 italic">
                  তারিখ: {new Date().toLocaleDateString('bn-BD')} &bull; জাতীয় মানদণ্ড ও প্রমিত বাংলা বানানরীতি
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
