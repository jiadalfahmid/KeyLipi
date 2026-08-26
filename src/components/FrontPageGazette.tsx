import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  Gamepad2,
  Keyboard,
  Layers,
  Layout,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { JUKTAKKHOR_DATABASE } from '../data/juktakkhorData';
import { TYPING_PASSAGES } from '../data/typingPassages';
import { soundFx } from '../lib/audio';
import { splitBanglaGraphemes } from '../lib/unicode';

interface SamplePrompt {
  id: string;
  category: string;
  title: string;
  text: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'literature',
    category: 'সাহিত্য ও ঐতিহ্য',
    title: 'আমাদের মাতৃভাষা',
    text: 'আমাদের মাতৃভাষা বাংলা। বর্ণমালার প্রতিটি অক্ষরে জড়িয়ে আছে গভীর আবেগ ও ইতিহাস। সঠিক আঙুলে কিবোর্ডে দ্রুত টাইপ করা এখন সময়ের অন্যতম শ্রেষ্ঠ দক্ষতা।'
  },
  {
    id: 'speed',
    category: 'স্পিড ড্রিল',
    title: 'হোম-রো ছন্দ',
    text: 'কিবোর্ডের দিকে না তাকিয়ে কেবল আঙুলের স্পর্শে টাইপ করার নামই টাচ টাইপিং। হোম-রো এর উপর হাত রাখলে বাকি সব কি হাতের নাগালে চলে আসে।'
  },
  {
    id: 'juktakkhor',
    category: 'যুক্তাক্ষর বাক্য',
    title: 'জ্ঞান ও বিজ্ঞান',
    text: 'বিজ্ঞান ও প্রযুক্তির যুগে স্পষ্ট ও নির্ভুল বাংলা লেখার জন্য যুক্তাক্ষরের হসন্ত প্রয়োগ জানা অত্যন্ত জরুরি। ক্ষ, জ্ঞ, ষ্ণ, ঙ্গ শব্দে বাংলার রূপ খোলে।'
  }
];

export const FrontPageGazette: React.FC = () => {
  const { user, setActiveTab, startLesson, setKeyboardLayout } = useApp();

  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [warmupInput, setWarmupInput] = useState('');
  const [warmupErrors, setWarmupErrors] = useState(0);
  const [warmupStartTime, setWarmupStartTime] = useState<number | null>(null);

  const activePrompt = SAMPLE_PROMPTS[selectedPromptIndex];
  const targetGraphemes = useMemo(() => splitBanglaGraphemes(activePrompt.text), [activePrompt.text]);

  // Word-level token structure for clean Bengali ligature rendering
  const promptWordTokens = useMemo(() => {
    const tokens: {
      type: 'word' | 'space';
      graphemes: { char: string; index: number }[];
    }[] = [];

    let currentWord: { char: string; index: number }[] = [];

    targetGraphemes.forEach((g, idx) => {
      if (g === ' ' || g === '\u00A0') {
        if (currentWord.length > 0) {
          tokens.push({ type: 'word', graphemes: currentWord });
          currentWord = [];
        }
        tokens.push({ type: 'space', graphemes: [{ char: ' ', index: idx }] });
      } else {
        currentWord.push({ char: g, index: idx });
      }
    });

    if (currentWord.length > 0) {
      tokens.push({ type: 'word', graphemes: currentWord });
    }

    return tokens;
  }, [targetGraphemes]);

  // Typed graphemes from user input
  const typedGraphemes = useMemo(() => splitBanglaGraphemes(warmupInput), [warmupInput]);

  const handleWarmupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!warmupStartTime && val.length > 0) {
      setWarmupStartTime(Date.now());
    }

    setWarmupInput(val);

    if (val.length > 0) {
      const currentTypedGraphemes = splitBanglaGraphemes(val);
      const lastIdx = currentTypedGraphemes.length - 1;
      const lastTypedGrapheme = currentTypedGraphemes[lastIdx];
      const expectedGrapheme = targetGraphemes[lastIdx];

      if (expectedGrapheme && lastTypedGrapheme.normalize('NFC') === expectedGrapheme.normalize('NFC')) {
        soundFx.playKeyClick(lastTypedGrapheme);
        if (currentTypedGraphemes.length % 5 === 0) {
          soundFx.playComboChime(Math.floor(currentTypedGraphemes.length / 5));
        }
      } else if (expectedGrapheme && lastTypedGrapheme.normalize('NFC') !== expectedGrapheme.normalize('NFC')) {
        soundFx.playError();
        setWarmupErrors((prev) => prev + 1);
      }
    }
  };

  const resetWarmup = () => {
    setWarmupInput('');
    setWarmupErrors(0);
    setWarmupStartTime(null);
  };

  // Live calculations for warmup
  const elapsedSec = warmupStartTime ? Math.max(1, (Date.now() - warmupStartTime) / 1000) : 1;
  const typedCount = typedGraphemes.length;
  const liveWpm = warmupStartTime && typedCount > 0 ? Math.round((typedCount / 4 / elapsedSec) * 60) : 0;
  const liveAcc = typedCount > 0 ? Math.max(0, Math.round(((typedCount - warmupErrors) / typedCount) * 100)) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
      {/* Editorial Lead Section (Broadsheet Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b-2 border-[#141210] pb-8">
        
        {/* Left 8 Cols: Main Editorial Lead Story */}
        <article className="lg:col-span-8 flex flex-col gap-5 lg:border-r lg:border-[#141210]/20 lg:pr-8">
          
          {/* Section Kicker */}
          <div className="flex items-center justify-between border-b border-[#141210]/15 pb-1 text-xs font-tiro text-[#8B0000] font-bold">
            <div className="flex items-center gap-2">
              <span className="bg-[#8B0000] text-[#F5F2EB] px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider">
                EDITORIAL MASTERCLASS
              </span>
              <span>বাংলা স্পর্শ টাইপিং একাডেমি • কীলিপি খতিয়ান</span>
            </div>
            <span className="text-[#141210]/60 font-mono text-[11px]">দশ আঙুলের বিজ্ঞান</span>
          </div>

          {/* Grand Main Headline in Tiro Bangla / Broadsheet Serif */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-tiro font-bold leading-[1.22] tracking-tight text-[#141210]">
            কীবোর্ডের দিকে না তাকিয়ে আঙুলের স্বতঃস্ফূর্ত ছন্দ: বাংলা টাইপিংয়ে পূর্ণাঙ্গ ব্যুৎপত্তি
          </h1>

          {/* Subdeck */}
          <p className="text-base sm:text-lg font-tiro italic text-[#141210]/85 leading-relaxed border-l-2 border-[#141210] pl-3">
            হোম-রো (ASDF JKL;) পদ্ধতির বৈজ্ঞানিক চর্চা, ১০-টোন মেকানিক্যাল অডিও ও যুক্তাক্ষরের নির্ভুল হসন্ত বিন্যাসে মিনিটে ৬০+ শব্দ টাইপের বিশ্বস্ত প্ল্যাটফর্ম।
          </p>

          {/* Two-Column Editorial Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#141210]/90 font-tiro text-[15px] leading-[1.8] text-justify">
            <div>
              <p className="drop-cap">
                বাংলা ভাষায় টাইপিং কেবল কোনো যান্ত্রিক কাজ নয়; এটি ভাষা ও চিন্তার সরাসরি প্রকাশ। যারা কিবোর্ডের দিকে তাকিয়ে দু-এক আঙুলে অক্ষর খোঁজেন, তাদের মস্তিষ্কের মনোযোগ বর্ণমালায় আটকে থাকে। পক্ষান্তরে, স্পর্শ টাইপিংয়ে (Touch Typing) মস্তিষ্ক সরাসরি শব্দ ভাবেন আর ১০টি আঙুল অবচেতন স্মৃতিতে সঠিক কী-তে আঘাত হানে।
              </p>
              <p className="mt-3">
                কীলিপি প্ল্যাটফর্মে আমরা এনেছি প্রতিটি আঙুলের জন্য পৃথক অডিও ফিডব্যাক, স্বচ্চ ফিঙ্গার নিশানা এবং বিজয়, অভ্র ও জাতীয় কিবোর্ডের সমন্বিত রিয়েল-টাইম টাইপিং সিমুলেটর।
              </p>
            </div>

            <div>
              <p>
                বিশেষ করে বাংলা যুক্তাক্ষর যেমন ক+্+ষ=ক্ষ, জ+্+ঞ=জ্ঞ, ত+্+র=ত্র কিংবা ষ্+ণ=ষ্ণ লেখার ক্ষেত্রে সঠিক হসন্ত নিয়ম জানা থাকলে কোনো ভুল ছাড়াই দ্রুত গতি তোলা সম্ভব।
              </p>
              <div className="mt-4 p-3.5 bg-[#EDE9DF] border border-[#141210]/20 rounded-xs">
                <span className="text-[11px] font-mono font-bold uppercase text-[#8B0000] block mb-1">
                  কীলিপির মূলনীতি:
                </span>
                <span className="text-xs italic text-[#141210]">
                  "কখনও নিচের দিকে তাকাবেন না। ভুল হলেও আঙুলের স্মৃতিকে বিশ্বাস করুন; গতি নিজে থেকেই বৃদ্ধি পাবে।"
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Live Broadsheet Typing Sandbox */}
          <div className="mt-3 bg-[#FCFBF8] border-2 border-[#141210]/40 p-5 sm:p-6 shadow-2xs">
            {/* Box Header & Prompt Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141210]/15 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-tiro font-bold text-[#141210] uppercase tracking-wider">
                  তাত্ক্ষণিক টাইপিং ড্রিল (Instant Live Practice)
                </span>
              </div>

              {/* Sample Prompt Selector Tabs */}
              <div className="flex items-center gap-1">
                {SAMPLE_PROMPTS.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPromptIndex(idx);
                      resetWarmup();
                    }}
                    className={`px-2 py-1 text-[11px] font-tiro font-bold transition-colors cursor-pointer rounded-xs ${
                      selectedPromptIndex === idx
                        ? 'bg-[#141210] text-[#F5F2EB]'
                        : 'bg-[#EDE9DF] text-[#141210]/70 hover:bg-[#DDD8CE]'
                    }`}
                  >
                    {p.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Display Text in Genuine Bangla Word Typesetting */}
            <div className="p-4 bg-[#EDE9DF]/60 border border-[#141210]/20 font-tiro text-lg sm:text-xl leading-[2.2] text-[#141210] mb-4 select-none flex flex-wrap items-baseline gap-y-1">
              {promptWordTokens.map((token, tIdx) => {
                if (token.type === 'space') {
                  const spaceIdx = token.graphemes[0].index;
                  const typedSpace = typedGraphemes[spaceIdx];
                  const isCurrent = spaceIdx === typedGraphemes.length;
                  return (
                    <span
                      key={`space-${tIdx}-${spaceIdx}`}
                      className={`inline-flex items-center justify-center mx-1 px-1 rounded-xs ${
                        isCurrent
                          ? 'bg-[#141210] text-[#FFFFFF] font-bold'
                          : typedSpace !== undefined
                          ? 'text-[#141210]/40'
                          : 'text-[#141210]/20'
                      }`}
                    >
                      ␣
                    </span>
                  );
                }

                return (
                  <span key={`word-${tIdx}`} className="inline-flex items-baseline flex-nowrap mr-1.5 my-0.5">
                    {token.graphemes.map(({ char, index }) => {
                      const typedChar = typedGraphemes[index];
                      let charClass = 'text-[#141210]/40';
                      if (typedChar !== undefined) {
                        charClass =
                          typedChar.normalize('NFC') === char.normalize('NFC')
                            ? 'text-[#141210] font-bold'
                            : 'text-rose-700 bg-rose-100 px-0.5 underline font-bold';
                      } else if (index === typedGraphemes.length) {
                        charClass = 'text-[#FFFFFF] bg-[#141210] px-1 rounded-xs font-bold shadow-xs';
                      }
                      return (
                        <span key={index} className={`relative inline-block ${charClass}`}>
                          {char}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>

            {/* Input Box and Live Score Bar */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={warmupInput}
                  onChange={handleWarmupChange}
                  placeholder="এখানে উপরের বাক্যটি টাইপ করুন এবং ১০-টোন সাউন্ড শুনুন..."
                  className="w-full bg-[#FFFFFF] border-2 border-[#141210]/30 px-3.5 py-2.5 text-base font-tiro focus:outline-none focus:border-[#141210] shadow-inner rounded-xs"
                />
                <button
                  onClick={resetWarmup}
                  title="পুনরায় শুরু"
                  className="p-2.5 bg-[#EDE9DF] border-2 border-[#141210]/20 hover:bg-[#DDD8CE] transition-colors cursor-pointer rounded-xs"
                >
                  <RotateCcw className="w-4 h-4 text-[#141210]" />
                </button>
              </div>

              {/* Live Mini Stats Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#141210]/15 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-[#141210]/60 uppercase font-bold mr-1.5">গতি:</span>
                    <span className="font-bold text-[#141210] text-sm">{liveWpm} WPM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#141210]/60 uppercase font-bold mr-1.5">নির্ভুলতা:</span>
                    <span className="font-bold text-emerald-800 text-sm">{liveAcc}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#141210]/60 uppercase font-bold mr-1.5">অক্ষর:</span>
                    <span className="font-bold text-[#141210] text-sm">{typedCount}/{targetGraphemes.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startLesson('lesson-1')}
                    className="px-4 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs rounded-xs"
                  >
                    <span>লেসন পাঠশালায় যান</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Right 4 Cols: Editorial Side Columns */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Academy Pathways Card */}
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-5 shadow-2xs flex flex-col gap-3.5">
            <div className="border-b border-[#141210]/15 pb-1.5 flex items-center justify-between">
              <span className="text-xs font-tiro font-bold text-[#8B0000] uppercase tracking-wider">
                কীলিপি একাডেমি মডিউল
              </span>
              <span className="text-[10px] font-mono text-[#141210]/60">PATHWAYS</span>
            </div>

            <div className="space-y-3 font-tiro text-xs text-[#141210]">
              <div
                onClick={() => setActiveTab('learn')}
                className="group cursor-pointer p-2.5 bg-[#EDE9DF]/40 hover:bg-[#EDE9DF] border border-[#141210]/15 transition-colors rounded-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#141210]/60 font-bold">লেভেল ১-৪</span>
                  <BookOpen className="w-3.5 h-3.5 text-[#141210]/60 group-hover:text-[#8B0000]" />
                </div>
                <h4 className="font-bold text-sm text-[#141210] group-hover:text-[#8B0000] transition-colors mt-0.5">
                  হোম-রো ও প্রাথমিক বর্ণমালা
                </h4>
                <p className="text-[#141210]/70 text-[11px] mt-0.5">
                  ভ ফ ড ব (ASDF) এবং র ত চ জ (JKL;) আঙুল স্থাপন ও অভ্যাস।
                </p>
              </div>

              <div
                onClick={() => setActiveTab('juktakkhor-lab')}
                className="group cursor-pointer p-2.5 bg-[#EDE9DF]/40 hover:bg-[#EDE9DF] border border-[#141210]/15 transition-colors rounded-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#141210]/60 font-bold">লেভেল ৫-৮</span>
                  <Layout className="w-3.5 h-3.5 text-[#141210]/60 group-hover:text-[#8B0000]" />
                </div>
                <h4 className="font-bold text-sm text-[#141210] group-hover:text-[#8B0000] transition-colors mt-0.5">
                  যুক্তাক্ষর ও হসন্ত কোষাগার
                </h4>
                <p className="text-[#141210]/70 text-[11px] mt-0.5">
                  ৫০+ জটিল যুক্তাক্ষরের ব্যবচ্ছেদ ও লাইভ টাইপিং ল্যাব।
                </p>
              </div>

              <div
                onClick={() => setActiveTab('speed-test')}
                className="group cursor-pointer p-2.5 bg-[#EDE9DF]/40 hover:bg-[#EDE9DF] border border-[#141210]/15 transition-colors rounded-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#141210]/60 font-bold">লেভেল ৯-১২</span>
                  <Zap className="w-3.5 h-3.5 text-[#141210]/60 group-hover:text-[#8B0000]" />
                </div>
                <h4 className="font-bold text-sm text-[#141210] group-hover:text-[#8B0000] transition-colors mt-0.5">
                  স্পিড টেস্ট ও টাইপিং সনদ
                </h4>
                <p className="text-[#141210]/70 text-[11px] mt-0.5">
                  ১, ২ ও ৩ মিনিটের জাতীয় অনুচ্ছেদে গতি পরীক্ষা ও সার্টিফিকেট।
                </p>
              </div>
            </div>
          </div>

          {/* Today's Top Typists / Leaderboard Preview */}
          <div className="bg-[#EDE9DF]/80 border-2 border-[#141210]/30 p-4 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#141210]/20 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-tiro font-bold text-[#141210]">
                  আজকের দ্রুততম টাইপিস্ট
                </span>
              </div>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className="text-[10px] font-tiro font-bold text-[#8B0000] hover:underline cursor-pointer"
              >
                সম্পূর্ণ তালিকা &rarr;
              </button>
            </div>

            <div className="space-y-2 font-tiro text-xs">
              {[
                { rank: 1, name: 'তানভীর আহমেদ', wpm: 72, acc: 99, layout: 'Bijoy' },
                { rank: 2, name: 'নুসরাত জাহান', wpm: 68, acc: 98, layout: 'Avro' },
                { rank: 3, name: 'সাদিয়া ইসলাম', wpm: 64, acc: 97, layout: 'Jatiya' },
                { rank: 4, name: 'রাকিবুল হাসান', wpm: 59, acc: 96, layout: 'Bijoy' }
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between bg-[#FCFBF8] p-2 border border-[#141210]/15 rounded-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs w-4 text-center text-[#141210]/60">
                      {item.rank}.
                    </span>
                    <span className="font-bold text-[#141210]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-[#141210]">{item.wpm} WPM</span>
                    <span className="text-[#141210]/50">({item.acc}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA Card */}
          <div className="bg-[#141210] text-[#F5F2EB] p-5 shadow-xs flex flex-col gap-3 rounded-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5F2EB]/60">
              KEY LIPI ACADEMY
            </span>
            <h3 className="font-tiro font-bold text-xl leading-tight">
              প্রথম ধাপ থেকেই টাইপিং শুরু করতে চান?
            </h3>
            <p className="text-xs font-tiro text-[#F5F2EB]/80 leading-relaxed">
              হোম-রো লেসন দিয়ে শুরু করুন এবং মাত্র ৭ দিনে আপনার টাইপিং গতি দ্বিগুণ করুন।
            </p>
            <button
              onClick={() => startLesson('lesson-1')}
              className="mt-2 w-full py-2.5 bg-[#F5F2EB] text-[#141210] font-tiro font-bold text-xs hover:bg-[#EDE9DF] transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-xs"
            >
              <span>লেসন-১ শুরু করুন</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </aside>
      </div>

      {/* 4 Core Pillars of Key Lipi (Broadsheet Section) */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between border-b-2 border-[#141210] pb-2">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#8B0000]" />
            <h2 className="font-tiro font-bold text-xl text-[#141210]">
              কীলিপি স্পর্শ টাইপিংয়ের ৪টি মূল স্তম্ভ
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase text-[#141210]/60 font-bold">
            FOUNDATIONAL PILLARS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-4 shadow-2xs flex flex-col gap-2 rounded-xs">
            <div className="flex items-center gap-1.5 text-[#8B0000] text-xs font-mono font-bold">
              <span>০১.</span>
              <span className="uppercase">HOME ROW ANATOMY</span>
            </div>
            <h3 className="font-tiro font-bold text-base text-[#141210]">
              হোম-রো ও দশ আঙুলের স্থাপন
            </h3>
            <p className="font-tiro text-xs text-[#141210]/75 leading-relaxed">
              F ও J নির্দেশক দাগে তর্জনী রেখে ASDF এবং JKL; কী-এর উপর দশ আঙুলের স্বাভাবিক বিশ্রাম এবং পরিমিত সঞ্চালন।
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-4 shadow-2xs flex flex-col gap-2 rounded-xs">
            <div className="flex items-center gap-1.5 text-[#8B0000] text-xs font-mono font-bold">
              <span>০২.</span>
              <span className="uppercase">10-TONE ACOUSTICS</span>
            </div>
            <h3 className="font-tiro font-bold text-base text-[#141210]">
              আঙুলভিত্তিক মেকানিক্যাল অডিও
            </h3>
            <p className="font-tiro text-xs text-[#141210]/75 leading-relaxed">
              কনিষ্ঠা থেকে বৃদ্ধাঙ্গুলি পর্যন্ত ১০টি আঙুলের জন্য পৃথক পিচ (১৭৫Hz - ৫৮০Hz), যা টাইপিংয়ে অনন্য রিদম তৈরি করে।
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-4 shadow-2xs flex flex-col gap-2 rounded-xs">
            <div className="flex items-center gap-1.5 text-[#8B0000] text-xs font-mono font-bold">
              <span>০৩.</span>
              <span className="uppercase">JUKTAKKHOR LAB</span>
            </div>
            <h3 className="font-tiro font-bold text-base text-[#141210]">
              যুক্তাক্ষর ব্যবচ্ছেদ ও হসন্ত
            </h3>
            <p className="font-tiro text-xs text-[#141210]/75 leading-relaxed">
              ৫০+ জটিল যুক্তাক্ষরের সংমিশ্রণ (ব্যঞ্জন + ্ + ব্যঞ্জন) এবং প্রতিটি কিবোর্ড লেআউটের জন্য নির্দিষ্ট কি-স্ট্রোক গাইড।
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-4 shadow-2xs flex flex-col gap-2 rounded-xs">
            <div className="flex items-center gap-1.5 text-[#8B0000] text-xs font-mono font-bold">
              <span>০৪.</span>
              <span className="uppercase">MULTI-LAYOUT</span>
            </div>
            <h3 className="font-tiro font-bold text-base text-[#141210]">
              বিজয়, অভ্র ও জাতীয় সমন্বয়
            </h3>
            <p className="font-tiro text-xs text-[#141210]/75 leading-relaxed">
              এক ক্লিকেই পছন্দমতো কীবোর্ড লেআউট পরিবর্তন করে ইউনিকোড ভি১৫ মানে যেকোনো সিস্টেমে দক্ষ টাইপিস্ট হওয়ার সুবিধা।
            </p>
          </div>
        </div>
      </div>

      {/* Tri-Layout Comparison Matrix Box */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 shadow-2xs flex flex-col gap-4 rounded-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-[#141210]/20 pb-3 gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B0000] block mb-0.5">
              LAYOUT CROSS-REFERENCE
            </span>
            <h3 className="font-tiro font-bold text-xl text-[#141210]">
              কীবোর্ড লেআউট তুলনামূলক চার্ট
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setKeyboardLayout('bijoy')}
              className={`px-2.5 py-1 text-xs font-tiro font-bold rounded-xs ${
                user.preferredKeyboard === 'bijoy' ? 'bg-[#141210] text-[#F5F2EB]' : 'bg-[#EDE9DF]'
              }`}
            >
              বিজয় (Bijoy)
            </button>
            <button
              onClick={() => setKeyboardLayout('avro')}
              className={`px-2.5 py-1 text-xs font-tiro font-bold rounded-xs ${
                user.preferredKeyboard === 'avro' ? 'bg-[#141210] text-[#F5F2EB]' : 'bg-[#EDE9DF]'
              }`}
            >
              অভ্র (Avro)
            </button>
            <button
              onClick={() => setKeyboardLayout('jatiya')}
              className={`px-2.5 py-1 text-xs font-tiro font-bold rounded-xs ${
                user.preferredKeyboard === 'jatiya' ? 'bg-[#141210] text-[#F5F2EB]' : 'bg-[#EDE9DF]'
              }`}
            >
              জাতীয় (Jatiya)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-tiro text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#141210]/30 bg-[#EDE9DF]/60 font-bold text-[#141210]">
                <th className="py-2.5 px-3">বাংলা বর্ণ / যুক্তবর্ণ</th>
                <th className="py-2.5 px-3">বিজয় ইউনিকোড (Bijoy)</th>
                <th className="py-2.5 px-3">অভ্র ফোনেটিক (Avro)</th>
                <th className="py-2.5 px-3">জাতীয় কিবোর্ড (Jatiya)</th>
                <th className="py-2.5 px-3">নির্দিষ্ট আঙুল</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141210]/10 font-mono text-[13px]">
              {[
                { char: 'ক', bijoy: 'J', avro: 'k', jatiya: 'J', finger: 'ডান তর্জনী (Right Index)' },
                { char: 'খ', bijoy: 'Shift + J', avro: 'kh', jatiya: 'Shift + J', finger: 'ডান তর্জনী (Right Index)' },
                { char: 'গ', bijoy: 'O', avro: 'g', jatiya: 'O', finger: 'ডান অনামিকা (Right Ring)' },
                { char: 'ত', bijoy: 'K', avro: 't', jatiya: 'K', finger: 'ডান মধ্যমা (Right Middle)' },
                { char: 'ক্ষ (ক+্+ষ)', bijoy: 'J + G + N', avro: 'kkh / kSh', jatiya: 'J + G + N', finger: 'তর্জনী ও মধ্যমা' },
                { char: 'জ্ঞ (জ+্+ঞ)', bijoy: 'U + G + I', avro: 'jng / gg', jatiya: 'U + G + I', finger: 'ডান তর্জনী ও মধ্যমা' },
                { char: 'হসন্ত (্)', bijoy: 'G (Link Key)', avro: ',, / `', jatiya: 'G (Link Key)', finger: 'বাম তর্জনী' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#EDE9DF]/40 transition-colors">
                  <td className="py-2 px-3 font-tiro font-bold text-base text-[#141210]">{row.char}</td>
                  <td className="py-2 px-3 font-bold text-[#8B0000]">{row.bijoy}</td>
                  <td className="py-2 px-3 font-bold text-emerald-800">{row.avro}</td>
                  <td className="py-2 px-3 font-bold text-amber-900">{row.jatiya}</td>
                  <td className="py-2 px-3 font-tiro text-xs text-[#141210]/80">{row.finger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
