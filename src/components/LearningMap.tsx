import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Lock,
  Play,
  Star,
  BookOpen,
  Newspaper,
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { CERTIFICATION_LEVELS } from '../data/certifications';
import { CurriculumModule, Lesson } from '../types';

export const LearningMap: React.FC = () => {
  const { user, startLesson, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('module-0');

  const categories = [
    { id: 'all', label: 'সকল ২০টি মডিউল (ALL)' },
    { id: 'foundation', label: 'ভিত্তি (MODULE 0-4)' },
    { id: 'consonants-fola', label: 'বর্ণমালা ও ফলা (5-6)' },
    { id: 'juktoborno', label: 'যুক্তবর্ণ আর্কিটেকচার (7-10)' },
    { id: 'fluency', label: 'শব্দ, বাক্য ও বাস্তব (11-14)' },
    { id: 'advanced', label: 'অ্যাডাপ্টিভ ও পেশাদার (15-19)' }
  ];

  const filteredModules = CURRICULUM_MODULES.filter((module) => {
    if (selectedCategory === 'foundation') return module.levelNumber <= 4;
    if (selectedCategory === 'consonants-fola') return module.levelNumber >= 5 && module.levelNumber <= 6;
    if (selectedCategory === 'juktoborno') return module.levelNumber >= 7 && module.levelNumber <= 10;
    if (selectedCategory === 'fluency') return module.levelNumber >= 11 && module.levelNumber <= 14;
    if (selectedCategory === 'advanced') return module.levelNumber >= 15;
    return true;
  });

  const isLessonUnlocked = (lessonId: string, levelNumber: number) => {
    if (levelNumber === 0) return true;
    if (user.completedLessons.includes(lessonId)) return true;

    // Check if previous lesson in curriculum is completed
    let prevLessonId: string | null = null;
    for (const mod of CURRICULUM_MODULES) {
      for (const les of mod.lessons) {
        if (les.id === lessonId) {
          if (!prevLessonId) return true;
          return user.completedLessons.includes(prevLessonId);
        }
        prevLessonId = les.id;
      }
    }
    return false;
  };

  const getModuleProgress = (module: CurriculumModule) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    const completed = module.lessons.filter((l) => user.completedLessons.includes(l.id)).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  const isModuleUnlocked = (module: CurriculumModule) => {
    if (module.levelNumber === 0) return true;
    const prevMod = CURRICULUM_MODULES.find((m) => m.levelNumber === module.levelNumber - 1);
    if (!prevMod) return true;
    // Unlocked if previous module is at least 50% completed or current module has at least one unlocked lesson
    const prevProgress = getModuleProgress(prevMod);
    return prevProgress >= 50 || module.lessons.some((l) => user.completedLessons.includes(l.id));
  };

  const totalLessonsCount = CURRICULUM_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalCompletedCount = user.completedLessons.length;
  const overallMasteryPercent = Math.min(100, Math.round((totalCompletedCount / Math.max(1, totalLessonsCount)) * 100));

  // Find next actionable lesson
  const getNextActionableLesson = (module: CurriculumModule): Lesson | null => {
    for (const les of module.lessons) {
      if (!user.completedLessons.includes(les.id) && isLessonUnlocked(les.id, module.levelNumber)) {
        return les;
      }
    }
    return module.lessons[0] || null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Newspaper Section Header */}
      <div className="border-b-2 border-[#141210] pb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Newspaper className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000]">
              PROGRESSIVE MASTERY CURRICULUM &bull; ২০টি সুশৃঙ্খল মডিউল
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            বাংলা স্পর্শ টাইপিং প্রগ্রেসিভ কারিকুলাম
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-3xl leading-relaxed">
            কীবোর্ড পরিচিতি $\rightarrow$ হোম রো $\rightarrow$ কার $\rightarrow$ শিফট $\rightarrow$ ফলা $\rightarrow$ হসন্ত $\rightarrow$ যুক্তবর্ণ $\rightarrow$ শব্দ $\rightarrow$ বাক্য $\rightarrow$ অনুচ্ছেদ $\rightarrow$ প্রফেশনাল সনদপত্র।
          </p>
        </div>

        {/* Global Stats Dashboard Pill */}
        <div className="flex items-center gap-5 bg-[#FCFBF8] p-4 border-2 border-[#141210]/40 shadow-2xs font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#141210]/60 uppercase font-bold">কারিকুলাম অগ্রগতি</div>
            <div className="text-lg font-bold text-[#141210] flex items-center gap-1.5 mt-0.5">
              <span>{overallMasteryPercent}%</span>
              <span className="text-[11px] font-normal text-[#141210]/60">({totalCompletedCount}/{totalLessonsCount})</span>
            </div>
          </div>
          <div className="h-9 w-[1px] bg-[#141210]/20"></div>
          <div>
            <div className="text-[10px] text-[#141210]/60 uppercase font-bold">অর্জিত পয়েন্ট</div>
            <div className="text-lg font-bold text-amber-900 flex items-center gap-1 mt-0.5">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>{user.totalXp} XP</span>
            </div>
          </div>
          <div className="h-9 w-[1px] bg-[#141210]/20"></div>
          <button
            onClick={() => setActiveTab('juktakkhor-lab')}
            className="px-3 py-1.5 bg-[#8B0000] text-[#F5F2EB] text-[11px] font-tiro font-bold hover:bg-[#141210] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>যুক্তবর্ণ ট্রি</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-tiro font-bold whitespace-nowrap transition-all border-2 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#141210] text-[#F5F2EB] border-[#141210]'
                : 'bg-[#FCFBF8] text-[#141210]/80 border-[#141210]/20 hover:border-[#141210]/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 20-Module System Cards */}
      <div className="space-y-6">
        {filteredModules.map((module) => {
          const progress = getModuleProgress(module);
          const unlocked = isModuleUnlocked(module);
          const isComplete = progress === 100;
          const isExpanded = expandedModuleId === module.id;
          const nextLesson = getNextActionableLesson(module);

          return (
            <div
              key={module.id}
              className={`bg-[#FCFBF8] border-2 transition-all shadow-2xs ${
                isComplete
                  ? 'border-[#141210]/50 bg-[#FAF7F0]'
                  : unlocked
                  ? 'border-[#141210]/40'
                  : 'border-[#141210]/15 opacity-70 bg-[#EDE9DF]/50'
              }`}
            >
              {/* Module Header Card - Exact Spec */}
              <div className="p-6 sm:p-7 flex flex-col gap-5">
                {/* Level / Module Badge & Tagline */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 bg-[#141210] text-[#F5F2EB] font-mono text-[10px] font-bold uppercase tracking-wider">
                        LEVEL / MODULE {module.levelNumber}
                      </span>
                      <span className="text-xs font-tiro font-bold text-[#8B0000]">
                        &bull; {module.badgeName}
                      </span>
                      {isComplete && (
                        <span className="px-2 py-0.5 bg-emerald-800 text-[#F5F2EB] font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          সম্পন্ন
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-tiro font-bold text-[#141210]">
                      {module.title}
                    </h2>
                    <p className="text-xs font-mono text-[#141210]/60 uppercase mt-0.5">
                      {module.titleEn}
                    </p>
                  </div>

                  {/* Rewards Pill */}
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="px-3 py-1.5 bg-[#EDE9DF] border border-[#141210]/20 font-bold text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>+{module.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                {/* Quote in Bangla */}
                <div className="bg-[#EDE9DF]/70 border-l-4 border-[#8B0000] p-3 text-xs sm:text-sm font-tiro italic text-[#141210]/90">
                  "{module.quoteBn}"
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#141210]/70 uppercase tracking-wider text-[10px]">
                      PROGRESS
                    </span>
                    <span className="font-bold text-[#141210]">
                      {progress}%
                    </span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full h-3 bg-[#EDE9DF] border border-[#141210]/30 overflow-hidden relative">
                    <div
                      className="h-full bg-[#141210] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Skills Tags Pills */}
                {module.skills && module.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#141210]/60 mr-1">
                      Skills:
                    </span>
                    {module.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#EDE9DF]/80 border border-[#141210]/15 text-[11px] font-tiro text-[#141210] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Unit & Lesson Quick Scannable List */}
                <div className="bg-[#FAF7F0] border border-[#141210]/20 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#141210]/70 uppercase border-b border-[#141210]/15 pb-1.5">
                    <span>পাঠ্যক্রম তালিকা (LESSONS & DRILLS)</span>
                    <span>{module.lessons.length}টি লেসন</span>
                  </div>

                  <div className="space-y-1.5">
                    {module.lessons.map((les, lIdx) => {
                      const isLesCompleted = user.completedLessons.includes(les.id);
                      const isLesUnlocked = isLessonUnlocked(les.id, module.levelNumber);
                      const isNext = !isLesCompleted && isLesUnlocked && nextLesson?.id === les.id;

                      return (
                        <div
                          key={les.id}
                          className={`flex items-center justify-between p-2 text-xs font-tiro transition-all ${
                            isLesCompleted
                              ? 'bg-emerald-50/60 text-emerald-950 border-l-2 border-emerald-700'
                              : isNext
                              ? 'bg-[#141210]/5 text-[#141210] font-bold border-l-2 border-[#8B0000]'
                              : isLesUnlocked
                              ? 'text-[#141210]/90 hover:bg-white/60'
                              : 'text-[#141210]/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isLesCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            ) : isNext ? (
                              <span className="w-4 h-4 text-[#8B0000] font-mono font-bold flex items-center justify-center shrink-0">
                                &rarr;
                              </span>
                            ) : isLesUnlocked ? (
                              <Play className="w-3.5 h-3.5 text-[#141210]/60 shrink-0" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-[#141210]/30 shrink-0" />
                            )}
                            <span className="font-tiro">
                              {les.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-[10px]">
                            {isLesCompleted ? (
                              <div className="flex items-center gap-0.5 text-amber-600">
                                {[1, 2, 3].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= (user.lessonStars[les.id] || 3)
                                        ? 'text-amber-500 fill-amber-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : isLesUnlocked ? (
                              <button
                                onClick={() => startLesson(les.id)}
                                className="px-2.5 py-1 bg-[#141210] text-[#F5F2EB] text-[10px] font-tiro font-bold hover:bg-[#8B0000] transition-colors cursor-pointer shadow-2xs"
                              >
                                শুরু করুন
                              </button>
                            ) : (
                              <span className="text-[#141210]/40 uppercase">লকড</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#141210]/20">
                  <div className="text-xs font-tiro text-[#141210]/70">
                    {unlocked
                      ? isComplete
                        ? 'মডিউলটির সকল লেসন সম্পন্ন হয়েছে। রিভিশন দিতে পারেন।'
                        : `পরবর্তী লেসন: ${nextLesson?.title || ''}`
                      : 'পূর্ববর্তী মডিউলের কমপক্ষে ৫০% শেষ করে এই মডিউলটি আনলক করুন।'}
                  </div>

                  {unlocked ? (
                    <button
                      onClick={() => nextLesson && startLesson(nextLesson.id)}
                      className="px-5 py-2.5 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <span>{isComplete ? 'রিভিউ করুন (Review Lesson)' : 'চালিয়ে যান (Continue Learning)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-[#EDE9DF] border border-[#141210]/20 text-xs font-tiro text-[#141210]/50 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>লকড (পূর্ববর্তী ধাপ সম্পন্ন করুন)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certification Overview Teaser Card */}
      <div className="bg-[#FAF7F0] border-2 border-[#141210]/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8B0000] uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>MODULE 19 &bull; কীলিপি অফিশিয়াল টাইপিং সনদপত্র</span>
          </div>
          <h3 className="text-2xl font-tiro font-bold text-[#141210]">
            জাতীয় ও আন্তর্জাতিক মানের সনদপত্র অর্জন করুন
          </h3>
          <p className="text-xs font-tiro text-[#141210]/80 max-w-2xl leading-relaxed">
            ব্রোঞ্জ (১৮ WPM), সিলভার (২৮ WPM), গোল্ড (৪০ WPM), এবং গ্র্যান্ডমাস্টার (৫২+ WPM) সনদপত্র পরীক্ষা দিন এবং আপনার টাইপিং দক্ষতার অফিসিয়াল স্বীকৃতি লাভ করুন।
          </p>
        </div>

        <button
          onClick={() => {
            const certMod = CURRICULUM_MODULES.find((m) => m.levelNumber === 19);
            if (certMod && certMod.lessons[0]) {
              startLesson(certMod.lessons[0].id);
            }
          }}
          className="px-6 py-3 bg-[#8B0000] text-[#F5F2EB] text-sm font-tiro font-bold hover:bg-[#141210] transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <Award className="w-4 h-4" />
          <span>সনদপত্র পরীক্ষা দিন</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
