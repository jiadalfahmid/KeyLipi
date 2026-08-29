import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  UserPlus,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginGoogle, loginWithEmail, signUpWithEmailPassword, sendPasswordResetEmailLink } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password) {
          setError('ইমেইল ও পাসওয়ার্ড উভয়টি পূরণ করুন।');
          setLoading(false);
          return;
        }
        const res = await loginWithEmail(email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'লগইন ব্যর্থ হয়েছে।');
        }
      } else if (mode === 'signup') {
        if (!email.trim() || !password || !name.trim()) {
          setError('সকল তথ্য (নাম, ইমেইল এবং পাসওয়ার্ড) পূরণ করুন।');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmailPassword(email, password, name);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'একাউন্ট তৈরি করা যায়নি।');
        }
      } else if (mode === 'reset') {
        if (!email.trim()) {
          setError('অনুগ্রহ করে আপনার ইমেইল ঠিকানা দিন।');
          setLoading(false);
          return;
        }
        const res = await sendPasswordResetEmailLink(email);
        if (res.success) {
          setSuccessMsg('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।');
        } else {
          setError(res.error || 'পাসওয়ার্ড রিসেট লিংক পাঠানো যায়নি।');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'একটি ত্রুটি ঘটেছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginGoogle();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'গুগল সাইন-ইন ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141210]/65 backdrop-blur-xs p-4 animate-fadeIn select-none">
      <div className="bg-[#FAF7F0] border-3 border-[#141210] max-w-md w-full p-6 shadow-2xl relative flex flex-col gap-4 text-[#141210]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#141210]/60 hover:text-[#141210] hover:bg-[#EDE9DF] rounded-xs cursor-pointer transition-colors"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-[#141210]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B0000] font-bold">
              KEYLIPI TYPIST ACCOUNT &bull; নিরাপদ ক্লাউড ব্যাকআপ
            </span>
          </div>
          <h2 className="text-2xl font-tiro font-bold text-[#141210] mt-1">
            {mode === 'login' && 'অ্যাকাউন্টে প্রবেশ করুন'}
            {mode === 'signup' && 'নতুন টাইপিস্ট অ্যাকাউন্ট খুলুন'}
            {mode === 'reset' && 'পাসওয়ার্ড পুনরুদ্ধার'}
          </h2>
          <p className="text-xs font-tiro text-[#141210]/70 mt-0.5">
            {mode === 'login' && 'আপনার ক্লাউড প্রগ্রেস, স্কোর ও সনদপত্র নিরাপদে পেতে লগইন করুন।'}
            {mode === 'signup' && 'কীলিপি একাডেমিতে আপনার প্রগ্রেস সংরক্ষণ করতে নিবন্ধন করুন।'}
            {mode === 'reset' && 'আপনার নিবন্ধিত ইমেইলে রিসেট লিংক পাঠানো হবে।'}
          </p>
        </div>

        {/* Google Quick Sign-In */}
        {mode !== 'reset' && (
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#FCFBF8] border-2 border-[#141210] py-2.5 px-4 font-tiro font-bold text-sm text-[#141210] hover:bg-[#EDE9DF] transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.7 0 3 .7 3.9 1.5l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.9C3.7 20.6 7.5 24 12 24z"
                />
              </svg>
              <span>গুগল অ্যাকাউন্ট দিয়ে এক ক্লিকে লগইন</span>
            </button>

            <div className="relative my-3 flex items-center justify-center">
              <div className="border-t border-[#141210]/20 w-full"></div>
              <span className="bg-[#FAF7F0] px-3 text-[11px] font-mono text-[#141210]/60 font-bold uppercase tracking-wider">
                অথবা ইমেইল
              </span>
            </div>
          </div>
        )}

        {/* Error / Success Feedback */}
        {error && (
          <div className="bg-[#8B0000]/10 border border-[#8B0000]/30 p-2.5 text-xs font-tiro text-[#8B0000] flex items-start gap-2 rounded-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-600/30 p-2.5 text-xs font-tiro text-emerald-800 flex items-start gap-2 rounded-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-tiro font-bold text-[#141210] mb-1">
                আপনার নাম (Display Name)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#141210]/50 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="যেমন: সিয়াম আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FCFBF8] border border-[#141210]/30 focus:border-[#8B0000] text-xs font-tiro py-2 pl-9 pr-3 outline-none rounded-xs"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-tiro font-bold text-[#141210] mb-1">
              ইমেইল ঠিকানা (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#141210]/50 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FCFBF8] border border-[#141210]/30 focus:border-[#8B0000] text-xs font-mono py-2 pl-9 pr-3 outline-none rounded-xs"
                required
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-tiro font-bold text-[#141210]">
                  পাসওয়ার্ড (Password)
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-tiro text-[#8B0000] hover:underline cursor-pointer font-bold"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#141210]/50 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FCFBF8] border border-[#141210]/30 focus:border-[#8B0000] text-xs font-mono py-2 pl-9 pr-3 outline-none rounded-xs"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B0000] text-[#F5F2EB] border-2 border-[#141210] py-2.5 px-4 font-tiro font-bold text-sm hover:bg-[#141210] transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span className="animate-pulse">প্রক্রিয়াধীন...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </>
            ) : mode === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>অ্যাকাউন্ট তৈরি করুন</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>রিসেট লিংক পাঠান</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="border-t border-[#141210]/20 pt-3 text-center text-xs font-tiro">
          {mode === 'login' ? (
            <p>
              কোনো অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-[#8B0000] font-bold hover:underline cursor-pointer"
              >
                নতুন অ্যাকাউন্ট খুলুন
              </button>
            </p>
          ) : (
            <p>
              ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-[#8B0000] font-bold hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
