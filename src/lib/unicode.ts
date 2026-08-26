/**
 * Robust Bangla Unicode segmentation, normalization, and comparison engine
 */

// Splits text into typable sequence of individual characters/codepoints
export function splitBanglaTypingTokens(text: string): string[] {
  if (!text) return [];
  const normalized = text.normalize('NFC');
  return Array.from(normalized);
}

// Grapheme cluster segmentation using Intl.Segmenter with regex fallback
export function splitBanglaGraphemes(text: string): string[] {
  if (!text) return [];

  // Normalize Unicode to NFC standard
  const normalized = text.normalize('NFC');

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as unknown as { Segmenter: new (lang: string, options: { granularity: string }) => { segment: (text: string) => Iterable<{ segment: string }> } }).Segmenter('bn', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(normalized), (s) => s.segment);
    } catch {
      // Fallback
    }
  }

  // Robust Regex fallback matching:
  // (Optional Ref) + Base Consonant/Vowel + (Nukta) + (Virama + Consonant)*(+ Matra/Vowel Sign)*(+ Anusvara/Bisarga/Chandrabindu) | Any other character
  const banglaGraphemeRegex = /(?:\u09B0\u09CD)?[\u0985-\u09B9\u09CE\u09DF-\u09E1]\u09BC?(?:\u09CD[\u0985-\u09B9\u09DF-\u09E1]\u09BC?)*(?:[\u09BE-\u09CC\u09D7\u09E2\u09E3])?(?:[\u0981-\u0983])?|[\s\S]/gu;
  const matches = normalized.match(banglaGraphemeRegex);
  return matches && matches.length > 0 ? matches : Array.from(normalized);
}

// Computes length in Standard Bangla Word Units (4 grapheme clusters = 1 standard word)
export function countBanglaWords(graphemeCount: number): number {
  return Math.max(1, Math.round(graphemeCount / 4));
}

// Calculate Net WPM
export function calculateWpm(
  correctGraphemes: number,
  uncorrectedErrors: number,
  elapsedSeconds: number
): { netWpm: number; rawWpm: number; cpm: number } {
  if (elapsedSeconds <= 0) return { netWpm: 0, rawWpm: 0, cpm: 0 };
  const minutes = elapsedSeconds / 60;
  const standardWordsCorrect = correctGraphemes / 4;
  const rawWpm = Math.round(standardWordsCorrect / minutes);
  const netWpm = Math.max(0, Math.round((standardWordsCorrect - uncorrectedErrors) / minutes));
  const cpm = Math.round(correctGraphemes / minutes);
  return { netWpm, rawWpm, cpm };
}

// Bijoy Swaroborno auto-composer helper (when pressing virama G followed by Kar)
export const BIJOY_VOWEL_COMPOSITIONS: Record<string, string> = {
  '্+া': 'আ',
  '্+ি': 'ই',
  '্+ী': 'ঈ',
  '্+ু': 'উ',
  '্+ূ': 'ঊ',
  '্+ৃ': 'ঋ',
  '্+ে': 'এ',
  '্+ৈ': 'ঐ',
  '্+ৌ': 'ঔ'
};

// Detailed feedback for mistakes
export interface MistakeDiagnostic {
  expected: string;
  actual: string;
  explanationBn: string;
  explanationEn: string;
  remedyBn: string;
}

export function diagnoseMistake(expected: string, actual: string, keyboard: 'avro' | 'bijoy' | 'jatiya'): MistakeDiagnostic {
  if (expected === ' ' && actual !== ' ') {
    return {
      expected: 'স্পেসবার (Space)',
      actual: actual,
      explanationBn: 'এখানে স্পেস দেওয়া প্রয়োজন ছিল।',
      explanationEn: 'A space was expected here.',
      remedyBn: 'বৃদ্ধাঙ্গুলি (Thumb) দিয়ে স্পেসবারে আলতো চাপ দিন।'
    };
  }

  // Kar specific guidance
  const karMap: Record<string, { name: string; keyBijoy: string; keyAvro: string }> = {
    'া': { name: 'আ-কার', keyBijoy: 'f', keyAvro: 'a' },
    'ি': { name: 'ই-কার (হ্রস্ব)', keyBijoy: 'd', keyAvro: 'i' },
    'ী': { name: 'ঈ-কার (দীর্ঘ)', keyBijoy: 'Shift + D', keyAvro: 'I / ee' },
    'ু': { name: 'উ-কার (হ্রস্ব)', keyBijoy: 's', keyAvro: 'u' },
    'ূ': { name: 'ঊ-কার (দীর্ঘ)', keyBijoy: 'Shift + S', keyAvro: 'U / oo' },
    'ৃ': { name: 'ঋ-কার', keyBijoy: 'a', keyAvro: 'rri' },
    'ে': { name: 'এ-কার', keyBijoy: 'c', keyAvro: 'e' },
    'ৈ': { name: 'ঐ-কার', keyBijoy: 'Shift + C', keyAvro: 'OI' },
    'ো': { name: 'ও-কার', keyBijoy: 'c + f', keyAvro: 'o' },
    'ৌ': { name: 'ঔ-কার', keyBijoy: 'Shift + X', keyAvro: 'OU' },
    '্': { name: 'হসন্ত / লিঙ্ক', keyBijoy: 'g', keyAvro: ',,' }
  };

  if (karMap[expected]) {
    const k = karMap[expected];
    return {
      expected: `${expected} (${k.name})`,
      actual,
      explanationBn: `প্রত্যাশিত কার-চিহ্ন '${expected}' (${k.name})। বিজয় কীবোর্ডে কি '${k.keyBijoy}' চাপুন।`,
      explanationEn: `Expected vowel sign '${expected}'. In Bijoy, press key '${k.keyBijoy}'.`,
      remedyBn: `ব্যঞ্জনবর্ণ টাইপ করার পর অবিলম্বে '${k.keyBijoy}' কি চাপুন।`
    };
  }

  // Swaroborno guidance
  const swaroMap: Record<string, string> = {
    'অ': 'Shift + F',
    'আ': 'g + f (হসন্ত + আকার)',
    'ই': 'g + d (হসন্ত + ইকার)',
    'ঈ': 'g + Shift+D',
    'উ': 'g + s (হসন্ত + উকার)',
    'ঊ': 'g + Shift+S',
    'ঋ': 'g + a (হসন্ত + ঋকার)',
    'এ': 'g + c (হসন্ত + একার)',
    'ঐ': 'g + Shift+C',
    'ও': 'x',
    'ঔ': 'g + Shift+X'
  };

  if (swaroMap[expected]) {
    return {
      expected: `${expected} (স্বরবর্ণ)`,
      actual,
      explanationBn: `স্বরবর্ণ '${expected}' টাইপ করার বিজয় নিয়ম: ${swaroMap[expected]}`,
      explanationEn: `To type vowel '${expected}' in Bijoy: press ${swaroMap[expected]}.`,
      remedyBn: `প্রথমে 'g' (হসন্ত) চাপুন, তারপর সংশ্লিষ্ট কার-চিহ্ন কি চাপুন।`
    };
  }

  if (expected.includes('্') || expected.length > 1) {
    if (keyboard === 'bijoy') {
      return {
        expected,
        actual,
        explanationBn: `এটি একটি যুক্তাক্ষর (${expected})। বিজয় কীবোর্ডে হসন্ত কি 'g' দিয়ে যুক্ত করতে হয়।`,
        explanationEn: `This is a conjunct (${expected}). In Bijoy, link with virama key 'g'.`,
        remedyBn: `প্রথম বর্ণ টাইপ করুন, তারপর 'g' চাপুন, এরপর পরবর্তী বর্ণ চাপুন।`
      };
    } else {
      return {
        expected,
        actual,
        explanationBn: `এটি একটি যুক্তাক্ষর (${expected})। অভ্রতে ফোনেটিক রোমান হরফ সঠিকভাবে লিখুন।`,
        explanationEn: `This is a conjunct (${expected}). Type the phonetic characters in Avro.`,
        remedyBn: `বানান লক্ষ্য করে ক্রমানুসারে টাইপ করুন।`
      };
    }
  }

  return {
    expected,
    actual,
    explanationBn: `প্রত্যাশিত বর্ণ ছিল '${expected}', কিন্তু টাইপ হয়েছে '${actual}'।`,
    explanationEn: `Expected '${expected}', but typed '${actual}'.`,
    remedyBn: `কীবোর্ডে নির্দেশিত আঙুলটি সঠিক কীতে অবস্থান করুন।`
  };
}
