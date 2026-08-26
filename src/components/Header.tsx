import React from 'react';
import { BookOpen, Crown, Flame, Gamepad2, Globe, Layout, Sparkles, Trophy, Volume2, VolumeX, Zap, Keyboard, Award } from 'lucide-react';
import { NavigationTab, useApp } from '../context/AppContext';
import { KEYBOARD_LAYOUTS } from '../lib/keyboardAdapters';
import { KeyboardLayoutId } from '../types';

export const Header: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    setKeyboardLayout,
    toggleSound,
    toggleLanguage
  } = useApp();

  const isBn = user.language === 'bn';

  const navItems: { id: NavigationTab; labelBn: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', labelBn: 'হোম (Overview)', labelEn: 'Overview', icon: Keyboard },
    { id: 'learn', labelBn: 'পাঠশালা (Lessons)', labelEn: 'Curriculum', icon: BookOpen },
    { id: 'speed-test', labelBn: 'স্পিড টেস্ট (Speed Arena)', labelEn: 'Speed Arena', icon: Zap },
    { id: 'juktakkhor-lab', labelBn: 'যুক্তাক্ষর ল্যাব (Conjuncts)', labelEn: 'Juktakkhor Lab', icon: Layout },
    { id: 'games', labelBn: 'টাইপিং খেলা (Arcade)', labelEn: 'Typing Games', icon: Gamepad2 },
    { id: 'dashboard', labelBn: 'আমার খতিয়ান (Profile)', labelEn: 'My Profile', icon: Crown },
    { id: 'leaderboard', labelBn: 'লিডারবোর্ড (Rankings)', labelEn: 'Leaderboard', icon: Trophy }
  ];

  return (
    <header className="border-b-4 border-double border-[#141210] bg-[#F5F2EB] sticky top-0 z-40 select-none">
      {/* Broadsheet Top Editorial Info Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-1.5 flex flex-wrap justify-between items-center border-b border-[#141210]/20 text-[11px] font-tiro text-[#141210]/75">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-bold tracking-wider text-[#8B0000] border-r border-[#141210]/20 pr-3">
            KEYLIPI &bull; বাংলা স্পর্শ টাইপিং একাডেমি
          </span>
          <span className="hidden sm:inline">বিজয় • অভ্র • জাতীয় কিবোর্ড সমন্বিত</span>
          <span className="bg-[#141210] text-[#F5F2EB] px-1.5 py-0.2 text-[10px] font-mono uppercase font-bold tracking-wider">
            ১০-আঙুল মেকানিক্যাল সাউন্ড
          </span>
        </div>
        <div className="flex items-center gap-3 font-tiro">
          <span className="hidden md:inline text-xs italic">
            "না তাকিয়েই নির্ভুল স্পর্শে বাংলা টাইপিং"
          </span>
          <span className="text-[10px] font-mono font-bold uppercase bg-[#EDE9DF] border border-[#141210]/20 px-2 py-0.5 rounded-xs">
            UNICODE V15
          </span>
        </div>
      </div>

      {/* Grand Editorial Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3 border-b-2 border-[#141210]">
        {/* Left Daily Streak Badge */}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#141210]/60">
            TOUCH TYPING CADENCE
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFBF8] border border-[#141210]/30 text-xs font-mono font-bold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-red-700 fill-red-700" />
              <span>{user.streakDays} দিন অবিচল</span>
            </div>
          </div>
        </div>

        {/* Center Grand Masthead Title */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center cursor-pointer group text-center"
        >
          <div className="flex items-center gap-3">
            <span className="font-serif-editorial text-4xl sm:text-5xl font-bold tracking-tight text-[#141210] group-hover:text-[#8B0000] transition-colors">
              কীলিপি &bull; KeyLipi
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-serif-editorial italic tracking-wide text-[#141210]/75 mt-0.5">
            THE EDITORIAL BANGLA TOUCH TYPING ACADEMY & SPEED ARENA
          </span>
        </div>

        {/* Right Tools & Controls */}
        <div className="flex items-center gap-2">
          {/* Keyboard Layout Selector */}
          <div className="flex items-center gap-1.5 bg-[#FCFBF8] border border-[#141210]/30 px-2.5 py-1 shadow-2xs">
            <span className="text-[10px] font-mono font-bold text-[#141210]/60 hidden sm:inline">
              LAYOUT:
            </span>
            <select
              value={user.preferredKeyboard}
              onChange={(e) => setKeyboardLayout(e.target.value as KeyboardLayoutId)}
              className="text-xs font-tiro font-bold text-[#141210] bg-transparent outline-none cursor-pointer"
            >
              {Object.values(KEYBOARD_LAYOUTS).map((lay) => (
                <option key={lay.id} value={lay.id} className="text-[#141210]">
                  {lay.nativeName} ({lay.name})
                </option>
              ))}
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 border transition-colors cursor-pointer ${
              user.soundEnabled
                ? 'bg-[#FCFBF8] border-[#141210]/30 text-[#141210]'
                : 'bg-[#EDE9DF] border-[#141210]/30 text-[#141210]/40'
            }`}
            title={user.soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
          >
            {user.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 bg-[#FCFBF8] border border-[#141210]/30 text-xs font-bold font-tiro hover:bg-[#EDE9DF] cursor-pointer flex items-center gap-1 shadow-2xs"
            title="ভাষা পরিবর্তন"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isBn ? 'EN' : 'বাং'}</span>
          </button>
        </div>
      </div>

      {/* Broadsheet Section Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto py-1.5 text-xs font-tiro font-bold">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (activeTab === 'lesson-player' && item.id === 'learn');
          return (
            <React.Fragment key={item.id}>
              {index > 0 && <span className="text-[#141210]/30 select-none">•</span>}
              <button
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#141210] text-[#F5F2EB] shadow-xs'
                    : 'text-[#141210]/80 hover:text-[#141210] hover:bg-[#141210]/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>{isBn ? item.labelBn : item.labelEn}</span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
};
