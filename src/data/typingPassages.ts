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
    id: 'juktakkhor-1',
    category: 'juktakkhor',
    categoryNameBn: 'যুক্তাক্ষর ড্রিল',
    titleBn: 'জটিল যুক্তবর্ণের সমন্বয়',
    titleEn: 'Juktakkhor Intensive Drill',
    authorOrSource: 'উন্নত টাইপিং প্রশিক্ষণ',
    text: 'বিজ্ঞান ও দর্শনের প্রাজ্ঞ অনুসন্ধিৎসা মানুষকে অন্ধবিশ্বাস ও অজ্ঞতার অন্ধকার থেকে মুক্ত করে। স্বাধীনতা সংগ্রাম ও মুক্তিযুদ্ধের রক্তাক্ত ইতিহাস আমাদের জাতির অহংকার। ব্রাহ্মণবাড়িয়া, রাষ্ট্রবিজ্ঞান, আকাঙ্ক্ষা ও তীক্ষ্ণ বিশ্লেষণের সংমিশ্রণে সমৃদ্ধি অর্জিত হয়।',
    difficulty: 'expert'
  }
];
