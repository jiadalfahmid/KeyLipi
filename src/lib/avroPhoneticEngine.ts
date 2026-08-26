/**
 * Full-featured Avro Phonetic transliteration engine for in-browser Bangla typing
 * Supports phonetics, contextual Kar attachments, conjuncts, and multi-character buffers
 */

// Basic single-character consonants
export const AVRO_CONSONANT_MAP: Record<string, string> = {
  k: 'ক',
  kh: 'খ',
  g: 'গ',
  gh: 'ঘ',
  Ng: 'ঙ',
  ng: 'ং',
  c: 'চ',
  ch: 'ছ',
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

// Vowels at word start / independent (Swaroborno)
export const AVRO_INDEPENDENT_VOWELS: Record<string, string> = {
  a: 'আ',
  aa: 'আ',
  A: 'অ',
  o: 'অ',
  O: 'ও',
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
  ou: 'ঔ',
  OU: 'ঔ',
  rri: 'ঋ',
  RRI: 'ঋ'
};

// Vowel signs (Kar) attached to consonants
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
  o: 'ো',
  O: 'ো',
  ou: 'ৌ',
  OU: 'ৌ',
  rri: 'ৃ'
};

// Common Avro conjunct patterns
export const AVRO_CONJUNCTS: Record<string, string> = {
  kkh: 'ক্ষ',
  kSh: 'ক্ষ',
  kkhN: 'ক্ষ্ণ',
  kkhm: 'ক্ষ্ম',
  kkhy: 'ক্ষ্য',
  kkhw: 'ক্ষ্ব',
  jn: 'জ্ঞ',
  jN: 'জ্ঞ',
  ngk: 'ঙ্ক',
  ngkh: 'ঙ্খ',
  ngg: 'ঙ্গ',
  nggh: 'ঙ্ঘ',
  nch: 'ঞ্চ',
  nchh: 'ঞ্ছ',
  nj: 'ঞ্জ',
  njh: 'ঞ্ঝ',
  NT: 'ণ্ট',
  NTh: 'ণ্ঠ',
  ND: 'ণ্ড',
  NDh: 'ণ্ঢ',
  NN: 'ণ্ণ',
  kt: 'ক্ত',
  kw: 'ক্ব',
  ky: 'ক্য',
  kr: 'ক্র',
  kl: 'ক্ল',
  ks: 'ক্স',
  gd: 'গ্দ',
  gdh: 'গ্ধ',
  gn: 'গ্ন',
  gb: 'গ্ব',
  gm: 'গ্ম',
  gy: 'গ্য',
  gr: 'গ্র',
  gl: 'গ্ল',
  ghn: 'ঘ্ন',
  ghy: 'ঘ্য',
  ghr: 'ঘ্র',
  chch: 'চ্চ',
  chchh: 'চ্ছ',
  chw: 'চ্ব',
  chy: 'চ্য',
  jj: 'জ্জ',
  jjh: 'জ্ঝ',
  jw: 'জ্ব',
  jy: 'জ্য',
  jr: 'জ্র',
  TT: 'ট্ট',
  Tw: 'ট্ব',
  Ty: 'ট্য',
  Tr: 'ট্র',
  DD: 'ড্ড',
  Dy: 'ড্য',
  Dr: 'ড্র',
  nt: 'ন্ত',
  nth: 'ন্থ',
  nd: 'ন্দ',
  ndh: 'ন্ধ',
  nn: 'ন্ন',
  nw: 'ন্ব',
  nm: 'ন্ম',
  ny: 'ন্য',
  pt: 'প্ত',
  pn: 'প্ন',
  pp: 'প্প',
  pl: 'প্ল',
  ps: 'প্স',
  py: 'প্য',
  pr: 'প্র',
  bd: 'ব্দ',
  bdh: 'ব্ধ',
  bb: 'ব্ব',
  bl: 'ব্ল',
  by: 'ব্য',
  br: 'ব্র',
  bht: 'ভ্ত',
  bhy: 'ভ্য',
  bhr: 'ভ্র',
  mn: 'ম্ন',
  mp: 'ম্প',
  mph: 'ম্ফ',
  mb: 'ম্ব',
  mbh: 'ম্ভ',
  mm: 'ম্ম',
  ml: 'ম্ল',
  my: 'ম্য',
  mr: 'ম্র',
  st: 'স্ত',
  sth: 'স্থ',
  sn: 'স্ন',
  sp: 'স্প',
  sph: 'স্ফ',
  sb: 'স্ব',
  sm: 'স্ম',
  sy: 'স্য',
  sr: 'স্র',
  sl: 'স্ল',
  sk: 'স্ক',
  skh: 'স্খ',
  shch: 'শ্চ',
  shchch: 'শ্ছ',
  shn: 'শ্ন',
  shw: 'শ্ব',
  shm: 'শ্ম',
  shy: 'শ্য',
  shr: 'শ্র',
  shl: 'শ্ল',
  Shk: 'ষ্ক',
  Shkh: 'ষ্খ',
  ShT: 'ষ্ট',
  ShTh: 'ষ্ঠ',
  ShN: 'ষ্ণ',
  Shp: 'ষ্প',
  Shph: 'ষ্ফ',
  Shm: 'ষ্ম',
  Shy: 'ষ্য',
  hn: 'হ্ন',
  hN: 'হ্ণ',
  hb: 'হ্ব',
  hm: 'হ্ম',
  hy: 'হ্য',
  hr: 'হ্র',
  hl: 'হ্ল'
};

// Special modifiers
export const AVRO_SPECIAL_MAP: Record<string, string> = {
  ':': 'ঃ',
  '^': 'ঁ',
  '.': '।',
  '..': '্',
  ',,': '্',
  '`': '', // vowel breaker
  "t`": 'ৎ',
  't,,': 'ৎ',
  '$': '৳'
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
    // Check 4-character combinations
    const four = input.substring(i, i + 4);
    if (AVRO_CONJUNCTS[four]) {
      output += AVRO_CONJUNCTS[four];
      i += 4;
      prevWasConsonant = true;
      continue;
    }

    // Check 3-character combinations
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

    // Check 2-character combinations
    const two = input.substring(i, i + 2);
    if (AVRO_CONJUNCTS[two]) {
      output += AVRO_CONJUNCTS[two];
      i += 2;
      prevWasConsonant = true;
      continue;
    }
    if (AVRO_SPECIAL_MAP[two] !== undefined) {
      output += AVRO_SPECIAL_MAP[two];
      i += 2;
      continue;
    }
    if (AVRO_CONSONANT_MAP[two]) {
      output += AVRO_CONSONANT_MAP[two];
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

    // Single character
    const one = input.charAt(i);

    if (one === ' ') {
      output += ' ';
      prevWasConsonant = false;
      i++;
      continue;
    }

    if (AVRO_SPECIAL_MAP[one] !== undefined) {
      output += AVRO_SPECIAL_MAP[one];
      i++;
      continue;
    }

    if (AVRO_KAR_MAP[one] && prevWasConsonant) {
      // If vowel 'o' is typed after a consonant in Avro (inherent vowel), it leaves consonant as is
      if (one === 'o') {
        // inherent vowel or o-kar
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

  return output;
}

/**
 * Maps a single keystroke or small buffer in Avro mode to either:
 * 1. Direct Bangla translation
 * 2. Next expected keystroke match
 */
export function matchAvroKeystroke(
  typedKey: string,
  expectedChar: string,
  buffer: string = ''
): {
  isMatch: boolean;
  producedBangla: string;
  newBuffer: string;
  consumed: boolean;
} {
  const combined = buffer + typedKey;
  const transliterated = transliterateAvro(combined);

  // Direct match with the expected character
  if (transliterated.endsWith(expectedChar) || transliterated === expectedChar) {
    return {
      isMatch: true,
      producedBangla: transliterated,
      newBuffer: '',
      consumed: true
    };
  }

  // Also check individual letter mappings (e.g. k -> ক, a -> া / আ)
  const singleTransliterated = transliterateAvro(typedKey);
  if (singleTransliterated === expectedChar) {
    return {
      isMatch: true,
      producedBangla: singleTransliterated,
      newBuffer: '',
      consumed: true
    };
  }

  // Check if expectedChar is a Kar (vowel diacritic) and user pressed the vowel key
  const karForVowel = AVRO_KAR_MAP[typedKey.toLowerCase()];
  if (karForVowel === expectedChar) {
    return {
      isMatch: true,
      producedBangla: karForVowel,
      newBuffer: '',
      consumed: true
    };
  }

  // Check independent vowel
  const independentVowel = AVRO_INDEPENDENT_VOWELS[typedKey];
  if (independentVowel === expectedChar) {
    return {
      isMatch: true,
      producedBangla: independentVowel,
      newBuffer: '',
      consumed: true
    };
  }

  // Check consonant match
  const consonant = AVRO_CONSONANT_MAP[typedKey];
  if (consonant === expectedChar) {
    return {
      isMatch: true,
      producedBangla: consonant,
      newBuffer: '',
      consumed: true
    };
  }

  // Check if this could be an intermediate prefix (e.g. typed 'k', expected 'খ' (kh))
  if (typedKey.length === 1 && 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(typedKey)) {
    return {
      isMatch: false,
      producedBangla: transliterated,
      newBuffer: combined.length > 5 ? typedKey : combined,
      consumed: false
    };
  }

  return {
    isMatch: false,
    producedBangla: transliterated,
    newBuffer: '',
    consumed: false
  };
}
