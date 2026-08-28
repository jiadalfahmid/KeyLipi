import { Achievement } from '../types';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first-step',
    title: 'প্রথম পদক্ষেপ',
    titleEn: 'First Key Press',
    description: 'প্রথম লেসন সম্পূর্ণ করে বাংলা টাইপিং যাত্রা শুরু করেছো।',
    icon: 'Sparkles',
    category: 'lessons',
    xpBonus: 100
  },
  {
    id: 'home-row-hero',
    title: 'হোম রো বীর',
    titleEn: 'Home Row Hero',
    description: 'হোম রো-র সমস্ত মৌলিক বর্ণ ৯৫% নির্ভুলতায় আয়ত্ত করেছো।',
    icon: 'Keyboard',
    category: 'lessons',
    xpBonus: 200
  },
  {
    id: 'accuracy-sniper',
    title: 'নিখুঁত কারিগর',
    titleEn: 'Accuracy Sniper',
    description: 'যেকোনো লেসনে ১০০% নিখুঁত (Zero Mistake) স্কোর অর্জন করেছো।',
    icon: 'Target',
    category: 'accuracy',
    xpBonus: 250
  },
  {
    id: 'speed-20',
    title: '২০ WPM মাইলফলক',
    titleEn: '20 WPM Milestone',
    description: 'স্পিড টেস্টে ২০ ডব্লিউপিএম গতি অতিক্রম করেছো (মডিউল ১ সম্পন্ন সাপেক্ষে)।',
    icon: 'Zap',
    category: 'speed',
    xpBonus: 300,
    requiresModuleId: 'module-1'
  },
  {
    id: 'speed-35',
    title: '৩৫ WPM প্রো টাইপিস্ট',
    titleEn: '35 WPM Pro Typist',
    description: '৩৫ ডব্লিউপিএম গতিতে প্রাতিষ্ঠানিক টাইপিং মান অর্জন (মডিউল ১ সম্পন্ন সাপেক্ষে)।',
    icon: 'Flame',
    category: 'speed',
    xpBonus: 500,
    requiresModuleId: 'module-1'
  },
  {
    id: 'speed-50',
    title: '৫০+ WPM স্পিড ডিমেনশন',
    titleEn: '50+ WPM Grandmaster',
    description: '৫০ ডব্লিউপিএম গতিতে এলিট টাইপিস্টের মর্যাদা লাভ (মডিউল ১ সম্পন্ন সাপেক্ষে)।',
    icon: 'Crown',
    category: 'speed',
    xpBonus: 1000,
    requiresModuleId: 'module-1'
  },
  {
    id: 'juktakkhor-crusher',
    title: 'যুক্তাক্ষর ক্রাশার',
    titleEn: 'Juktakkhor Crusher',
    description: 'ক্ষ, জ্ঞ, ষ্ণ সহ ১০টি জটিল যুক্তবর্ণ সফলভাবে টাইপ করেছো।',
    icon: 'ShieldCheck',
    category: 'special',
    xpBonus: 400
  },
  {
    id: 'streak-3',
    title: '৩ দিনের অগ্নিশিখা',
    titleEn: '3-Day Fire Streak',
    description: 'টানা ৩ দিন নিয়মিত বাংলা টাইপিং অনুশীলন করেছো।',
    icon: 'Flame',
    category: 'streak',
    xpBonus: 200
  },
  {
    id: 'streak-7',
    title: '৭ দিনের সাধনা',
    titleEn: '7-Day Weekly Streak',
    description: 'টানা ১ সপ্তাহ দৈনিক টাইপিং লক্ষ্য পূরণ করেছো।',
    icon: 'Calendar',
    category: 'streak',
    xpBonus: 500
  },
  {
    id: 'game-champion',
    title: 'গেম মাস্টার',
    titleEn: 'Arcade Champion',
    description: 'যেকোনো মিনি-গেমে ১০০০ এর বেশি স্কোর অর্জন করেছো।',
    icon: 'Gamepad2',
    category: 'special',
    xpBonus: 350
  },
  {
    id: 'wordsmith-1000',
    title: 'সহস্র শব্দ পূরণ',
    titleEn: '1000 Characters Master',
    description: 'প্ল্যাটফর্মে সর্বমোট ১,০০০ এর বেশি বাংলা বর্ণ সফলভাবে টাইপ করেছো।',
    icon: 'BookOpen',
    category: 'special',
    xpBonus: 450
  },
  {
    id: 'boss-slayer',
    title: 'যুক্তাক্ষর বস বিজয়ী',
    titleEn: 'Boss Slayer',
    description: 'যুক্তাক্ষর বস ফাইট গেমে বসকে সম্পূর্ণ পরাজিত করেছো।',
    icon: 'Trophy',
    category: 'special',
    xpBonus: 600
  }
];
