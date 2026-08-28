import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { ACHIEVEMENTS_LIST } from '../data/achievements';
import { isModuleCompleted } from '../data/curriculum';
import { soundFx } from '../lib/audio';
import {
  CertificationTier,
  JuktakkhorMasteryScore,
  KeyboardLayoutId,
  PracticeSessionRecord,
  UserProfile
} from '../types';
import {
  auth,
  ensureAuth,
  signInWithGoogle,
  signOutUser,
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
  publishSessionToFirestore,
  updateUserProfileData,
  checkUsernameAvailability,
  testConnection
} from '../lib/firebase';

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
  authUser: FirebaseUser | null;
  isAuthLoading: boolean;
  isSyncing: boolean;
  authError: string | null;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  updateUserProfile: (data: {
    displayName?: string;
    username?: string;
    photoURL?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  setAuthError: (msg: string | null) => void;
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
  isModule1Done: boolean;
  isFocusMode: boolean;
  setIsFocusMode: (focus: boolean | ((prev: boolean) => boolean)) => void;
  toggleFocusMode: () => void;
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
  preferredKeyboard: 'avro',
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
      keyboardLayout: 'avro',
      netWpm: 18,
      accuracy: 96,
      durationSeconds: 45,
      xpEarned: 100
    }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
  const [isFocusMode, setIsFocusMode] = useState<boolean>(true);

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
  };

  const isModule1Done = isModuleCompleted('module-1', user.completedLessons || []);

  // Validate connection & subscribe to Firebase Auth state changes
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(true);
      if (fbUser) {
        setAuthUser(fbUser);
        try {
          const cloudProfile = await fetchUserProfileFromFirestore(fbUser.uid);
          if (cloudProfile) {
            setUser((prev) => ({
              ...prev,
              ...cloudProfile,
              uid: fbUser.uid,
              email: fbUser.email || cloudProfile.email,
              photoURL: fbUser.photoURL || cloudProfile.photoURL || prev.photoURL,
              username: cloudProfile.username || prev.username,
              displayName: cloudProfile.displayName || fbUser.displayName || prev.displayName,
              recentSessions: sanitizeSessions(cloudProfile.recentSessions || prev.recentSessions)
            }));
          } else {
            // First time login for this user - populate cloud from current state
            const initialCloud: UserProfile = {
              ...user,
              uid: fbUser.uid,
              email: fbUser.email || undefined,
              photoURL: fbUser.photoURL || user.photoURL || undefined,
              displayName: fbUser.displayName || user.displayName
            };
            setUser(initialCloud);
            await syncUserProfileToFirestore(fbUser.uid, initialCloud);
          }
        } catch (err) {
          console.warn('Profile load notice:', err);
        }
      } else {
        setAuthUser(null);
        // Ensure anonymous session for guest typing
        ensureAuth().catch(() => {});
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save to LocalStorage and Auto-Sync to Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }

    if (authUser?.uid) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        syncUserProfileToFirestore(authUser.uid, user)
          .catch(() => {})
          .finally(() => setIsSyncing(false));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [user, authUser?.uid]);

  // Sync sound settings to audio synth
  useEffect(() => {
    soundFx.setEnabled(user.soundEnabled);
    soundFx.setTheme(user.soundTheme);
  }, [user.soundEnabled, user.soundTheme]);

  const loginGoogle = async () => {
    setAuthError(null);
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
        setAuthUser(loggedInUser);
        soundFx.playSuccessFanfare();
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        return;
      }
      setAuthError(err?.message || 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setAuthUser(null);
      setUser(INITIAL_USER);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err: any) {
      console.warn('Sign out error:', err);
    }
  };

  const updateProfileName = async (name: string) => {
    if (!name.trim()) return;
    const cleanName = name.trim();
    setUser((prev) => ({ ...prev, displayName: cleanName }));
    if (authUser) {
      await updateUserProfileData(cleanName);
      await syncUserProfileToFirestore(authUser.uid, { ...user, displayName: cleanName });
    }
  };

  const updateUserProfile = async (data: {
    displayName?: string;
    username?: string;
    photoURL?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const updates: Partial<UserProfile> = {};

    if (data.displayName !== undefined) {
      const trimmed = data.displayName.trim();
      if (!trimmed) {
        return { success: false, error: 'নাম খালি রাখা যাবে না।' };
      }
      updates.displayName = trimmed;
    }

    if (data.username !== undefined) {
      const cleanUsername = data.username.trim().toLowerCase();
      if (cleanUsername !== user.username) {
        const check = await checkUsernameAvailability(cleanUsername, authUser?.uid || user.uid);
        if (!check.available) {
          return { success: false, error: check.error || 'এই ইউজার আইডিটি গ্রহণযোগ্য নয়।' };
        }
        updates.username = cleanUsername;
      }
    }

    if (data.photoURL !== undefined) {
      updates.photoURL = data.photoURL.trim();
    }

    const updatedUser: UserProfile = {
      ...user,
      ...updates
    };

    setUser(updatedUser);

    if (authUser?.uid) {
      try {
        if (updates.displayName) {
          await updateUserProfileData(updates.displayName, updates.photoURL);
        }
        await syncUserProfileToFirestore(authUser.uid, updatedUser);
      } catch (err) {
        console.warn('Update cloud profile notice:', err);
      }
    }

    return { success: true };
  };

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

    const updatedCompleted =
      record.mode === 'lesson' && selectedLessonId && !user.completedLessons.includes(selectedLessonId)
        ? [...user.completedLessons, selectedLessonId]
        : user.completedLessons;

    const module1Complete = isModuleCompleted('module-1', updatedCompleted);

    // Check achievement milestones
    const newUnlocked = [...user.unlockedAchievements];
    
    // WPM milestones: ONLY unlocked if Module 1 is completed!
    if (module1Complete) {
      if (record.netWpm >= 20 && !newUnlocked.includes('speed-20')) newUnlocked.push('speed-20');
      if (record.netWpm >= 35 && !newUnlocked.includes('speed-35')) newUnlocked.push('speed-35');
      if (record.netWpm >= 50 && !newUnlocked.includes('speed-50')) newUnlocked.push('speed-50');
    }

    if (record.accuracy >= 100 && !newUnlocked.includes('accuracy-sniper')) newUnlocked.push('accuracy-sniper');
    if (newStreak >= 3 && !newUnlocked.includes('streak-3')) newUnlocked.push('streak-3');
    if (newStreak >= 7 && !newUnlocked.includes('streak-7')) newUnlocked.push('streak-7');

    const stars = record.accuracy >= 98 ? 3 : record.accuracy >= 92 ? 2 : 1;
    const updatedStars = selectedLessonId
      ? { ...user.lessonStars, [selectedLessonId]: Math.max(user.lessonStars[selectedLessonId] || 0, stars) }
      : user.lessonStars;

    const rawSessions = [newRecord, ...(user.recentSessions || [])].slice(0, 30);

    const oldLevel = user.level;
    const newTotalXp = user.totalXp + record.xpEarned;
    const newLevel = calculateLevel(newTotalXp);
    const leveledUp = newLevel > oldLevel;
    if (leveledUp) {
      soundFx.playSuccessFanfare();
    }

    const updatedUser: UserProfile = {
      ...user,
      totalXp: newTotalXp,
      level: newLevel,
      streakDays: newStreak,
      lastPracticeDate: today,
      unlockedAchievements: newUnlocked,
      completedLessons: updatedCompleted,
      lessonStars: updatedStars,
      recentSessions: sanitizeSessions(rawSessions)
    };

    setUser(updatedUser);

    // Publish to cloud leaderboard & sessions collection
    publishSessionToFirestore(newRecord, updatedUser).catch(() => {});
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
    if (authUser) {
      syncUserProfileToFirestore(authUser.uid, INITIAL_USER);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authUser,
        isAuthLoading,
        isSyncing,
        authError,
        loginGoogle,
        logout,
        updateProfileName,
        updateUserProfile,
        setAuthError,
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
        resetProgress,
        isModule1Done,
        isFocusMode,
        setIsFocusMode,
        toggleFocusMode
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
