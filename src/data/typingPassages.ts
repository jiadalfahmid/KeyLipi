export interface TypingPassage {
  id: string;
  category: 'easy' | 'general' | 'literature' | 'news' | 'office' | 'juktakkhor';
  categoryNameBn: string;
  titleBn: string;
  titleEn: string;
  authorOrSource: string;
  text: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
}

export const TYPING_PASSAGES: TypingPassage[] = [
  {
    id: 'easy-1',
    category: 'easy',
    categoryNameBn: 'সহজ বাংলা',
    titleBn: 'আমাদের সুন্দর গ্রাম',
    titleEn: 'Our Beautiful Village',
    authorOrSource: 'প্রাথমিক পাঠমালা',
    text: 'আমাদের গ্রামখানি ছবির মতো সুন্দর। গ্রামের পাশ দিয়ে একটি ছোট নদী বয়ে গেছে। সকাল বেলা পাখি ডাকে, ফুল ফোটে এবং মিষ্টি বাতাস বয়। চাষিরা সকালে লাঙ্গল নিয়ে মাঠে যায়। রাখাল ছেলে মাঠে গরু চড়ায়।',
    difficulty: 'beginner'
  },
  {
    id: 'easy-2',
    category: 'easy',
    categoryNameBn: 'সহজ বাংলা',
    titleBn: 'বই পড়ার আনন্দ',
    titleEn: 'The Joy of Reading',
    authorOrSource: 'শিশু সাহিত্য',
    text: 'বই মানুষের পরম বন্ধু। ভালো বই আমাদের জ্ঞান বাড়ায় এবং মনকে আনন্দ দেয়। অবসর সময়ে গল্প ও কবিতার বই পড়া একটি চমৎকার অভ্যাস। লাইব্রেরিতে গেলে হাজারো সুন্দর বইয়ের সন্ধান মেলে।',
    difficulty: 'beginner'
  },
  {
    id: 'easy-3',
    category: 'easy',
    categoryNameBn: 'সহজ বাংলা',
    titleBn: 'শীতের সকালের মিষ্টি রোদ',
    titleEn: 'Winter Morning Sunlight',
    authorOrSource: 'প্রকৃতি কথা',
    text: 'শীতের সকালে চারদিক ঘন কুয়াশায় ঢাকা থাকে। ঘাসের ডগায় জমে থাকা শিশিরবিন্দু মুক্তোর মতো চিকচিক করে। মিষ্টি রোদে বসে চা খাওয়ার আনন্দ অতুলনীয়। খেজুরের কাঁচা রস শীতের এক অপরূপ উপহার।',
    difficulty: 'beginner'
  },
  {
    id: 'easy-4',
    category: 'easy',
    categoryNameBn: 'সহজ বাংলা',
    titleBn: 'নদীর কলতান ও মাঝি',
    titleEn: 'River Melody',
    authorOrSource: 'লোক সংস্কৃতি',
    text: 'নদীর বুকে পাল তুলে নৌকা চলে যায়। মাঝিমাল্লারা ভাটিয়ালি গান গেয়ে মন জুড়িয়ে দেয়। নদীর দুই তীরে কাশফুল দোলে। জেলেরা জাল ফেলে রূপালী মাছ ধরে। শান্ত নদীর এমন রূপ মনকে প্রশান্তিতে ভরিয়ে তোলে।',
    difficulty: 'beginner'
  },
  {
    id: 'general-1',
    category: 'general',
    categoryNameBn: 'সাধারণ বাংলা',
    titleBn: 'ডিজিটাল বাংলাদেশের অগ্রগতি',
    titleEn: 'Digital Progress',
    authorOrSource: 'বিজ্ঞান ও প্রযুক্তি সাময়িকী',
    text: 'তথ্যপ্রযুক্তির অভাবনীয় অগ্রগতির ফলে আজ মানুষের জীবনযাত্রা অনেক সহজ ও গতিশীল হয়েছে। ঘরে বসেই মানুষ দেশ-বিদেশের খবর জানতে পারছে এবং শিক্ষা, স্বাস্থ্য ও ব্যাংকিং সেবা গ্রহণ করছে। বাংলা ভাষার সঠিক ডিজিটাল প্রয়োগ ভবিষ্যৎ প্রজন্মের জন্য অত্যন্ত প্রয়োজন।',
    difficulty: 'intermediate'
  },
  {
    id: 'general-2',
    category: 'general',
    categoryNameBn: 'সাধারণ বাংলা',
    titleBn: 'দৈনন্দিন জীবনে সময় সচেতনতা',
    titleEn: 'Value of Time in Daily Life',
    authorOrSource: 'জীবন গঠন ও উন্নয়ন',
    text: 'সময়ানুবর্তিতা সফলতার অন্যতম প্রধান চাবিকাঠি। যিনি সময়ের সঠিক সদ্ব্যবহার করেন, তিনি জীবনে কাঙ্ক্ষিত লক্ষ্যে পৌঁছাতে পারেন। নিয়মিত কাজ নির্দিষ্ট সময়ে সম্পন্ন করার অভ্যাস মানুষকে দায়িত্ববান ও কর্মনিষ্ঠ করে তোলে।',
    difficulty: 'intermediate'
  },
  {
    id: 'general-3',
    category: 'general',
    categoryNameBn: 'সাধারণ বাংলা',
    titleBn: 'স্বাস্থ্য সুরক্ষা ও সুষম খাদ্য',
    titleEn: 'Health & Balanced Diet',
    authorOrSource: 'জনস্বাস্থ্য ও পুষ্টি বিজ্ঞান',
    text: 'সুস্বাস্থ্য সকল সুখের মূল। প্রতিদিন পরিমিত পুষ্টিকর খাদ্য গ্রহণ, পর্যাপ্ত বিশুদ্ধ পানি পান এবং নিয়মিত শরীরচর্চা রোগ প্রতিরোধ ক্ষমতা বাড়ায়। শারীরিক ও মানসিক সুস্থতা বজায় থাকলে যেকোনো কাজে মনোযোগ ও দক্ষতা বহুগুণ বৃদ্ধি পায়।',
    difficulty: 'intermediate'
  },
  {
    id: 'literature-1',
    category: 'literature',
    categoryNameBn: 'বাংলা সাহিত্য',
    titleBn: 'গীতাঞ্জলি — চিত্ত যেথা ভয়শূন্য',
    titleEn: 'Gitanjali Excerpt',
    authorOrSource: 'রবীন্দ্রনাথ ঠাকুর',
    text: 'চিত্ত যেথা ভয়শূন্য, উচ্চ যেথা শির, জ্ঞান যেথা মুক্ত, যেথা গৃহের প্রাচীর আপন প্রাঙ্গণতলে দিবসশর্বরী বসুধারে রাখে নাই খণ্ড ক্ষুদ্র করি, যেথা বাক্য হৃদয়ের উৎসমুখ হতে উচ্ছ্বসিয়া উঠে, যেথা নির্বারিত স্রোতে দেশে দেশে দিশে দিশে কর্মধারা ধায় অজস্র সহস্রবিধ চরিতার্থতায়।',
    difficulty: 'expert'
  },
  {
    id: 'literature-2',
    category: 'literature',
    categoryNameBn: 'বাংলা সাহিত্য',
    titleBn: 'বিদ্রোহী কবিতাংশ',
    titleEn: 'The Rebel Poem',
    authorOrSource: 'কাজী নজরুল ইসলাম',
    text: 'বল বীর, বল উন্নত মম শির! শির নেহারি আমারি নতশির ওই শিখর হিমাদ্রির! বল বীর, বল মহাবিশ্বের মহাকাশ ফাড়ি চন্দ্র সূর্য গ্রহ তারা ছাড়ি ভূলোক দ্যুলোক গোলক ভেদিয়া খোদার আসন আরশ ছেদিয়া উঠিয়াছি চির-বিস্ময় আমি বিশ্ববিধাতৃর!',
    difficulty: 'expert'
  },
  {
    id: 'literature-3',
    category: 'literature',
    categoryNameBn: 'বাংলা সাহিত্য',
    titleBn: 'রূপসী বাংলা — আবার আসিব ফিরে',
    titleEn: 'Ruposhi Bangla',
    authorOrSource: 'জীবনানন্দ দাশ',
    text: 'আবার আসিব ফিরে ধানসিঁড়িটির তীরে এই বাংলায়, হয়তো মানুষ নয় হয়তো বা শঙ্খচিল শালিকের বেশে, হয়তো ভোরের কাক হয়ে এই কার্তিকের নবান্নের দেশে কুয়াশার বুকে ভেসে একদিন আসিব এ কাঁঠাল-ছায়ায়।',
    difficulty: 'intermediate'
  },
  {
    id: 'literature-4',
    category: 'literature',
    categoryNameBn: 'বাংলা সাহিত্য',
    titleBn: 'আমার ভাইয়ের রক্তে রাঙানো',
    titleEn: 'Language Movement Anthem',
    authorOrSource: 'আব্দুল গাফফার চৌধুরী',
    text: 'আমার ভাইয়ের রক্তে রাঙানো একুশে ফেব্রুয়ারি, আমি কি ভুলিতে পারি। ছেলেহারা শত মায়ের অশ্রু-গড়া এ ফেব্রুয়ারি, আমি কি ভুলিতে পারি। রক্তে আমার চব্বিশের রক্তঝরা মিছিলের সুর জাগে, জাগে ক্রান্তির বজ্রধ্বনি।',
    difficulty: 'intermediate'
  },
  {
    id: 'news-1',
    category: 'news',
    categoryNameBn: 'সংবাদ ও সমসাময়িক',
    titleBn: 'পরিবেশ সুরক্ষায় বৃক্ষরোপণ অভিযান',
    titleEn: 'Environmental News',
    authorOrSource: 'জাতীয় দৈনিক',
    text: 'বৈশ্বিক উষ্ণায়ন ও জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব মোকাবিলায় দেশজুড়ে ব্যাপক বৃক্ষরোপণ কর্মসূচি গ্রহণ করা হয়েছে। প্রাকৃতিক ভারসাম্য রক্ষা এবং আগামী প্রজন্মের জন্য একটি বাসযোগ্য সবুজ পৃথিবী গড়ে তুলতে বনায়ন কার্যক্রমের বিকল্প নেই।',
    difficulty: 'intermediate'
  },
  {
    id: 'news-2',
    category: 'news',
    categoryNameBn: 'সংবাদ ও সমসাময়িক',
    titleBn: 'মহাকাশ গবেষণা ও আধুনিক বিজ্ঞান',
    titleEn: 'Space Exploration News',
    authorOrSource: 'আন্তর্জাতিক বিজ্ঞান ডেস্ক',
    text: 'আধুনিক কৃত্রিম উপগ্রহ এবং মহাকাশ টেলিস্কোপ দূরবর্তী ছায়াপথগুলোর অভূতপূর্ব চিত্র প্রেরণ করছে। নতুন গ্রহের সন্ধান ও সৌরজগতের রহস্য উদঘাটনে বিজ্ঞানীরা নিরলস গবেষণা চালিয়ে যাচ্ছেন। বৈজ্ঞানিক অনুসন্ধান মানবজাতির জ্ঞানভাণ্ডারকে সমৃদ্ধ করছে।',
    difficulty: 'intermediate'
  },
  {
    id: 'office-1',
    category: 'office',
    categoryNameBn: 'দাপ্তরিক ও প্রাতিষ্ঠানিক',
    titleBn: 'অফিসিয়াল সার্কুলার ও নোটিশ',
    titleEn: 'Official Office Notice',
    authorOrSource: 'প্রশাসন বিভাগ',
    text: 'এতদ্বারা সংশ্লিষ্ট সকলের অবগতির জন্য জানানো যাচ্ছে যে, আগামী ২৬শে মার্চ মহান স্বাধীনতা ও জাতীয় দিবস যথাযোগ্য মর্যাদায় উদযাপিত হবে। উক্ত দিবসে সকল কর্মকর্তা ও কর্মচারীকে সকাল ৮:৩০ ঘটিকায় প্রধান কার্যালয়ের মিলনায়তনে উপস্থিত থাকার জন্য অনুরোধ করা হলো।',
    difficulty: 'intermediate'
  },
  {
    id: 'office-2',
    category: 'office',
    categoryNameBn: 'দাপ্তরিক ও প্রাতিষ্ঠানিক',
    titleBn: 'প্রশাসনিক বিজ্ঞপ্তি ও আর্থিক নিয়মাবলী',
    titleEn: 'Administrative Memo',
    authorOrSource: 'অর্থ ও হিসাব শাখা',
    text: 'চলতি অর্থবৎসরের বার্ষিক নিরীক্ষা কার্যক্রম আগামী পহেলা এপ্রিল হতে শুরু হবে। সকল বিভাগীয় প্রধানকে যাবতীয় ভাউচার ও নথিপত্র যথাযথভাবে প্রস্তুত করে অডিট কমিটির নিকট যথাসময়ে উপস্থাপন করার জন্য নির্দেশ প্রদান করা যাচ্ছে।',
    difficulty: 'intermediate'
  },
  {
    id: 'juktakkhor-1',
    category: 'juktakkhor',
    categoryNameBn: 'যুক্তাক্ষর ড্রিল',
    titleBn: 'জটিল যুক্তবর্ণের সমন্বয়',
    titleEn: 'Juktakkhor Intensive Drill',
    authorOrSource: 'উন্নত টাইপিং প্রশিক্ষণ',
    text: 'বিজ্ঞান ও দর্শনের প্রাজ্ঞ অনুসন্ধিৎসা মানুষকে অন্ধবিশ্বাস ও অজ্ঞতার অন্ধকার থেকে মুক্ত করে। স্বাধীনতা সংগ্রাম ও মুক্তিযুদ্ধের রক্তাক্ত ইতিহাস আমাদের জাতির অহংকার। ব্রাহ্মণবাড়িয়া, রাষ্ট্রবিজ্ঞান, আকাঙ্ক্ষা ও তীক্ষ্ণ বিশ্লেষণের সংমিশ্রণে সমৃদ্ধি অর্জিত হয়।',
    difficulty: 'expert'
  },
  {
    id: 'juktakkhor-2',
    category: 'juktakkhor',
    categoryNameBn: 'যুক্তাক্ষর ড্রিল',
    titleBn: 'উচ্চতর সংযুক্ত ব্যঞ্জনবর্ণ',
    titleEn: 'High-Level Conjunct Consonants',
    authorOrSource: 'ভাষাতত্ত্ব গবেষণা',
    text: 'সুক্ষ্ম দৃষ্টিকোণ, অক্ষুণ্ণ শ্রদ্ধা এবং নিষ্কলঙ্ক চরিত্রের অধিকারী ব্যক্তি সমাজে পথপ্রদর্শক হিসেবে স্বীকৃতি পান। রাষ্ট্রপতি ও প্রধানমন্ত্রীর সমন্বিত উদ্যোগে জাতীয় উন্নয়ন ত্বরান্বিত হচ্ছে। আন্তর্জাতিক চুক্তি বাস্তবায়নে সুস্পষ্ট দিকনির্দেশনা আবশ্যক।',
    difficulty: 'expert'
  }
];

/**
 * Pick a random passage from the pool, optionally avoiding an exclude ID or matching category
 */
export const getRandomPassage = (excludeId?: string, category?: string): TypingPassage => {
  let pool = TYPING_PASSAGES;
  if (category && category !== 'all') {
    const filtered = pool.filter((p) => p.category === category);
    if (filtered.length > 0) pool = filtered;
  }
  const available = pool.filter((p) => p.id !== excludeId);
  if (available.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)] || TYPING_PASSAGES[0];
  }
  return available[Math.floor(Math.random() * available.length)];
};
