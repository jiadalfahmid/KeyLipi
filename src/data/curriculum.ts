import { CurriculumModule } from '../types';

export const CURRICULUM_MODULES: CurriculumModule[] = [
  // ================= MODULE 0 =================
  {
    id: 'module-0',
    levelNumber: 0,
    title: 'প্রথম পদক্ষেপ',
    titleEn: 'Module 0 — Physical & Mental Foundations',
    badgeName: 'প্রথম পদক্ষেপ',
    quoteBn: 'সঠিক হাতের অবস্থান এবং আঙুলের স্বাচ্ছন্দ্যই দ্রুত ও নির্ভুল টাইপিংয়ের ভিত্তি।',
    description: 'কীবোর্ড পরিচিতি, F ও J এর স্পর্শনির্ভর বাম্প, ১০ আঙুলের বন্টন এবং স্পেসবারের ছন্দময় টাইপিং।',
    skills: ['F & J বাম্প', 'A-S-D-F অবস্থান', 'J-K-L-; অবস্থান', 'বৃদ্ধাঙ্গুলির স্পেসবার ছন্দ'],
    xpReward: 300,
    units: [
      {
        id: 'unit-0-1',
        unitNumber: '0.1',
        title: 'কীবোর্ড পরিচিতি',
        titleEn: 'Keyboard Geography & Anchors',
        description: 'কীবোর্ড জোন, মডিফায়ার কী এবং F ও J কী-এর ট্যাকটাইল বাম্পের পরিচিতি।',
        lessons: [
          {
            id: 'lesson-0-1-1',
            moduleId: 'module-0',
            unitId: 'unit-0-1',
            levelNumber: 0,
            title: '০.১.১ — কীবোর্ডের পরিচয়',
            titleEn: '0.1.1 Keyboard Layout & Key Zones',
            summary: 'কীবোর্ডের প্রধান অংশগুলো: লেটার কী, মডিফায়ার কী (Shift, Ctrl, Alt), Space, Backspace এবং Enter।',
            targetKeys: ['f', 'j', ' ', 'd', 'k'],
            explanation: {
              bangla: 'কীবোর্ডের কেন্দ্রস্থল হলো বর্ণমালার অংশ (Alphabet Area)। চারপাশে রয়েছে ব্যাকস্পেস (ভুল মোছার জন্য), এন্টার (নতুন লাইনের জন্য), এবং নিচে লম্বা স্পেসবার। না তাকিয়ে টাইপ করার শুরুতেই প্রতিটি জোনের অবস্থান মনের মধ্যে চিত্রায়িত করুন।',
              english: 'Identify key zones: Alphabet cluster, spacebar at bottom, enter on the right, and modifier keys on the sides.',
              tips: ['কব্জি কিবোর্ডে ঠেকিয়ে রাখবেন না, হালকা ভাসিয়ে রাখুন', 'স্ক্রিনের দিকে তাকান, কী-বোর্ডের দিকে নয়']
            },
            drillText: 'f j f j f j f j d k d k d k d k',
            practiceSentences: ['f j d k f j d k', 'j f k d j f k d'],
            challengeText: 'f j d k f j d k f j d k j f k d j f k d',
            minAccuracy: 90,
            minWpm: 12,
            xpReward: 100
          },
          {
            id: 'lesson-0-1-2',
            moduleId: 'module-0',
            unitId: 'unit-0-1',
            levelNumber: 0,
            title: '০.১.২ — F এবং J বাম্প',
            titleEn: '0.1.2 Tactile Bumps on F & J',
            summary: 'চোখ বন্ধ করে স্পর্শের মাধ্যমে F ও J এর উঁচু দাগ (Bumps) খুঁজে আঙুল নোঙর করার কৌশল।',
            targetKeys: ['f', 'j'],
            explanation: {
              bangla: 'কীবোর্ডের F এবং J কীতে দুটি ছোট উঁচু দাগ (Bumps) রয়েছে। বাম হাতের তর্জনী থাকবে F-এ এবং ডান হাতের তর্জনী থাকবে J-এ। চোখ না নামিয়ে এই দুটি দাগ স্পর্শ করে হাত সঠিক স্থানে ফিরিয়ে আনুন।',
              english: 'Feel the tactile bumps on F and J with your left and right index fingers to anchor your home position.',
              tips: ['অন্য বোতাম চেপে প্রতিবার তর্জনী F ও J কীতে ফিরিয়ে আনুন']
            },
            drillText: 'f f j j f j f j f f j j j j f f',
            practiceSentences: ['f j f j f f j j', 'j f j f j j f f'],
            challengeText: 'f f j j f j f j f f j j j j f f f j f j',
            minAccuracy: 92,
            minWpm: 15,
            xpReward: 120
          }
        ]
      },
      {
        id: 'unit-0-2',
        unitNumber: '0.2',
        title: 'হাতের অবস্থান ও ১০ আঙুলের বণ্টন',
        titleEn: 'Hand Placement & 10-Finger Allocation',
        description: 'বাম হাত (A S D F), ডান হাত (J K L ;) এবং ১০ আঙুলের সুনির্দিষ্ট বোতাম ম্যাপিং।',
        lessons: [
          {
            id: 'lesson-0-2-1',
            moduleId: 'module-0',
            unitId: 'unit-0-2',
            levelNumber: 0,
            title: '০.২.১ — বাম ও ডান হাতের অবস্থান',
            titleEn: '0.2.1 Left & Right Home Hand Placement',
            summary: 'বাম হাত: A S D F এবং ডান হাত: J K L ; সারিবদ্ধভাবে স্থাপন করুন।',
            targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
            explanation: {
              bangla: 'বাম হাতের চার আঙুল বসবে A (কনিষ্ঠা), S (অনামিকা), D (মধ্যমা), F (তর্জনী)। ডান হাত বসবে J (তর্জনী), K (মধ্যমা), L (অনামিকা), ; (কনিষ্ঠা)। মাঝখানের G ও H খালি থাকবে।',
              english: 'Position left fingers on A S D F and right fingers on J K L ; keeping G and H centered in between.',
              tips: ['আঙুলগুলো বিড়ালের থাবার মতো বাঁকিয়ে আলতোভাবে রাখুন']
            },
            drillText: 'a s d f j k l ; a s d f j k l ;',
            practiceSentences: ['a s d f j k l ; f d s a ; l k j', 'a s d f j k l ; a s d f j k l ;'],
            challengeText: 'a s d f j k l ; f d s a ; l k j a s d f j k l ;',
            minAccuracy: 92,
            minWpm: 15,
            xpReward: 140
          }
        ]
      },
      {
        id: 'unit-0-3',
        unitNumber: '0.3',
        title: 'স্পেসবার ও রিদম',
        titleEn: 'Spacebar & Typing Rhythm',
        description: 'বৃদ্ধাঙ্গুলি দিয়ে শব্দের মাঝে সুষম স্পেস এবং গতিময় ছন্দের অনুশীলন।',
        lessons: [
          {
            id: 'lesson-0-3-1',
            moduleId: 'module-0',
            unitId: 'unit-0-3',
            levelNumber: 0,
            title: '০.৩.১ — বৃদ্ধাঙ্গুলির নিয়ন্ত্রণ ও স্পেসিং',
            titleEn: '0.3.1 Thumb Control & Space Cadence',
            summary: 'প্রতিটি টোকেন বা শব্দের পর ডান অথবা বাম হাতের বৃদ্ধাঙ্গুলি দিয়ে মৃদু স্পেস চাপুন।',
            targetKeys: [' ', 'f', 'j', 'd', 'k'],
            explanation: {
              bangla: 'কখনোই তর্জনী বা অন্য আঙুল দিয়ে স্পেস চাপবেন না। সব সময় ডান বা বাম বৃদ্ধাঙ্গুলি দিয়ে আলতো ছন্দে স্পেসবারে ট্যাপ করুন।',
              english: 'Always use your thumb for the spacebar. Keep your rhythm smooth and even.',
              tips: ['অন্য আঙুলগুলো হোম রো-তে স্থির রেখে কেবল বৃদ্ধাঙ্গুলি নামিয়ে স্পেস চাপুন']
            },
            drillText: 'f j d k f j d k f j d k f j d k',
            practiceSentences: ['f j d k f j d k f j d k', 'j k f d j k f d j k f d'],
            challengeText: 'f j d k f j d k j k f d j k f d f j d k f j d k',
            minAccuracy: 95,
            minWpm: 18,
            xpReward: 150
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 1 =================
  {
    id: 'module-1',
    levelNumber: 1,
    title: 'হোম রো ভিত্তি',
    titleEn: 'Module 1 — Home Row Foundation',
    badgeName: 'হোম রো শিক্ষানবিস',
    quoteBn: 'হোম রো-তে আঙুলের পেশি নিয়ন্ত্রণ অর্জন করলে টাইপিংয়ের গতি দ্বিগুণ হয়ে যায়।',
    description: 'প্রথম ও দ্বিতীয় হোম-রো অক্ষর সেট, দুই হাতের সমন্বয় এবং মৌলিক বাংলা শব্দ গঠন।',
    skills: ['ক (J)', 'ত (K)', 'দ (L)', 'স (;)', 'ব (H)', 'মৌলিক শব্দ গঠন'],
    xpReward: 450,
    units: [
      {
        id: 'unit-1-1',
        unitNumber: '1.1',
        title: 'Home Row অক্ষর পরিচিতি',
        titleEn: 'Home Row Characters',
        description: 'ধাপে ধাপে হোম রো-এর অক্ষরগুলোর সাথে পরিচিতি।',
        lessons: [
          {
            id: 'lesson-1-1-1',
            moduleId: 'module-1',
            unitId: 'unit-1-1',
            levelNumber: 1,
            title: '১.১.১ — প্রথম অক্ষর সেট (ক, ত, দ, স)',
            titleEn: '1.1.1 First Character Set: Ka, Ta, Da, Sa',
            summary: 'ডান হাতের হোম রো অক্ষর: ক (J), ত (K), দ (L), স (;)।',
            targetKeys: ['ক', 'ত', 'দ', 'স'],
            explanation: {
              bangla: 'বিজয় ও জাতীয় কীবোর্ডে ডান হাতের চার আঙুল যথাক্রমে J (ক), K (ত), L (দ), ; (স) নির্দেশ করে। অভ্র কীবোর্ডে k, t, d, s চাপুন।',
              english: 'In Bijoy/Jatiya: J=ক, K=ত, L=দ, ;=স. In Avro: k, t, d, s.',
              tips: ['আঙুলগুলোর অবস্থান পরিবর্তন না করে আলতোভাবে চাপুন']
            },
            drillText: 'ক ত দ স ক ত দ স কত কদ কস তক তদ তাস সদ সকল',
            practiceSentences: ['কত কদ কস তক তদ', 'সদ কত কস তদ কত'],
            challengeText: 'কত কদ কস তক তদ তাস সদ সকল কত কদ কস তক তদ',
            minAccuracy: 90,
            minWpm: 15,
            xpReward: 150
          },
          {
            id: 'lesson-1-1-2',
            moduleId: 'module-1',
            unitId: 'unit-1-1',
            levelNumber: 1,
            title: '১.১.২ — দ্বিতীয় অক্ষর সেট (ব ও হোম রো বিস্তার)',
            titleEn: '1.1.2 Second Character Set: Ba & Reach',
            summary: 'ডান তর্জনী বামে H কীতে প্রসারিত করে ব (H) টাইপ করা ও J কীতে ফিরে আসা।',
            targetKeys: ['ব', 'ক', 'ত', 'দ', 'স'],
            explanation: {
              bangla: 'তর্জনী দিয়ে J থেকে একটু বামে গিয়ে H চাপলে "ব" টাইপ হয়। চাপার সাথে সাথে আঙুলটিকে আবার J কীতে ফিরিয়ে আনবেন।',
              english: 'Reach left with right index to H for "ব", then immediately return to J anchor.',
              tips: ['ব চাপার সময় কব্জি না ঘুরিয়ে কেবল তর্জনী প্রসারিত করুন']
            },
            drillText: 'বক বস কত সব কস তব কদ বকবক কতকত বক বস সব কত তব',
            practiceSentences: ['বক বস সব কত তব কস', 'কত বক সব বস বক কত'],
            challengeText: 'বক বস কত সব কস তব বকবক কতকত সব বক বস কত সব',
            minAccuracy: 92,
            minWpm: 16,
            xpReward: 160
          }
        ]
      },
      {
        id: 'unit-1-2',
        unitNumber: '1.2',
        title: 'ছন্দ ও দুই হাতের সমন্বয়',
        titleEn: 'Rhythm & Finger Independence',
        description: 'হাত বদলানোর গতি ও স্বাধীন আঙুল নিয়ন্ত্রণ।',
        lessons: [
          {
            id: 'lesson-1-2-1',
            moduleId: 'module-1',
            unitId: 'unit-1-2',
            levelNumber: 1,
            title: '১.২.১ — পুনরাবৃত্তি ও ছন্দ ড্রিল',
            titleEn: '1.2.1 Repetition & Cadence Drills',
            summary: 'হোম রো অক্ষরের পুনরাবৃত্তিতে স্থিতিশীল গতি বজায় রাখা।',
            targetKeys: ['ক', 'ত', 'দ', 'স', 'ব'],
            explanation: {
              bangla: 'একটি অক্ষরের পর আরেকটি অক্ষরের সময়ের ব্যবধান যেন সমান থাকে। দ্রুত চাপার চেয়ে সমান ছন্দে চাপা বেশি গুরুত্বপূর্ণ।',
              english: 'Focus on uniform interval between keystrokes.',
              tips: ['মেট্রোনোমের মতো নিয়মিত ছন্দে টাইপ করুন']
            },
            drillText: 'বব কক তত দদ সস বক বস সব কত বকবক কতকত সব বক',
            practiceSentences: ['সব বক বস কত সব', 'বক বকবক করে কত সব'],
            challengeText: 'বব কক তত দদ সস বক বস সব কত বকবক কতকত সব বক বস কত সব',
            minAccuracy: 92,
            minWpm: 18,
            xpReward: 180
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 2 =================
  {
    id: 'module-2',
    levelNumber: 2,
    title: 'কারের ভিত্তি',
    titleEn: 'Module 2 — Vowel Diacritics (Kar Foundation)',
    badgeName: 'কার-চিহ্ন কারিগর',
    quoteBn: 'ব্যঞ্জনবর্ণ + কার = উচ্চারণযোগ্য বাংলা একক। কার কখনোই একা থাকে না।',
    description: 'আ-কার, ই/ঈ-কার, উ/ঊ-কার, ঋ-কার, এ/ঐ-কার ও ও/ঔ-কার সহযোগে পূর্ণাঙ্গ শব্দ গঠন।',
    skills: ['আ-কার (F)', 'ই-কার (D)', 'ঈ-কার (Shift+D)', 'উ-কার (S)', 'এ-কার (C)', 'ও-কার (X/C+F)'],
    xpReward: 600,
    units: [
      {
        id: 'unit-2-1',
        unitNumber: '2.1',
        title: 'আ-কার (F)',
        titleEn: 'A-Kar Attachment',
        description: 'ব্যঞ্জনবর্ণের পর আ-কার যোগ করে মৌলিক পারিবারিক ও প্রাকৃতিক শব্দ।',
        lessons: [
          {
            id: 'lesson-2-1-1',
            moduleId: 'module-2',
            unitId: 'unit-2-1',
            levelNumber: 2,
            title: '২.১.১ — আ-কার ও প্রথম পূর্ণাঙ্গ শব্দ',
            titleEn: '2.1.1 A-Kar Attachment: Kaka, Baba, Dada',
            summary: 'ব্যঞ্জন + া: ক+া = কা, ব+া = বা, দ+া = দা, স+া = সা, ত+া = তা।',
            targetKeys: ['া', 'ক', 'ব', 'দ', 'স', 'ত'],
            explanation: {
              bangla: 'সর্বদা প্রথমে ব্যঞ্জনবর্ণ টাইপ করবেন, তারপর আকার (বিজয়-এ F কী)। যেমন: বাবা = ব+া+ব+া (h+f+h+f)।',
              english: 'Always type consonant first, then A-kar (F in Bijoy).',
              tips: ['আকার ডানে বসে, তাই কীবোর্ডেও ব্যঞ্জনের পরে F চাপবেন']
            },
            drillText: 'কা তা দা সা বা কাকা দাদা বাবা কাতা বাদা তাবা সাদা কাদা বসা',
            practiceSentences: ['কাকা সাদা বক', 'বাবা কাদা বসা', 'দাদা সাদা বক দেখ'],
            challengeText: 'কাকা দাদা বাবা কাতা বাদা তাবা সাদা কাদা বসা কাকা সাদা বক বাবা কাদা বসা',
            minAccuracy: 92,
            minWpm: 18,
            xpReward: 200
          }
        ]
      },
      {
        id: 'unit-2-2',
        unitNumber: '2.2',
        title: 'ই-কার ও ঈ-কার',
        titleEn: 'I-Kar & II-Kar',
        description: 'হ্রস্ব ই-কার (D) ও দীর্ঘ ঈ-কার (Shift+D) এর সঠিক সংযুক্তি।',
        lessons: [
          {
            id: 'lesson-2-2-1',
            moduleId: 'module-2',
            unitId: 'unit-2-2',
            levelNumber: 2,
            title: '২.২.১ — ই-কার (D) ও ঈ-কার (Shift+D)',
            titleEn: '2.2.1 I-Kar & II-Kar Drills',
            summary: 'কি, তি, দি, সি, বি এবং কী, তী, দী, সী, বী দিয়ে শব্দ তৈরি।',
            targetKeys: ['ি', 'ী', 'ক', 'ব', 'দ', 'স', 'ত'],
            explanation: {
              bangla: 'যদিও হাতে লেখার সময় ই-কার আগে বসে, কম্পিউটারে টাইপিংয়ের সময় সর্বদা আগে ব্যঞ্জনবর্ণ, তারপর ই-কার (D) চাপতে হয়। যেমন: দিদি = l + d + l + d।',
              english: 'Even though I-kar appears on the left in writing, always type the consonant first, then D.',
              tips: ['দিদি = l + d + l + d', 'নদী = b + l + Shift+D']
            },
            drillText: 'কি তি দি সি বি কী তী দী সী বী দিদি বিবি কিসি সীমা শীত নদী',
            practiceSentences: ['দিদি কিসি দিল', 'সীমা নদী তীরে গেল', 'শীতকালে নদী শান্ত থাকে'],
            challengeText: 'দিদি বিবি কিসি সীমা শীত নদী কি তি দি সি বি কী তী দী সী বী দিদি সীমা নদী',
            minAccuracy: 92,
            minWpm: 20,
            xpReward: 220
          }
        ]
      },
      {
        id: 'unit-2-7',
        unitNumber: '2.7',
        title: 'মিশ্র কার চ্যালেঞ্জ',
        titleEn: 'Mixed Kar Challenge',
        description: 'সকল কার-চিহ্নের সম্মিলিত বাস্তব শব্দ অনুশীলন।',
        lessons: [
          {
            id: 'lesson-2-7-1',
            moduleId: 'module-2',
            unitId: 'unit-2-7',
            levelNumber: 2,
            title: '২.৭.১ — সকল কারের সমন্বিত শব্দ',
            titleEn: '2.7.1 Multi-Kar Mastery Words',
            summary: 'কা কি কী কু কূ কে কৈ কো কৌ সহযোগে বিচিত্র বাংলা শব্দ।',
            targetKeys: ['া', 'ি', 'ী', 'ু', 'ূ', 'ে', 'ৈ', 'ো', 'ৌ'],
            explanation: {
              bangla: 'বাংলায় সব কার-চিহ্নই ব্যঞ্জনের সাথে যুক্ত হয়ে শব্দ গঠন করে। প্রতিটি কারের আঙুলের অবস্থান মনে রাখুন: আকার (F), ইকার (D), ঈকার (Shift+D), উকার (S), একার (C)।',
              english: 'Master all vowel diacritics combined with consonants to form authentic Bangla words.',
              tips: ['চোখ স্ক্রিনে রেখে আঙুল নিজে থেকেই যেন কার-চিহ্নের কীতে চলে যায়']
            },
            drillText: 'কাকা দিদি কুসুম কৃপা মেলা তৈরি পোকা মৌমাছি সীমানা সুখ দুঃখ সেবা',
            practiceSentences: ['মেলায় মৌমাছি উড়ে বেড়ায়', 'সুখী জীবন গড়তে সেবার মনোভাব দরকার', 'কাকা দিদি মেলায় গেল'],
            challengeText: 'কাকা দিদি কুসুম কৃপা মেলা তৈরি পোকা মৌমাছি সীমানা সুখ সেবা মেলায় মৌমাছি উড়ে বেড়ায়',
            minAccuracy: 93,
            minWpm: 22,
            xpReward: 250
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 3 =================
  {
    id: 'module-3',
    levelNumber: 3,
    title: 'SHIFT ও দ্বিতীয় স্তরের বর্ণ',
    titleEn: 'Module 3 — Shift & Secondary Alphabet Tier',
    badgeName: 'শিফট মাস্টার',
    quoteBn: 'বিপরীত হাত দিয়ে শিফট চাপা টাচ টাইপিংয়ের অন্যতম গুরুত্বপূর্ণ শৃঙ্খলা।',
    description: 'বিপরীত হাতের শিফট মেকানিক্স, মহাপ্রাণ বর্ণ (খ, থ, ধ, ফ, ভ) ও মিশ্র শিফট রিদম ড্রিল।',
    skills: ['বিপরীত হাতের Shift', 'খ (Shift+J)', 'থ (Shift+K)', 'ধ (Shift+L)', 'ভ (Shift+H)', 'ফ (Shift+R)'],
    xpReward: 500,
    units: [
      {
        id: 'unit-3-1',
        unitNumber: '3.1',
        title: 'Shift মেকানিক্স',
        titleEn: 'Shift Key Mechanics',
        description: 'বিপরীত হাত দিয়ে Shift চেপে অক্ষরের দ্বিতীয় রূপ বের করা।',
        lessons: [
          {
            id: 'lesson-3-1-1',
            moduleId: 'module-3',
            unitId: 'unit-3-1',
            levelNumber: 3,
            title: '৩.১.১ — বিপরীত হাত দিয়ে Shift ও মহাপ্রাণ বর্ণ',
            titleEn: '3.1.1 Opposite-Hand Shift Mechanics',
            summary: 'ডান হাতের কীতে শিফট করতে বাম কনিষ্ঠা দিয়ে বাম Shift চাপুন (যেমন: খ = Shift+J, থ = Shift+K)।',
            targetKeys: ['খ', 'থ', 'ধ', 'ভ', 'ফ'],
            explanation: {
              bangla: 'স্বর্ণযুগীয় নিয়ম: ডান হাতের কোনো কী শিফট করতে হলে বাম হাতের কনিষ্ঠা দিয়ে বাম Shift চাপবেন; বাম হাতের কী শিফট করতে হলে ডান হাতের কনিষ্ঠা দিয়ে ডান Shift চাপবেন।',
              english: 'Opposite-Hand Shift Rule: Use left pinky for right-hand keys and right pinky for left-hand keys.',
              tips: ['একই হাত দিয়ে শিফট ও অক্ষর চাপতে যাবেন না, গতি কমে যাবে']
            },
            drillText: 'খ থ ধ ভ ফ খাতা থালা ধান ভাত ফুল কথা খেলা ছবি ভালো ফল',
            practiceSentences: ['থালায় ভাত রাখ', 'ভালো ফল খেতে মিষ্টি', 'খাতা কলম নিয়ে খেলা কর'],
            challengeText: 'খ থ ধ ভ ফ খাতা থালা ধান ভাত ফুল কথা খেলা ছবি ভালো ফল থালায় ভাত রাখ ভালো ফল খাও',
            minAccuracy: 92,
            minWpm: 20,
            xpReward: 220
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 4 =================
  {
    id: 'module-4',
    levelNumber: 4,
    title: 'স্বরবর্ণ ও স্বাধীন অক্ষর',
    titleEn: 'Module 4 — Independent Vowels & Formulas',
    badgeName: 'স্বরবর্ণ সাধক',
    quoteBn: 'শব্দের শুরুতে বা স্বাধীনভাবে স্বরবর্ণ লেখার জন্য নির্ধারিত ফর্মুলা প্রয়োগ করুন।',
    description: 'অ, আ, ই, ঈ, উ, ঊ, ঋ, এ, ঐ, ও, ঔ এর সঠিক কিবোর্ড লিঙ্কিং ফর্মুলা ও শব্দ গঠন।',
    skills: ['অ (Shift+F)', 'আ (্+া / Shift+F+F)', 'ই (্+ি)', 'ঈ (্+ী)', 'উ (্+ু)', 'এ (্+ে)', 'ও (Shift+X)'],
    xpReward: 550,
    units: [
      {
        id: 'unit-4-1',
        unitNumber: '4.1',
        title: 'মৌলিক স্বরবর্ণ',
        titleEn: 'Basic Vowels: A, Aa, I, Ii, U, Uu',
        description: 'অ, আ, ই, ঈ, উ, ঊ লেখার কিবোর্ড ফর্মুলা।',
        lessons: [
          {
            id: 'lesson-4-1-1',
            moduleId: 'module-4',
            unitId: 'unit-4-1',
            levelNumber: 4,
            title: '৪.১.১ — স্বাধীন স্বরবর্ণ ও কম্পোজিশন',
            titleEn: '4.1.1 Independent Vowel Formulas',
            summary: 'বিজয়-এ: অ = Shift+F, আ = ্+া (g+f), ই = ্+ি (g+d), ঈ = ্+ী (g+D), উ = ্+ু (g+s)।',
            targetKeys: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'এ', 'ঐ', 'ও', 'ঔ'],
            explanation: {
              bangla: 'বিজয় কীবোর্ডে স্বাধীন স্বরবর্ণ টাইপ করতে হসন্তের সাথে কার যুক্ত করতে হয়: যেমন আ = g+f, ই = g+d, উ = g+s, এ = g+c। অভ্র-তে a, aa/A, i, I, u, U, e, o লিখুন।',
              english: 'In Bijoy: Type Hasanta (G) followed by the corresponding Kar to produce independent vowels.',
              tips: ['অ = Shift+F', 'আ = g + f', 'ই = g + d', 'উ = g + s']
            },
            drillText: 'অ আ ই ঈ উ ঊ এ ঐ ও ঔ আকাশ নদী আলো ঔষধ ঈদ উৎসব একতা আম',
            practiceSentences: ['আকাশে মেঘের মেলা', 'ঈদের দিনে আনন্দ হয়', 'একতাই আমাদের প্রধান বল'],
            challengeText: 'অ আ ই ঈ উ ঊ এ ঐ ও ঔ আকাশ নদী আলো ঔষধ ঈদ উৎসব একতা আম আকাশে মেঘের মেলা ঈদের আনন্দ',
            minAccuracy: 92,
            minWpm: 22,
            xpReward: 240
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 5 =================
  {
    id: 'module-5',
    levelNumber: 5,
    title: 'পূর্ণ বর্ণমালা',
    titleEn: 'Module 5 — Full Bangla Alphabet Mastery',
    badgeName: 'বর্ণমালা বিশেষজ্ঞ',
    quoteBn: 'উপরের সারি ও নিচের সারির সকল ব্যঞ্জনবর্ণে আঙুলের মসৃণ চলাচল আয়ত্ত করুন।',
    description: 'টপ রো (Q W E R T Y U I O P) এবং বটম রো (Z X C V B N M) এর সম্পূর্ণ বর্ণমালা কভারেজ।',
    skills: ['টপ রো বর্ণমালা', 'বটম রো বর্ণমালা', 'ণ, ঞ, ঙ, ং, ঃ, ঁ', 'র‍্যান্ডম বর্ণ ড্রিল'],
    xpReward: 650,
    units: [
      {
        id: 'unit-5-1',
        unitNumber: '5.1',
        title: 'পূর্ণ বর্ণমালা চ্যালেঞ্জ',
        titleEn: 'Top & Bottom Row Complete Alphabet',
        description: 'বাংলা বর্ণমালার সকল অক্ষরের উপর আঙুলের স্বয়ংক্রিয় নিয়ন্ত্রণ।',
        lessons: [
          {
            id: 'lesson-5-1-1',
            moduleId: 'module-5',
            unitId: 'unit-5-1',
            levelNumber: 5,
            title: '৫.১.১ — পূর্ণ বর্ণমালা ও র্যান্ডম ড্রিল',
            titleEn: '5.1.1 Full Alphabet Reach & Accuracy',
            summary: 'ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ ড় ঢ় য়।',
            targetKeys: ['ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ', 'ড়', 'ঢ়', 'য়'],
            explanation: {
              bangla: 'বাংলা কীবোর্ডের প্রতিটি সারির অক্ষরের সাথে আঙুলের নিখুঁত সম্পর্ক গড়ে তুলুন। কোনো বর্ণ যেন অপরিচিত বা বিলম্ব সৃষ্টিকারী না থাকে।',
              english: 'Build instantaneous muscle reflexes for all 39 Bangla consonants.',
              tips: ['আঙুল চেপে আবার হোম কীতে ফিরে আসার রিদম বজায় রাখুন']
            },
            drillText: 'ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ ড় ঢ় য়',
            practiceSentences: ['বাংলা আমার প্রাণের ভাষা', 'সকল বর্ণমালা শুদ্ধভাবে টাইপ করুন', 'নদী মেঘ পাহাড় ঘেরা রূপসী বাংলা'],
            challengeText: 'ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ ড় ঢ় য় বাংলা ভাষা',
            minAccuracy: 93,
            minWpm: 24,
            xpReward: 260
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 6 =================
  {
    id: 'module-6',
    levelNumber: 6,
    title: 'ফলা ও বিশেষ গঠন',
    titleEn: 'Module 6 — Fola & Diacritics',
    badgeName: 'ফলা কারিগর',
    quoteBn: 'র-ফলা এবং রেফের পার্থক্য বুঝে নেওয়া বাংলা টাইপিংয়ের অপরিহার্য দক্ষতা।',
    description: 'র-ফলা (Z), য-ফলা (Shift+Z), ব-ফলা, ম-ফলা, ল-ফলা, রেফ (Shift+A) এবং বিশেষ চিহ্ন ঁ ঃ ৎ । এর ব্যবহার।',
    skills: ['র-ফলা (Z)', 'য-ফলা (Shift+Z)', 'রেফ (Shift+A)', 'চন্দ্রবিন্দু (Shift+Q)', 'বিসর্গ (Shift+V)', 'দাঁড়ি (Shift+A/G)'],
    xpReward: 700,
    units: [
      {
        id: 'unit-6-1',
        unitNumber: '6.1',
        title: 'র-ফলা বনাম রেফ',
        titleEn: 'R-Fola vs Ref Distinction',
        description: 'ক্র, প্র, গ্র (র-ফলা) এবং র্ক, র্প, র্গ (রেফ) এর মৌলিক পার্থক্য।',
        lessons: [
          {
            id: 'lesson-6-1-1',
            moduleId: 'module-6',
            unitId: 'unit-6-1',
            levelNumber: 6,
            title: '৬.১.১ — র-ফলা (Z) ও রেফ (Shift+A)',
            titleEn: '6.1.1 R-Fola (Z) & Ref (Shift+A) Mechanics',
            summary: 'র-ফলা ব্যঞ্জনের পরে বসে (ক+z = ক্র); রেফ ব্যঞ্জনের আগে Shift+A চেপে বসে (Shift+A + ক = র্ক)।',
            targetKeys: ['ক্র', 'প্র', 'গ্র', 'ত্র', 'র্ক', 'র্প', 'র্গ', 'র্ত'],
            explanation: {
              bangla: 'গুরুত্বপূর্ণ পার্থক্য: র-ফলা দিতে ব্যঞ্জনের পর z চাপবেন (যেমন: গ্রাম = o + z + f + m)। রেফ দিতে ব্যঞ্জনের আগে Shift+A চাপবেন (যেমন: কর্ম = Shift+A + k + m)।',
              english: 'Crucial: For R-fola press Z after consonant. For Ref press Shift+A before the consonant in Bijoy.',
              tips: ['গ্রাম = o + z + f + m', 'কর্ম = Shift+A + k + m', 'সূর্য = s + Shift+S + Shift+A + w']
            },
            drillText: 'ক্র প্র গ্র ত্র র্ক র্প র্গ র্ত গ্রাম প্রথম ক্রিকেট ছাত্র কর্ম ধর্ম সূর্য সর্প বর্ষা',
            practiceSentences: ['আমাদের গ্রামটি ছবির মতো সুন্দর', 'সৎ কর্ম মানুষকে বাঁচিয়ে রাখে', 'প্রথম সূর্যোদয়ে প্রকৃতি আলোকিত হয়'],
            challengeText: 'ক্র প্র গ্র ত্র র্ক র্প র্গ র্ত গ্রাম প্রথম ক্রিকেট ছাত্র কর্ম ধর্ম সূর্য সর্প বর্ষা গ্রাম প্রথম ক্রিকেট ছাত্র',
            minAccuracy: 93,
            minWpm: 24,
            xpReward: 260
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 7 =================
  {
    id: 'module-7',
    levelNumber: 7,
    title: 'হসন্ত ও যুক্তবর্ণের ভিত্তি',
    titleEn: 'Module 7 — Hasanta & Conjunct Foundations',
    badgeName: 'হসন্ত প্রকৌশলী',
    quoteBn: 'ব্যঞ্জন ১ + হসন্ত + ব্যঞ্জন ২ = যুক্তবর্ণ। এই গাণিতিক সূত্রেই গঠিত হয় বাংলা যুক্তাক্ষর।',
    description: 'হসন্তের মূল মেকানিক্স, সাধারণ যুক্তবর্ণ (ক্ত, ন্ত, ন্দ, ম্প, ল্প, ত্ত, ব্দ, স্ক, ষ্ট, স্থ) ও শব্দ গঠন।',
    skills: ['হসন্ত (G)', 'ক্ত (ক+্+ত)', 'ন্ত (ন+্+ত)', 'ন্দ (ন+্+দ)', 'ম্প (ম+্+প)', 'স্ক (স+্+ক)'],
    xpReward: 750,
    units: [
      {
        id: 'unit-7-1',
        unitNumber: '7.1',
        title: 'হসন্ত মেকানিক্স ও দ্বি-ব্যঞ্জন যুক্তবর্ণ',
        titleEn: 'Hasanta Mechanics & Two-Consonant Conjuncts',
        description: 'প্রথম ব্যঞ্জন + হসন্ত (G) + দ্বিতীয় ব্যঞ্জন = যুক্তবর্ণ তৈরির ভিত্তি।',
        lessons: [
          {
            id: 'lesson-7-1-1',
            moduleId: 'module-7',
            unitId: 'unit-7-1',
            levelNumber: 7,
            title: '৭.১.১ — ব্যঞ্জন ১ + হসন্ত + ব্যঞ্জন ২',
            titleEn: '7.1.1 Two-Consonant Conjunct Formula',
            summary: 'ক+্+ত = ক্ত (j+g+k), ন+্+ত = ন্ত (b+g+k), ন+্+দ = ন্দ (b+g+l), ম+্+প = ম্প (m+g+r)।',
            targetKeys: ['ক্ত', 'ন্ত', 'ন্দ', 'ম্প', 'ল্প', 'ত্ত', 'ব্দ', 'স্ক', 'ষ্ট', 'স্থ'],
            explanation: {
              bangla: 'যুক্তবর্ণ টাইপিংয়ের নিয়ম: প্রথম বর্ণ চাপুন, তারপর হসন্ত (G কী) চাপুন, তারপর দ্বিতীয় বর্ণ চাপুন। কম্পিউটার স্বয়ংক্রিয়ভাবে দুটি বর্ণকে যুক্ত করবে।',
              english: 'Type 1st consonant + Hasanta (G) + 2nd consonant to create clean ligatures.',
              tips: ['রক্ত = h + j + g + k', 'শান্ত = Shift+S + f + b + g + k', 'আনন্দ = g+f + b + b + g + l']
            },
            drillText: 'ক্ত ন্ত ন্দ ম্প ল্প ত্ত ব্দ স্ক ষ্ট স্থ রক্ত শান্ত আনন্দ গল্প উত্তর শব্দ স্কুল কষ্ট স্থান',
            practiceSentences: ['মন শান্ত রেখে টাইপ করুন', 'সুন্দর গল্প পড়ে আনন্দ পাই', 'স্কুলে যাওয়ার সময় হয়েছে'],
            challengeText: 'ক্ত ন্ত ন্দ ম্প ল্প ত্ত ব্দ স্ক ষ্ট স্থ রক্ত শান্ত আনন্দ গল্প উত্তর শব্দ স্কুল কষ্ট স্থান রক্ত শান্ত আনন্দ গল্প',
            minAccuracy: 93,
            minWpm: 25,
            xpReward: 280
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 8 =================
  {
    id: 'module-8',
    levelNumber: 8,
    title: 'যুক্তবর্ণ CORE',
    titleEn: 'Module 8 — Core Juktoborno Mastery',
    badgeName: 'যুক্তবর্ণ কারিগর',
    quoteBn: 'এখন তুমি বাংলা টাইপিংয়ের সবচেয়ে গুরুত্বপূর্ণ অংশগুলোর একটি শিখবে — যুক্তবর্ণ।',
    description: 'সর্বাধিক ব্যবহৃত যুক্তবর্ণসমূহ: ক্ত, ন্ত, ন্দ, ম্প, ল্প, ক্র, প্র, ত্র, ব্য, দ্য, ত্য, ধ্য এর দ্রুত ড্রিল।',
    skills: ['ক্ত', 'ন্ত', 'ন্দ', 'ম্প', 'ক্র', 'প্র', 'ত্র', 'ব্য', 'দ্য', 'ত্য'],
    xpReward: 850,
    units: [
      {
        id: 'unit-8-1',
        unitNumber: '8.1',
        title: 'দৈনন্দিন ব্যবহৃত যুক্তবর্ণ',
        titleEn: 'Everyday Juktoborno Drill',
        description: 'বাংলা বই ও সংবাদপত্রে ব্যবহৃত শীর্ষ যুক্তবর্ণসমূহের টাইপিং।',
        lessons: [
          {
            id: 'lesson-8-1-1',
            moduleId: 'module-8',
            unitId: 'unit-8-1',
            levelNumber: 8,
            title: '৮.১.১ — কোর যুক্তবর্ণ ও শব্দ গতি',
            titleEn: '8.1.1 Core Juktoborno Speed & Precision',
            summary: 'শক্তি, ভক্ত, বন্ধু, সুন্দর, সম্পর্ক, গল্প, গ্রাম, প্রথম, ছাত্র, ব্যক্তি, বিদ্যা, সত্য।',
            targetKeys: ['ক্ত', 'ন্ত', 'ন্দ', 'ম্প', 'ক্র', 'প্র', 'ত্র', 'ব্য', 'দ্য', 'ত্য'],
            explanation: {
              bangla: 'এই যুক্তবর্ণগুলো বাংলা ভাষায় সবচেয়ে বেশি ব্যবহৃত হয়। এগুলোর আঙুলের গতি স্বয়ংক্রিয় রিফ্লেক্সে পরিণত করুন।',
              english: 'Build reflex-level fluency on the most frequent Bangla conjuncts.',
              tips: ['ভুল হলে থামবেন না, শব্দটির কি-সিকোয়েন্স মনে করে পুনরায় টাইপ করুন']
            },
            drillText: 'শক্তি ভক্ত বন্ধু সুন্দর সম্পর্ক গল্প গ্রাম প্রথম ছাত্র ব্যক্তি বিদ্যা সত্য প্রত্যাশা',
            practiceSentences: ['সৎ ব্যক্তি সবসময় সত্য কথা বলেন', 'বন্ধুত্ব একটি অমূল্য সুন্দর সম্পর্ক', 'প্রথম ছাত্র পরীক্ষায় শ্রেষ্ঠ ফল করেছে'],
            challengeText: 'শক্তি ভক্ত বন্ধু সুন্দর সম্পর্ক গল্প গ্রাম প্রথম ছাত্র ব্যক্তি বিদ্যা সত্য প্রত্যাশা শক্তি ভক্ত বন্ধু সুন্দর সম্পর্ক',
            minAccuracy: 94,
            minWpm: 26,
            xpReward: 300
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 9 =================
  {
    id: 'module-9',
    levelNumber: 9,
    title: 'যুক্তবর্ণ ADVANCED',
    titleEn: 'Module 9 — Advanced & Irregular Juktoborno',
    badgeName: 'যুক্তাক্ষর বিশারদ',
    quoteBn: 'ক্ষ, জ্ঞ, ষ্ণ এর মতো জটিল ও রূপান্তরিত রূপগুলো বিশ্লেষণ করে শিখলে কখনো ভুল হবে না।',
    description: 'ক্ষ (ক+ষ), জ্ঞ (জ+ঞ), হ্ম (হ+ম), ষ্ণ (ষ+ণ), চ্ছ, জ্জ, দ্ধ এবং ত্রিমাত্রিক যুক্তবর্ণ ন্ত্র, ষ্ট্র, ক্ষ্ম।',
    skills: ['ক্ষ (j+g+N)', 'জ্ঞ (u+g+I)', 'হ্ম (i+g+m)', 'ষ্ণ (N+g+B)', 'ন্ত্র (b+g+k+z)', 'ষ্ট্র (N+g+t+z)'],
    xpReward: 950,
    units: [
      {
        id: 'unit-9-1',
        unitNumber: '9.1',
        title: 'বিশেষ ও রূপান্তরিত যুক্তবর্ণ',
        titleEn: 'Special Transformed Conjuncts',
        description: 'ক্ষ, জ্ঞ, হ্ম, ষ্ণ, ঙ্ক, ঙ্গ, ঞ্চ, ঞ্জ এর নিখুঁত কম্পোজিশন।',
        lessons: [
          {
            id: 'lesson-9-1-1',
            moduleId: 'module-9',
            unitId: 'unit-9-1',
            levelNumber: 9,
            title: '৯.১.১ — ক্ষ, জ্ঞ, হ্ম ও ষ্ণ এর রহস্যভেদ',
            titleEn: '9.1.1 Demystifying Kkh, Jn, Hm & Shn',
            summary: 'ক্ষ = ক+্+ষ (j+g+Shift+N), জ্ঞ = জ+্+ঞ (u+g+Shift+I), হ্ম = হ+্+ম (i+g+m), ষ্ণ = ষ+্+ণ (Shift+N+g+Shift+B)।',
            targetKeys: ['ক্ষ', 'জ্ঞ', 'হ্ম', 'ষ্ণ', 'ঙ্ক', 'ঙ্গ', 'ঞ্চ', 'ঞ্জ'],
            explanation: {
              bangla: 'রূপান্তরিত যুক্তবর্ণে বর্ণের চেহারা বদলে যায়। মনে রাখুন: ক্ষ হলো ক+ষ, জ্ঞ হলো জ+ঞ, ষ্ণ হলো ষ+ণ। বিজয়-এ j+g+N, u+g+I, N+g+B।',
              english: 'Decompose transformed ligatures into base consonants: ক্ষ = ক+ষ, জ্ঞ = জ+ঞ, ষ্ণ = ষ+ণ.',
              tips: ['জ্ঞান = u + g + Shift+I + f + b', 'শিক্ষা = Shift+S + d + j + g + Shift+N + f']
            },
            drillText: 'ক্ষ জ্ঞ হ্ম ষ্ণ ঙ্ক ঙ্গ ঞ্চ ঞ্জ শিক্ষা জ্ঞান বিজ্ঞান পরীক্ষা কৃষ্ণ অঙ্ক সঙ্গীত অঞ্চল গঞ্জ',
            practiceSentences: ['জ্ঞান মানুষের অমূল্য সম্পদ', 'পরীক্ষায় ভালো ফল করতে নিয়মিত পড়া দরকার', 'বিজ্ঞানীদের নতুন আবিষ্কারে বিশ্ব চমৎকৃত'],
            challengeText: 'ক্ষ জ্ঞ হ্ম ষ্ণ ঙ্ক ঙ্গ ঞ্চ ঞ্জ শিক্ষা জ্ঞান বিজ্ঞান পরীক্ষা কৃষ্ণ অঙ্ক সঙ্গীত অঞ্চল গঞ্জ শিক্ষা জ্ঞান বিজ্ঞান পরীক্ষা',
            minAccuracy: 94,
            minWpm: 28,
            xpReward: 320
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 10 =================
  {
    id: 'module-10',
    levelNumber: 10,
    title: 'যুক্তবর্ণ in Real Words',
    titleEn: 'Module 10 — Juktoborno in Natural Bangla Context',
    badgeName: 'যুক্তবর্ণ প্রয়োগবিদ',
    quoteBn: 'বিচ্ছিন্ন যুক্তবর্ণ নয়, বাস্তব বাক্যে সাবলীল প্রয়োগই চূড়ান্ত দক্ষতা।',
    description: 'প্রকৃত শব্দশৃঙ্খল (ক্ত → শক্ত → শক্তি) এবং জটিল যুক্তাক্ষরসমৃদ্ধ পূর্ণাঙ্গ শব্দমালা।',
    skills: ['শব্দশৃঙ্খল গঠন', 'বহু-যুক্তবর্ণ শব্দ', 'প্রশাসনিক শব্দ', 'সাহিত্যিক শব্দ'],
    xpReward: 900,
    units: [
      {
        id: 'unit-10-1',
        unitNumber: '10.1',
        title: 'বাস্তব শব্দ ও শব্দশৃঙ্খল',
        titleEn: 'Authentic Word Chains',
        description: 'ক্ত → শক্ত → শক্তি এবং জ্ঞ → জ্ঞান → বিজ্ঞান → বৈজ্ঞানিক।',
        lessons: [
          {
            id: 'lesson-10-1-1',
            moduleId: 'module-10',
            unitId: 'unit-10-1',
            levelNumber: 10,
            title: '১০.১.১ — প্রগ্রেসিভ শব্দশৃঙ্খল ড্রিল',
            titleEn: '10.1.1 Progressive Word Chains',
            summary: 'মৌলিক যুক্তবর্ণ থেকে দীর্ঘতম প্রাতিষ্ঠানিক শব্দ টাইপ করার দক্ষতা।',
            targetKeys: ['ক্ত', 'ক্ষ', 'জ্ঞ', 'ণ্ড', 'ষ্ট্র', 'ন্ত্র'],
            explanation: {
              bangla: 'শব্দশৃঙ্খল আপনাকে যুক্তবর্ণ দিয়ে ছোট থেকে বড় শব্দ ধাপে ধাপে তৈরি করতে শেখায়: ভক্ত → ভক্তি → ভক্তিমতী, রাষ্ট্র → রাষ্ট্রপতি → রাষ্ট্রবিজ্ঞান।',
              english: 'Progress from root conjuncts to multi-syllabic contextual words.',
              tips: ['গতি সামঞ্জস্যপূর্ণ রাখুন']
            },
            drillText: 'ভক্ত ভক্তি ভক্তিমতী শক্ত শক্তি শক্তিশালী রাষ্ট্র রাষ্ট্রপতি রাষ্ট্রবিজ্ঞান বিজ্ঞান বিজ্ঞানী বৈজ্ঞানিক',
            practiceSentences: ['রাষ্ট্রপতির সরকারি বাসভবন বঙ্গভবনে অবস্থিত', 'বিজ্ঞানীদের নিরলস গবেষণায় দেশ এগিয়ে চলছে', 'শক্তিশালী মনোবল থাকলে যেকোনো বাধা জয় করা যায়'],
            challengeText: 'ভক্ত ভক্তি ভক্তিমতী শক্ত শক্তি শক্তিশালী রাষ্ট্র রাষ্ট্রপতি রাষ্ট্রবিজ্ঞান বিজ্ঞান বিজ্ঞানী বৈজ্ঞানিক শক্ত শক্তি শক্তিশালী রাষ্ট্র',
            minAccuracy: 95,
            minWpm: 30,
            xpReward: 350
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 11 =================
  {
    id: 'module-11',
    levelNumber: 11,
    title: 'শব্দ নির্মাতা',
    titleEn: 'Module 11 — Vocabulary Builder & Word Architecture',
    badgeName: 'শব্দ স্থপতি',
    quoteBn: 'সহজ, মাঝারি, কঠিন ও দীর্ঘ শব্দের সুষম প্রস্তুতি টাইপিংয়ে আত্মবিশ্বাস জোগায়।',
    description: 'বাংলা শব্দভাণ্ডারের বিভিন্ন স্তরের শব্দ টাইপিং এবং দুর্বল শব্দস্বয়ংক্রিয় রিভিউ।',
    skills: ['সহজ শব্দ', 'মাঝারি শব্দ', 'দীর্ঘ প্রাতিষ্ঠানিক শব্দ', 'দুর্বল শব্দ সংশোধন'],
    xpReward: 800,
    units: [
      {
        id: 'unit-11-1',
        unitNumber: '11.1',
        title: 'শব্দ স্তর বিন্যাস',
        titleEn: 'Word Hierarchy & Complexity',
        description: 'সহজ থেকে দীর্ঘতম বাংলা শব্দের টাইপিং অনুশীলন।',
        lessons: [
          {
            id: 'lesson-11-1-1',
            moduleId: 'module-11',
            unitId: 'unit-11-1',
            levelNumber: 11,
            title: '১১.১.১ — দীর্ঘ প্রাতিষ্ঠানিক ও বৈজ্ঞানিক শব্দমালা',
            titleEn: '11.1.1 Multi-Syllabic Institutional Words',
            summary: 'আন্তর্জাতিক, গণপ্রজাতন্ত্রী, স্বায়ত্তশাসিত, পৃষ্ঠপোষকতা, পুনর্গঠন, উত্তরাধিকার।',
            targetKeys: ['আন্তর্জাতিক', 'গণপ্রজাতন্ত্রী', 'স্বায়ত্তশাসিত', 'পৃষ্ঠপোষকতা'],
            explanation: {
              bangla: 'দীর্ঘ শব্দের ক্ষেত্রে বানান ভেঙে ভেঙে মনে মনে সিলেবল অনুযায়ী টাইপ করুন। যেমন: আন্তর্-জাতিক, গণ-প্রজা-তন্ত্রী।',
              english: 'Chunk long words into rhythmic syllables for effortless execution.',
              tips: ['অক্ষর খোঁজা বন্ধ করে শব্দের অর্থের প্রবাহে আঙুল ছেড়ে দিন']
            },
            drillText: 'আন্তর্জাতিক গণপ্রজাতন্ত্রী স্বায়ত্তশাসিত পৃষ্ঠপোষকতা পুনর্গঠন উত্তরাধিকার জবাবদিহিতা প্রাতিষ্ঠানিক সম্প্রসারণ',
            practiceSentences: ['গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের নিয়ম মেনে চলুন', 'আন্তর্জাতিক মাতৃভাষা দিবস বিশ্বব্যাপী পালিত হয়', 'প্রাতিষ্ঠানিক স্বচ্ছতা ও জবাবদিহিতা নিশ্চিত করা জরুরি'],
            challengeText: 'আন্তর্জাতিক গণপ্রজাতন্ত্রী স্বায়ত্তশাসিত পৃষ্ঠপোষকতা পুনর্গঠন উত্তরাধিকার জবাবদিহিতা প্রাতিষ্ঠানিক সম্প্রসারণ আন্তর্জাতিক গণপ্রজাতন্ত্রী',
            minAccuracy: 95,
            minWpm: 32,
            xpReward: 360
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 12 =================
  {
    id: 'module-12',
    levelNumber: 12,
    title: 'বাক্য নির্মাতা ও যতিচিহ্ন',
    titleEn: 'Module 12 — Sentence Flow & Punctuation',
    badgeName: 'বাক্যশিল্পী',
    quoteBn: 'যতিচিহ্নের সঠিক ব্যবহার বাক্যকে সুন্দর ও স্পষ্ট করে তোলে।',
    description: 'সংক্ষিপ্ত, দৈনন্দিন, প্রাতিষ্ঠানিক ও জটিল বাক্য এবং কমা, দাঁড়ি, প্রশ্নবোধক, উদ্ধৃতিচিহ্নের ব্যবহার।',
    skills: ['কমা (,)', 'দাঁড়ি (।)', 'প্রশ্নবোধক (?)', 'বিস্ময়বোধক (!)', 'উদ্ধৃতি (" ")', 'বাক্য ছন্দ'],
    xpReward: 850,
    units: [
      {
        id: 'unit-12-1',
        unitNumber: '12.1',
        title: 'যতিচিহ্ন ও বাক্য ছন্দ',
        titleEn: 'Punctuation Mechanics & Sentence Flow',
        description: 'যতিচিহ্ন সহযোগে বাস্তব বাংলা বাক্য টাইপিং।',
        lessons: [
          {
            id: 'lesson-12-1-1',
            moduleId: 'module-12',
            unitId: 'unit-12-1',
            levelNumber: 12,
            title: '১২.১.১ — পূর্ণাঙ্গ যতিচিহ্নসমৃদ্ধ বাক্য',
            titleEn: '12.1.1 Full Punctuation Sentence Flow',
            summary: 'কমা, দাঁড়ি, প্রশ্নবোধক, সেমিকোলন এবং ডাবল কোটেশন ব্যবহার করে বাক্য টাইপিং।',
            targetKeys: ['।', ',', '?', '!', '"', ':', ';'],
            explanation: {
              bangla: 'বিজয় কীবোর্ডে দাঁড়ি হলো Shift+A (অথবা G কী ক্ষেত্রবিশেষে)। কমা হলো কমা বোতাম। প্রশ্নবোধক হলো Shift+/। যতিচিহ্নের পর একটি স্পেস দিতে ভুলবেন না।',
              english: 'Practice typing full sentences with punctuation: comma, dari (।), question mark, and quotes.',
              tips: ['দাঁড়ির পর একটি স্পেস দিন', 'কোটেশনের ভেতরে শব্দ টাইপ করতে শিফট ধরে রাখুন']
            },
            drillText: 'সততা কি শুধু কথার কথা? না, সততা কাজের প্রতিচ্ছবি। তিনি বললেন, "জ্ঞানই শক্তি।"',
            practiceSentences: ['তুমি কি নিয়মিত টাইপিং অনুশীলন কর? হ্যাঁ, আমি প্রতিদিন করি।', 'শিক্ষক বললেন, "পরিশ্রম ছাড়া কোনো বিকল্প নেই।"', 'আমাদের দেশ সুন্দর, উর্বর এবং সবুজ।'],
            challengeText: 'সততা কি শুধু কথার কথা? না, সততা কাজের প্রতিচ্ছবি। তিনি বললেন, "জ্ঞানই শক্তি।" তুমি কি নিয়মিত টাইপিং অনুশীলন কর? হ্যাঁ, আমি প্রতিদিন করি।',
            minAccuracy: 95,
            minWpm: 32,
            xpReward: 380
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 13 =================
  {
    id: 'module-13',
    levelNumber: 13,
    title: 'অনুচ্ছেদ ও বাস্তব টাইপিং',
    titleEn: 'Module 13 — Paragraphs & Real-World Text',
    badgeName: 'অনুচ্ছেদ মাস্টার',
    quoteBn: 'গল্প, প্রবন্ধ, সংবাদ এবং দাপ্তরিক নথিপত্র টাইপ করে পূর্ণাঙ্গ আত্মবিশ্বাস অর্জন করুন।',
    description: 'সংক্ষিপ্ত অনুচ্ছেদ, সংবাদ প্রতিবেদন, শিক্ষামূলক প্রবন্ধ ও দাপ্তরিক আবেদনপত্র টাইপিং।',
    skills: ['সংবাদ প্রতিবেদন', 'দাপ্তরিক চিঠি', 'ছোট গল্প', 'প্রশাসনিক নোটিশ'],
    xpReward: 1000,
    units: [
      {
        id: 'unit-13-1',
        unitNumber: '13.1',
        title: 'বাস্তব অনুচ্ছেদ ও প্রতিবেদন',
        titleEn: 'Authentic Paragraphs & Reports',
        description: 'বাস্তব জীবনের বিভিন্ন প্রেক্ষাপটের অনুচ্ছেদ টাইপিং।',
        lessons: [
          {
            id: 'lesson-13-1-1',
            moduleId: 'module-13',
            unitId: 'unit-13-1',
            levelNumber: 13,
            title: '১৩.১.১ — সংবাদ প্রতিবেদন ও অফিসিয়াল নোটিশ',
            titleEn: '13.1.1 News Dispatch & Office Memo',
            summary: 'সংবাদপত্রের সম্পাদকীয় ও অফিসিয়াল সার্কুলার টাইপিং ড্রিল।',
            targetKeys: ['অনুচ্ছেদ', 'প্রতিবেদন', 'দাপ্তরিক'],
            explanation: {
              bangla: 'দীর্ঘ অনুচ্ছেদে টাইপিংয়ের সময় একটানা স্থির গতি বজায় রাখা জরুরি। তাড়াহুড়া না করে প্রতিটি বাক্যের শেষে ছন্দ ঠিক রাখুন।',
              english: 'Maintain consistent pace and steady breathing across full news paragraphs.',
              tips: ['প্যারাগ্রাফ টাইপিংয়ে নজর থাকবে পরবর্তী শব্দের ওপর']
            },
            drillText: 'ডিজিটাল বাংলাদেশ বিনির্মাণে তথ্যপ্রযুক্তির প্রসার অপরিহার্য। সর্বস্তরে বাংলা ভাষার সঠিক প্রয়োগ নিশ্চিত করতে কম্পিউটার টাইপিং দক্ষতা আবশ্যক। অফিস-আদালত ও শিক্ষাপ্রতিষ্ঠানে দ্রুত বাংলা টাইপিং কাজের গতিশীলতা বাড়িয়ে দেয়।',
            practiceSentences: ['সকল কর্মকর্তা ও কর্মচারীদের যথাসময়ে উপস্থিত হওয়ার জন্য নির্দেশ প্রদান করা হলো।', 'বাংলা ভাষার ডিজিটাল রূপান্তর আজ সময়ের জোরালো দাবি।', 'নদীমাতৃক বাংলাদেশের রূপসী প্রকৃতি আমাদের অহংকার।'],
            challengeText: 'ডিজিটাল বাংলাদেশ বিনির্মাণে তথ্যপ্রযুক্তির প্রসার অপরিহার্য। সর্বস্তরে বাংলা ভাষার সঠিক প্রয়োগ নিশ্চিত করতে কম্পিউটার টাইপিং দক্ষতা আবশ্যক। অফিস-আদালত ও শিক্ষাপ্রতিষ্ঠানে দ্রুত বাংলা টাইপিং কাজের গতিশীলতা বাড়িয়ে দেয়।',
            minAccuracy: 95,
            minWpm: 34,
            xpReward: 400
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 14 =================
  {
    id: 'module-14',
    levelNumber: 14,
    title: 'স্পিড ও নির্ভুলতা',
    titleEn: 'Module 14 — Speed & Precision Calibration',
    badgeName: 'গতি ও নির্ভুলতার সম্রাট',
    quoteBn: 'আগে নির্ভুলতা (৯৫%+), তারপর স্বয়ংক্রিয়ভাবে তৈরি হবে প্রফেশনাল স্পিড।',
    description: 'গতি বৃদ্ধি, ছন্দময় টাইপিং, দুর্বল কী ও স্লো কম্বিনেশন নিরাময় ড্রিল।',
    skills: ['৯৫%+ নির্ভুলতা', 'দুর্বল কী নিরাময়', 'কম্বিনেশন অপটিমাইজেশন', 'স্পিড স্প্রিন্ট'],
    xpReward: 1100,
    units: [
      {
        id: 'unit-14-1',
        unitNumber: '14.1',
        title: 'নির্ভুলতা প্রথম, গতি দ্বিতীয়',
        titleEn: 'Accuracy-First Speed Calibration',
        description: 'ভুল না করে গতি বাড়ানোর জন্য উচ্চমাত্রার ড্রিল।',
        lessons: [
          {
            id: 'lesson-14-1-1',
            moduleId: 'module-14',
            unitId: 'unit-14-1',
            levelNumber: 14,
            title: '১৪.১.১ — উচ্চ নির্ভুলতা স্পিড স্প্রিন্ট (৪০+ WPM)',
            titleEn: '14.1.1 Precision Speed Sprint (40+ WPM)',
            summary: '৯৬%+ নির্ভুলতা বজায় রেখে ৪০+ ডব্লিউপিএম গতি অর্জন করার স্প্রিন্ট টেস্ট।',
            targetKeys: ['স্পিড', 'নির্ভুলতা', 'ছন্দ'],
            explanation: {
              bangla: 'কোনো ভুল না করে টানা টাইপ করার চেষ্টা করুন। আঙ্গুলগুলোকে কীবোর্ডের ওপর ভাসিয়ে দ্রুত ট্যাপ করুন।',
              english: 'Maintain 96%+ accuracy while pushing your net speed above 40 WPM.',
              tips: ['ব্যাকস্পেস কম চাপার অভ্যাস করুন']
            },
            drillText: 'পরিশ্রম সৌভাগ্যের প্রসূতি। একাগ্রতা ও নিয়মিত অনুশীলনের মাধ্যমেই যেকোনো বিষয়ে সর্বোচ্চ সাফল্য অর্জন সম্ভব। বাংলা স্পর্শ টাইপিংয়ে পারদর্শিতা আপনাকে অন্যদের চেয়ে বহুগুণ এগিয়ে রাখবে।',
            practiceSentences: ['পরিশ্রম সৌভাগ্যের প্রসূতি।', 'একাগ্রতা ও অনুশীলনে সাফল্য আসে।', 'বাংলা টাইপিং দক্ষতা আপনাকে এগিয়ে রাখবে।'],
            challengeText: 'পরিশ্রম সৌভাগ্যের প্রসূতি। একাগ্রতা ও নিয়মিত অনুশীলনের মাধ্যমেই যেকোনো বিষয়ে সর্বোচ্চ সাফল্য অর্জন সম্ভব। বাংলা স্পর্শ টাইপিংয়ে পারদর্শিতা আপনাকে অন্যদের চেয়ে বহুগুণ এগিয়ে রাখবে।',
            minAccuracy: 96,
            minWpm: 38,
            xpReward: 450
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 15 =================
  {
    id: 'module-15',
    levelNumber: 15,
    title: 'Adaptive Practice',
    titleEn: 'Module 15 — Intelligent Adaptive Training',
    badgeName: 'অ্যাডাপ্টিভ ট্রেইনার',
    quoteBn: 'তোমার ভুল ও দুর্বলতা বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে তৈরি হয় ব্যক্তিগত অনুশীলন ড্রিল।',
    description: 'এআই ও ডেটা চালিত গতিশীল ড্রিল: যে কী বা যুক্তবর্ণে তোমার ভুল বেশি, সেই অনুযায়ী কাস্টম লেডার জেনারেশন।',
    skills: ['দুর্বল কী ডিটেকশন', 'কাস্টম ওয়ার্ড লেডার', 'হেজিটেশন দূরীকরণ', 'ডায়নামিক ফিডব্যাক'],
    xpReward: 1200,
    units: [
      {
        id: 'unit-15-1',
        unitNumber: '15.1',
        title: 'ব্যক্তিগত দুর্বলতা নিরাময় ইঞ্জিন',
        titleEn: 'Personal Weakness Remediation',
        description: 'ভুল ও দ্বিধাগ্রস্ত অক্ষরগুলোর ওপর ভিত্তি করে স্বয়ংক্রিয় প্র্যাকটিস সেশন।',
        lessons: [
          {
            id: 'lesson-15-1-1',
            moduleId: 'module-15',
            unitId: 'unit-15-1',
            levelNumber: 15,
            title: '১৫.১.১ — দুর্বল যুক্তবর্ণ লেডার ড্রিল',
            titleEn: '15.1.1 Weak Key Ladder Drill',
            summary: 'জ্ঞ $\\rightarrow$ জ্ঞান $\\rightarrow$ বিজ্ঞান $\\rightarrow$ অজ্ঞ $\\rightarrow$ বিজ্ঞানী $\\rightarrow$ বাক্য গঠন।',
            targetKeys: ['জ্ঞ', 'ক্ষ', 'ষ্ণ', 'ঙ্ক', 'হ্ম'],
            explanation: {
              bangla: 'এই সেশনে সিস্টেম স্বয়ংক্রিয়ভাবে চিহ্নিত দুর্বল যুক্তবর্ণ নিয়ে শব্দশৃঙ্খল তৈরি করে দেবে যাতে দ্বিধা দূর হয়।',
              english: 'AI-driven dynamic session targeting your slowest and most error-prone combinations.',
              tips: ['যে অক্ষরে বেশি ভুল হয়, সেটির কি-ম্যাপিং ধীরে ধীরে ৩ বার অনুশীলন করুন']
            },
            drillText: 'জ্ঞ জ্ঞান বিজ্ঞান বিজ্ঞানী অজ্ঞ প্রজ্ঞা ক্ষ শিক্ষা পরীক্ষা ক্ষতি ক্ষমা ষ্ণ কৃষ্ণ বিষ্ণু তৃষ্ণা',
            practiceSentences: ['জ্ঞান ও বিজ্ঞান মানবসভ্যতার মূল চালিকাশক্তি।', 'শিক্ষার আলোয় দূর হয় অজ্ঞানতার অন্ধকার।', 'তৃষ্ণার্ত পথিক নদীর স্বচ্ছ পানি পান করল।'],
            challengeText: 'জ্ঞ জ্ঞান বিজ্ঞান বিজ্ঞানী অজ্ঞ প্রজ্ঞা ক্ষ শিক্ষা পরীক্ষা ক্ষতি ক্ষমা ষ্ণ কৃষ্ণ বিষ্ণু তৃষ্ণা জ্ঞান ও বিজ্ঞান মানবসভ্যতার চালিকাশক্তি',
            minAccuracy: 96,
            minWpm: 40,
            xpReward: 480
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 16 =================
  {
    id: 'module-16',
    levelNumber: 16,
    title: 'টাইপিং গেম ACADEMY',
    titleEn: 'Module 16 — Typing Arcade & Skill Games',
    badgeName: 'গেম আর্কেড মাস্টার',
    quoteBn: 'খেলার ছলে তীব্র উত্তেজনার মাঝে টাইপিং রিফ্লেক্সকে পরিণত করুন অবচেতন অভ্যাসে।',
    description: 'Character Rain, Kar Catcher, Fola Fighter, Juktoborno Boss, Word Runner ও Sentence Race।',
    skills: ['Character Rain', 'Juktoborno Boss', 'Word Runner', 'Survival Challenge'],
    xpReward: 1000,
    units: [
      {
        id: 'unit-16-1',
        unitNumber: '16.1',
        title: 'আর্কেড গেমস ও রিফ্লেক্স চ্যালেঞ্জ',
        titleEn: 'Arcade Challenges & High Reflexes',
        description: 'গেম হাবে কারিকুলাম দক্ষতার সমন্বিত স্পিড ড্রিল।',
        lessons: [
          {
            id: 'lesson-16-1-1',
            moduleId: 'module-16',
            unitId: 'unit-16-1',
            levelNumber: 16,
            title: '১৬.১.১ — যুক্তবর্ণ বস ও ওয়ার্ড রানার ড্রিল',
            titleEn: '16.1.1 Conjunct Boss & Speed Runner',
            summary: 'পড়ন্ত অক্ষর ও দ্রুত ধাবমান যুক্তবর্ণ টাইপ করে উচ্চ স্কোর অর্জনের রিফ্লেক্স টেস্ট।',
            targetKeys: ['রিফ্লেক্স', 'যুক্তবর্ণ', 'গতি'],
            explanation: {
              bangla: 'স্ক্রিনে প্রদর্শিত শব্দ মাটিতে পড়ার আগেই দ্রুত টাইপ করে ফেলুন। এতে চোখের দৃষ্টি ও আঙুলের সমন্বয় বিদ্যুৎগতির হবে।',
              english: 'Destroy falling glyphs before they hit the ground to train hyper-fast neural reflexes.',
              tips: ['প্রথম অক্ষর দেখামাত্র আঙুল স্বয়ংক্রিয়ভাবে চালনা করুন']
            },
            drillText: 'বিদ্যুৎ বিজ্ঞান রাষ্ট্র বৃষ্টি পরীক্ষা কৃষ্ণ বন্ধু শিক্ষক সুন্দর শতাব্দী গল্প কল্পনা',
            practiceSentences: ['বিদ্যুৎ চমকালে আকাশ আলোয় ভরে যায়।', 'বিজ্ঞানীদের গবেষণা দেশে বিপ্লব এনেছে।', 'পরীক্ষায় সেরা ফল করে বন্ধুকে চমকে দিল।'],
            challengeText: 'বিদ্যুৎ বিজ্ঞান রাষ্ট্র বৃষ্টি পরীক্ষা কৃষ্ণ বন্ধু শিক্ষক সুন্দর শতাব্দী গল্প কল্পনা বিদ্যুৎ বিজ্ঞান রাষ্ট্র বৃষ্টি পরীক্ষা',
            minAccuracy: 95,
            minWpm: 42,
            xpReward: 500
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 17 =================
  {
    id: 'module-17',
    levelNumber: 17,
    title: 'বাস্তবধর্মী টাইপিং সিমুলেশন',
    titleEn: 'Module 17 — Real-World Workflows & Simulations',
    badgeName: 'বাস্তব সিমুলেটর',
    quoteBn: 'চ্যাট, সোশ্যাল মিডিয়া, ইমেইল, অফিস মেমো ও ফর্ম পূরণের বাস্তব অনুভূতি।',
    description: 'দৈনন্দিন সামাজিক যোগাযোগ, অফিসিয়াল ইমেইল, নোটিশ ও আবেদনপত্র প্রস্তুতকরণ।',
    skills: ['চ্যাট টাইপিং', 'ইমেইল ড্রাফটিং', 'অফিস মেমো', 'আবেদনপত্র'],
    xpReward: 1200,
    units: [
      {
        id: 'unit-17-1',
        unitNumber: '17.1',
        title: 'প্রফেশনাল ডিজিটাল ডকুমেন্ট',
        titleEn: 'Professional Digital Workflows',
        description: 'বাস্তব কর্মক্ষেত্রের বাংলা ডকুমেন্ট ড্রিল।',
        lessons: [
          {
            id: 'lesson-17-1-1',
            moduleId: 'module-17',
            unitId: 'unit-17-1',
            levelNumber: 17,
            title: '১৭.১.১ — অফিসিয়াল ইমেইল ও আবেদনপত্র ড্রাফটিং',
            titleEn: '17.1.1 Official Email & Application Drafting',
            summary: 'বরাবর, বিষয়, মহোদয় এবং আনুষ্ঠানিক প্রাতিষ্ঠানিক বাংলা লেখার টাইপিং।',
            targetKeys: ['বরাবর', 'মহোদয়', 'বিনীত', 'নিবেদন'],
            explanation: {
              bangla: 'অফিসিয়াল নথিতে ব্যাকরণগত শুদ্ধতা ও পরিশীলিত যতিচিহ্ন অপরিহার্য। প্রমিত বাংলা বানানের নিয়ম অনুসরণ করুন।',
              english: 'Type formal emails and administrative letters with pristine typography.',
              tips: ['অনুচ্ছেদগুলোর মাঝে স্পেস ও যতিচিহ্ন ঠিক রাখুন']
            },
            drillText: 'বরাবর, ব্যবস্থাপনা পরিচালক। বিষয়: বার্ষিক কর্মপরিকল্পনা প্রণয়ন সংক্রান্ত সভা। মহোদয়, বিনীত নিবেদন এই যে, আগামী রবিবার সকাল দশটায় একটি বিশেষ সভা অনুষ্ঠিত হবে।',
            practiceSentences: ['বরাবর, বিভাগীয় প্রধান। বিষয়: নৈমিত্তিক ছুটির আবেদন।', 'আপনার সক্রিয় অংশগ্রহণ আমাদের একান্ত কাম্য।', 'বিনীত নিবেদক, মো. রফিকুল ইসলাম।'],
            challengeText: 'বরাবর, ব্যবস্থাপনা পরিচালক। বিষয়: বার্ষিক কর্মপরিকল্পনা প্রণয়ন সংক্রান্ত সভা। মহোদয়, বিনীত নিবেদন এই যে, আগামী রবিবার সকাল দশটায় একটি বিশেষ সভা অনুষ্ঠিত হবে। আপনার উপস্থিতি একান্ত কাম্য।',
            minAccuracy: 96,
            minWpm: 42,
            xpReward: 520
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 18 =================
  {
    id: 'module-18',
    levelNumber: 18,
    title: 'পেশাদার টাইপিং ও দীর্ঘ সেশন',
    titleEn: 'Module 18 — Professional Mastery & Long Sessions',
    badgeName: 'পেশাদার টাইপিস্ট',
    quoteBn: 'টানা ৫ মিনিট উচ্চ গতি ও ৯৮%+ নির্ভুলতায় টাইপ করাই পেশাদারিত্বের প্রমাণ।',
    description: 'দীর্ঘ সেশনে ধৈর্য ও ক্লান্তিহীন গতি, এরর রিকভারি এবং প্রফেশনাল স্ট্যান্ডার্ড ডকুমেন্টস।',
    skills: ['৫ মিনিট দীর্ঘ টেস্ট', 'ক্লান্তিহীন রিদম', 'এরর রিকভারি', 'পেশাদার স্ট্যান্ডার্ড'],
    xpReward: 1500,
    units: [
      {
        id: 'unit-18-1',
        unitNumber: '18.1',
        title: 'পেশাদার দীর্ঘ সেশন ও সহনশীলতা',
        titleEn: 'Endurance & High Consistency',
        description: 'টানা দীর্ঘ অনুচ্ছেদে গতি ও নির্ভুলতা ধরে রাখা।',
        lessons: [
          {
            id: 'lesson-18-1-1',
            moduleId: 'module-18',
            unitId: 'unit-18-1',
            levelNumber: 18,
            title: '১৮.১.১ — ৫ মিনিটের পেশাদার দীর্ঘ অনুচ্ছেদ',
            titleEn: '18.1.1 5-Minute Professional Document Sprint',
            summary: '৪৮+ WPM এবং ৯৮% নির্ভুলতায় টানা সরকারি প্রজ্ঞাপন ও বাজেট নথি টাইপিং।',
            targetKeys: ['পেশাদার', 'প্রজ্ঞাপন', 'সংবিধান'],
            explanation: {
              bangla: 'পেশাদার টাইপিস্টরা দীর্ঘ সময় টাইপ করার সময়ও মনোযোগ হারান না। কব্জি হালকা রাখুন এবং চোখ স্ক্রিনে স্থির রাখুন।',
              english: 'Maintain 48+ WPM and 98%+ accuracy across a sustained 5-minute professional document.',
              tips: ['শ্বাস-প্রশ্বাস স্বাভাবিক রাখুন, কাঁধ শিথিল রাখুন']
            },
            drillText: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রশাসনিক কার্যক্রমে সর্বস্তরে প্রমিত বাংলা ভাষার প্রচলন নিশ্চিতকরণ অতীব গুরুত্বপূর্ণ। আধুনিক ডিজিটাল কার্যপরিবেশে তাৎক্ষণিক প্রতিবেদন প্রণয়ন, সরকারি প্রজ্ঞাপন জারি এবং তথ্য সংরক্ষণ প্রক্রিয়া দ্রুত ও নির্ভুল বাংলা স্পর্শ টাইপিংয়ের ওপর গভীরভাবে নির্ভরশীল।',
            practiceSentences: ['প্রশাসনিক স্বচ্ছতা ও জবাবদিহিতা জাতীয় উন্নয়নের মূলভিত্তি।', 'সংবিধানের নির্দেশনা মোতাবেক রাষ্ট্রভাষা বাংলার মর্যাদা সমুন্নত রাখা সবার দায়িত্ব।', 'তথ্যপ্রযুক্তির আধুনিক উৎকর্ষে বাংলা টাইপিং এক অপরিহার্য পেশাগত দক্ষতা।'],
            challengeText: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রশাসনিক কার্যক্রমে সর্বস্তরে প্রমিত বাংলা ভাষার প্রচলন নিশ্চিতকরণ অতীব গুরুত্বপূর্ণ। আধুনিক ডিজিটাল কার্যপরিবেশে তাৎক্ষণিক প্রতিবেদন প্রণয়ন, সরকারি প্রজ্ঞাপন জারি এবং তথ্য সংরক্ষণ প্রক্রিয়া দ্রুত ও নির্ভুল বাংলা স্পর্শ টাইপিংয়ের ওপর গভীরভাবে নির্ভরশীল।',
            minAccuracy: 98,
            minWpm: 46,
            xpReward: 600
          }
        ]
      }
    ],
    lessons: []
  },

  // ================= MODULE 19 =================
  {
    id: 'module-19',
    levelNumber: 19,
    title: 'সনদপত্র ও গ্র্যান্ডমাস্টার পরীক্ষা',
    titleEn: 'Module 19 — Official Competency Certification',
    badgeName: 'গ্র্যান্ডমাস্টার টাইপিস্ট',
    quoteBn: 'তোমার পরিশ্রম ও প্রতিভার চূড়ান্ত স্বীকৃতি — অফিশিয়াল কীলিপি বাংলা টাইপিং সনদপত্র।',
    description: 'ব্রোঞ্জ, সিলভার, গোল্ড ও গ্র্যান্ডমাস্টার সনদপত্র মূল্যায়ন পরীক্ষা ও আন্তর্জাতিক মানের সার্টিফিকেট অর্জন।',
    skills: ['ব্রোঞ্জ সনদপত্র (১৮ WPM)', 'সিলভার সনদপত্র (২৮ WPM)', 'গোল্ড সনদপত্র (৪০ WPM)', 'গ্র্যান্ডমাস্টার সনদপত্র (৫২ WPM)'],
    xpReward: 2000,
    units: [
      {
        id: 'unit-19-1',
        unitNumber: '19.1',
        title: 'সনদপত্র পরীক্ষা ও মূল্যায়ন',
        titleEn: 'Official Certification Benchmarks',
        description: '৪টি স্তরের সনদপত্র পরীক্ষা ও ভেরিফায়েবল সার্টিফিকেট জেনারেশন।',
        lessons: [
          {
            id: 'lesson-19-1-1',
            moduleId: 'module-19',
            unitId: 'unit-19-1',
            levelNumber: 19,
            title: '১৯.১.১ — গ্র্যান্ডমাস্টার টাইপিং সনদপত্র পরীক্ষা',
            titleEn: '19.1.1 Grandmaster Certification Assessment',
            summary: '৫২+ WPM ও ৯৮%+ নির্ভুলতায় ৫ মিনিটের চূড়ান্ত কমপ্রিহেনসিভ টেস্ট।',
            targetKeys: ['সনদপত্র', 'গ্র্যান্ডমাস্টার', 'বাংলা'],
            explanation: {
              bangla: 'এই চূড়ান্ত পরীক্ষায় উত্তীর্ণ হলে আপনি কীলিপি গ্র্যান্ডমাস্টার সনদপত্র অর্জন করবেন যা আপনার প্রোফাইলে চিরকাল ভাস্বর থাকবে।',
              english: 'Pass this final comprehensive 5-minute benchmark to earn the prestigious Grandmaster Certificate.',
              tips: ['পূর্ণ একাগ্রতা দিয়ে শুরু থেকে শেষ পর্যন্ত একই গতিতে টাইপ করুন']
            },
            drillText: 'আন্তর্জাতিক মাতৃভাষা দিবস আমাদের আত্মমর্যাদার প্রতীক। উনিশশো বাহান্ন সালের একুশে ফেব্রুয়ারি মাতৃভাষার অধিকার প্রতিষ্ঠার রক্তক্ষয়ী সংগ্রাম বিশ্বে বিরল দৃষ্টান্ত স্থাপন করেছে। তথ্যপ্রযুক্তির যুগে বাংলা ভাষার সঠিক ব্যবহার ও কম্পিউটার টাইপিংয়ে স্বনির্ভরতা অর্জন প্রতিটি নাগরিকের একান্ত দায়িত্ব। নিরবচ্ছিন্ন অনুশীলন ও প্রমিত বানানরীতির চর্চায় গড়ে ওঠে পূর্ণাঙ্গ ব্যুৎপত্তি।',
            practiceSentences: ['একুশে ফেব্রুয়ারি আমাদের জাতীয় অহংকার ও প্রেরণার উৎস।', 'বাংলা স্পর্শ টাইপিংয়ে গ্র্যান্ডমাস্টার দক্ষতা অর্জন একটি অনন্য কৃতিত্ব।', 'শুদ্ধ বানান ও দ্রুতগতির সমন্বয়ে গড়ে ওঠে শীর্ষ পেশাদারিত্ব।'],
            challengeText: 'আন্তর্জাতিক মাতৃভাষা দিবস আমাদের আত্মমর্যাদার প্রতীক। উনিশশো বাহান্ন সালের একুশে ফেব্রুয়ারি মাতৃভাষার অধিকার প্রতিষ্ঠার রক্তক্ষয়ী সংগ্রাম বিশ্বে বিরল দৃষ্টান্ত স্থাপন করেছে। তথ্যপ্রযুক্তির যুগে বাংলা ভাষার সঠিক ব্যবহার ও কম্পিউটার টাইপিংয়ে স্বনির্ভরতা অর্জন প্রতিটি নাগরিকের একান্ত দায়িত্ব। নিরবচ্ছিন্ন অনুশীলন ও প্রমিত বানানরীতির চর্চায় গড়ে ওঠে পূর্ণাঙ্গ ব্যুৎপত্তি।',
            minAccuracy: 98,
            minWpm: 50,
            xpReward: 1000
          }
        ]
      }
    ],
    lessons: []
  }
];

// Populate flattened lessons for each module from its units if empty
CURRICULUM_MODULES.forEach((mod) => {
  if (mod.units && mod.units.length > 0) {
    const flatLessons = mod.units.flatMap((u) => u.lessons);
    mod.lessons = flatLessons;
  }
});

export const getModuleLessons = (moduleId: string) => {
  const mod = CURRICULUM_MODULES.find((m) => m.id === moduleId);
  if (!mod) return [];
  return mod.lessons && mod.lessons.length > 0
    ? mod.lessons
    : (mod.units || []).flatMap((u) => u.lessons);
};

export const isModuleCompleted = (moduleId: string, completedLessons: string[] = []): boolean => {
  const lessons = getModuleLessons(moduleId);
  if (lessons.length === 0) return false;
  return lessons.every((l) => completedLessons.includes(l.id));
};
