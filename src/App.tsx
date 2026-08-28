/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dashboard } from './components/Dashboard';
import { FrontPageGazette } from './components/FrontPageGazette';
import { GamesHub } from './components/GamesHub';
import { Header } from './components/Header';
import { JuktakkhorLab } from './components/JuktakkhorLab';
import { LeaderboardView } from './components/LeaderboardView';
import { LearningMap } from './components/LearningMap';
import { LessonPlayer } from './components/LessonPlayer';
import { SpeedTestArena } from './components/SpeedTestArena';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { activeTab, isFocusMode } = useApp();
  const isInTypingFocus = (activeTab === 'lesson-player' || activeTab === 'speed-test') && isFocusMode;

  return (
    <div className={`min-h-screen bg-[#F5F2EB] text-[#141210] flex flex-col font-tiro selection:bg-[#141210] selection:text-[#F5F2EB] ${isInTypingFocus ? 'h-screen overflow-y-auto' : ''}`}>
      {/* Broadsheet Editorial / Focus Header */}
      <Header />

      {/* Main Dynamic Viewport */}
      <main className={`flex-1 ${isInTypingFocus ? 'pb-4' : 'pb-16'}`}>
        {activeTab === 'home' && <FrontPageGazette />}
        {activeTab === 'learn' && <LearningMap />}
        {activeTab === 'lesson-player' && <LessonPlayer />}
        {activeTab === 'speed-test' && <SpeedTestArena />}
        {(activeTab === 'juktakkhor-lab' || activeTab === 'juktakkhor') && <JuktakkhorLab />}
        {activeTab === 'games' && <GamesHub />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </main>

      {/* Authentic Broadsheet Editorial Footer (hidden in focus mode to keep full viewport clean) */}
      {!isInTypingFocus && (
        <footer className="border-t-4 border-double border-[#141210] bg-[#EDE9DF] py-8 px-6 text-xs text-[#141210]/70 font-tiro select-none">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
              <span className="font-serif-editorial font-bold text-xl text-[#141210]">
                KeyLipi &bull; কীলিপি বাংলা টাইপিং একাডেমি
              </span>
              <span className="text-[11px] text-[#141210]/60 italic">
                বাংলা টাচ টাইপিংয়ের ঐতিহ্য, নির্ভুলতা ও দ্রুততার ব্রডশিট প্রকাশনা
              </span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold">
              <span>বিজয় লেআউট</span>
              <span>&bull;</span>
              <span>অভ্র ফোনেটিক</span>
              <span>&bull;</span>
              <span>জাতীয় কিবোর্ড</span>
              <span>&bull;</span>
              <span>১০-আঙুল অ্যাকোস্টিক সিন্থেসাইজার</span>
            </div>

            <div className="text-[11px] font-mono text-[#141210]/60">
              &copy; {new Date().getFullYear()} KEYLIPI &bull; ALL RIGHTS RESERVED
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
