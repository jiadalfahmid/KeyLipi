export type KeyboardLayoutId = 'avro' | 'bijoy' | 'jatiya';

export type FingerAssignment =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb';

export type Hand = 'left' | 'right';

export interface KeyMapEntry {
  code: string;           // e.g. "KeyJ"
  key: string;            // 'j'
  label: string;          // Primary Bangla glyph e.g. "ক"
  shiftLabel?: string;    // Shifted Bangla glyph e.g. "খ"
  altLabel?: string;      // AltGr / Option glyph
  finger: FingerAssignment;
  hand: Hand;
  row: 'number' | 'top' | 'home' | 'bottom' | 'space';
}

export interface KeyboardLayoutDefinition {
  id: KeyboardLayoutId;
  name: string;
  nativeName: string;
  description: string;
  tagline: string;
  keymap: Record<string, KeyMapEntry>;
}

export interface GraphemeKeystroke {
  key: string;
  code: string;
  shift: boolean;
  finger: FingerAssignment;
  hand: Hand;
  note?: string;
}

export interface LessonObjective {
  title: string;
  description: string;
}

export type LessonStepType =
  | 'learn'
  | 'demonstrate'
  | 'guided-practice'
  | 'drill'
  | 'speed-challenge'
  | 'accuracy-challenge'
  | 'mini-game'
  | 'review'
  | 'mastery-test';

export interface Lesson {
  id: string;
  moduleId: string;
  unitId?: string;
  levelNumber: number;
  title: string;
  titleEn: string;
  summary: string;
  targetKeys: string[];
  explanation: {
    bangla: string;
    english: string;
    tips: string[];
  };
  drillText: string;
  practiceSentences: string[];
  challengeText: string;
  minAccuracy: number;
  minWpm: number;
  xpReward: number;
  keyboardOverrides?: Partial<
    Record<
      KeyboardLayoutId,
      {
        explanationBn?: string;
        tips?: string[];
        drillText?: string;
        formula?: string;
      }
    >
  >;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: string; // e.g. "0.1", "1.2", "8.3"
  title: string;
  titleEn: string;
  description: string;
  lessons: Lesson[];
}

export interface CurriculumModule {
  id: string;
  levelNumber: number;
  title: string;
  titleEn: string;
  badgeName: string;
  quoteBn: string;
  description: string;
  skills: string[];
  xpReward: number;
  units?: CurriculumUnit[];
  lessons: Lesson[]; // Flat list of all lessons for compatibility
}

export type JuktakkhorGroupType =
  | 'group-a'
  | 'group-b'
  | 'group-c'
  | 'group-d'
  | 'group-e'
  | 'group-f'
  | 'group-a-simple'
  | 'group-b-fola'
  | 'group-c-jafola'
  | 'group-d-complex'
  | 'group-e-special'
  | 'group-f-multi';

export type JuktakkhorMasteryScore = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface JuktakkhorItem {
  id: string;
  glyph: string;
  breakdown: string[]; // e.g. ["ক", "্", "ষ"]
  breakdownText: string; // "ক + ্ + ষ"
  pronunciation: string; // "kkh"
  category: 'common' | 'intermediate' | 'rare' | 'tri-consonant';
  group: JuktakkhorGroupType;
  bijoyKeystrokes: string; // "j + g + N"
  avroKeystrokes: string; // "kkh"
  jatiyaKeystrokes?: string;
  sampleWords: string[];
  sampleSentences?: string[];
  sampleSentence?: string;
  fingerGuidance?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  explanationBn?: string;
  explanation?: string;
}

export type CertificationTier = 'bronze' | 'silver' | 'gold' | 'grandmaster';

export interface CertificationLevel {
  tier: CertificationTier;
  titleBn: string;
  titleEn: string;
  badge: string;
  badgeIcon?: string;
  descriptionBn: string;
  minWpm: number;
  minAccuracy: number;
  minCompletedModules: number;
  durationSeconds: number;
  samplePassage: string;
}

export interface TypingStats {
  rawWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorCount: number;
  combo: number;
  maxCombo: number;
  elapsedSeconds: number;
}

export interface UserProfile {
  username: string;
  displayName: string;
  preferredKeyboard: KeyboardLayoutId;
  level: number;
  totalXp: number;
  streakDays: number;
  lastPracticeDate: string;
  streakFreezes: number;
  completedLessons: string[]; // lesson ids
  lessonStars: Record<string, number>; // lessonId -> 1..3
  unlockedAchievements: string[]; // achievement ids
  soundEnabled: boolean;
  soundTheme: 'cherry-blue' | 'creamy' | 'typewriter' | 'silent';
  language: 'bn' | 'en';
  weakKeys: Record<string, { errors: number; totalAttempts: number }>;
  juktakkhorMastery: Record<string, JuktakkhorMasteryScore>; // glyph -> 0..6
  earnedCertificates: Record<
    CertificationTier,
    {
      earnedDate: string;
      wpm: number;
      accuracy: number;
      certificateNumber: string;
    }
  >;
  recentSessions: PracticeSessionRecord[];
}

export interface PracticeSessionRecord {
  id: string;
  timestamp: number;
  mode: 'lesson' | 'speed-test' | 'game' | 'juktakkhor-lab' | 'custom';
  title: string;
  keyboardLayout: KeyboardLayoutId;
  netWpm: number;
  accuracy: number;
  durationSeconds: number;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'lessons' | 'special';
  xpBonus: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  xpReward: number;
  completed: boolean;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  displayName: string;
  avatarLetter: string;
  topWpm: number;
  accuracy: number;
  totalXp: number;
  keyboard: KeyboardLayoutId;
  streak: number;
  badge: string;
}
