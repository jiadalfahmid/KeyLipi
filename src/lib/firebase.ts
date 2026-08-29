import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import configData from '../../firebase-applet-config.json';
import { UserProfile, PracticeSessionRecord, LeaderboardUser } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(configData) : getApp();

// Initialize Firestore & Auth
export const db = getFirestore(app, configData.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Validate Firestore connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase offline mode active.');
    }
    return false;
  }
}

/**
 * Ensure an authenticated session (anonymous or Google signed in)
 */
export const ensureAuth = async (): Promise<FirebaseUser | null> => {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  return new Promise((resolve) => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          try {
            const cred = await signInAnonymously(auth);
            resolve(cred.user);
          } catch (err) {
            console.warn('Anonymous sign-in unavailable or restricted:', err);
            resolve(null);
          }
        }
      });
    } catch (err) {
      console.warn('Auth state check failed:', err);
      resolve(null);
    }
  });
};

/**
 * Sign in with Google Popup
 */
export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    const errorCode = err?.code || '';
    const errorMsg = err?.message || '';

    // Gracefully handle user closing or dismissing popup
    if (
      errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorMsg.includes('popup-closed-by-user') ||
      errorMsg.includes('cancelled-popup-request')
    ) {
      console.info('গুগল লগইন পপআপ উইন্ডো বন্ধ করা হয়েছে।');
      return null;
    }

    if (errorCode === 'auth/popup-blocked' || errorMsg.includes('popup-blocked')) {
      throw new Error('ব্রাউজারে পপআপ ব্লক করা আছে। অনুগ্রহ করে পপআপ অনুমতি দিন এবং আবার চেষ্টা করুন।');
    }

    if (errorCode === 'auth/unauthorized-domain') {
      throw new Error('এই ডোমেনটি ফায়ারবেস অথেনটিকেশনে অনুমোদিত নয়। অনুগ্রহ করে Firebase Console > Authentication > Settings > Authorized domains এ গিয়ে ডোমেনটি যোগ করুন।');
    }

    console.warn('Google Sign-In Notice:', err);
    throw new Error(err?.message || 'গুগল সাইন-ইন সম্পন্ন করা যায়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।');
  }
};

/**
 * Sign in with Email and Password
 */
export const signInWithEmail = async (
  email: string,
  pass: string
): Promise<FirebaseUser | null> => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return cred.user;
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      throw new Error('ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। দয়া করে পুনরায় পরীক্ষা করুন।');
    }
    if (code === 'auth/invalid-email') {
      throw new Error('ইমেইল ঠিকানাটি সঠিক ফরম্যাটে নয়।');
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('অতিরিক্ত ভুল চেষ্টার কারণে একাউন্ট সাময়িকভাবে লক হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    }
    throw new Error(err?.message || 'ইমেইল লগইন ব্যর্থ হয়েছে।');
  }
};

/**
 * Sign up with Email and Password
 */
export const signUpWithEmail = async (
  email: string,
  pass: string,
  displayName: string
): Promise<FirebaseUser | null> => {
  try {
    const cleanEmail = email.trim();
    const cleanName = displayName.trim() || 'বাংলা টাইপিস্ট';
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: cleanName });
    }
    return cred.user;
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      throw new Error('এই ইমেইল দিয়ে ইতোমধ্যে একটি একাউন্ট তৈরি করা আছে। লগইন করুন।');
    }
    if (code === 'auth/weak-password') {
      throw new Error('পাসওয়ার্ডটি অত্যন্ত দুর্বল। কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।');
    }
    if (code === 'auth/invalid-email') {
      throw new Error('ইমেইল ঠিকানাটি সঠিক ফরম্যাটে নয়।');
    }
    throw new Error(err?.message || 'একাউন্ট তৈরি করা যায়নি।');
  }
};

/**
 * Send Password Reset Email
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/user-not-found') {
      throw new Error('এই ইমেইলে কোনো একাউন্ট খুঁজে পাওয়া যায়নি।');
    }
    if (code === 'auth/invalid-email') {
      throw new Error('ইমেইল ঠিকানাটি সঠিক ফরম্যাটে নয়।');
    }
    throw new Error(err?.message || 'পাসওয়ার্ড রিসেট লিংক পাঠানো যায়নি।');
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign out error:', err);
  }
};

/**
 * Update user display profile
 */
export const updateUserProfileData = async (
  displayName: string,
  photoURL?: string
): Promise<void> => {
  if (auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName, photoURL });
    } catch (err) {
      console.warn('Profile update error:', err);
    }
  }
};

/**
 * Validate and check if username is available
 */
export const checkUsernameAvailability = async (
  username: string,
  currentUid?: string
): Promise<{ available: boolean; error?: string }> => {
  const clean = username.trim().toLowerCase();
  if (clean.length < 3) {
    return { available: false, error: 'ইউজার আইডি কমপক্ষে ৩ অক্ষরের হতে হবে।' };
  }
  if (clean.length > 20) {
    return { available: false, error: 'ইউজার আইডি সর্বোচ্চ ২০ অক্ষরের হতে পারে।' };
  }
  if (!/^[a-z0-9_]+$/.test(clean)) {
    return { available: false, error: 'কেবল ছোট হাতের ইংরেজি বর্ণ, সংখ্যা এবং আন্ডারস্কোর (_) ব্যবহার করা যাবে।' };
  }
  if (/^[0-9_]/.test(clean)) {
    return { available: false, error: 'ইউজার আইডি কোনো সংখ্যা বা আন্ডারস্কোর দিয়ে শুরু হতে পারে না।' };
  }

  try {
    const userDocRef = doc(db, 'usernames', clean);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (currentUid && data.uid === currentUid) {
        return { available: true };
      }
      return { available: false, error: 'এই ইউজার আইডিটি ইতিমধ্যে অন্য কেউ ব্যবহার করছেন।' };
    }
    return { available: true };
  } catch (err) {
    console.warn('Username check notice:', err);
    return { available: true }; // Allow graceful fallback
  }
};

/**
 * Claim or update user username reservation in Firestore
 */
export const claimUsernameInFirestore = async (
  username: string,
  uid: string,
  displayName?: string
): Promise<boolean> => {
  const clean = username.trim().toLowerCase();
  try {
    const userDocRef = doc(db, 'usernames', clean);
    await setDoc(userDocRef, {
      uid,
      username: clean,
      displayName: displayName || '',
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.warn('Claim username notice:', err);
    return false;
  }
};

/**
 * Save user profile to Firestore
 */
export const syncUserProfileToFirestore = async (
  uid: string,
  userProfile: Partial<UserProfile>
) => {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    // Sanitize data before sending
    const sanitizedData = {
      uid,
      username: userProfile.username || 'bangla_typist',
      displayName: userProfile.displayName || 'বাংলা টাইপিস্ট',
      email: userProfile.email || auth.currentUser?.email || '',
      photoURL: userProfile.photoURL || auth.currentUser?.photoURL || '',
      preferredKeyboard: userProfile.preferredKeyboard || 'avro',
      level: userProfile.level || 1,
      totalXp: userProfile.totalXp || 0,
      streakDays: userProfile.streakDays || 0,
      lastPracticeDate: userProfile.lastPracticeDate || new Date().toISOString().split('T')[0],
      streakFreezes: userProfile.streakFreezes || 2,
      completedLessons: userProfile.completedLessons || [],
      lessonStars: userProfile.lessonStars || {},
      unlockedAchievements: userProfile.unlockedAchievements || [],
      soundEnabled: userProfile.soundEnabled ?? true,
      soundTheme: userProfile.soundTheme || 'cherry-blue',
      language: userProfile.language || 'bn',
      weakKeys: userProfile.weakKeys || {},
      juktakkhorMastery: userProfile.juktakkhorMastery || {},
      earnedCertificates: userProfile.earnedCertificates || {},
      recentSessions: (userProfile.recentSessions || []).slice(0, 30),
      updatedAt: serverTimestamp()
    };

    await setDoc(userRef, sanitizedData, { merge: true });

    if (userProfile.username) {
      await claimUsernameInFirestore(userProfile.username, uid, userProfile.displayName);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
};

/**
 * Fetch user profile from Firestore
 */
export const fetchUserProfileFromFirestore = async (
  uid: string
): Promise<UserProfile | null> => {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
  return null;
};

/**
 * Subscribe to real-time user profile updates from Firestore
 */
export const subscribeToUserProfile = (
  uid: string,
  onData: (profile: UserProfile | null) => void
): Unsubscribe => {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          onData(snap.data() as UserProfile);
        } else {
          onData(null);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, path);
        onData(null);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return () => {};
  }
};

/**
 * Publish typing speed session or test score to global team leaderboard in Firestore
 */
export const publishSessionToFirestore = async (
  session: PracticeSessionRecord,
  user: UserProfile
) => {
  const currentUser = auth.currentUser;
  const uid = currentUser?.uid || user.uid || 'anon-user';
  const sessionPath = `sessions/${session.id}`;

  try {
    const sessionDocRef = doc(db, 'sessions', session.id);
    await setDoc(sessionDocRef, {
      ...session,
      uid,
      username: user.username || 'bangla_typist',
      displayName: user.displayName || 'বাংলা টাইপিস্ট',
      photoURL: user.photoURL || currentUser?.photoURL || '',
      createdAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, sessionPath);
  }

  // Update public leaderboard entry - WPM based primary ranking
  const leaderboardPath = `leaderboard/${uid}`;
  try {
    const leaderboardRef = doc(db, 'leaderboard', uid);
    const existingSnap = await getDoc(leaderboardRef);
    let topWpm = session.netWpm;
    let accuracy = session.accuracy;
    let durationSeconds = session.durationSeconds;
    let bestLayout = session.keyboardLayout;

    if (existingSnap.exists()) {
      const existing = existingSnap.data();
      const previousTop = existing.topWpm || 0;
      if (session.netWpm > previousTop) {
        topWpm = session.netWpm;
        accuracy = session.accuracy;
        durationSeconds = session.durationSeconds;
        bestLayout = session.keyboardLayout;
      } else {
        topWpm = previousTop;
        accuracy = existing.accuracy || session.accuracy;
        durationSeconds = existing.durationSeconds || session.durationSeconds;
        bestLayout = existing.layout || session.keyboardLayout;
      }
    }

    let badge = 'শিক্ষার্থী টাইপিস্ট';
    if (topWpm >= 50) badge = 'গ্র্যান্ডমাস্টার টাইপিস্ট';
    else if (topWpm >= 40) badge = 'মাস্টার টাইপিস্ট';
    else if (topWpm >= 30) badge = 'দক্ষ টাইপিস্ট';
    else if (topWpm >= 20) badge = 'অগ্রগামী টাইপিস্ট';

    await setDoc(
      leaderboardRef,
      {
        uid,
        username: user.username || 'bangla_typist',
        displayName: user.displayName || currentUser?.displayName || 'বাংলা টাইপিস্ট',
        photoURL: user.photoURL || currentUser?.photoURL || '',
        level: user.level,
        totalXp: user.totalXp,
        topWpm,
        accuracy,
        durationSeconds,
        layout: bestLayout,
        streak: user.streakDays || 1,
        badge,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, leaderboardPath);
  }
};

/**
 * Fetch real-time live community leaderboard from Firestore (ordered by topWpm desc)
 */
export const subscribeToLeaderboard = (
  onData: (entries: LeaderboardUser[]) => void
): Unsubscribe => {
  const path = 'leaderboard';
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('topWpm', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snap) => {
        const list: LeaderboardUser[] = snap.docs.map((docSnap, idx) => {
          const d = docSnap.data();
          const name = d.displayName || 'বাংলা টাইপিস্ট';
          const username = d.username || name.toLowerCase().replace(/[\s@.]+/g, '_');
          return {
            id: docSnap.id,
            uid: d.uid || docSnap.id,
            rank: idx + 1,
            username,
            displayName: name,
            photoURL: d.photoURL || '',
            avatarLetter: name.charAt(0).toUpperCase() || 'ব',
            topWpm: d.topWpm || 0,
            accuracy: d.accuracy || 100,
            durationSeconds: d.durationSeconds || 60,
            totalXp: d.totalXp || 0,
            keyboard: d.layout || 'avro',
            streak: d.streak || 1,
            badge: d.badge || 'টাইপিস্ট'
          };
        });
        onData(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        onData([]);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
};
