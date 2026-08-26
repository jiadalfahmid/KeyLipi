import React from 'react';
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Keyboard,
  ShieldAlert,
  Sparkles,
  Target,
  Trophy,
  Zap,
  Newspaper,
  Layers,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS_LIST } from '../data/achievements';
import { CERTIFICATION_LEVELS } from '../data/certifications';
import { JUKTAKKHOR_DATABASE } from '../data/juktakkhorData';

export const Dashboard: React.FC = () => {
  const { user, startLesson, setActiveTab } = useApp();

  // Find most frequent weak keys
  const weakKeyEntries: [string, { errors: number; totalAttempts: number }][] = (
    Object.entries(user.weakKeys) as [string, { errors: number; totalAttempts: number }][]
  )
    .filter(([_, stat]) => stat.errors > 0)
    .sort((a, b) => b[1].errors - a[1].errors)
    .slice(0, 6);

  // Calculate average WPM across sessions
  const avgWpm =
    user.recentSessions.length > 0
      ? Math.round(
          user.recentSessions.reduce((acc, s) => acc + s.netWpm, 0) / user.recentSessions.length
        )
      : 0;

  const avgAccuracy =
    user.recentSessions.length > 0
      ? Math.round(
          user.recentSessions.reduce((acc, s) => acc + s.accuracy, 0) / user.recentSessions.length
        )
      : 100;

  const masteredJuktakkhorCount = (Object.values(user.juktakkhorMastery || {}) as number[]).filter(
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
              TYPIST DOSSIER &bull; টাইপিস্ট বৃত্তান্ত ও ড্যাশবোর্ড
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            টাইপিস্ট প্রোফাইল ও পারফরম্যান্স মেট্রিক্স
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-2xl leading-relaxed">
            দৈনিক টাইপিং ধারাবাহিকতা, দুর্বল কি-অ্যানালাইসিস, অর্জিত সনদপত্র এবং বিস্তারিত সেশন লগ।
          </p>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-4 bg-[#FCFBF8] p-4 border-2 border-[#141210]/40 shadow-2xs font-mono text-xs">
          <div className="w-12 h-12 border-2 border-[#141210] bg-[#EDE9DF] flex items-center justify-center font-tiro text-xl font-bold text-[#141210]">
            {user.displayName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-[#141210] font-tiro">{user.displayName}</div>
            <div className="text-[10px] text-[#141210]/60 uppercase">
              LEVEL {user.level} &bull; {user.preferredKeyboard.toUpperCase()} LAYOUT
            </div>
            <div className="text-[10px] text-[#8B0000] font-bold">
              {user.totalXp} XP অর্জিত
            </div>
          </div>
        </div>
      </div>

      {/* Official Certification Showcase */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/40 p-6 sm:p-8 shadow-2xs flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141210]/20 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-[#8B0000]" />
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000]">
                OFFICIAL CERTIFICATES &bull; অফিশিয়াল সনদপত্র
              </span>
            </div>
            <h2 className="text-2xl font-tiro font-bold text-[#141210]">
              কীলিপি বাংলা টাইপিং সনদপত্র গ্যালারি
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('learn')}
            className="px-4 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>মডিউল ১৯ পরীক্ষা দিন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Certification Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTIFICATION_LEVELS.map((cert) => {
            const earned = user.earnedCertificates?.[cert.tier];

            return (
              <div
                key={cert.tier}
                className={`p-5 border-2 flex flex-col justify-between gap-4 transition-all relative ${
                  earned
                    ? 'bg-[#FAF7F0] border-[#141210] shadow-sm'
                    : 'bg-[#EDE9DF]/40 border-[#141210]/20 opacity-70'
                }`}
              >
                {/* Badge Top */}
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{cert.badgeIcon || cert.badge}</span>
                  {earned ? (
                    <span className="px-2 py-0.5 bg-emerald-800 text-[#F5F2EB] font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      অর্জিত
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#141210]/20 text-[#141210]/70 font-mono text-[9px] font-bold uppercase">
                      লকড
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-tiro font-bold text-[#141210]">
                    {cert.titleBn}
                  </h3>
                  <p className="text-[10px] font-mono text-[#141210]/60 uppercase">
                    {cert.titleEn}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#141210]/15 space-y-1 font-mono text-xs text-[#141210]/80">
                    <div className="flex justify-between">
                      <span>প্রয়োজনীয় গতি:</span>
                      <span className="font-bold text-[#141210]">{cert.minWpm} WPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>প্রয়োজনীয় নির্ভুলতা:</span>
                      <span className="font-bold text-[#141210]">{cert.minAccuracy}%</span>
                    </div>
                  </div>
                </div>

                {earned ? (
                  <div className="bg-[#EDE9DF] p-2.5 border border-[#141210]/20 font-mono text-[10px] text-[#141210]/80">
                    <div className="font-bold text-emerald-900">
                      সনদ নং: {earned.certificateNumber}
                    </div>
                    <div className="text-[9px] text-[#141210]/60">
                      তারিখ: {earned.earnedDate} ({earned.wpm} WPM, {earned.accuracy}%)
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveTab('learn')}
                    className="w-full py-1.5 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors cursor-pointer"
                  >
                    পরীক্ষা দিন
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Weak Area Heatmap & Daily Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weak Key Heatmap (7 cols) */}
        <div className="lg:col-span-7 bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 shadow-2xs flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#141210]/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#8B0000]" />
              <h2 className="text-xl font-tiro font-bold text-[#141210]">
                দুর্বল কি ও যুক্তবর্ণ বিশ্লেষণ (Weak Key Analysis)
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase text-[#141210]/50 font-bold">
              SRS ADAPTIVE ENGINE
            </span>
          </div>

          <p className="text-xs font-tiro text-[#141210]/80 leading-relaxed">
            টাইপিং অনুশীলনে যেসব বর্ণে আপনি বেশি ভুল করেছেন, আমাদের স্মার্ট অ্যালগরিদম সেগুলো চিহ্নিত করে স্বয়ংক্রিয় ড্রিল সাজিয়ে দেয়:
          </p>

          {weakKeyEntries.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {weakKeyEntries.map(([keyChar, stat]) => (
                <div
                  key={keyChar}
                  className="bg-[#EDE9DF]/70 p-3.5 border border-[#141210]/20 flex flex-col justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tiro font-bold text-2xl text-[#141210]">
                      {keyChar}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 border border-rose-200">
                      {stat.errors} বার ভুল
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#141210]/60">
                    মোট প্রচেষ্টা: {stat.totalAttempts} বার
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-[#EDE9DF]/40 border border-[#141210]/20 text-center font-tiro text-sm text-[#141210]/60">
              অভিনন্দন! আপনার টাইপিংয়ে এখনও কোনো বড় দুর্বলতা পাওয়া যায়নি।
            </div>
          )}

          <div className="bg-[#FAF7F0] p-4 border border-[#141210]/20 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#8B0000] block">
                আজকের স্মার্ট ড্রিল রিকমেন্ডেশন:
              </span>
              <p className="text-xs font-tiro font-bold text-[#141210] mt-0.5">
                ৩ মিনিটের দুর্বল যুক্তবর্ণ ({weakKeyEntries[0]?.[0] || 'ক্ষ'} ও {weakKeyEntries[1]?.[0] || 'জ্ঞ'}) রিফ্রেশার অনুশীলন
              </p>
            </div>
            <button
              onClick={() => setActiveTab('juktakkhor-lab')}
              className="px-4 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              ল্যাবে যান
            </button>
          </div>
        </div>

        {/* Daily Challenges (5 cols) */}
        <div className="lg:col-span-5 bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#141210]/20 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#141210]" />
              <h2 className="text-xl font-tiro font-bold text-[#141210]">
                দৈনিক লক্ষ্য (Daily Goals)
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5">
              TODAY
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: '১০০টি বাংলা শব্দ টাইপ করা',
                desc: 'যেকোনো লেসন বা স্পিড টেস্টের মাধ্যমে',
                reward: 100,
                progress: 75,
                done: false
              },
              {
                title: '৯৫% নির্ভুলতায় ১টি স্পিড টেস্ট',
                desc: 'মিনিমাম ৩০ WPM গতিসহ',
                reward: 150,
                progress: 100,
                done: true
              },
              {
                title: '৩টি নতুন যুক্তবর্ণ মাস্টারি ড্রিল',
                desc: 'যুক্তবর্ণ ল্যাবে ০ থেকে ৫ স্কোর অর্জন',
                reward: 200,
                progress: 66,
                done: false
              }
            ].map((challenge, i) => (
              <div
                key={i}
                className="p-3.5 border border-[#141210]/20 bg-[#EDE9DF]/50 flex flex-col gap-2 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-tiro font-bold text-[#141210]">
                      {challenge.title}
                    </h4>
                    <p className="text-[11px] font-tiro text-[#141210]/70">
                      {challenge.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 border border-amber-200">
                    +{challenge.reward} XP
                  </span>
                </div>

                <div className="w-full bg-[#EDE9DF] h-2 border border-[#141210]/20 overflow-hidden">
                  <div
                    className={`h-full ${challenge.done ? 'bg-emerald-700' : 'bg-[#141210]'}`}
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unlocked Achievements Showcase */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 sm:p-8 shadow-2xs flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#141210]/20 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000] block mb-1">
              TROPHIES &amp; BADGES &bull; পদক ও সম্মাননা
            </span>
            <h2 className="text-2xl font-tiro font-bold text-[#141210]">
              অর্জিত মেডেল ও অর্জনসমূহ ({user.unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = user.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 border-2 transition-all flex flex-col justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-[#FAF7F0] border-[#141210]/40 shadow-2xs'
                    : 'bg-[#EDE9DF]/40 border-[#141210]/15 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 border-2 flex items-center justify-center ${
                      isUnlocked
                        ? 'border-[#141210] bg-[#EDE9DF] text-[#141210]'
                        : 'border-[#141210]/20 text-[#141210]/40'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#141210]/60">
                    +{ach.xpBonus} XP
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-tiro font-bold text-[#141210]">
                    {ach.title}
                  </h4>
                  <p className="text-[11px] font-tiro text-[#141210]/70 mt-0.5 line-clamp-2 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions Activity Log */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 shadow-2xs flex flex-col gap-4">
        <h2 className="text-xl font-tiro font-bold text-[#141210] border-b border-[#141210]/20 pb-3">
          সাম্প্রতিক টাইপিং সেশন ইতিহাস (Recent Activity Logs)
        </h2>

        {user.recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#141210]/20 text-[10px] font-bold uppercase tracking-wider text-[#141210]/60">
                  <th className="py-2.5 px-3">মোড ও শিরোনাম</th>
                  <th className="py-2.5 px-3">লেআউট</th>
                  <th className="py-2.5 px-3">গতি (WPM)</th>
                  <th className="py-2.5 px-3">নির্ভুলতা</th>
                  <th className="py-2.5 px-3">অর্জিত XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141210]/10">
                {user.recentSessions.map((s, idx) => (
                  <tr key={`${s.id || 'sess'}-${idx}`} className="hover:bg-[#EDE9DF]/60 transition-colors">
                    <td className="py-3 px-3 font-tiro font-bold text-[#141210]">
                      {s.title}
                    </td>
                    <td className="py-3 px-3 uppercase text-[#141210]/70">
                      {s.keyboardLayout}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#141210]">
                      {s.netWpm} WPM
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-800">
                      {s.accuracy}%
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-900">
                      +{s.xpEarned} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs font-tiro text-[#141210]/60 py-4 text-center">
            এখনও কোনো সেশন সম্পন্ন করা হয়নি। আজই টাইপিং শুরু করুন!
          </p>
        )}
      </div>
    </div>
  );
};
