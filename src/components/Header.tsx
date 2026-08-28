import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
  Globe,
  Layout,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  Keyboard,
  Award,
  LogIn,
  LogOut,
  UserCheck,
  Edit2,
  Check,
  CloudCheck,
  Cloud,
  X,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Eye,
  EyeOff,
  Target
} from 'lucide-react';
import { NavigationTab, useApp } from '../context/AppContext';
import { KEYBOARD_LAYOUTS } from '../lib/keyboardAdapters';
import { KeyboardLayoutId } from '../types';

export const Header: React.FC = () => {
  const {
    user,
    authUser,
    isAuthLoading,
    isSyncing,
    authError,
    setAuthError,
    loginGoogle,
    logout,
    updateProfileName,
    activeTab,
    setActiveTab,
    setKeyboardLayout,
    toggleSound,
    toggleLanguage,
    isFocusMode,
    toggleFocusMode
  } = useApp();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.displayName);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isBn = user.language === 'bn';
  const isInTypingFocus = (activeTab === 'lesson-player' || activeTab === 'speed-test') && isFocusMode;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore if iframe policy restricts
    }
  };

  const navItems: { id: NavigationTab; labelBn: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', labelBn: 'হোম (Overview)', labelEn: 'Overview', icon: Keyboard },
    { id: 'learn', labelBn: 'পাঠশালা (Lessons)', labelEn: 'Curriculum', icon: BookOpen },
    { id: 'speed-test', labelBn: 'স্পিড টেস্ট (Speed Arena)', labelEn: 'Speed Arena', icon: Zap },
    { id: 'juktakkhor-lab', labelBn: 'যুক্তাক্ষর ল্যাব (Conjuncts)', labelEn: 'Juktakkhor Lab', icon: Layout },
    { id: 'games', labelBn: 'টাইপিং খেলা (Arcade)', labelEn: 'Typing Games', icon: Gamepad2 },
    { id: 'dashboard', labelBn: 'প্রোফাইল (Profile)', labelEn: 'Profile', icon: Crown },
    { id: 'leaderboard', labelBn: 'লিডারবোর্ড (Rankings)', labelEn: 'Leaderboard', icon: Trophy }
  ];

  const handleSaveName = async () => {
    if (nameInput.trim()) {
      await updateProfileName(nameInput.trim());
      setEditingName(false);
    }
  };

  // Sleek Distraction-Free Focus Navigation Bar for Lessons and Tests
  if (isInTypingFocus) {
    return (
      <header className="border-b-2 border-[#141210] bg-[#FAF7F0] sticky top-0 z-40 select-none shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Back / Exit with shortcut hint */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'lesson-player' ? 'learn' : 'home')}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FCFBF8] border border-[#141210]/30 hover:bg-[#EDE9DF] text-xs font-tiro font-bold text-[#141210] transition-colors cursor-pointer rounded-xs shadow-2xs"
              title="প্রস্থান করতে Esc চাপুন"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8B0000]" />
              <span>{activeTab === 'lesson-player' ? 'পাঠশালা' : 'প্রধান পৃষ্ঠা'}</span>
              <span className="text-[10px] font-mono text-[#141210]/50 bg-[#EDE9DF] px-1 rounded-xs ml-0.5">Esc</span>
            </button>

            {/* Mode Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-tiro text-[#141210]/80 border-l border-[#141210]/20 pl-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <div className="flex items-center gap-1.5 font-bold text-[#141210]">
                {activeTab === 'lesson-player' ? (
                  <>
                    <Target className="w-3.5 h-3.5 text-[#8B0000]" />
                    <span>অনুশীলন ও ড্রিল ফোকাস মোড</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#8B0000]" />
                    <span>স্পিড টেস্ট অ্যারেনা</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Essential distraction-free controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Keyboard Layout */}
            <div className="flex items-center gap-1 bg-[#FCFBF8] border border-[#141210]/30 px-2 py-0.5 shadow-2xs rounded-xs">
              <span className="text-[10px] font-mono text-[#141210]/60 font-bold hidden md:inline">LAYOUT:</span>
              <select
                value={user.preferredKeyboard}
                onChange={(e) => setKeyboardLayout(e.target.value as KeyboardLayoutId)}
                className="text-xs font-tiro font-bold text-[#141210] bg-transparent outline-none cursor-pointer"
              >
                {Object.values(KEYBOARD_LAYOUTS).map((lay) => (
                  <option key={lay.id} value={lay.id} className="text-[#141210]">
                    {lay.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 border transition-colors cursor-pointer rounded-xs ${
                user.soundEnabled
                  ? 'bg-[#FCFBF8] border-[#141210]/30 text-[#141210]'
                  : 'bg-[#EDE9DF] border-[#141210]/30 text-[#141210]/40'
              }`}
              title={user.soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            >
              {user.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 bg-[#FCFBF8] border border-[#141210]/30 hover:bg-[#EDE9DF] text-[#141210] text-xs transition-colors cursor-pointer rounded-xs shadow-2xs"
              title={isFullscreen ? 'ফুলস্ক্রিন থেকে বের হন' : 'ফুলস্ক্রিন মোড'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Expand to Full Broadsheet Header */}
            <button
              onClick={toggleFocusMode}
              className="flex items-center gap-1 px-2 py-1 bg-[#FCFBF8] border border-[#141210]/30 hover:bg-[#EDE9DF] text-[11px] font-tiro text-[#141210]/80 transition-colors cursor-pointer rounded-xs shadow-2xs"
              title="সম্পূর্ণ হেডার উন্মুক্ত করুন"
            >
              <Eye className="w-3 h-3 text-[#141210]/60" />
              <span className="hidden md:inline">মেনু</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
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
            {/* Cloud Sync Status */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#141210]/80">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-600'}`}></span>
              <span className="font-bold hidden sm:inline">
                {isSyncing ? 'সিঙ্ক হচ্ছে...' : 'ক্লাউড সিঙ্কড'}
              </span>
            </div>

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
                <Flame className="w-3.5 h-3.5 text-[#8B0000] fill-[#8B0000]" />
                <span>{user.streakDays} দিন অবিচল</span>
              </div>
              <div className="px-2 py-1 bg-[#EDE9DF] border border-[#141210]/20 text-[10px] font-mono font-bold text-[#141210]">
                LEVEL {user.level}
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

          {/* Right Tools & Auth Controls */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
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

            {/* User Auth Button */}
            {authUser ? (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 bg-[#FCFBF8] border-2 border-[#141210] px-2.5 py-1 text-xs font-tiro font-bold hover:bg-[#EDE9DF] transition-colors cursor-pointer shadow-2xs"
                title="অ্যাকাউন্ট ও ক্লাউড ডেটা"
              >
                {authUser.photoURL ? (
                  <img
                    src={authUser.photoURL}
                    alt={user.displayName}
                    className="w-5 h-5 rounded-full object-cover border border-[#141210]/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#141210] text-[#F5F2EB] flex items-center justify-center text-[10px] font-mono">
                    {user.displayName.charAt(0)}
                  </div>
                )}
                <span className="max-w-[90px] truncate">{user.displayName}</span>
              </button>
            ) : (
              <button
                onClick={loginGoogle}
                className="flex items-center gap-1.5 bg-[#8B0000] text-[#F5F2EB] border-2 border-[#141210] px-3 py-1 text-xs font-tiro font-bold hover:bg-[#141210] transition-colors cursor-pointer shadow-2xs"
                title="গুগল দিয়ে লগইন করে প্রগ্রেস সেভ করুন"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন করুন</span>
              </button>
            )}
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

      {/* Auth Error Banner if needed */}
      {authError && (
        <div className="bg-[#8B0000]/10 border-b border-[#8B0000]/30 px-4 py-2 text-[#8B0000] text-xs font-tiro flex items-center justify-between font-bold">
          <span>{authError}</span>
          <button onClick={() => setAuthError(null)} className="cursor-pointer p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Profile & Account Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141210]/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF7F0] border-3 border-[#141210] max-w-md w-full p-6 shadow-xl relative flex flex-col gap-5">
            {/* Close */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-1 text-[#141210]/60 hover:text-[#141210] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-[#141210]/20 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B0000] font-bold block">
                TYPIST ACCOUNT &bull; টাইপিস্ট অ্যাকাউন্ট
              </span>
              <h2 className="text-2xl font-tiro font-bold text-[#141210] mt-1">
                ব্যবহারকারী প্রোফাইল ও সিঙ্ক
              </h2>
            </div>

            {/* User Details */}
            <div className="flex items-center gap-4 bg-[#FCFBF8] p-4 border border-[#141210]/30 shadow-2xs">
              {authUser?.photoURL ? (
                <img
                  src={authUser.photoURL}
                  alt={user.displayName}
                  className="w-14 h-14 rounded-full border-2 border-[#141210] object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full border-2 border-[#141210] bg-[#EDE9DF] flex items-center justify-center text-2xl font-tiro font-bold text-[#141210]">
                  {user.displayName.charAt(0)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="text-sm font-tiro font-bold border border-[#141210] bg-white px-2 py-1 outline-none w-full"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1.5 bg-[#141210] text-[#F5F2EB] cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-tiro font-bold text-[#141210] truncate">
                      {user.displayName}
                    </h3>
                    <button
                      onClick={() => {
                        setNameInput(user.displayName);
                        setEditingName(true);
                      }}
                      className="p-1 text-[#141210]/60 hover:text-[#141210] cursor-pointer"
                      title="নাম পরিবর্তন করুন"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-xs font-mono text-[#141210]/60 truncate">
                  {authUser?.email || 'গেস্ট অ্যাকাউন্ট'}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-mono font-bold text-[#8B0000]">
                  <span>LEVEL {user.level}</span>
                  <span>&bull;</span>
                  <span>{user.totalXp} XP</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#8B0000] fill-[#8B0000]" />
                    {user.streakDays} দিন
                  </span>
                </div>
              </div>
            </div>

            {/* Cloud Status Info */}
            <div className="bg-[#EDE9DF]/60 p-3.5 border border-[#141210]/20 text-xs font-tiro space-y-1.5">
              <div className="flex items-center justify-between text-[#141210]">
                <span className="font-bold">ক্লাউড প্রগ্রেস সিঙ্ক:</span>
                <span className="font-mono text-[#141210] font-bold bg-[#141210]/10 px-2 py-0.5 rounded-xs">সক্রিয় (Firestore Connected)</span>
              </div>
              <p className="text-[11px] text-[#141210]/70 leading-relaxed">
                আপনার সমস্ত লেসন প্রগ্রেস, স্পিড টেস্ট স্কোর, যুক্তাক্ষর মাস্টারি, স্ট্রিক এবং অর্জিত সনদপত্র স্বয়ংক্রিয়ভাবে ফায়ারবেস ক্লাউডে সংরক্ষিত হচ্ছে।
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#141210]/20">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setActiveTab('dashboard');
                }}
                className="px-4 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors cursor-pointer shadow-2xs"
              >
                পূর্ণাঙ্গ প্রোফাইল দেখুন
              </button>

              <button
                onClick={() => {
                  logout();
                  setShowProfileModal(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#8B0000]/40 bg-[#8B0000]/10 text-[#8B0000] text-xs font-tiro font-bold hover:bg-[#8B0000] hover:text-[#F5F2EB] transition-colors cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
