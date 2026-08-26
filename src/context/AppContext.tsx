import React, { createContext, useContext, useEffect, useState } from 'react';
import { ACHIEVEMENTS_LIST } from '../data/achievements';
import { soundFx } from '../lib/audio';
import { CertificationTier, JuktakkhorMasteryScore, KeyboardLayoutId, PracticeSessionRecord, UserProfile } from '../types';

export type NavigationTab =
  | 'home'
  | 'learn'
  | 'lesson-player'
  | 'speed-test'
  | 'juktakkhor-lab'
  | 'games'
  | 'dashboard'
  | 'leaderboard';

interface AppContextType {
  user: UserProfile;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedLessonId: string | null;
  startLesson: (lessonId: string) => void;
  setKeyboardLayout: (layout: KeyboardLayoutId) => void;
  addXp: (amount: number) => { newLevel: number; leveledUp: boolean };
  recordSession: (record: Omit<PracticeSessionRecord, 'id' | 'timestamp'>) => void;
  toggleSound: () => void;
  setSoundTheme: (theme: 'cherry-blue' | 'creamy' | 'typewriter' | 'silent') => void;
  toggleLanguage: () => void;
  recordWeakKey: (key: string, isError: boolean) => void;
  updateJuktakkhorMastery: (glyph: string, score: JuktakkhorMasteryScore) => void;
  claimCertificate: (tier: CertificationTier, wpm: number, accuracy: number) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'keylipi_user_profile_v1';

const sanitizeSessions = (sessions: PracticeSessionRecord[] = []): PracticeSessionRecord[] => {
  const seen = new Set<string>();
  const sanitized: PracticeSessionRecord[] = [];
  sessions.forEach((s, idx) => {
    let id = s.id || `session-${s.timestamp || Date.now()}-${idx}`;
    if (seen.has(id)) {
      id = `${id}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
    }
    seen.add(id);
    sanitized.push({ ...s, id });
  });
  return sanitized;
};

const INITIAL_USER: UserProfile = {
  username: 'bangla_typist',
  displayName: 'বাংলা টাইপিস্ট',
  preferredKeyboard: 'bijoy',
  level: 1,
  totalXp: 150,
  streakDays: 1,
  lastPracticeDate: new Date().toISOString().split('T')[0],
  streakFreezes: 2,
  completedLessons: ['lesson-0-1-1'],
  lessonStars: { 'lesson-0-1-1': 3 },
  unlockedAchievements: ['first-step'],
  soundEnabled: true,
  soundTheme: 'cherry-blue',
  language: 'bn',
  weakKeys: {
    'ক্ষ': { errors: 4, totalAttempts: 12 },
    'জ্ঞ': { errors: 3, totalAttempts: 8 },
    'র-ফলা': { errors: 2, totalAttempts: 10 }
  },
  juktakkhorMastery: {
    'ক্ত': 5,
    'ন্ত': 4,
    'ন্দ': 4,
    'ক্ষ': 3,
    'জ্ঞ': 2,
    'ক্র': 5,
    'প্র': 4,
    'ব্য': 3
  },
  earnedCertificates: {
    bronze: {
      earnedDate: '2026-08-25',
      wpm: 22,
      accuracy: 94,
      certificateNumber: 'KL-BRZ-8941'
    }
  } as any,
  recentSessions: [
    {
      id: 'init-1',
      timestamp: Date.now() - 3600000 * 2,
      mode: 'lesson',
      title: 'কীবোর্ডে হাতের বসার সঠিক নিয়ম',
      keyboardLayout: 'bijoy',
      netWpm: 18,
      accuracy: 96,
      durationSeconds: 45,
      xpEarned: 100
    }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_USER,
            ...parsed,
            recentSessions: sanitizeSessions(parsed.recentSessions || INITIAL_USER.recentSessions)
          };
        }
      }
    } catch {
      // Ignore
    }
    return INITIAL_USER;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('lesson-1-1');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }
  }, [user]);

  // Sync sound settings to audio synth
  useEffect(() => {
    soundFx.setEnabled(user.soundEnabled);
    soundFx.setTheme(user.soundTheme);
  }, [user.soundEnabled, user.soundTheme]);

  const setKeyboardLayout = (layout: KeyboardLayoutId) => {
    setUser((prev) => ({ ...prev, preferredKeyboard: layout }));
  };

  const startLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('lesson-player');
  };

  const calculateLevel = (xp: number): number => {
    if (xp < 500) return 1;
    if (xp < 1500) return 2;
    if (xp < 3500) return 3;
    if (xp < 7000) return 4;
    if (xp < 12000) return 5;
    if (xp < 20000) return 6;
    if (xp < 32000) return 7;
    if (xp < 50000) return 8;
    if (xp < 75000) return 9;
    return 10;
  };

  const addXp = (amount: number) => {
    const oldLevel = user.level;
    const newTotal = user.totalXp + amount;
    const newLevel = calculateLevel(newTotal);
    const leveledUp = newLevel > oldLevel;

    if (leveledUp) {
      soundFx.playSuccessFanfare();
    }

    setUser((prev) => ({
      ...prev,
      totalXp: newTotal,
      level: newLevel
    }));

    return { newLevel, leveledUp };
  };

  const recordSession = (record: Omit<PracticeSessionRecord, 'id' | 'timestamp'>) => {
    const uniqueSuffix = Math.random().toString(36).slice(2, 9);
    const newRecord: PracticeSessionRecord = {
      ...record,
      id: `session-${Date.now()}-${uniqueSuffix}`,
      timestamp: Date.now()
    };

    // Update streak logic
    const today = new Date().toISOString().split('T')[0];
    let newStreak = user.streakDays;
    if (user.lastPracticeDate !== today) {
      newStreak += 1;
    }

    // Check achievement milestones
    const newUnlocked = [...user.unlockedAchievements];
    if (record.netWpm >= 20 && !newUnlocked.includes('speed-20')) newUnlocked.push('speed-20');
    if (record.netWpm >= 35 && !newUnlocked.includes('speed-35')) newUnlocked.push('speed-35');
    if (record.netWpm >= 50 && !newUnlocked.includes('speed-50')) newUnlocked.push('speed-50');
    if (record.accuracy >= 100 && !newUnlocked.includes('accuracy-sniper')) newUnlocked.push('accuracy-sniper');
    if (newStreak >= 3 && !newUnlocked.includes('streak-3')) newUnlocked.push('streak-3');
    if (newStreak >= 7 && !newUnlocked.includes('streak-7')) newUnlocked.push('streak-7');

    setUser((prev) => {
      const updatedCompleted = record.mode === 'lesson' && selectedLessonId && !prev.completedLessons.includes(selectedLessonId)
        ? [...prev.completedLessons, selectedLessonId]
        : prev.completedLessons;

      const stars = record.accuracy >= 98 ? 3 : record.accuracy >= 92 ? 2 : 1;
      const updatedStars = selectedLessonId ? { ...prev.lessonStars, [selectedLessonId]: Math.max(prev.lessonStars[selectedLessonId] || 0, stars) } : prev.lessonStars;

      const rawSessions = [newRecord, ...(prev.recentSessions || [])].slice(0, 20);

      return {
        ...prev,
        streakDays: newStreak,
        lastPracticeDate: today,
        unlockedAchievements: newUnlocked,
        completedLessons: updatedCompleted,
        lessonStars: updatedStars,
        recentSessions: sanitizeSessions(rawSessions)
      };
    });

    addXp(record.xpEarned);
  };

  const recordWeakKey = (key: string, isError: boolean) => {
    if (!key || key === ' ') return;
    setUser((prev) => {
      const existing = prev.weakKeys[key] || { errors: 0, totalAttempts: 0 };
      return {
        ...prev,
        weakKeys: {
          ...prev.weakKeys,
          [key]: {
            errors: existing.errors + (isError ? 1 : 0),
            totalAttempts: existing.totalAttempts + 1
          }
        }
      };
    });
  };

  const updateJuktakkhorMastery = (glyph: string, score: JuktakkhorMasteryScore) => {
    setUser((prev) => ({
      ...prev,
      juktakkhorMastery: {
        ...(prev.juktakkhorMastery || {}),
        [glyph]: score
      }
    }));
  };

  const claimCertificate = (tier: CertificationTier, wpm: number, accuracy: number) => {
    const certNumber = `KL-${tier.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    setUser((prev) => ({
      ...prev,
      earnedCertificates: {
        ...(prev.earnedCertificates || {}),
        [tier]: {
          earnedDate: today,
          wpm,
          accuracy,
          certificateNumber: certNumber
        }
      }
    }));

    soundFx.playSuccessFanfare();
  };

  const toggleSound = () => {
    setUser((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const setSoundTheme = (theme: 'cherry-blue' | 'creamy' | 'typewriter' | 'silent') => {
    setUser((prev) => ({ ...prev, soundTheme: theme }));
  };

  const toggleLanguage = () => {
    setUser((prev) => ({ ...prev, language: prev.language === 'bn' ? 'en' : 'bn' }));
  };

  const resetProgress = () => {
    setUser(INITIAL_USER);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        selectedLessonId,
        startLesson,
        setKeyboardLayout,
        addXp,
        recordSession,
        toggleSound,
        setSoundTheme,
        toggleLanguage,
        recordWeakKey,
        updateJuktakkhorMastery,
        claimCertificate,
        showOnboarding,
        setShowOnboarding,
        resetProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
