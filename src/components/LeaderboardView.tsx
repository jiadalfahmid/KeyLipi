import { Award, Flame, Medal, ShieldCheck, Trophy, Users, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeaderboardUser } from '../types';

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'u1',
    rank: 1,
    username: 'tanvir_speed',
    displayName: 'তানভীর আহমেদ',
    avatarLetter: 'ত',
    topWpm: 68,
    accuracy: 99,
    totalXp: 82400,
    keyboard: 'bijoy',
    streak: 42,
    badge: 'গ্র্যান্ডমাস্টার'
  },
  {
    id: 'u2',
    rank: 2,
    username: 'sumaiya_lipi',
    displayName: 'সুমাইয়া হক',
    avatarLetter: 'স',
    topWpm: 64,
    accuracy: 98,
    totalXp: 74100,
    keyboard: 'avro',
    streak: 28,
    badge: 'মাস্টার'
  },
  {
    id: 'u3',
    rank: 3,
    username: 'rahim_keys',
    displayName: 'আব্দুর রহিম',
    avatarLetter: 'আ',
    topWpm: 59,
    accuracy: 98,
    totalXp: 61500,
    keyboard: 'bijoy',
    streak: 35,
    badge: 'নিনজা'
  },
  {
    id: 'u4',
    rank: 4,
    username: 'nusrat_typer',
    displayName: 'নুসরাত জাহান',
    avatarLetter: 'ন',
    topWpm: 54,
    accuracy: 97,
    totalXp: 49800,
    keyboard: 'avro',
    streak: 19,
    badge: 'এক্সপার্ট'
  },
  {
    id: 'u5',
    rank: 5,
    username: 'fahim_pro',
    displayName: 'ফাহিম মোর্শেদ',
    avatarLetter: 'ফ',
    topWpm: 48,
    accuracy: 96,
    totalXp: 38200,
    keyboard: 'bijoy',
    streak: 14,
    badge: 'স্পিড স্ট্রাইকার'
  }
];

export const LeaderboardView: React.FC = () => {
  const { user } = useApp();
  const [filterLayout, setFilterLayout] = useState<'all' | 'avro' | 'bijoy'>('all');
  const [timeframe, setTimeframe] = useState<'weekly' | 'all_time'>('weekly');

  const filteredUsers = MOCK_LEADERBOARD.filter((u) => {
    if (filterLayout === 'all') return true;
    return u.keyboard === filterLayout;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-[#1A1A1A]/10 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#1A1A1A]/50 mb-1 block">
            GLOBAL RANKINGS & COMPETITION
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial font-bold text-[#1A1A1A] tracking-tight">
            কীলিপি লিডারবোর্ড ও চ্যাম্পিয়নশিপ
          </h1>
          <p className="text-sm font-bengali text-[#1A1A1A]/70 mt-1">
            সারা দেশের সেরা বাংলা টাইপিস্টদের গতি ও নির্ভুলতার ন্যাশনাল র‍্যাঙ্কিং।
          </p>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex items-center bg-[#FFFFFF] p-1 border border-[#1A1A1A]/15 text-xs font-sans font-bold">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              timeframe === 'weekly' ? 'bg-[#1A1A1A] text-[#F2F0ED]' : 'text-[#1A1A1A]/70 hover:bg-[#F2F0ED]'
            }`}
          >
            সাপ্তাহিক (Weekly)
          </button>
          <button
            onClick={() => setTimeframe('all_time')}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              timeframe === 'all_time' ? 'bg-[#1A1A1A] text-[#F2F0ED]' : 'text-[#1A1A1A]/70 hover:bg-[#F2F0ED]'
            }`}
          >
            সর্বকালীন (All Time)
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* 2nd Place */}
        {filteredUsers[1] && (
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 p-6 shadow-xs flex flex-col items-center text-center gap-3 order-2 md:order-1">
            <div className="w-12 h-12 rounded-full border-2 border-gray-400 bg-gray-100 flex items-center justify-center font-bold text-gray-700">
              🥈 2
            </div>
            <div>
              <h3 className="text-lg font-serif-editorial font-bold text-[#1A1A1A]">
                {filteredUsers[1].displayName}
              </h3>
              <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/50">
                {filteredUsers[1].keyboard.toUpperCase()} &bull; {filteredUsers[1].badge}
              </span>
            </div>
            <div className="font-mono text-xl font-bold text-[#1A1A1A]">
              {filteredUsers[1].topWpm} WPM
            </div>
          </div>
        )}

        {/* 1st Place */}
        {filteredUsers[0] && (
          <div className="bg-[#FFFFFF] border-2 border-[#1A1A1A] p-8 shadow-md flex flex-col items-center text-center gap-4 order-1 md:order-2">
            <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-amber-100 flex items-center justify-center font-bold text-2xl text-amber-900 shadow-xs">
              👑 1
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase bg-amber-50 text-amber-800 px-2 py-0.5 border border-amber-200 font-bold">
                WEEKLY CHAMPION
              </span>
              <h3 className="text-2xl font-serif-editorial font-bold text-[#1A1A1A] mt-1">
                {filteredUsers[0].displayName}
              </h3>
              <span className="text-[11px] font-mono uppercase text-[#1A1A1A]/60">
                {filteredUsers[0].keyboard.toUpperCase()} &bull; {filteredUsers[0].badge}
              </span>
            </div>
            <div className="font-mono text-3xl font-bold text-[#1A1A1A]">
              {filteredUsers[0].topWpm} WPM
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {filteredUsers[2] && (
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 p-6 shadow-xs flex flex-col items-center text-center gap-3 order-3">
            <div className="w-12 h-12 rounded-full border-2 border-amber-700 bg-amber-50 flex items-center justify-center font-bold text-amber-800">
              🥉 3
            </div>
            <div>
              <h3 className="text-lg font-serif-editorial font-bold text-[#1A1A1A]">
                {filteredUsers[2].displayName}
              </h3>
              <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/50">
                {filteredUsers[2].keyboard.toUpperCase()} &bull; {filteredUsers[2].badge}
              </span>
            </div>
            <div className="font-mono text-xl font-bold text-[#1A1A1A]">
              {filteredUsers[2].topWpm} WPM
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 p-6 shadow-xs flex flex-col gap-4">
        {/* Table Filters */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1A1A]/50 uppercase text-[10px]">কীবোর্ড ফিল্টার:</span>
            {['all', 'avro', 'bijoy'].map((k) => (
              <button
                key={k}
                onClick={() => setFilterLayout(k as 'all' | 'avro' | 'bijoy')}
                className={`px-2.5 py-1 uppercase font-semibold cursor-pointer ${
                  filterLayout === k ? 'bg-[#1A1A1A] text-[#F2F0ED]' : 'bg-[#F2F0ED] text-[#1A1A1A]/70'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[10px] font-sans text-emerald-800 bg-emerald-50 px-2 py-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ANTI-CHEAT VERIFIED</span>
          </div>
        </div>

        {/* Table Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-[#1A1A1A]/15 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">
                <th className="py-2.5 px-3">র‍্যাঙ্ক</th>
                <th className="py-2.5 px-3">টাইপিস্ট</th>
                <th className="py-2.5 px-3">লেআউট</th>
                <th className="py-2.5 px-3">সর্বোচ্চ গতি</th>
                <th className="py-2.5 px-3">নির্ভুলতা</th>
                <th className="py-2.5 px-3">স্ট্রিক</th>
                <th className="py-2.5 px-3">অর্জিত মোট XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#F2F0ED]/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-sm text-[#1A1A1A]">
                    #{u.rank}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full border border-[#1A1A1A]/20 bg-[#F2F0ED] flex items-center justify-center font-bold text-xs">
                        {u.avatarLetter}
                      </div>
                      <div>
                        <span className="font-bold text-[#1A1A1A] block">{u.displayName}</span>
                        <span className="text-[10px] text-[#1A1A1A]/50">@{u.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 uppercase font-mono text-xs text-[#1A1A1A]/70">
                    {u.keyboard}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-sm text-[#1A1A1A]">
                    {u.topWpm} WPM
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-xs text-emerald-700">
                    {u.accuracy}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-xs text-[#1A1A1A]">
                    🔥 {u.streak}d
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-xs text-amber-900">
                    {u.totalXp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
