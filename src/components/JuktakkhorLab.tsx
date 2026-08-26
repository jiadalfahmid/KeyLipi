import React, { useMemo, useState, useEffect } from 'react';
import {
  ArrowRight,
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
  RefreshCw,
  Trophy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JUKTAKKHOR_DATABASE } from '../data/juktakkhorData';
import { soundFx } from '../lib/audio';
import { getKeystrokeGuidance } from '../lib/keyboardAdapters';
import { JuktakkhorGroupType, JuktakkhorItem, JuktakkhorMasteryScore } from '../types';
import { VirtualKeyboard } from './VirtualKeyboard';

const MASTERY_LEVEL_LABELS: Record<JuktakkhorMasteryScore, { label: string; desc: string; color: string }> = {
  0: { label: 'Not Learned', desc: 'এখনো শুরু হয়নি', color: 'bg-gray-200 text-gray-700' },
  1: { label: 'Seen', desc: 'পরিচিত', color: 'bg-blue-100 text-blue-800' },
  2: { label: 'Practiced', desc: 'অনুশীলিত', color: 'bg-cyan-100 text-cyan-800' },
  3: { label: 'Familiar', desc: 'স্মরণে আছে', color: 'bg-amber-100 text-amber-800' },
  4: { label: 'Accurate', desc: 'নির্ভুল', color: 'bg-emerald-100 text-emerald-800' },
  5: { label: 'Fast', desc: 'দ্রুতগতির', color: 'bg-indigo-100 text-indigo-800' },
  6: { label: 'Mastered', desc: 'মাস্টার', color: 'bg-purple-900 text-amber-300' }
};

const GROUPS: { id: JuktakkhorGroupType | 'all'; title: string; subtitle: string; groupKey?: JuktakkhorGroupType }[] = [
  { id: 'all', title: 'সকল যুক্তবর্ণ', subtitle: 'সম্পূর্ণ ডেটাবেজ' },
  { id: 'group-a', title: 'Group A — Simple', subtitle: 'ক্ত, ন্ত, ন্দ, ম্প, ল্প, ত্ত, ব্দ, স্ক', groupKey: 'group-a' },
  { id: 'group-b', title: 'Group B — Common Fola', subtitle: 'ক্র, গ্র, প্র, ত্র, দ্র, ব্র, শ্র', groupKey: 'group-b' },
  { id: 'group-c', title: 'Group C — য-ফলা', subtitle: 'ব্য, দ্য, ত্য, ধ্য, ন্য, ম্য', groupKey: 'group-c' },
  { id: 'group-d', title: 'Group D — Complex', subtitle: 'ঙ্ক, ঙ্গ, ঞ্চ, ঞ্জ, ণ্ড, ষ্ট, ষ্ঠ, স্থ', groupKey: 'group-d' },
  { id: 'group-e', title: 'Group E — Special', subtitle: 'ক্ষ, জ্ঞ, হ্ম, ষ্ণ, চ্ছ, জ্জ, দ্ধ', groupKey: 'group-e' },
  { id: 'group-f', title: 'Group F — Multi-consonant', subtitle: 'ন্ত্র, ষ্ট্র, ক্ষ্ম, ন্দ্র, স্ত্র', groupKey: 'group-f' }
];

export const JuktakkhorLab: React.FC = () => {
  const { user, updateJuktakkhorMastery, addXp } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<JuktakkhorGroupType | 'all'>('all');
  const [activeItem, setActiveItem] = useState<JuktakkhorItem>(JUKTAKKHOR_DATABASE[0]);

  // Practice Modes: 'isolated' | 'words' | 'sentence'
  const [practiceMode, setPracticeMode] = useState<'isolated' | 'words' | 'sentence'>('isolated');
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceSuccess, setPracticeSuccess] = useState(false);
  const [drillSuccessCount, setDrillSuccessCount] = useState(0);

  const currentScore: JuktakkhorMasteryScore = (user.juktakkhorMastery?.[activeItem.glyph] ?? 0) as JuktakkhorMasteryScore;

  const keystrokeGuide = useMemo(() => {
    return getKeystrokeGuidance(activeItem.glyph, user.preferredKeyboard);
  }, [activeItem.glyph, user.preferredKeyboard]);

  const filteredList = useMemo(() => {
    return JUKTAKKHOR_DATABASE.filter((item) => {
      const matchGroup = selectedGroup === 'all' || item.group === selectedGroup;
      const matchSearch =
        item.glyph.includes(searchQuery) ||
        item.breakdownText.includes(searchQuery) ||
        item.pronunciation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sampleWords.some((w) => w.includes(searchQuery));
      return matchGroup && matchSearch;
    });
  }, [searchQuery, selectedGroup]);

  // Target text for current practice mode
  const currentTargetText = useMemo(() => {
    if (practiceMode === 'isolated') {
      return activeItem.glyph;
    } else if (practiceMode === 'words') {
      return activeItem.sampleWords.join(' ');
    } else {
      return activeItem.sampleSentence || `${activeItem.sampleWords[0] || activeItem.glyph} দিয়ে শুদ্ধ বাক্য রচনা করুন।`;
    }
  }, [practiceMode, activeItem]);

  const handlePracticeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPracticeInput(val);
    if (val.length > 0) {
      soundFx.playKeyClick(val.slice(-1));
    }

    const isMatch = val.trim() === currentTargetText.trim();
    if (isMatch) {
      setPracticeSuccess(true);
      soundFx.playComboChime(10);
      setDrillSuccessCount((prev) => prev + 1);

      // Upgrade mastery score dynamically if not maxed
      const nextScore = Math.min(6, currentScore + 1) as JuktakkhorMasteryScore;
      if (nextScore > currentScore) {
        updateJuktakkhorMastery(activeItem.glyph, nextScore);
        addXp(50);
      }
    } else {
      setPracticeSuccess(false);
    }
  };

  const resetPractice = (mode: 'isolated' | 'words' | 'sentence') => {
    setPracticeMode(mode);
    setPracticeInput('');
    setPracticeSuccess(false);
  };

  // Calculate overall group completion
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
              JUKTOBORNO MASTERY TREE &bull; যুক্তবর্ণ মাস্টার ট্রি
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            যুক্তবর্ণ গাঠনিক বৃক্ষ ও মাস্টার ল্যাব
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-3xl leading-relaxed">
            গ্রুপ A থেকে গ্রুপ F পর্যন্ত প্রতিটি যুক্তবর্ণের পৃথক ব্যবচ্ছেদ, কি-সিকোয়েন্স, একক ড্রিল, শব্দ শৃঙ্খল এবং ০–৬ স্তরের স্বয়ংক্রিয় মাস্টার স্কোর ট্র্যাকিং।
          </p>
        </div>

        {/* Global Juktoborno Mastery Pill */}
        <div className="flex items-center gap-5 bg-[#FCFBF8] p-4 border-2 border-[#141210]/40 shadow-2xs font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#141210]/60 uppercase font-bold">মাস্টার যুক্তবর্ণ</div>
            <div className="text-lg font-bold text-[#141210] flex items-center gap-1 mt-0.5">
              <Trophy className="w-4 h-4 text-amber-700" />
              <span>{masteredCount} / {JUKTAKKHOR_DATABASE.length}</span>
            </div>
          </div>
          <div className="h-9 w-[1px] bg-[#141210]/20"></div>
          <div>
            <div className="text-[10px] text-[#141210]/60 uppercase font-bold">সক্রিয় কি-লেআউট</div>
            <div className="text-sm font-bold text-[#8B0000] uppercase mt-0.5">
              {user.preferredKeyboard}
            </div>
          </div>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {GROUPS.map((grp) => (
          <button
            key={grp.id}
            onClick={() => setSelectedGroup(grp.id)}
            className={`px-3.5 py-2 text-xs font-tiro font-bold whitespace-nowrap transition-all border-2 cursor-pointer flex flex-col text-left ${
              selectedGroup === grp.id
                ? 'bg-[#141210] text-[#F5F2EB] border-[#141210]'
                : 'bg-[#FCFBF8] text-[#141210]/80 border-[#141210]/20 hover:border-[#141210]/50'
            }`}
          >
            <span>{grp.title}</span>
            <span className="text-[10px] opacity-70 font-normal">{grp.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Glyph Mastery Matrix */}
        <div className="lg:col-span-5 bg-[#FCFBF8] border-2 border-[#141210]/30 p-5 shadow-2xs max-h-[640px] overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#141210]/20 pb-2">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#8B0000]">
              যুক্তবর্ণ ক্যাটালগ ({filteredList.length} টি)
            </span>
            <div className="relative w-36">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="খুঁজুন..."
                className="w-full bg-[#FFFFFF] border border-[#141210]/30 px-2 py-1 text-xs font-tiro focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {filteredList.map((item) => {
              const isSelected = activeItem.id === item.id;
              const score: JuktakkhorMasteryScore = (user.juktakkhorMastery?.[item.glyph] ?? 0) as JuktakkhorMasteryScore;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item);
                    setPracticeInput('');
                    setPracticeSuccess(false);
                    soundFx.playKeyClick(item.glyph);
                  }}
                  className={`p-2.5 flex flex-col items-center justify-between border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#141210] text-[#F5F2EB] border-[#141210] shadow-sm scale-[1.02]'
                      : 'bg-[#EDE9DF]/50 text-[#141210] border-[#141210]/20 hover:bg-[#EDE9DF]'
                  }`}
                >
                  {/* Mastery Score Badge (0-6) */}
                  <div
                    className={`absolute top-1 right-1 text-[9px] font-mono font-bold px-1 rounded-2xs ${
                      isSelected ? 'bg-amber-400 text-black' : 'bg-[#141210]/15 text-[#141210]'
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
            })}
          </div>
        </div>

        {/* Right Column: Deep Blueprint, Decomposition & 3-Stage Drill */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 sm:p-8 shadow-2xs flex flex-col gap-6">
            {/* Header with Glyph, Pronunciation and 0-6 Score */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#141210]/20 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-[#141210] text-[#F5F2EB] font-mono text-[10px] font-bold uppercase tracking-wider">
                    {activeItem.group?.toUpperCase() || 'CORE'}
                  </span>
                  <span className="text-xs font-tiro font-bold text-[#8B0000]">
                    &bull; {activeItem.category}
                  </span>
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
                  মাস্টারি স্কোর (MASTERY)
                </span>
                <div className="text-xl font-bold text-[#141210] flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-700">{currentScore} / 6</span>
                  <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${MASTERY_LEVEL_LABELS[currentScore].color}`}>
                    {MASTERY_LEVEL_LABELS[currentScore].label}
                  </span>
                </div>
                <span className="text-[10px] font-tiro text-[#141210]/70 mt-0.5">
                  {MASTERY_LEVEL_LABELS[currentScore].desc}
                </span>
              </div>
            </div>

            {/* Linguistic Explanation */}
            {activeItem.explanation && (
              <div className="bg-[#EDE9DF]/60 border-l-4 border-[#8B0000] p-3 text-xs sm:text-sm font-tiro text-[#141210]/90 leading-relaxed">
                {activeItem.explanation}
              </div>
            )}

            {/* Formula Decomposition: Animated Stage Breakdown */}
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/60 mb-2">
                গাঠনিক ব্যবচ্ছেদ (DECOMPOSITION FORMULA):
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

            {/* Keystrokes by Keyboard Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#EDE9DF]/70 p-3 border border-[#141210]/20">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8B0000] block mb-1">
                  বিজয় (BIJOY)
                </span>
                <div className="font-mono font-bold text-sm text-[#141210] bg-[#FCFBF8] px-2.5 py-1 border border-[#141210]/20 inline-block">
                  {activeItem.bijoyKeystrokes}
                </div>
              </div>

              <div className="bg-[#EDE9DF]/70 p-3 border border-[#141210]/20">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8B0000] block mb-1">
                  অভ্র (AVRO)
                </span>
                <div className="font-mono font-bold text-sm text-[#141210] bg-[#FCFBF8] px-2.5 py-1 border border-[#141210]/20 inline-block">
                  {activeItem.avroKeystrokes}
                </div>
              </div>

              <div className="bg-[#EDE9DF]/70 p-3 border border-[#141210]/20">
                <span className="text-[10px] font-mono font-bold uppercase text-[#8B0000] block mb-1">
                  জাতীয় (JATIYA)
                </span>
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

            {/* Practice Step Selector */}
            <div className="flex items-center gap-2 border-b border-[#141210]/20 pb-2">
              {[
                { id: 'isolated', label: '১. একক যুক্তবর্ণ (Isolated)' },
                { id: 'words', label: '২. শব্দ শৃঙ্খল (Word Chain)' },
                { id: 'sentence', label: '৩. বাক্য প্রয়োগ (Sentence)' }
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

            {/* Interactive Live Sandbox */}
            <div className="bg-[#EDE9DF]/60 p-4 border border-[#141210]/25 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/70">
                  নিচের টেক্সটটি সঠিকভাবে টাইপ করুন:
                </span>
                {practiceSuccess && (
                  <span className="flex items-center gap-1 text-emerald-800 text-xs font-bold font-tiro bg-emerald-100 px-2 py-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>সঠিক হয়েছে! (+৫০ XP &amp; স্কিল আপ)</span>
                  </span>
                )}
              </div>

              {/* Target Text Display */}
              <div className="p-3 bg-[#FCFBF8] border border-[#141210]/20 text-lg font-tiro font-bold text-[#141210]">
                {currentTargetText}
              </div>

              {/* Live Input Field */}
              <input
                type="text"
                value={practiceInput}
                onChange={handlePracticeChange}
                placeholder="এখানে টাইপ করুন..."
                className="w-full bg-[#FFFFFF] border-2 border-[#141210]/30 p-3 text-xl font-tiro font-bold focus:outline-none focus:border-[#141210] shadow-inner"
              />
            </div>

            {/* Virtual Keyboard */}
            <div className="pt-2">
              <VirtualKeyboard
                layoutId={user.preferredKeyboard}
                activeKeyChar={keystrokeGuide[0]?.key || ''}
                activeKeyCode={keystrokeGuide[0]?.code}
                isShiftActive={keystrokeGuide[0]?.shift}
                onVirtualKeyPress={(char) => {
                  setPracticeInput((prev) => prev + char);
                  if ((practiceInput + char).trim() === currentTargetText.trim()) {
                    setPracticeSuccess(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
