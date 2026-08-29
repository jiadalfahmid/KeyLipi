import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  Layers,
  Search,
  Sparkles,
  Zap,
  Newspaper,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Trophy,
  Shuffle,
  Volume2,
  Keyboard,
  HelpCircle,
  Copy,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { JUKTAKKHOR_DATABASE } from '../data/juktakkhorData';
import { soundFx } from '../lib/audio';
import { getKeystrokeGuidance, translatePhysicalKeyToBijoy } from '../lib/keyboardAdapters';
import { transliterateAvro } from '../lib/avroPhoneticEngine';
import { canonicalizeBanglaUnicode, splitBanglaGraphemes } from '../lib/unicode';
import { JuktakkhorGroupType, JuktakkhorItem, JuktakkhorMasteryScore, KeyboardLayoutId } from '../types';
import { VirtualKeyboard } from './VirtualKeyboard';

const MASTERY_LEVEL_LABELS: Record<JuktakkhorMasteryScore, { label: string; desc: string; color: string; bg: string }> = {
  0: { label: 'অপরিচিত', desc: 'এখনো শুরু হয়নি', color: 'text-gray-600', bg: 'bg-gray-200' },
  1: { label: 'পরিচিত', desc: 'লেভেল ১ অর্জিত', color: 'text-blue-700', bg: 'bg-blue-100' },
  2: { label: 'অনুশীলিত', desc: 'লেভেল ২ অর্জিত', color: 'text-cyan-800', bg: 'bg-cyan-100' },
  3: { label: 'আয়ত্তাধীন', desc: 'লেভেল ৩ অর্জিত', color: 'text-amber-800', bg: 'bg-amber-100' },
  4: { label: 'নির্ভুল', desc: 'লেভেল ৪ অর্জিত', color: 'text-emerald-800', bg: 'bg-emerald-100' },
  5: { label: 'দ্রুতগতির', desc: 'লেভেল ৫ অর্জিত', color: 'text-indigo-800', bg: 'bg-indigo-100' },
  6: { label: 'মাস্টার', desc: 'পূর্ণ দক্ষতা অর্জিত', color: 'text-amber-300', bg: 'bg-[#141210]' }
};

interface GroupTabDef {
  id: string;
  title: string;
  subtitle: string;
  groupKeys?: string[];
}

const GROUPS: GroupTabDef[] = [
  { id: 'all', title: 'সকল যুক্তবর্ণ', subtitle: 'সম্পূর্ণ ক্যাটালগ' },
  { id: 'group-a', title: 'দল ক — সাধারণ যুক্তবর্ণ', subtitle: 'ক্ত, ন্ত, ন্দ, ম্প, ল্প, ত্ত, ব্দ, স্ক', groupKeys: ['group-a', 'group-a-simple'] },
  { id: 'group-b', title: 'দল খ — র-ফলাযুক্ত', subtitle: 'ক্র, গ্র, প্র, ত্র, দ্র, ব্র, শ্র', groupKeys: ['group-b', 'group-b-fola'] },
  { id: 'group-c', title: 'দল গ — য-ফলাযুক্ত', subtitle: 'ব্য, দ্য, ত্য, ধ্য, ন্য, ম্য', groupKeys: ['group-c', 'group-c-jafola'] },
  { id: 'group-d', title: 'দল ঘ — নাসিক্য ও মূর্ধন্য', subtitle: 'ঙ্ক, ঙ্গ, ঞ্চ, ঞ্জ, ণ্ড, ষ্ট, ষ্ঠ, স্থ', groupKeys: ['group-d', 'group-d-complex'] },
  { id: 'group-e', title: 'দল ঙ — বিশেষ ও অনিয়মিত', subtitle: 'ক্ষ, জ্ঞ, হ্ম, ষ্ণ, চ্ছ, জ্জ, দ্ধ', groupKeys: ['group-e', 'group-e-special'] },
  { id: 'group-f', title: 'দল চ — ত্রিমাত্রিক যুক্তবর্ণ', subtitle: 'ন্ত্র, ষ্ট্র, ক্ষ্ম, ন্দ্র, স্ত্র', groupKeys: ['group-f', 'group-f-multi'] },
  { id: 'unmastered', title: 'অসম্পূর্ণ যুক্তবর্ণ', subtitle: 'অনুশীলন প্রয়োজন' }
];

export const JuktakkhorLab: React.FC = () => {
  const { user, updateJuktakkhorMastery, addXp, setKeyboardLayout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<JuktakkhorItem>(() => JUKTAKKHOR_DATABASE[0]);

  // Practice Modes: 'isolated' | 'words' | 'sentence' | 'quiz'
  const [practiceMode, setPracticeMode] = useState<'isolated' | 'words' | 'sentence' | 'quiz'>('isolated');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceSuccess, setPracticeSuccess] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [avroBuffer, setAvroBuffer] = useState('');
  const [pendingVirama, setPendingVirama] = useState(false);

  // Quiz state
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Get active score for current glyph
  const currentScore: JuktakkhorMasteryScore = (user.juktakkhorMastery?.[activeItem.glyph] ?? 0) as JuktakkhorMasteryScore;

  // Filtered list based on group and search query
  const filteredList = useMemo(() => {
    return JUKTAKKHOR_DATABASE.filter((item) => {
      let matchGroup = false;
      if (selectedGroup === 'all') {
        matchGroup = true;
      } else if (selectedGroup === 'unmastered') {
        const score = user.juktakkhorMastery?.[item.glyph] ?? 0;
        matchGroup = score < 5;
      } else {
        const grp = GROUPS.find((g) => g.id === selectedGroup);
        if (grp?.groupKeys) {
          matchGroup = grp.groupKeys.includes(item.group);
        } else {
          matchGroup = item.group.startsWith(selectedGroup);
        }
      }

      if (!matchGroup) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      const matchGlyph = item.glyph.includes(q);
      const matchBreakdown = item.breakdownText.toLowerCase().includes(q);
      const matchPronun = item.pronunciation.toLowerCase().includes(q);
      const matchWords = item.sampleWords.some((w) => w.includes(q));

      return matchGlyph || matchBreakdown || matchPronun || matchWords;
    });
  }, [searchQuery, selectedGroup, user.juktakkhorMastery]);

  // Current target text for active practice mode
  const currentTargetText = useMemo(() => {
    if (practiceMode === 'isolated') {
      return activeItem.glyph;
    } else if (practiceMode === 'words') {
      const word = activeItem.sampleWords[selectedWordIndex] || activeItem.sampleWords[0] || activeItem.glyph;
      return word;
    } else if (practiceMode === 'sentence') {
      if (activeItem.sampleSentences && activeItem.sampleSentences.length > 0) {
        return activeItem.sampleSentences[0];
      }
      return activeItem.sampleSentence || `${activeItem.sampleWords[0] || activeItem.glyph} দিয়ে শুদ্ধ বাক্য অনুশীলন করুন।`;
    } else {
      return activeItem.glyph;
    }
  }, [practiceMode, activeItem, selectedWordIndex]);

  // Keystrokes guidance based on active layout
  const keystrokeGuide = useMemo(() => {
    return getKeystrokeGuidance(currentTargetText, user.preferredKeyboard);
  }, [currentTargetText, user.preferredKeyboard]);

  // Compute current step in the keystroke sequence
  const currentKeyStep = useMemo(() => {
    if (!keystrokeGuide || keystrokeGuide.length === 0) return null;
    const inputGraphemes = splitBanglaGraphemes(practiceInput);
    const stepIdx = Math.min(inputGraphemes.length, keystrokeGuide.length - 1);
    return keystrokeGuide[stepIdx] || keystrokeGuide[0];
  }, [keystrokeGuide, practiceInput]);

  // Reset practice state when active item or mode changes
  const resetPractice = useCallback((mode: 'isolated' | 'words' | 'sentence' | 'quiz' = practiceMode) => {
    setPracticeMode(mode);
    setPracticeInput('');
    setPracticeSuccess(false);
    setAvroBuffer('');
    setPendingVirama(false);
    setQuizAnswerSelected(null);
    setIsQuizCorrect(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [practiceMode]);

  useEffect(() => {
    resetPractice(practiceMode);
  }, [activeItem.id, practiceMode]);

  // Auto focus input when clicking anywhere on interactive box
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  };

  // Completion handler for practice drill
  const handleDrillSuccess = useCallback(() => {
    setPracticeSuccess(true);
    soundFx.playSuccessFanfare();
    triggerConfetti();

    // Increment repeat count
    setRepeatCount((prev) => prev + 1);

    // Upgrade mastery score dynamically
    const nextScore = Math.min(6, currentScore + 1) as JuktakkhorMasteryScore;
    if (nextScore > currentScore) {
      updateJuktakkhorMastery(activeItem.glyph, nextScore);
      addXp(50);
    } else {
      addXp(20);
    }
  }, [currentScore, activeItem.glyph, updateJuktakkhorMastery, addXp]);

  // Handle live physical input translation & comparison
  const handlePhysicalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (practiceSuccess) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNextItem();
      }
      return;
    }

    if (e.key === 'Backspace') {
      if (avroBuffer.length > 0) {
        e.preventDefault();
        setAvroBuffer((prev) => prev.slice(0, -1));
        return;
      }
      return;
    }

    // Ignore modifiers
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      resetPractice(practiceMode);
      return;
    }

    // Process Bijoy / Jatiya typing
    if (user.preferredKeyboard === 'bijoy' || user.preferredKeyboard === 'jatiya') {
      // Translate physical keystroke to Bijoy character
      const banglaChar = translatePhysicalKeyToBijoy(e.key, e.code, e.shiftKey);
      if (banglaChar) {
        e.preventDefault();
        const nextVal = canonicalizeBanglaUnicode(practiceInput + banglaChar);
        setPracticeInput(nextVal);
        soundFx.playKeyClick(banglaChar);

        const normTarget = canonicalizeBanglaUnicode(currentTargetText);
        if (nextVal === normTarget) {
          handleDrillSuccess();
        } else if (!normTarget.startsWith(nextVal)) {
          setShakeError(true);
          soundFx.playError();
          setTimeout(() => setShakeError(false), 300);
        }
        return;
      }
    } else if (user.preferredKeyboard === 'avro') {
      // Avro Phonetic Transliteration
      if (/^[a-zA-Z0-9`~!@#$%^&*()_+=\-[\]{};':",./<>?]$/.test(e.key)) {
        e.preventDefault();
        const newBuf = avroBuffer + e.key;
        setAvroBuffer(newBuf);
        const transliterated = transliterateAvro(newBuf);
        const nextVal = canonicalizeBanglaUnicode(practiceInput + transliterated);
        soundFx.playKeyClick(e.key);

        const normTarget = canonicalizeBanglaUnicode(currentTargetText);
        if (nextVal === normTarget) {
          setPracticeInput(nextVal);
          setAvroBuffer('');
          handleDrillSuccess();
        } else if (normTarget.startsWith(nextVal)) {
          setPracticeInput(nextVal);
          setAvroBuffer('');
        } else if (!normTarget.startsWith(practiceInput)) {
          setShakeError(true);
          soundFx.playError();
          setTimeout(() => setShakeError(false), 300);
        }
        return;
      }
    }
  };

  // Direct input change handler (for Bangla IME or virtual keys)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = canonicalizeBanglaUnicode(e.target.value);
    setPracticeInput(val);

    if (val.length > 0) {
      soundFx.playKeyClick(val.slice(-1));
    }

    const normTarget = canonicalizeBanglaUnicode(currentTargetText);
    if (val === normTarget) {
      handleDrillSuccess();
    } else if (val.length > 0 && !normTarget.startsWith(val)) {
      setShakeError(true);
      soundFx.playError();
      setTimeout(() => setShakeError(false), 300);
    }
  };

  // Virtual keyboard click handler
  const handleVirtualKeyPress = (char: string) => {
    if (practiceSuccess) return;
    const nextVal = canonicalizeBanglaUnicode(practiceInput + char);
    setPracticeInput(nextVal);
    soundFx.playKeyClick(char);

    const normTarget = canonicalizeBanglaUnicode(currentTargetText);
    if (nextVal === normTarget) {
      handleDrillSuccess();
    } else if (!normTarget.startsWith(nextVal)) {
      setShakeError(true);
      soundFx.playError();
      setTimeout(() => setShakeError(false), 300);
    }
  };

  // Navigation handlers
  const currentIndexInList = filteredList.findIndex((it) => it.id === activeItem.id);

  const handleNextItem = () => {
    if (filteredList.length === 0) return;
    const nextIdx = (currentIndexInList + 1) % filteredList.length;
    setActiveItem(filteredList[nextIdx]);
    soundFx.playKeyClick('next');
  };

  const handlePrevItem = () => {
    if (filteredList.length === 0) return;
    const prevIdx = (currentIndexInList - 1 + filteredList.length) % filteredList.length;
    setActiveItem(filteredList[prevIdx]);
    soundFx.playKeyClick('prev');
  };

  const handleRandomItem = () => {
    if (filteredList.length <= 1) return;
    let randIdx = Math.floor(Math.random() * filteredList.length);
    if (randIdx === currentIndexInList) {
      randIdx = (randIdx + 1) % filteredList.length;
    }
    setActiveItem(filteredList[randIdx]);
    soundFx.playKeyClick('random');
  };

  // Copy glyph / breakdown to clipboard
  const handleCopy = () => {
    const textToCopy = `${activeItem.glyph} = ${activeItem.breakdownText} (${user.preferredKeyboard.toUpperCase()}: ${
      user.preferredKeyboard === 'bijoy'
        ? activeItem.bijoyKeystrokes
        : user.preferredKeyboard === 'avro'
        ? activeItem.avroKeystrokes
        : activeItem.jatiyaKeystrokes || activeItem.bijoyKeystrokes
    })`;
    navigator.clipboard?.writeText(textToCopy);
    setIsCopied(true);
    soundFx.playComboChime(5);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Generate quiz options for decomposition quiz mode
  const quizOptions = useMemo(() => {
    if (practiceMode !== 'quiz') return [];
    const correct = activeItem.glyph;
    const others = JUKTAKKHOR_DATABASE.filter((it) => it.glyph !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((it) => it.glyph);
    return [correct, ...others].sort(() => 0.5 - Math.random());
  }, [practiceMode, activeItem.glyph]);

  const handleQuizSelect = (glyphOption: string) => {
    if (quizAnswerSelected) return;
    setQuizAnswerSelected(glyphOption);
    const isRight = glyphOption === activeItem.glyph;
    setIsQuizCorrect(isRight);

    if (isRight) {
      soundFx.playSuccessFanfare();
      triggerConfetti();
      addXp(40);
      const nextScore = Math.min(6, currentScore + 1) as JuktakkhorMasteryScore;
      if (nextScore > currentScore) {
        updateJuktakkhorMastery(activeItem.glyph, nextScore);
      }
    } else {
      soundFx.playError();
    }
  };

  // Global total mastered count (level 5 or 6)
  const masteredCount = (Object.values(user.juktakkhorMastery || {}) as number[]).filter(
    (s) => s >= 5
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Newspaper Section Header */}
      <div className="border-b-2 border-[#141210] pb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Newspaper className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000]">
              JUKTOBORNO MASTERY TREE &bull; যুক্তবর্ণ ল্যাব
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            যুক্তবর্ণ গাঠনিক বৃক্ষ ও মাস্টার ল্যাব
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-3xl leading-relaxed">
            গ্রুপ A থেকে F পর্যন্ত প্রতিটি যুক্তবর্ণের নিখুঁত ব্যবচ্ছেদ, লাইভ কি-সিকোয়েন্স, একক ড্রিল, শব্দ শৃঙ্খল, বাক্য প্রয়োগ ও ০–৬ স্তরের স্বয়ংক্রিয় মাস্টার স্কোরিং।
          </p>
        </div>

        {/* Global Juktoborno Mastery & Layout Selector */}
        <div className="flex flex-wrap items-center gap-4 bg-[#FCFBF8] p-3.5 border-2 border-[#141210]/40 shadow-2xs">
          <div>
            <div className="text-[10px] text-[#141210]/60 uppercase font-mono font-bold">মাস্টার যুক্তবর্ণ</div>
            <div className="text-lg font-bold text-[#141210] flex items-center gap-1.5 mt-0.5">
              <Trophy className="w-4 h-4 text-amber-700" />
              <span className="font-mono">{masteredCount} / {JUKTAKKHOR_DATABASE.length}</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-[#141210]/20 hidden sm:block"></div>

          {/* Direct Keyboard Layout Switcher */}
          <div>
            <div className="text-[10px] text-[#141210]/60 uppercase font-mono font-bold mb-1">কীবোর্ড লেআউট</div>
            <div className="flex items-center gap-1">
              {[
                { id: 'bijoy', label: 'বিজয়' },
                { id: 'avro', label: 'অভ্র' },
                { id: 'jatiya', label: 'জাতীয়' }
              ].map((k) => (
                <button
                  key={k.id}
                  onClick={() => setKeyboardLayout(k.id as KeyboardLayoutId)}
                  className={`px-2.5 py-1 text-xs font-tiro font-bold transition-all border cursor-pointer ${
                    user.preferredKeyboard === k.id
                      ? 'bg-[#8B0000] text-[#F5F2EB] border-[#8B0000] shadow-xs'
                      : 'bg-[#EDE9DF]/70 text-[#141210] border-[#141210]/20 hover:bg-[#EDE9DF]'
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {GROUPS.map((grp) => {
          const isSelected = selectedGroup === grp.id;
          return (
            <button
              key={grp.id}
              onClick={() => setSelectedGroup(grp.id)}
              className={`px-3.5 py-2 text-xs font-tiro font-bold whitespace-nowrap transition-all border-2 cursor-pointer flex flex-col text-left ${
                isSelected
                  ? 'bg-[#141210] text-[#F5F2EB] border-[#141210] shadow-sm'
                  : 'bg-[#FCFBF8] text-[#141210]/80 border-[#141210]/20 hover:border-[#141210]/60'
              }`}
            >
              <span>{grp.title}</span>
              <span className="text-[10px] opacity-70 font-normal">{grp.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Glyph Matrix Catalog & Quick Controls */}
        <div className="lg:col-span-5 bg-[#FCFBF8] border-2 border-[#141210]/30 p-5 shadow-2xs flex flex-col gap-4 max-h-[720px]">
          {/* Search and Quick Action Toolbar */}
          <div className="flex flex-col gap-2.5 border-b border-[#141210]/20 pb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#8B0000]">
                ক্যাটালগ ({filteredList.length} টি)
              </span>

              {/* Random / Shuffle Button */}
              <button
                onClick={handleRandomItem}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-tiro font-bold bg-[#EDE9DF] border border-[#141210]/25 text-[#141210] hover:bg-[#141210] hover:text-[#F5F2EB] transition-all cursor-pointer"
                title="র্যান্ডম যুক্তবর্ণ অনুশীলন"
              >
                <Shuffle className="w-3 h-3" />
                <span>র্যান্ডম</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="যুক্তবর্ণ, উচ্চারণ বা শব্দ দিয়ে খুঁজুন..."
                className="w-full bg-[#FFFFFF] border border-[#141210]/30 px-3 py-1.5 text-xs font-tiro focus:outline-none focus:border-[#141210]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1.5 text-xs text-gray-500 hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Glyph Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 overflow-y-auto pr-1 scrollbar-thin flex-1">
            {filteredList.length === 0 ? (
              <div className="col-span-full py-12 text-center text-xs font-tiro text-gray-500">
                কোনো যুক্তবর্ণ পাওয়া যায়নি।
              </div>
            ) : (
              filteredList.map((item) => {
                const isSelected = activeItem.id === item.id;
                const score: JuktakkhorMasteryScore = (user.juktakkhorMastery?.[item.glyph] ?? 0) as JuktakkhorMasteryScore;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item);
                      soundFx.playKeyClick(item.glyph);
                    }}
                    className={`p-2.5 flex flex-col items-center justify-between border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#141210] text-[#F5F2EB] border-[#141210] shadow-sm scale-[1.02]'
                        : 'bg-[#EDE9DF]/50 text-[#141210] border-[#141210]/20 hover:bg-[#EDE9DF] hover:border-[#141210]/50'
                    }`}
                  >
                    {/* Mastery Level Badge */}
                    <div
                      className={`absolute top-1 right-1 text-[9px] font-mono font-bold px-1 rounded-2xs ${
                        isSelected
                          ? 'bg-amber-400 text-black'
                          : score >= 5
                          ? 'bg-emerald-700 text-white'
                          : score > 0
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-[#141210]/15 text-[#141210]'
                      }`}
                    >
                      {score}/6
                    </div>

                    <span className="font-tiro font-bold text-2xl leading-none mt-2">
                      {item.glyph}
                    </span>

                    <div className="flex items-center gap-1 mt-2 text-[9px] font-mono opacity-80">
                      <span>{item.pronunciation}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Pagination footer */}
          <div className="flex items-center justify-between border-t border-[#141210]/20 pt-3 text-xs font-tiro">
            <button
              onClick={handlePrevItem}
              disabled={filteredList.length === 0}
              className="flex items-center gap-1 px-3 py-1 bg-[#EDE9DF] border border-[#141210]/25 hover:bg-[#141210] hover:text-[#F5F2EB] transition-all disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>পূর্ববর্তী</span>
            </button>

            <span className="font-mono text-[11px] text-[#141210]/70 font-bold">
              {currentIndexInList >= 0 ? `${currentIndexInList + 1} / ${filteredList.length}` : '—'}
            </span>

            <button
              onClick={handleNextItem}
              disabled={filteredList.length === 0}
              className="flex items-center gap-1 px-3 py-1 bg-[#EDE9DF] border border-[#141210]/25 hover:bg-[#141210] hover:text-[#F5F2EB] transition-all disabled:opacity-40 cursor-pointer"
            >
              <span>পরবর্তী</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Deep Blueprint, Decomposition & 4-Stage Practice Lab */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 sm:p-8 shadow-2xs flex flex-col gap-6">
            {/* Header with Glyph, Pronunciation, Group, and 0-6 Score */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#141210]/20 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-[#141210] text-[#F5F2EB] font-mono text-[10px] font-bold uppercase tracking-wider">
                    {activeItem.group?.toUpperCase() || 'CORE'}
                  </span>
                  <span className="text-xs font-tiro font-bold text-[#8B0000]">
                    &bull; {activeItem.category}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] font-mono text-gray-600 hover:text-black border border-gray-300 px-1.5 py-0.5 ml-2 cursor-pointer"
                    title="কপি করুন"
                  >
                    {isCopied ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-tiro font-bold text-[#141210]">
                    {activeItem.glyph}
                  </span>
                  <span className="font-mono text-lg text-[#141210]/60">
                    /{activeItem.pronunciation}/
                  </span>
                </div>
              </div>

              {/* Mastery Score Box */}
              <div className="bg-[#EDE9DF] border border-[#141210]/25 p-3 flex flex-col items-end font-mono">
                <span className="text-[10px] text-[#141210]/60 uppercase font-bold">
                  দক্ষতার মাত্রা
                </span>
                <div className="text-xl font-bold text-[#141210] flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-700 font-bold">{currentScore} / 6</span>
                  <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${MASTERY_LEVEL_LABELS[currentScore].bg} ${MASTERY_LEVEL_LABELS[currentScore].color}`}>
                    {MASTERY_LEVEL_LABELS[currentScore].label}
                  </span>
                </div>
                <span className="text-[10px] font-tiro text-[#141210]/70 mt-0.5">
                  {MASTERY_LEVEL_LABELS[currentScore].desc}
                </span>
              </div>
            </div>

            {/* Linguistic Explanation */}
            {(activeItem.explanationBn || activeItem.explanation) && (
              <div className="bg-[#EDE9DF]/60 border-l-4 border-[#8B0000] p-3 text-xs sm:text-sm font-tiro text-[#141210]/90 leading-relaxed">
                {activeItem.explanationBn || activeItem.explanation}
              </div>
            )}

            {/* Formula Decomposition: Animated Stage Breakdown */}
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/60 mb-2">
                গাঠনিক ব্যবচ্ছেদ:
              </div>
              <div className="flex items-center gap-2 flex-wrap font-tiro">
                {activeItem.breakdown.map((part, i) => (
                  <React.Fragment key={i}>
                    <span className="px-4 py-2.5 bg-[#EDE9DF] border-2 border-[#141210]/20 font-bold text-2xl text-[#141210] shadow-2xs">
                      {part === '্' ? '্ (হসন্ত)' : part}
                    </span>
                    {i < activeItem.breakdown.length - 1 && (
                      <span className="text-xl font-bold text-[#141210]/40">+</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-xl font-bold text-[#141210]/40">=</span>
                <span className="px-5 py-2.5 bg-[#141210] text-[#F5F2EB] font-bold text-3xl shadow-2xs">
                  {activeItem.glyph}
                </span>
              </div>
            </div>

            {/* Keystrokes by Keyboard Layout with Active Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setKeyboardLayout('bijoy')}
                className={`p-3 border transition-all cursor-pointer ${
                  user.preferredKeyboard === 'bijoy'
                    ? 'bg-[#FAF7F0] border-[#8B0000] shadow-xs'
                    : 'bg-[#EDE9DF]/50 border-[#141210]/15 hover:bg-[#EDE9DF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#8B0000]">
                    বিজয়
                  </span>
                  {user.preferredKeyboard === 'bijoy' && (
                    <span className="text-[9px] bg-[#8B0000] text-white px-1 font-mono uppercase">সক্রিয়</span>
                  )}
                </div>
                <div className="font-mono font-bold text-sm text-[#141210] bg-[#FCFBF8] px-2.5 py-1 border border-[#141210]/20 inline-block">
                  {activeItem.bijoyKeystrokes}
                </div>
              </div>

              <div
                onClick={() => setKeyboardLayout('avro')}
                className={`p-3 border transition-all cursor-pointer ${
                  user.preferredKeyboard === 'avro'
                    ? 'bg-[#FAF7F0] border-[#8B0000] shadow-xs'
                    : 'bg-[#EDE9DF]/50 border-[#141210]/15 hover:bg-[#EDE9DF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#8B0000]">
                    অভ্র
                  </span>
                  {user.preferredKeyboard === 'avro' && (
                    <span className="text-[9px] bg-[#8B0000] text-white px-1 font-mono uppercase">সক্রিয়</span>
                  )}
                </div>
                <div className="font-mono font-bold text-sm text-[#141210] bg-[#FCFBF8] px-2.5 py-1 border border-[#141210]/20 inline-block">
                  {activeItem.avroKeystrokes}
                </div>
              </div>

              <div
                onClick={() => setKeyboardLayout('jatiya')}
                className={`p-3 border transition-all cursor-pointer ${
                  user.preferredKeyboard === 'jatiya'
                    ? 'bg-[#FAF7F0] border-[#8B0000] shadow-xs'
                    : 'bg-[#EDE9DF]/50 border-[#141210]/15 hover:bg-[#EDE9DF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#8B0000]">
                    জাতীয়
                  </span>
                  {user.preferredKeyboard === 'jatiya' && (
                    <span className="text-[9px] bg-[#8B0000] text-white px-1 font-mono uppercase">সক্রিয়</span>
                  )}
                </div>
                <div className="font-mono font-bold text-sm text-[#141210] bg-[#FCFBF8] px-2.5 py-1 border border-[#141210]/20 inline-block">
                  {activeItem.jatiyaKeystrokes || activeItem.bijoyKeystrokes}
                </div>
              </div>
            </div>

            {/* Finger & Tactile Guidance */}
            {activeItem.fingerGuidance && (
              <div className="text-xs font-tiro text-[#141210]/80 bg-[#FAF7F0] p-3 border border-[#141210]/15">
                <span className="font-bold text-[#141210]">আঙুলের নির্দেশনা: </span>
                {activeItem.fingerGuidance}
              </div>
            )}

            {/* Practice Step Mode Selector */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#141210]/20 pb-2">
              {[
                { id: 'isolated', label: '১. একক বর্ণ' },
                { id: 'words', label: '২. শব্দ প্রয়োগ' },
                { id: 'sentence', label: '৩. বাক্য প্রয়োগ' },
                { id: 'quiz', label: '৪. গাঠনিক কুইজ' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => resetPractice(m.id as any)}
                  className={`px-3 py-1.5 text-xs font-tiro font-bold border-2 transition-all cursor-pointer ${
                    practiceMode === m.id
                      ? 'bg-[#141210] text-[#F5F2EB] border-[#141210]'
                      : 'bg-[#EDE9DF]/60 text-[#141210]/80 border-[#141210]/20 hover:bg-[#EDE9DF]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Word Chain Selector (Only when practiceMode === 'words') */}
            {practiceMode === 'words' && activeItem.sampleWords.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-tiro font-bold text-[#141210]/70">শব্দ নির্বাচন:</span>
                {activeItem.sampleWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedWordIndex(idx);
                      setPracticeInput('');
                      setPracticeSuccess(false);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className={`px-2.5 py-1 text-xs font-tiro font-bold border transition-all cursor-pointer ${
                      selectedWordIndex === idx
                        ? 'bg-[#8B0000] text-white border-[#8B0000]'
                        : 'bg-[#EDE9DF] text-[#141210] border-[#141210]/20 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            )}

            {/* Mode 4: Quiz Mode */}
            {practiceMode === 'quiz' ? (
              <div className="bg-[#EDE9DF]/60 p-6 border border-[#141210]/25 flex flex-col gap-4">
                <div className="text-center">
                  <span className="text-xs font-mono font-bold uppercase text-[#8B0000] block mb-1">
                    কুইজ প্রশ্ন: নিচের গাঠনিক ব্যবচ্ছেদটি কোন যুক্তবর্ণ নির্দেশ করে?
                  </span>
                  <div className="text-3xl font-tiro font-bold text-[#141210] my-3">
                    {activeItem.breakdownText} = ?
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {quizOptions.map((opt, idx) => {
                    const isSelected = quizAnswerSelected === opt;
                    const isRight = opt === activeItem.glyph;
                    let btnClass = 'bg-[#FCFBF8] border-2 border-[#141210]/30 hover:border-[#141210]';

                    if (isSelected) {
                      btnClass = isRight
                        ? 'bg-emerald-600 text-white border-emerald-800'
                        : 'bg-red-600 text-white border-red-800';
                    } else if (quizAnswerSelected && isRight) {
                      btnClass = 'bg-emerald-100 text-emerald-900 border-emerald-500';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizSelect(opt)}
                        disabled={quizAnswerSelected !== null}
                        className={`p-4 text-3xl font-tiro font-bold flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isQuizCorrect !== null && (
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#141210]/20">
                    <span className={`text-sm font-tiro font-bold ${isQuizCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                      {isQuizCorrect ? '✓ সঠিক উত্তর! (+৪০ XP)' : '✗ ভুল হয়েছে! সঠিক উত্তর ছিল ' + activeItem.glyph}
                    </span>

                    <button
                      onClick={handleNextItem}
                      className="px-4 py-1.5 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-all cursor-pointer"
                    >
                      পরবর্তী যুক্তবর্ণ ❯
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Mode 1, 2, 3: Interactive Live Typing Sandbox */
              <div
                onClick={focusInput}
                className={`bg-[#EDE9DF]/60 p-5 border-2 transition-all flex flex-col gap-4 cursor-text ${
                  shakeError ? 'border-red-500 animate-shake' : isInputFocused ? 'border-[#141210]' : 'border-[#141210]/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/70 flex items-center gap-1.5">
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>টাইপিং অনুশীলন ক্ষেত্র:</span>
                  </span>

                  {practiceSuccess ? (
                    <span className="flex items-center gap-1 text-emerald-800 text-xs font-bold font-tiro bg-emerald-100 px-2.5 py-0.5 border border-emerald-300">
                      <Check className="w-3.5 h-3.5" />
                      <span>সঠিক হয়েছে! (+৫০ XP &amp; স্কিল আপ)</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetPractice(practiceMode);
                      }}
                      className="text-[11px] font-tiro text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>রিসেট</span>
                    </button>
                  )}
                </div>

                {/* Target Text Display with Character-by-Character Coloring */}
                <div className="p-4 bg-[#FCFBF8] border border-[#141210]/20 text-2xl sm:text-3xl font-tiro font-bold text-[#141210] tracking-wide select-none min-h-[70px] flex items-center flex-wrap">
                  {(() => {
                    const normTarget = canonicalizeBanglaUnicode(currentTargetText);
                    const normInput = canonicalizeBanglaUnicode(practiceInput);

                    let matchedLen = 0;
                    for (let i = 0; i < normInput.length; i++) {
                      if (normInput[i] === normTarget[i]) {
                        matchedLen++;
                      } else {
                        break;
                      }
                    }

                    const matchedPart = normTarget.slice(0, matchedLen);
                    const currentExpectedChar = normTarget[matchedLen] || '';
                    const remainingPart = normTarget.slice(matchedLen + 1);

                    return (
                      <div className="flex items-baseline flex-wrap">
                        {/* Green matched characters */}
                        {matchedPart && (
                          <span className="text-emerald-700 bg-emerald-50/80 px-0.5 rounded-2xs">
                            {matchedPart}
                          </span>
                        )}

                        {/* Current pulsating cursor character */}
                        {currentExpectedChar && (
                          <span className="bg-amber-300 text-[#141210] px-1 rounded-2xs underline decoration-2 decoration-[#8B0000] animate-pulse mx-0.5">
                            {currentExpectedChar}
                          </span>
                        )}

                        {/* Remaining gray characters */}
                        {remainingPart && (
                          <span className="text-gray-400">
                            {remainingPart}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Hidden / Synced Interactive Physical & Virtual Input */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={practiceInput}
                    onChange={handleInputChange}
                    onKeyDown={handlePhysicalKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="কীবোর্ডে সরাসরি টাইপ করুন..."
                    className="w-full bg-[#FFFFFF] border-2 border-[#141210]/30 p-3 text-xl font-tiro font-bold focus:outline-none focus:border-[#141210] shadow-inner"
                  />
                  {avroBuffer && (
                    <div className="absolute right-3 top-3 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200">
                      Buffer: {avroBuffer}
                    </div>
                  )}
                </div>

                {/* Post-Success Next Action Bar */}
                {practiceSuccess && (
                  <div className="flex items-center justify-between bg-emerald-50 p-3 border border-emerald-300 mt-1">
                    <span className="text-xs font-tiro font-bold text-emerald-900">
                      চমৎকার! সফলভাবে অনুশীলন সম্পন্ন হয়েছে।
                    </span>

                    <button
                      onClick={handleNextItem}
                      className="px-4 py-1.5 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <span>পরবর্তী যুক্তবর্ণ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Virtual Keyboard for tactile guidance & visual aid */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/70">
                  কীবোর্ড নির্দেশিকা:
                </span>
                {currentKeyStep && (
                  <span className="text-xs font-mono font-bold text-[#8B0000] bg-[#EDE9DF] px-2 py-0.5">
                    কী: {currentKeyStep.key} {currentKeyStep.shift ? '(Shift সহ)' : ''} &bull; {currentKeyStep.finger}
                  </span>
                )}
              </div>

              <VirtualKeyboard
                layoutId={user.preferredKeyboard}
                activeKeyChar={currentKeyStep?.key || ''}
                activeKeyCode={currentKeyStep?.code}
                isShiftActive={currentKeyStep?.shift}
                onVirtualKeyPress={handleVirtualKeyPress}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
