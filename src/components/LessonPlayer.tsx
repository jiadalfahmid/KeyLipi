import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, RotateCcw, Sparkles, Star } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { soundFx } from '../lib/audio';
import { getKeystrokeGuidance, translatePhysicalKeyToBijoy } from '../lib/keyboardAdapters';
import { matchAvroKeystroke, transliterateAvro } from '../lib/avroPhoneticEngine';
import { calculateWpm, diagnoseMistake, splitBanglaGraphemes, splitBanglaTypingTokens, BIJOY_VOWEL_COMPOSITIONS } from '../lib/unicode';
import { Lesson } from '../types';
import { TypingHUD } from './TypingHUD';
import { VirtualKeyboard } from './VirtualKeyboard';

export const LessonPlayer: React.FC = () => {
  const {
    user,
    selectedLessonId,
    startLesson,
    setActiveTab,
    recordSession,
    recordWeakKey
  } = useApp();

  // Find current lesson
  const currentLesson: Lesson | null = useMemo(() => {
    for (const mod of CURRICULUM_MODULES) {
      const found = mod.lessons.find((l) => l.id === selectedLessonId);
      if (found) return found;
    }
    return CURRICULUM_MODULES[0].lessons[0];
  }, [selectedLessonId]);

  // Lesson sub-stages: 'learn' | 'practice' | 'challenge' | 'completed'
  const [stage, setStage] = useState<'learn' | 'practice' | 'challenge' | 'completed'>('learn');

  // Target text for current stage
  const targetText = useMemo(() => {
    if (!currentLesson) return '';
    if (stage === 'practice') return currentLesson.drillText;
    if (stage === 'challenge') return currentLesson.challengeText;
    return currentLesson.drillText;
  }, [currentLesson, stage]);

  const graphemes = useMemo(() => splitBanglaGraphemes(targetText), [targetText]);

  // Typing state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subTokenIndex, setSubTokenIndex] = useState(0);
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [errorCount, setErrorCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [pressedKeyCode, setPressedKeyCode] = useState<string | null>(null);
  const [mistakeTip, setMistakeTip] = useState<string | null>(null);
  const [pendingVirama, setPendingVirama] = useState(false);
  const [avroBuffer, setAvroBuffer] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sub-tokens of the current active grapheme
  const currentGrapheme = graphemes[currentIndex] || '';
  const currentSubTokens = useMemo(() => splitBanglaTypingTokens(currentGrapheme), [currentGrapheme]);
  const activeExpectedToken = currentSubTokens[subTokenIndex] || currentGrapheme;

  // Reset stage
  const resetSession = useCallback(() => {
    setCurrentIndex(0);
    setSubTokenIndex(0);
    setErrorIndices(new Set());
    setErrorCount(0);
    setTotalKeystrokes(0);
    setCombo(0);
    setMaxCombo(0);
    setElapsedSeconds(0);
    setTimerActive(false);
    setMistakeTip(null);
    setPendingVirama(false);
    setAvroBuffer('');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    resetSession();
    setStage('learn');
  }, [selectedLessonId, resetSession]);

  // Timer tick
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // Current expected token keystroke guide
  const keystrokeGuide = useMemo(() => {
    if (!activeExpectedToken) return [];
    const fullGuide = getKeystrokeGuidance(activeExpectedToken, user.preferredKeyboard);
    if (user.preferredKeyboard === 'avro' && avroBuffer.length > 0 && fullGuide.length > avroBuffer.length) {
      return fullGuide.slice(avroBuffer.length);
    }
    if (pendingVirama && fullGuide.length > 1) {
      return fullGuide.slice(1);
    }
    return fullGuide;
  }, [activeExpectedToken, user.preferredKeyboard, pendingVirama, avroBuffer]);

  // Real-time WPM & accuracy
  const { netWpm, cpm } = useMemo(() => {
    return calculateWpm(currentIndex, errorCount, elapsedSeconds);
  }, [currentIndex, errorCount, elapsedSeconds]);

  const accuracy = useMemo(() => {
    if (totalKeystrokes === 0) return 100;
    const acc = Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100);
    return Math.max(0, Math.min(100, acc));
  }, [totalKeystrokes, errorCount]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  };

  // Completion handler
  const handleCompletion = useCallback(() => {
    if (stage === 'completed') return;
    setTimerActive(false);
    soundFx.playSuccessFanfare();
    triggerConfetti();

    const xpEarned = stage === 'challenge' ? currentLesson?.xpReward || 150 : Math.round((currentLesson?.xpReward || 150) * 0.7);

    recordSession({
      mode: 'lesson',
      title: currentLesson?.title || 'Lesson',
      keyboardLayout: user.preferredKeyboard,
      netWpm,
      accuracy,
      durationSeconds: elapsedSeconds,
      xpEarned
    });

    setStage('completed');
  }, [stage, currentLesson, user.preferredKeyboard, netWpm, accuracy, elapsedSeconds, recordSession]);

  // Input evaluator
  const handleCharInput = useCallback(
    (inputChar: string, rawCode?: string) => {
      if (currentIndex >= graphemes.length) return;

      if (!timerActive) {
        setTimerActive(true);
      }

      const expectedToken = currentSubTokens[subTokenIndex] || currentGrapheme;

      // Swaroborno auto-composition handling (e.g. Bijoy g + f -> আ)
      if (user.preferredKeyboard === 'bijoy' || user.preferredKeyboard === 'jatiya') {
        const swarobornoList = ['আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ঔ'];
        if (inputChar === '্' && swarobornoList.includes(expectedToken) && !pendingVirama) {
          setPendingVirama(true);
          soundFx.playKeyClick(rawCode || 'KeyG');
          setTotalKeystrokes((prev) => prev + 1);
          setMistakeTip(null);
          return;
        }

        if (pendingVirama) {
          setPendingVirama(false);
          const composed = BIJOY_VOWEL_COMPOSITIONS[`্+${inputChar}`] || inputChar;
          inputChar = composed;
        }
      }

      setTotalKeystrokes((prev) => prev + 1);

      // Check full grapheme match (e.g. from IME) or sub-token match
      const isFullGraphemeMatch =
        inputChar.normalize('NFC') === currentGrapheme.normalize('NFC') ||
        (currentGrapheme === ' ' && inputChar === ' ');

      const isSubTokenMatch =
        inputChar.normalize('NFC') === expectedToken.normalize('NFC') ||
        (expectedToken === ' ' && inputChar === ' ');

      if (isFullGraphemeMatch) {
        soundFx.playKeyClick(rawCode || currentGrapheme);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);
        if (nextCombo % 10 === 0) soundFx.playComboChime(nextCombo);

        setMistakeTip(null);
        recordWeakKey(currentGrapheme, false);

        setSubTokenIndex(0);
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);

        if (nextIdx >= graphemes.length) {
          handleCompletion();
        }
      } else if (isSubTokenMatch) {
        soundFx.playKeyClick(rawCode || expectedToken);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);
        if (nextCombo % 10 === 0) soundFx.playComboChime(nextCombo);

        setMistakeTip(null);
        recordWeakKey(expectedToken, false);

        if (subTokenIndex + 1 >= currentSubTokens.length) {
          // Grapheme complete
          setSubTokenIndex(0);
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);

          if (nextIdx >= graphemes.length) {
            handleCompletion();
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

        const diag = diagnoseMistake(expectedToken, inputChar, user.preferredKeyboard);
        setMistakeTip(diag.explanationBn);
      }
    },
    [
      currentIndex,
      graphemes,
      currentGrapheme,
      currentSubTokens,
      subTokenIndex,
      timerActive,
      combo,
      maxCombo,
      user.preferredKeyboard,
      pendingVirama,
      recordWeakKey,
      handleCompletion
    ]
  );

  // Global physical keyboard listener
  useEffect(() => {
    if (stage !== 'practice' && stage !== 'challenge') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore standalone modifier and navigation keys so pressing Shift alone doesn't trigger mistakes
      if (
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Alt' ||
        e.key === 'Meta' ||
        e.key === 'CapsLock' ||
        e.key === 'Tab' ||
        e.key === 'Escape' ||
        e.code?.startsWith('Shift') ||
        e.code?.startsWith('Control') ||
        e.code?.startsWith('Alt')
      ) {
        return;
      }

      setPressedKeyCode(e.code);
      setTimeout(() => setPressedKeyCode(null), 120);

      // Handle Backspace
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

      // If user is typing space
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setAvroBuffer('');
        handleCharInput(' ', e.code);
        return;
      }

      // In Bijoy / Jatiya mode, accurately translate physical key and code
      if (user.preferredKeyboard === 'bijoy' || user.preferredKeyboard === 'jatiya') {
        e.preventDefault();
        const banglaChar = translatePhysicalKeyToBijoy(e.key, e.code, e.shiftKey);
        handleCharInput(banglaChar, e.code);
      } else {
        // Avro mode: auto register transliteration phonetically
        e.preventDefault();
        if (!timerActive) {
          setTimerActive(true);
        }

        const expectedToken = currentSubTokens[subTokenIndex] || currentGrapheme;

        // If direct bangla unicode is entered from OS IME
        if (e.key === expectedToken || e.key === currentGrapheme) {
          setAvroBuffer('');
          handleCharInput(e.key, e.code);
          return;
        }

        const res = matchAvroKeystroke(e.key, expectedToken, avroBuffer);
        if (res.isMatch) {
          setAvroBuffer('');
          handleCharInput(expectedToken, e.code);
        } else if (res.newBuffer.length > 0 && res.newBuffer !== avroBuffer) {
          // Valid multi-key sequence prefix (e.g. user typed 'k' for 'খ')
          setAvroBuffer(res.newBuffer);
          soundFx.playKeyClick();
          setTotalKeystrokes((prev) => prev + 1);
          setMistakeTip(
            `অভ্র ফোনেটিক: '${expectedToken}' এর জন্য পরের কী চাপুন (Buffer: ${res.newBuffer})`
          );
        } else {
          // Mistake / wrong key
          setAvroBuffer('');
          const transliterated = transliterateAvro(e.key);
          handleCharInput(transliterated || e.key, e.code);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    stage,
    user.preferredKeyboard,
    currentIndex,
    subTokenIndex,
    currentGrapheme,
    currentSubTokens,
    avroBuffer,
    pendingVirama,
    timerActive,
    handleCharInput
  ]);

  // Find next lesson
  const nextLessonId = useMemo(() => {
    let currentFound = false;
    for (const mod of CURRICULUM_MODULES) {
      for (const les of mod.lessons) {
        if (currentFound) return les.id;
        if (les.id === selectedLessonId) currentFound = true;
      }
    }
    return null;
  }, [selectedLessonId]);

  if (!currentLesson) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Top Breadcrumb and Lesson Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('learn')}
            className="p-2 border border-[#1A1A1A]/20 bg-[#FFFFFF] hover:bg-[#EAE8E3] text-[#1A1A1A] transition-colors cursor-pointer"
            title="Back to Learning Map"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#1A1A1A]/50">
              LEVEL {currentLesson.levelNumber} &bull; LESSON {currentLesson.id.replace('lesson-', '')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#1A1A1A] tracking-tight">
              {currentLesson.title}
            </h1>
          </div>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-1.5 text-xs font-sans font-semibold">
          <button
            onClick={() => {
              setStage('learn');
              resetSession();
            }}
            className={`px-3 py-1 border transition-colors cursor-pointer ${
              stage === 'learn'
                ? 'bg-[#1A1A1A] text-[#F2F0ED] border-[#1A1A1A]'
                : 'bg-[#FFFFFF] border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F2F0ED]'
            }`}
          >
            ১. জানা (Learn)
          </button>
          <button
            onClick={() => {
              setStage('practice');
              resetSession();
            }}
            className={`px-3 py-1 border transition-colors cursor-pointer ${
              stage === 'practice'
                ? 'bg-[#1A1A1A] text-[#F2F0ED] border-[#1A1A1A]'
                : 'bg-[#FFFFFF] border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F2F0ED]'
            }`}
          >
            ২. অনুশীলন (Practice)
          </button>
          <button
            onClick={() => {
              setStage('challenge');
              resetSession();
            }}
            className={`px-3 py-1 border transition-colors cursor-pointer ${
              stage === 'challenge'
                ? 'bg-[#1A1A1A] text-[#F2F0ED] border-[#1A1A1A]'
                : 'bg-[#FFFFFF] border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-[#F2F0ED]'
            }`}
          >
            ৩. চ্যালেঞ্জ (Challenge)
          </button>
        </div>
      </div>

      {/* STAGE 1: Learn Card */}
      {stage === 'learn' && (
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 p-6 sm:p-10 shadow-sm flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/50 mb-1 block">
                LESSON BLUEPRINT
              </span>
              <h2 className="text-2xl font-serif-editorial font-bold text-[#1A1A1A]">
                {currentLesson.titleEn}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#1A1A1A]/20 bg-[#F2F0ED] flex items-center justify-center font-mono font-bold text-sm">
              +{currentLesson.xpReward} XP
            </div>
          </div>

          <p className="text-base sm:text-lg text-[#1A1A1A]/80 font-bengali leading-relaxed">
            {currentLesson.explanation.bangla}
          </p>

          <div className="bg-[#EAE8E3]/60 p-4 border border-[#1A1A1A]/10">
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#1A1A1A]/60 block mb-2">
              টার্গেট কীসমূহ (TARGET GLYPHS):
            </span>
            <div className="flex flex-wrap gap-2">
              {currentLesson.targetKeys.map((k, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#FFFFFF] border border-[#1A1A1A]/20 font-bengali font-bold text-lg text-[#1A1A1A] shadow-xs"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {currentLesson.explanation.tips.length > 0 && (
            <div>
              <h4 className="text-xs font-sans font-bold tracking-wider uppercase text-[#1A1A1A]/60 mb-2">
                বিশেষ পরামর্শ (PRO TIPS):
              </h4>
              <ul className="space-y-1.5 font-bengali text-sm text-[#1A1A1A]/80 list-disc list-inside">
                {currentLesson.explanation.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-[#1A1A1A]/10 flex justify-end">
            <button
              onClick={() => {
                setStage('practice');
                resetSession();
              }}
              className="px-6 py-3 bg-[#1A1A1A] text-[#F2F0ED] font-sans text-xs font-bold tracking-widest uppercase hover:bg-black transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>অনুশীলন শুরু করি (START DRILL)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2 & 3: Practice & Challenge Typing HUD */}
      {(stage === 'practice' || stage === 'challenge') && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50">
                মোড:
              </span>
              <span className="font-bold text-[#1A1A1A]">
                {stage === 'practice' ? 'গাইডেড প্র্যাকটিস ড্রিল' : 'টাইমড স্পিড চ্যালেঞ্জ'}
              </span>
            </div>
            <button
              onClick={resetSession}
              className="flex items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট (Reset)</span>
            </button>
          </div>

          {/* Real-time Typing HUD Stage */}
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
            keystrokeGuide={keystrokeGuide}
            mistakeTip={mistakeTip}
            subGraphemeIndex={subTokenIndex}
            subGraphemeTotal={currentSubTokens.length}
          />

          {/* Interactive Virtual Keyboard */}
          <VirtualKeyboard
            layoutId={user.preferredKeyboard}
            activeKeyChar={keystrokeGuide[0]?.key || ''}
            activeKeyCode={keystrokeGuide[0]?.code}
            isShiftActive={keystrokeGuide[0]?.shift}
            pressedKeyCode={pressedKeyCode}
            onVirtualKeyPress={(char) => handleCharInput(char)}
          />
        </div>
      )}

      {/* STAGE 4: Completed Result Screen */}
      {stage === 'completed' && (
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 p-8 sm:p-12 shadow-md flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full border-2 border-[#1A1A1A] bg-[#EAE8E3] flex items-center justify-center text-[#1A1A1A]">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#1A1A1A]/50 mb-1 block">
              LESSON COMPLETED
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-editorial font-bold text-[#1A1A1A]">
              দারুণ কাজ! (Splendid Run)
            </h2>
            <p className="text-sm font-bengali text-[#1A1A1A]/70 mt-1">
              তুমি সফলভাবে লেসনটির সমস্ত শর্ত পূরণ করেছো।
            </p>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-7 h-7 ${
                  (accuracy >= 98 && star <= 3) || (accuracy >= 92 && star <= 2) || star === 1
                    ? 'text-amber-500 fill-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Score Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 w-full bg-[#F2F0ED] p-4 border border-[#1A1A1A]/10 text-center font-mono">
            <div>
              <div className="text-[10px] text-[#1A1A1A]/50 uppercase font-sans font-bold">NET SPEED</div>
              <div className="text-2xl font-bold text-[#1A1A1A]">{netWpm} WPM</div>
            </div>
            <div className="border-x border-[#1A1A1A]/10">
              <div className="text-[10px] text-[#1A1A1A]/50 uppercase font-sans font-bold">ACCURACY</div>
              <div className="text-2xl font-bold text-emerald-700">{accuracy}%</div>
            </div>
            <div>
              <div className="text-[10px] text-[#1A1A1A]/50 uppercase font-sans font-bold">XP EARNED</div>
              <div className="text-2xl font-bold text-amber-900">+{currentLesson.xpReward} XP</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setStage('practice');
                resetSession();
              }}
              className="px-4 py-2.5 border border-[#1A1A1A]/20 bg-[#FFFFFF] hover:bg-[#EAE8E3] text-xs font-sans font-bold uppercase transition-colors cursor-pointer"
            >
              আবার চেষ্টা করি (Retry)
            </button>
            {nextLessonId && (
              <button
                onClick={() => startLesson(nextLessonId)}
                className="px-6 py-2.5 bg-[#1A1A1A] text-[#F2F0ED] text-xs font-sans font-bold tracking-wider uppercase hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>পরের লেসন (Next Lesson)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setActiveTab('learn')}
              className="px-4 py-2.5 border border-[#1A1A1A]/20 bg-[#FFFFFF] hover:bg-[#EAE8E3] text-xs font-sans font-bold uppercase transition-colors cursor-pointer"
            >
              লেসন ম্যাপে ফিরি
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
