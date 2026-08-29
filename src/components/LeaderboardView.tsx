import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  Medal,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
  RefreshCw,
  Search,
  ArrowUpDown,
  Sparkles,
  Keyboard,
  UserCheck,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeaderboardUser } from '../types';
import { subscribeToLeaderboard } from '../lib/firebase';

export const LeaderboardView: React.FC = () => {
  const { user, authUser, setActiveTab } = useApp();
  const [filterLayout, setFilterLayout] = useState<'all' | 'avro' | 'bijoy' | 'jatiya'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'topWpm' | 'totalXp' | 'accuracy' | 'streak'>('topWpm');
  const [realUsers, setRealUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Subscribe to real-time Firestore Leaderboard collection
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToLeaderboard((data) => {
      setRealUsers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter and sort the real Firestore users
  const processedUsers = realUsers
    .filter((u) => {
      if (filterLayout !== 'all' && u.keyboard !== filterLayout) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.displayName.toLowerCase().includes(q) ||
          (u.username && u.username.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'topWpm') return b.topWpm - a.topWpm;
      if (sortBy === 'accuracy') return b.accuracy - a.accuracy;
      if (sortBy === 'streak') return b.streak - a.streak;
      return b.totalXp - a.totalXp;
    })
    .map((u, idx) => ({
      ...u,
      rank: idx + 1
    }));

  const top1 = processedUsers[0];
  const top2 = processedUsers[1];
  const top3 = processedUsers[2];

  const currentUserId = authUser?.uid || user.uid;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Broadsheet Section Header */}
      <div className="border-b-2 border-[#141210] pb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Trophy className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000]">
              NATIONAL SPEED RANKINGS &bull; জাতীয় রিয়েলটাইম লিডারবোর্ড
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            কীলিপি লাইভ টাইপিং লিডারবোর্ড
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-2xl leading-relaxed">
            স্পিড টেস্ট পরীক্ষায় অর্জিত নেট গতি (WPM) ও নির্ভুলতার ভিত্তিতে সারা দেশের বাংলা টাইপিস্টদের রিয়েলটাইম র‍্যাঙ্কিং।
          </p>
        </div>

        {/* Live Status and Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FCFBF8] border-2 border-[#141210]/40 font-mono text-xs shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-bold text-[#141210]">লাইভ সিঙ্কড ({realUsers.length} জন টাইপিস্ট)</span>
          </div>

          <button
            onClick={() => setActiveTab('speed-test')}
            className="px-4 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>নতুন স্পিড টেস্ট দিন</span>
          </button>
        </div>
      </div>

      {/* Podium Display (Top 3 real players) */}
      {processedUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
          {/* 2nd Place */}
          {top2 ? (
            <div className="bg-[#FCFBF8] border-2 border-[#141210]/40 p-6 shadow-2xs flex flex-col items-center text-center gap-3 order-2 md:order-1 relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#141210] bg-[#EDE9DF] flex items-center justify-center font-mono font-bold text-base text-[#141210] shadow-2xs">
                #2
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-800 px-2 py-0.5 border border-slate-300 font-bold">
                  রৌপ্য স্থান
                </span>
                <h3 className="text-xl font-tiro font-bold text-[#141210] mt-1.5">
                  {top2.displayName}
                </h3>
                <span className="text-[10px] font-mono text-[#141210]/60">
                  @{top2.username || 'typist'} &bull; {top2.keyboard.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <div className="text-xl font-bold text-[#141210]">
                  {top2.topWpm} <span className="text-xs font-normal">WPM</span>
                </div>
                <span className="text-[#141210]/30">|</span>
                <div className="text-xs font-bold text-amber-900">
                  {top2.totalXp} <span className="text-[10px] font-normal">XP</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block order-1 opacity-40 border-2 border-dashed border-[#141210]/30 p-6 text-center font-tiro text-xs">
              ২য় স্থান উন্মুক্ত
            </div>
          )}

          {/* 1st Place (Champion) */}
          {top1 && (
            <div className="bg-[#FAF7F0] border-2 border-[#141210] p-8 shadow-sm flex flex-col items-center text-center gap-4 order-1 md:order-2 relative">
              <div className="w-16 h-16 rounded-full border-2 border-[#141210] bg-amber-200 flex items-center justify-center text-amber-950 shadow-xs">
                <Crown className="w-8 h-8 text-amber-900" />
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 border border-amber-300 font-bold tracking-wider">
                  জাতীয় শীর্ষ টাইপিস্ট (১ম স্থান)
                </span>
                <h3 className="text-2xl font-tiro font-bold text-[#141210] mt-2">
                  {top1.displayName}
                </h3>
                <span className="text-[11px] font-mono text-[#141210]/70 font-bold">
                  @{top1.username || 'champion'} &bull; {top1.keyboard.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <div className="text-3xl font-bold text-[#141210]">
                  {top1.topWpm} <span className="text-sm font-normal">WPM</span>
                </div>
                <span className="text-[#141210]/30">|</span>
                <div className="text-sm font-bold text-emerald-800">
                  {top1.accuracy}% <span className="text-[10px] font-normal">Acc</span>
                </div>
                <span className="text-[#141210]/30">|</span>
                <div className="text-sm font-bold text-amber-900">
                  {top1.totalXp} <span className="text-[10px] font-normal">XP</span>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 ? (
            <div className="bg-[#FCFBF8] border-2 border-[#141210]/40 p-6 shadow-2xs flex flex-col items-center text-center gap-3 order-3 relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#141210] bg-[#EDE9DF] flex items-center justify-center font-mono font-bold text-base text-amber-900 shadow-2xs">
                #3
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase bg-amber-50 text-amber-900 px-2 py-0.5 border border-amber-200 font-bold">
                  ব্রোঞ্জ স্থান
                </span>
                <h3 className="text-xl font-tiro font-bold text-[#141210] mt-1.5">
                  {top3.displayName}
                </h3>
                <span className="text-[10px] font-mono text-[#141210]/60">
                  @{top3.username || 'typist'} &bull; {top3.keyboard.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <div className="text-xl font-bold text-[#141210]">
                  {top3.topWpm} <span className="text-xs font-normal">WPM</span>
                </div>
                <span className="text-[#141210]/30">|</span>
                <div className="text-xs font-bold text-amber-900">
                  {top3.totalXp} <span className="text-[10px] font-normal">XP</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block order-3 opacity-40 border-2 border-dashed border-[#141210]/30 p-6 text-center font-tiro text-xs">
              ৩য় স্থান উন্মুক্ত
            </div>
          )}
        </div>
      )}

      {/* Control Bar: Filters & Search */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/40 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Layout Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase text-[#141210]/60 mr-1">
            কীবোর্ড লেআউট:
          </span>
          {[
            { id: 'all', label: 'সকল লেআউট' },
            { id: 'avro', label: 'অভ্র (Avro)' },
            { id: 'bijoy', label: 'বিজয় (Bijoy)' },
            { id: 'jatiya', label: 'জাতীয় (Jatiya)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterLayout(tab.id as any)}
              className={`px-3 py-1 text-xs font-tiro font-bold border transition-colors cursor-pointer ${
                filterLayout === tab.id
                  ? 'bg-[#141210] text-[#F5F2EB] border-[#141210]'
                  : 'bg-[#EDE9DF]/60 text-[#141210] border-[#141210]/20 hover:bg-[#EDE9DF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-1.5 bg-[#EDE9DF]/60 border border-[#141210]/30 px-2.5 py-1">
            <Search className="w-3.5 h-3.5 text-[#141210]/50" />
            <input
              type="text"
              placeholder="টাইপিস্ট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs font-tiro text-[#141210] bg-transparent outline-none w-32 sm:w-40"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#EDE9DF]/60 border border-[#141210]/30 px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#141210]/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-tiro font-bold text-[#141210] bg-transparent outline-none cursor-pointer"
            >
              <option value="topWpm">গতি (WPM) অনুযায়ী</option>
              <option value="totalXp">মোট XP অনুযায়ী</option>
              <option value="accuracy">নির্ভুলতা অনুযায়ী</option>
              <option value="streak">স্ট্রিক অনুযায়ী</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/40 p-6 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#141210]/20 pb-3">
          <h2 className="text-xl font-tiro font-bold text-[#141210]">
            টাইপিস্টদের পূর্ণাঙ্গ তালিকা
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 border border-emerald-300 rounded-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>লাইভ ন্যাশনাল র‍্যাঙ্কিং</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 font-tiro text-[#141210]/70">
            <RefreshCw className="w-6 h-6 animate-spin text-[#8B0000]" />
            <span>লাইভ লিডারবোর্ড লোড হচ্ছে...</span>
          </div>
        ) : processedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-[#141210]/20 text-[10px] font-bold uppercase tracking-wider text-[#141210]/60">
                  <th className="py-3 px-3">র‍্যাঙ্ক</th>
                  <th className="py-3 px-3">টাইপিস্ট ও ইউজার আইডি</th>
                  <th className="py-3 px-3">লেআউট</th>
                  <th className="py-3 px-3">সর্বোচ্চ গতি</th>
                  <th className="py-3 px-3">নির্ভুলতা</th>
                  <th className="py-3 px-3">স্ট্রিক</th>
                  <th className="py-3 px-3">মোট অর্জিত XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141210]/10">
                {processedUsers.map((u) => {
                  const isCurrentUser =
                    u.uid === currentUserId ||
                    u.id === currentUserId ||
                    (authUser?.displayName && u.displayName === authUser.displayName);

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-[#FAF7F0] font-bold border-l-4 border-l-[#8B0000]'
                          : 'hover:bg-[#EDE9DF]/50'
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 font-bold">
                          {u.rank === 1 ? (
                            <span className="flex items-center gap-1 text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300">
                              <Crown className="w-3.5 h-3.5" /> #1
                            </span>
                          ) : u.rank === 2 ? (
                            <span className="flex items-center gap-1 text-slate-900 bg-slate-200 px-2 py-0.5 border border-slate-300">
                              <Medal className="w-3.5 h-3.5" /> #2
                            </span>
                          ) : u.rank === 3 ? (
                            <span className="flex items-center gap-1 text-amber-900 bg-amber-50 px-2 py-0.5 border border-amber-200">
                              <Medal className="w-3.5 h-3.5" /> #3
                            </span>
                          ) : (
                            <span className="text-[#141210]/60">#{u.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          {u.photoURL ? (
                            <img
                              src={u.photoURL}
                              alt={u.displayName}
                              className="w-8 h-8 rounded-full border border-[#141210]/30 object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-[#141210]/30 bg-[#EDE9DF] flex items-center justify-center font-tiro font-bold text-sm text-[#141210]">
                              {u.avatarLetter || u.displayName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-tiro font-bold text-sm text-[#141210]">
                                {u.displayName}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[9px] font-mono font-bold bg-[#8B0000] text-[#F5F2EB] px-1.5 py-0.2">
                                  আপনি
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-[#141210]/50 block">
                              @{u.username || 'typist'} &bull; {u.badge}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 uppercase text-[#141210]/80 font-bold text-[11px]">
                        {u.keyboard}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-sm text-[#141210]">
                        {u.topWpm} <span className="text-[10px] font-normal text-[#141210]/60">WPM</span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#141210]">
                        {u.accuracy}%
                      </td>
                      <td className="py-3.5 px-3 text-[#141210]">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#8B0000] fill-[#8B0000]" />
                          {u.streak} দিন
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#141210]">
                        {u.totalXp} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-4 border-2 border-dashed border-[#141210]/20 text-center flex flex-col items-center gap-4 bg-[#EDE9DF]/30">
            <div className="w-12 h-12 rounded-full border border-[#141210]/30 bg-[#EDE9DF] flex items-center justify-center text-[#141210]">
              <Trophy className="w-6 h-6 text-[#8B0000]" />
            </div>
            <div>
              <h3 className="font-tiro font-bold text-lg text-[#141210]">
                এখনো কোনো র‍্যাঙ্কিং রেকর্ড নেই
              </h3>
              <p className="text-xs font-tiro text-[#141210]/70 mt-1 max-w-md">
                প্রথম ব্যক্তি হিসেবে একটি স্পিড টেস্ট বা টাইপিং অনুশীলন সম্পন্ন করুন এবং লিডারবোর্ডের শীর্ষ স্থান অধিকার করুন!
              </p>
            </div>
            <button
              onClick={() => setActiveTab('speed-test')}
              className="px-5 py-2 bg-[#141210] text-[#F5F2EB] font-tiro font-bold text-xs hover:bg-[#8B0000] transition-colors cursor-pointer shadow-2xs"
            >
              এখনই টেস্ট দিন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
