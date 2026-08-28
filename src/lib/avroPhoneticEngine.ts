/**
 * Comprehensive Avro Phonetic Transliteration Engine for In-Browser Bangla Typing
 * Complies with the official OmicronLab Avro Phonetic transliteration standard.
 */

import { canonicalizeBanglaUnicode } from './unicode';

// Basic single and double character consonants
export const AVRO_CONSONANT_MAP: Record<string, string> = {
  k: 'ক',
  kh: 'খ',
  g: 'গ',
  gh: 'ঘ',
  Ng: 'ঙ',
  ng: 'ং',
  c: 'চ',
  ch: 'ছ',
  chh: 'ছ',
  j: 'জ',
  jh: 'ঝ',
  NG: 'ঞ',
  T: 'ট',
  Th: 'ঠ',
  D: 'ড',
  Dh: 'ঢ',
  N: 'ণ',
  t: 'ত',
  th: 'থ',
  d: 'দ',
  dh: 'ধ',
  n: 'ন',
  p: 'প',
  f: 'ফ',
  ph: 'ফ',
  b: 'ব',
  bh: 'ভ',
  v: 'ভ',
  m: 'ম',
  z: 'য',
  Z: 'ঝ',
  r: 'র',
  R: 'ড়',
  Rh: 'ঢ়',
  l: 'ল',
  sh: 'শ',
  S: 'শ',
  Sh: 'ষ',
  s: 'স',
  h: 'হ',
  y: 'য়',
  Y: 'য়',
  w: 'ও',
  W: 'ও'
};

// Independent Vowels at word start / standalone (Swaroborno)
export const AVRO_INDEPENDENT_VOWELS: Record<string, string> = {
  o: 'অ',
  A: 'অ',
  a: 'আ',
  aa: 'আ',
  i: 'ই',
  I: 'ঈ',
  ee: 'ঈ',
  u: 'উ',
  U: 'ঊ',
  oo: 'ঊ',
  e: 'এ',
  E: 'এ',
  oi: 'ঐ',
  OI: 'ঐ',
  Oi: 'ঐ',
  O: 'ও',
  w: 'ও',
  ou: 'ঔ',
  OU: 'ঔ',
  Ou: 'ঔ',
  rri: 'ঋ',
  RRI: 'ঋ',
  ri: 'ঋ',
  RI: 'ঋ'
};

// Vowel signs (Kar) attached to preceding consonants
export const AVRO_KAR_MAP: Record<string, string> = {
  a: 'া',
  aa: 'া',
  i: 'ি',
  I: 'ী',
  ee: 'ী',
  u: 'ু',
  U: 'ূ',
  oo: 'ূ',
  e: 'ে',
  E: 'ে',
  oi: 'ৈ',
  OI: 'ৈ',
  Oi: 'ৈ',
  o: 'ো',
  O: 'ো',
  ou: 'ৌ',
  OU: 'ৌ',
  Ou: 'ৌ',
  rri: 'ৃ',
  RRI: 'ৃ',
  ri: 'ৃ'
};

// Comprehensive Avro conjunct patterns (sorted by key length during matching)
export const AVRO_CONJUNCTS: Record<string, string> = {
  // 4-character combinations
  kkhm: 'ক্ষ্ম',
  kkhy: 'ক্ষ্য',
  kkhw: 'ক্ষ্ব',
  kkhN: 'ক্ষ্ণ',
  nggh: 'ঙ্ঘ',
  ngkh: 'ঙ্খ',
  nchh: 'ঞ্ছ',
  shchch: 'শ্ছ',
  shch: 'শ্চ',

  // 3-character combinations
  kkh: 'ক্ষ',
  kSh: 'ক্ষ',
  jn: 'জ্ঞ',
  jN: 'জ্ঞ',
  ngk: 'ঙ্ক',
  ngg: 'ঙ্গ',
  nch: 'ঞ্চ',
  njh: 'ঞ্ঝ',
  nj: 'ঞ্জ',
  NTh: 'ণ্ঠ',
  NDh: 'ণ্ঢ',
  nth: 'ন্থ',
  ndh: 'ন্ধ',
  bdh: 'ব্ধ',
  bht: 'ভ্ত',
  bhy: 'ভ্য',
  bhr: 'ভ্র',
  bhw: 'ভ্ব',
  mph: 'ম্ফ',
  mbh: 'ম্ভ',
  sth: 'স্থ',
  sph: 'স্ফ',
  skh: 'স্খ',
  shn: 'শ্ন',
  shm: 'শ্ম',
  shr: 'শ্র',
  shl: 'শ্ল',
  shw: 'শ্ব',
  shy: 'শ্য',
  Shk: 'স্ক',
  Shkh: 'ষ্খ',
  ShT: 'ষ্ট',
  ShTh: 'ষ্ঠ',
  ShN: 'ষ্ণ',
  Shp: 'ষ্প',
  Shph: 'ষ্ফ',
  Shm: 'ষ্ম',
  Shy: 'ষ্য',
  Shw: 'ষ্ব',
  gdh: 'গ্ধ',
  ghn: 'ঘ্ন',
  ghr: 'ঘ্র',
  ghy: 'ঘ্য',
  chchh: 'চ্ছ',
  jjh: 'জ্ঝ',
  chch: 'চ্চ',

  // 2-character combinations
  kt: 'ক্ত',
  kr: 'ক্র',
  kl: 'ক্ল',
  kw: 'ক্ব',
  ky: 'ক্য',
  ks: 'ক্স',
  gd: 'গ্দ',
  gn: 'গ্ন',
  gb: 'গ্ব',
  gm: 'গ্ম',
  gr: 'গ্র',
  gl: 'গ্ল',
  gw: 'গ্ব',
  gy: 'গ্য',
  chw: 'চ্ব',
  chy: 'চ্য',
  jj: 'জ্জ',
  jw: 'জ্ব',
  jy: 'জ্য',
  jr: 'জ্র',
  TT: 'ট্ট',
  Tr: 'ট্র',
  Tw: 'ট্ব',
  Ty: 'ট্য',
  DD: 'ড্ড',
  Dr: 'ড্র',
  Dw: 'ড্ব',
  Dy: 'ড্য',
  NT: 'ণ্ট',
  ND: 'ণ্ড',
  NN: 'ণ্ণ',
  tt: 'ত্ত',
  tr: 'ত্র',
  tw: 'ত্ব',
  ty: 'ত্য',
  tm: 'ত্ম',
  dd: 'দ্দ',
  ddh: 'দ্ধ',
  dr: 'দ্র',
  dw: 'দ্ব',
  dy: 'দ্য',
  dm: 'দ্ম',
  nt: 'ন্ত',
  nd: 'ন্দ',
  nn: 'ন্ন',
  nm: 'ন্ম',
  ny: 'ন্য',
  nw: 'ন্ব',
  pt: 'প্ত',
  pn: 'প্ন',
  pp: 'প্প',
  pl: 'প্ল',
  pr: 'প্র',
  ps: 'প্স',
  py: 'প্য',
  pw: 'প্ব',
  bd: 'ব্দ',
  bb: 'ব্ব',
  bl: 'ব্ল',
  br: 'ব্র',
  by: 'ব্য',
  bw: '্ব',
  mn: 'ম্ন',
  mp: 'ম্প',
  mb: 'ম্ব',
  mm: 'ম্ম',
  ml: 'ম্ল',
  mr: 'ম্র',
  my: 'ম্য',
  mw: 'ম্ব',
  st: 'স্ত',
  sn: 'স্ন',
  sp: 'স্প',
  sm: 'স্ম',
  sy: 'স্য',
  sr: 'স্র',
  sl: 'স্ল',
  sk: 'স্ক',
  sw: 'স্ব',
  hn: 'হ্ন',
  hN: 'হ্ণ',
  hm: 'হ্ম',
  hl: 'হ্ল',
  hr: 'হ্র',
  hy: 'হ্য',
  hw: 'হ্ব'
};

// Special Avro modifiers and punctuations
export const AVRO_SPECIAL_MAP: Record<string, string> = {
  ':': 'ঃ',
  H: 'ঃ',
  '^': 'ঁ',
  '.': '।',
  '..': '্',
  ',,': '্',
  ',': '্',
  '`': '', // vowel breaker
  "t`": 'ৎ',
  't,,': 'ৎ',
  '$': '৳',
  '|': '।'
};

/**
 * Phonetically translates an Avro Roman string into Bengali Unicode.
 */
export function transliterateAvro(input: string): string {
  if (!input) return '';

  let output = '';
  let i = 0;
  const len = input.length;
  let prevWasConsonant = false;

  while (i < len) {
    // 1. Check 4-character combinations
    const four = input.substring(i, i + 4);
    if (AVRO_CONJUNCTS[four]) {
      output += AVRO_CONJUNCTS[four];
      i += 4;
      prevWasConsonant = true;
      continue;
    }

    // 2. Check 3-character combinations
    const three = input.substring(i, i + 3);
    if (AVRO_CONJUNCTS[three]) {
      output += AVRO_CONJUNCTS[three];
      i += 3;
      prevWasConsonant = true;
      continue;
    }
    if (three.toLowerCase() === 'rri') {
      output += prevWasConsonant ? 'ৃ' : 'ঋ';
      i += 3;
      prevWasConsonant = false;
      continue;
    }

    // 3. Check 2-character combinations
    const two = input.substring(i, i + 2);
    if (AVRO_SPECIAL_MAP[two] !== undefined) {
      output += AVRO_SPECIAL_MAP[two];
      i += 2;
      prevWasConsonant = false;
      continue;
    }
    if (AVRO_CONJUNCTS[two]) {
      output += AVRO_CONJUNCTS[two];
      i += 2;
      prevWasConsonant = true;
      continue;
    }
    if (AVRO_KAR_MAP[two] && prevWasConsonant) {
      output += AVRO_KAR_MAP[two];
      i += 2;
      prevWasConsonant = false;
      continue;
    }
    if (AVRO_INDEPENDENT_VOWELS[two]) {
      output += AVRO_INDEPENDENT_VOWELS[two];
      i += 2;
      prevWasConsonant = false;
      continue;
    }
    if (AVRO_CONSONANT_MAP[two]) {
      output += AVRO_CONSONANT_MAP[two];
      i += 2;
      prevWasConsonant = true;
      continue;
    }

    // 4. Single character
    const one = input.charAt(i);

    if (one === ' ') {
      output += ' ';
      prevWasConsonant = false;
      i++;
      continue;
    }

    if (AVRO_SPECIAL_MAP[one] !== undefined) {
      output += AVRO_SPECIAL_MAP[one];
      prevWasConsonant = false;
      i++;
      continue;
    }

    if (AVRO_KAR_MAP[one] && prevWasConsonant) {
      // Inherent vowel logic: if 'o' is typed after consonant, leave as inherent unless capital O
      if (one === 'o') {
        output += 'ো';
      } else {
        output += AVRO_KAR_MAP[one];
      }
      prevWasConsonant = false;
      i++;
      continue;
    }

    if (AVRO_INDEPENDENT_VOWELS[one]) {
      output += AVRO_INDEPENDENT_VOWELS[one];
      prevWasConsonant = false;
      i++;
      continue;
    }

    if (AVRO_CONSONANT_MAP[one]) {
      output += AVRO_CONSONANT_MAP[one];
      prevWasConsonant = true;
      i++;
      continue;
    }

    // Default passthrough
    output += one;
    prevWasConsonant = false;
    i++;
  }

  return canonicalizeBanglaUnicode(output);
}

/**
 * Maps a single keystroke or small buffer in Avro mode to determine if it completes
 * the expected Bangla token or grapheme.
 */
export function matchAvroKeystroke(
  typedKey: string,
  expectedChar: string,
  buffer: string = '',
  targetGrapheme?: string
): {
  isMatch: boolean;
  producedBangla: string;
  newBuffer: string;
  consumed: boolean;
  isPrefix: boolean;
} {
  const expectedNorm = canonicalizeBanglaUnicode(expectedChar);
  const targetNorm = targetGrapheme ? canonicalizeBanglaUnicode(targetGrapheme) : expectedNorm;
  const combined = buffer + typedKey;
  const transliteratedCombined = canonicalizeBanglaUnicode(transliterateAvro(combined));

  // 1. Direct match with combined transliteration
  if (
    transliteratedCombined === expectedNorm ||
    transliteratedCombined === targetNorm ||
    transliteratedCombined.endsWith(expectedNorm)
  ) {
    return {
      isMatch: true,
      producedBangla: transliteratedCombined,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  // 2. Direct single key transliteration match
  const singleTransliterated = canonicalizeBanglaUnicode(transliterateAvro(typedKey));
  if (singleTransliterated === expectedNorm || singleTransliterated === targetNorm) {
    return {
      isMatch: true,
      producedBangla: singleTransliterated,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  // 3. Check Vowel Signs (Kar) map for combined and single key
  const karCombined = AVRO_KAR_MAP[combined] || AVRO_KAR_MAP[combined.toLowerCase()];
  if (karCombined === expectedNorm) {
    return {
      isMatch: true,
      producedBangla: karCombined,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  const karSingle = AVRO_KAR_MAP[typedKey] || AVRO_KAR_MAP[typedKey.toLowerCase()];
  if (karSingle === expectedNorm && buffer === '') {
    return {
      isMatch: true,
      producedBangla: karSingle,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  // 4. Check Independent Vowels
  const indVowelCombined = AVRO_INDEPENDENT_VOWELS[combined];
  if (indVowelCombined === expectedNorm || indVowelCombined === targetNorm) {
    return {
      isMatch: true,
      producedBangla: indVowelCombined,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  const indVowelSingle = AVRO_INDEPENDENT_VOWELS[typedKey];
  if ((indVowelSingle === expectedNorm || indVowelSingle === targetNorm) && buffer === '') {
    return {
      isMatch: true,
      producedBangla: indVowelSingle,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  // 5. Check Consonants & Conjuncts
  const conjCombined = AVRO_CONJUNCTS[combined] || AVRO_CONSONANT_MAP[combined];
  if (conjCombined === expectedNorm || conjCombined === targetNorm) {
    return {
      isMatch: true,
      producedBangla: conjCombined,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  // 6. Check Special Characters
  const specialCombined = AVRO_SPECIAL_MAP[combined];
  if (specialCombined === expectedNorm || specialCombined === targetNorm) {
    return {
      isMatch: true,
      producedBangla: specialCombined,
      newBuffer: '',
      consumed: true,
      isPrefix: false
    };
  }

  // 7. Check if combined is a valid prefix towards expectedChar or targetGrapheme
  const isLetterOrPunct = /^[a-zA-Z0-9,.:`^$|-]$/.test(typedKey);
  if (isLetterOrPunct && combined.length < 6) {
    // Check if any conjunct starts with combined
    const matchingConj = Object.keys(AVRO_CONJUNCTS).some(
      (k) => k.startsWith(combined) && (AVRO_CONJUNCTS[k] === expectedNorm || AVRO_CONJUNCTS[k] === targetNorm)
    );

    // Check if any consonant / kar sequence starts with combined
    const matchingKar = Object.keys(AVRO_KAR_MAP).some(
      (k) => k.startsWith(combined) && AVRO_KAR_MAP[k] === expectedNorm
    );

    const matchingInd = Object.keys(AVRO_INDEPENDENT_VOWELS).some(
      (k) => k.startsWith(combined) && AVRO_INDEPENDENT_VOWELS[k] === expectedNorm
    );

    if (matchingConj || matchingKar || matchingInd) {
      return {
        isMatch: false,
        producedBangla: transliteratedCombined,
        newBuffer: combined,
        consumed: false,
        isPrefix: true
      };
    }

    // Generic multi-key buffering for roman alphabet letters (e.g. k -> kh for খ, s -> st for স্ত)
    if (/^[a-zA-Z]$/.test(typedKey)) {
      return {
        isMatch: false,
        producedBangla: transliteratedCombined,
        newBuffer: combined,
        consumed: false,
        isPrefix: true
      };
    }
  }

  // 8. No match and not a valid prefix -> mistake
  return {
    isMatch: false,
    producedBangla: singleTransliterated || typedKey,
    newBuffer: '',
    consumed: false,
    isPrefix: false
  };
}
