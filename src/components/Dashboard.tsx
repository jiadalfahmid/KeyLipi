import React, { useState } from 'react';
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
  Download,
  LogIn,
  LogOut,
  Edit2,
  Check,
  CloudCheck,
  UserCheck,
  User,
  Image,
  AtSign,
  Lock,
  RefreshCw,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS_LIST } from '../data/achievements';
import { CERTIFICATION_LEVELS } from '../data/certifications';
import { JUKTAKKHOR_DATABASE } from '../data/juktakkhorData';
import { checkUsernameAvailability } from '../lib/firebase';
import { AuthModal } from './AuthModal';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
];

export const Dashboard: React.FC = () => {
  const { user, authUser, loginGoogle, logout, updateUserProfile, startLesson, setActiveTab, isModule1Done } = useApp();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(user.displayName);
  const [usernameInput, setUsernameInput] = useState(user.username || '');
  const [photoUrlInput, setPhotoUrlInput] = useState(user.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Open Edit Modal / Form
  const handleOpenEdit = () => {
    setDisplayNameInput(user.displayName);
    setUsernameInput(user.username || '');
    setPhotoUrlInput(user.photoURL || '');
    setProfileError(null);
    setProfileSuccess(false);
    setIsEditingProfile(true);
  };

  // Save Profile Changes
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setIsSaving(true);

    try {
      const result = await updateUserProfile({
        displayName: displayNameInput.trim(),
        username: usernameInput.trim().toLowerCase(),
        photoURL: photoUrlInput.trim()
      });

      if (result.success) {
        setProfileSuccess(true);
        setTimeout(() => {
          setIsEditingProfile(false);
          setProfileSuccess(false);
        }, 1200);
      } else {
        setProfileError(result.error || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      setProfileError(err?.message || 'সার্ভারে সংযোগে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

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
      {/* Sign-in prompt banner if in guest mode */}
      {!authUser && (
        <div className="bg-[#FAF7F0] border-2 border-[#141210] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 border-2 border-[#141210] bg-[#EDE9DF] flex items-center justify-center text-[#8B0000] shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-tiro font-bold text-base text-[#141210]">
                গুগল অ্যাকাউন্ট দিয়ে লগইন করুন
              </h3>
              <p className="font-tiro text-xs text-[#141210]/75">
                আপনার টাইপিং গতি, স্ট্রিক, অর্জিত মেডেল এবং সনদপত্র আজীবনের জন্য ক্লাউডে সুরক্ষিত রাখুন।
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="px-5 py-2 bg-[#8B0000] text-[#F5F2EB] font-tiro font-bold text-xs hover:bg-[#141210] transition-colors cursor-pointer shadow-2xs flex items-center gap-2 shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন / নিবন্ধন</span>
          </button>
        </div>
      )}

      {/* Profile Dossier Header */}
      <div className="border-b-2 border-[#141210] pb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Newspaper className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000]">
              TYPIST DOSSIER &bull; টাইপিস্ট বৃত্তান্ত ও প্রোফাইল
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-tiro font-bold text-[#141210] tracking-tight">
            টাইপিস্ট প্রোফাইল ও পারফরম্যান্স মেট্রিক্স
          </h1>
          <p className="text-sm font-tiro text-[#141210]/80 mt-1 max-w-2xl leading-relaxed">
            দৈনিক টাইপিং ধারাবাহিকতা, দুর্বল কি-অ্যানালাইসিস, অর্জিত সনদপত্র এবং বিস্তারিত সেশন লগ।
          </p>
        </div>

        {/* User Card with Direct Edit Button */}
        <div className="flex items-center gap-4 bg-[#FCFBF8] p-4 border-2 border-[#141210]/40 shadow-2xs font-mono text-xs">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-14 h-14 border-2 border-[#141210] object-cover rounded-xs"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-14 h-14 border-2 border-[#141210] bg-[#EDE9DF] flex items-center justify-center font-tiro text-2xl font-bold text-[#141210]">
              {user.displayName.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="text-base font-bold text-[#141210] font-tiro">{user.displayName}</div>
              <button
                onClick={handleOpenEdit}
                className="p-1 border border-[#141210]/20 bg-[#EDE9DF] hover:bg-[#141210] hover:text-[#F5F2EB] transition-colors cursor-pointer rounded-xs"
                title="প্রোফাইল সম্পাদন করুন (Edit Profile)"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-[#141210]/60 font-mono flex items-center gap-1">
              <span>@{user.username || 'bangla_typist'}</span>
              <span>&bull;</span>
              <span className="uppercase">{user.preferredKeyboard}</span>
            </div>

            <div className="text-[10px] text-[#8B0000] font-bold mt-0.5 flex items-center gap-2">
              <span>{user.totalXp} XP অর্জিত</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#8B0000] fill-[#8B0000]" />
                {user.streakDays} দিন স্ট্রিক
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141210]/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF7F0] border-3 border-[#141210] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-5">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 p-1 text-[#141210]/60 hover:text-[#141210] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#141210]/20 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B0000] font-bold block">
                EDIT PROFILE &bull; প্রোফাইল সম্পাদনা
              </span>
              <h2 className="text-2xl font-tiro font-bold text-[#141210] mt-1">
                টাইপিস্ট তথ্য আপডেট করুন
              </h2>
            </div>

            {profileError && (
              <div className="p-3 bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000] text-xs font-tiro flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#8B0000]" />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="p-3 bg-[#141210]/10 border border-[#141210]/30 text-[#141210] text-xs font-tiro flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#141210]" />
                <span>প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 font-tiro">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-[#141210] mb-1">
                  প্রদর্শন নাম (Display Name)
                </label>
                <div className="flex items-center gap-2 border-2 border-[#141210]/40 bg-white px-3 py-2">
                  <User className="w-4 h-4 text-[#141210]/50" />
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full text-sm font-bold text-[#141210] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Unique User ID */}
              <div>
                <label className="block text-xs font-bold text-[#141210] mb-1">
                  ইউজার আইডি (Unique User ID / Username)
                </label>
                <div className="flex items-center gap-2 border-2 border-[#141210]/40 bg-white px-3 py-2">
                  <AtSign className="w-4 h-4 text-[#141210]/50" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="e.g. sakib_typist"
                    className="w-full text-sm font-mono font-bold text-[#141210] outline-none"
                    required
                  />
                </div>
                <span className="text-[10px] font-tiro text-[#141210]/60 mt-1 block">
                  লিডারবোর্ড ও প্রোফাইলে এই আইডিটি ইউনিকভাবে প্রদর্শিত হবে (শুধুমাত্র ছোট হাতের ইংরেজি বর্ণ, সংখ্যা ও আন্ডারস্কোর)।
                </span>
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-xs font-bold text-[#141210] mb-1">
                  প্রোফাইল ছবির লিংক (Image URL)
                </label>
                <div className="flex items-center gap-2 border-2 border-[#141210]/40 bg-white px-3 py-2">
                  <Image className="w-4 h-4 text-[#141210]/50" />
                  <input
                    type="url"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full text-xs font-mono text-[#141210] outline-none"
                  />
                </div>
              </div>

              {/* Avatar Presets */}
              <div>
                <span className="text-[11px] font-bold text-[#141210] block mb-1.5">
                  অথবা ডিফল্ট অবতার নির্বাচন করুন:
                </span>
                <div className="flex items-center gap-2.5">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPhotoUrlInput(url)}
                      className={`w-10 h-10 rounded-full border-2 overflow-hidden cursor-pointer transition-transform ${
                        photoUrlInput === url
                          ? 'border-[#8B0000] scale-110 shadow-md ring-2 ring-[#8B0000]'
                          : 'border-[#141210]/30 hover:scale-105'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {photoUrlInput && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrlInput('')}
                      className="px-2 py-1 text-[10px] font-mono border border-[#141210]/30 bg-[#EDE9DF] hover:bg-[#8B0000]/10 text-[#8B0000] cursor-pointer"
                    >
                      ছবি মুছুন
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#141210]/20">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-[#141210]/30 text-xs font-bold text-[#141210] hover:bg-[#EDE9DF] cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-bold hover:bg-[#8B0000] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              অর্জিত জাতীয় টাইপিং সনদপত্র
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('speed-test')}
            className="px-4 py-2 bg-[#141210] text-[#F5F2EB] text-xs font-tiro font-bold hover:bg-[#8B0000] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#8B0000]" />
            <span>নতুন সনদ পরীক্ষা দিন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CERTIFICATION_LEVELS.map((cert) => {
            const isEarned = !!user.earnedCertificates?.[cert.tier];
            const certData = user.earnedCertificates?.[cert.tier];

            return (
              <div
                key={cert.tier}
                className={`p-5 border-2 transition-all flex flex-col justify-between gap-4 ${
                  isEarned
                    ? 'bg-[#FAF7F0] border-[#141210] shadow-sm'
                    : 'bg-[#EDE9DF]/40 border-[#141210]/20 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8B0000]">
                      {cert.tier.toUpperCase()}
                    </span>
                    {isEarned ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#141210] bg-[#141210]/10 px-1.5 py-0.5 border border-[#141210]/20">
                        <CheckCircle2 className="w-3 h-3" /> অর্জিত
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-[#141210]/50">
                        অনুপলব্ধ
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-tiro font-bold text-[#141210]">
                    {cert.titleBn}
                  </h3>
                  <p className="text-xs font-tiro text-[#141210]/75 mt-1">
                    {cert.minWpm} WPM &bull; {cert.minAccuracy}% নির্ভুলতা
                  </p>
                </div>

                {isEarned && certData ? (
                  <div className="pt-3 border-t border-[#141210]/20 font-mono text-[10px] text-[#141210]/70 flex flex-col gap-1">
                    <div>সনদ নম্বর: <span className="font-bold text-[#141210]">{certData.certificateNumber}</span></div>
                    <div>তারিখ: {certData.earnedDate}</div>
                    <div>গতি: {certData.wpm} WPM ({certData.accuracy}%)</div>
                  </div>
                ) : (
                  <div className="text-[11px] font-tiro text-[#141210]/50 italic">
                    স্পিড টেস্টে লক্ষ্য পূরণ করে এই সনদ অর্জন করুন।
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Keys & Daily Goals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weak Keys Analysis (7 cols) */}
        <div className="lg:col-span-7 bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#141210]/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#8B0000]" />
              <h2 className="text-xl font-tiro font-bold text-[#141210]">
                দুর্বল কি ও যুক্তবর্ণ অ্যানালাইসিস
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#8B0000] bg-[#8B0000]/10 px-2 py-0.5 border border-[#8B0000]/30">
              AI DETECTED
            </span>
          </div>

          {weakKeyEntries.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {weakKeyEntries.map(([key, stat]) => (
                <div
                  key={key}
                  className="p-3 bg-[#EDE9DF]/60 border border-[#141210]/20 flex flex-col gap-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-tiro font-bold text-[#141210]">{key}</span>
                    <span className="text-xs font-mono font-bold text-[#8B0000] bg-[#8B0000]/10 px-1.5 py-0.2 border border-[#8B0000]/30">
                      {stat.errors} ভুল
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
                স্মার্ট ড্রিল রিকমেন্ডেশন:
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

        {/* Daily Goals (5 cols) */}
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
                desc: 'যেকোনো মডিউল বা স্পিড টেস্টের মাধ্যমে',
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

      {/* Unlocked Achievements Showcase with Module 1 Guard */}
      <div className="bg-[#FCFBF8] border-2 border-[#141210]/30 p-6 sm:p-8 shadow-2xs flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141210]/20 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8B0000] block mb-1">
              TROPHIES &amp; BADGES &bull; পদক ও সম্মাননা
            </span>
            <h2 className="text-2xl font-tiro font-bold text-[#141210]">
              অর্জিত মেডেল ও অর্জনসমূহ ({user.unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length})
            </h2>
          </div>

          {!isModule1Done && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-tiro">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>গতি সংক্রান্ত (WPM) অর্জনগুলো মডিউল ১ সম্পন্ন হওয়ার পর উন্মুক্ত হবে।</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isSpeedAchievement = ach.category === 'speed' || ach.requiresModuleId === 'module-1';
            const isLockedByModule1 = isSpeedAchievement && !isModule1Done;
            const isUnlocked = user.unlockedAchievements.includes(ach.id) && !isLockedByModule1;

            return (
              <div
                key={ach.id}
                className={`p-4 border-2 transition-all flex flex-col justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-[#FAF7F0] border-[#141210]/40 shadow-2xs'
                    : isLockedByModule1
                    ? 'bg-[#EDE9DF]/25 border-[#141210]/10 opacity-40'
                    : 'bg-[#EDE9DF]/40 border-[#141210]/15 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 border-2 flex items-center justify-center ${
                      isUnlocked
                        ? 'border-[#141210] bg-[#EDE9DF] text-[#141210]'
                        : isLockedByModule1
                        ? 'border-[#141210]/20 bg-[#EDE9DF]/50 text-[#141210]/30'
                        : 'border-[#141210]/20 text-[#141210]/40'
                    }`}
                  >
                    {isLockedByModule1 ? <Lock className="w-4 h-4" /> : <Award className="w-5 h-5" />}
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
                    {isLockedByModule1
                      ? 'মডিউল ১ সম্পন্ন হলে গতি অর্জনটি আনলকযোগ্য হবে।'
                      : ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
