import { FingerAssignment, GraphemeKeystroke, Hand, KeyboardLayoutDefinition, KeyboardLayoutId } from '../../types';
import { canonicalizeBanglaUnicode } from '../unicode';
import { AVRO_CHAR_TO_KEYSTROKES, AVRO_KEYMAP } from './avroKeymap';
import { BIJOY_CHAR_TO_KEYSTROKES, BIJOY_KEYMAP } from './bijoyKeymap';

export const KEYBOARD_LAYOUTS: Record<KeyboardLayoutId, KeyboardLayoutDefinition> = {
  avro: {
    id: 'avro',
    name: 'Avro Phonetic',
    nativeName: 'অভ্র ফোনেটিক',
    description: 'Type Bangla phonetically using standard English pronunciation (e.g., ami -> আমি, bangla -> বাংলা).',
    tagline: 'সহজ ফোনেটিক টাইপিং — যেভাবে উচ্চারণ, সেভাবেই টাইপ',
    keymap: AVRO_KEYMAP
  },
  bijoy: {
    id: 'bijoy',
    name: 'Bijoy 52 / Unicode',
    nativeName: 'বিজয় বায়ান্ন (ইউনিকোড)',
    description: 'Traditional fixed layout with dedicated keys for vowels, consonants, and virama (g) linkage.',
    tagline: 'পেশাদার ও সরকারি কাজের মানসম্মত ফিক্সড লেআউট',
    keymap: BIJOY_KEYMAP
  },
  jatiya: {
    id: 'jatiya',
    name: 'National Standard (Jatiya)',
    nativeName: 'জাতীয় কীবোর্ড',
    description: 'BCC standard keyboard layout designed for high ergonomics and standardized typing exams.',
    tagline: 'বাংলাদেশ কম্পিউটার কাউন্সিল (BCC) অনুমোদিত লেআউট',
    keymap: BIJOY_KEYMAP // Compatible standard base
  }
};

/**
 * Standard touch-typing finger and hand geometry for physical ANSI keyboard keys
 */
const PHYSICAL_KEY_MAP: Record<string, { code: string; finger: FingerAssignment; hand: Hand }> = {
  // Number Row
  '`': { code: 'Backquote', finger: 'left-pinky', hand: 'left' },
  '~': { code: 'Backquote', finger: 'left-pinky', hand: 'left' },
  '1': { code: 'Digit1', finger: 'left-pinky', hand: 'left' },
  '!': { code: 'Digit1', finger: 'left-pinky', hand: 'left' },
  '2': { code: 'Digit2', finger: 'left-ring', hand: 'left' },
  '@': { code: 'Digit2', finger: 'left-ring', hand: 'left' },
  '3': { code: 'Digit3', finger: 'left-middle', hand: 'left' },
  '#': { code: 'Digit3', finger: 'left-middle', hand: 'left' },
  '4': { code: 'Digit4', finger: 'left-index', hand: 'left' },
  '$': { code: 'Digit4', finger: 'left-index', hand: 'left' },
  '5': { code: 'Digit5', finger: 'left-index', hand: 'left' },
  '%': { code: 'Digit5', finger: 'left-index', hand: 'left' },
  '6': { code: 'Digit6', finger: 'right-index', hand: 'right' },
  '^': { code: 'Digit6', finger: 'right-index', hand: 'right' },
  '7': { code: 'Digit7', finger: 'right-index', hand: 'right' },
  '&': { code: 'Digit7', finger: 'right-index', hand: 'right' },
  '8': { code: 'Digit8', finger: 'right-middle', hand: 'right' },
  '*': { code: 'Digit8', finger: 'right-middle', hand: 'right' },
  '9': { code: 'Digit9', finger: 'right-ring', hand: 'right' },
  '(': { code: 'Digit9', finger: 'right-ring', hand: 'right' },
  '0': { code: 'Digit0', finger: 'right-pinky', hand: 'right' },
  ')': { code: 'Digit0', finger: 'right-pinky', hand: 'right' },
  '-': { code: 'Minus', finger: 'right-pinky', hand: 'right' },
  '_': { code: 'Minus', finger: 'right-pinky', hand: 'right' },
  '=': { code: 'Equal', finger: 'right-pinky', hand: 'right' },
  '+': { code: 'Equal', finger: 'right-pinky', hand: 'right' },

  // Top Row
  'q': { code: 'KeyQ', finger: 'left-pinky', hand: 'left' },
  'w': { code: 'KeyW', finger: 'left-ring', hand: 'left' },
  'e': { code: 'KeyE', finger: 'left-middle', hand: 'left' },
  'r': { code: 'KeyR', finger: 'left-index', hand: 'left' },
  't': { code: 'KeyT', finger: 'left-index', hand: 'left' },
  'y': { code: 'KeyY', finger: 'right-index', hand: 'right' },
  'u': { code: 'KeyU', finger: 'right-index', hand: 'right' },
  'i': { code: 'KeyI', finger: 'right-middle', hand: 'right' },
  'o': { code: 'KeyO', finger: 'right-ring', hand: 'right' },
  'p': { code: 'KeyP', finger: 'right-pinky', hand: 'right' },
  '[': { code: 'BracketLeft', finger: 'right-pinky', hand: 'right' },
  '{': { code: 'BracketLeft', finger: 'right-pinky', hand: 'right' },
  ']': { code: 'BracketRight', finger: 'right-pinky', hand: 'right' },
  '}': { code: 'BracketRight', finger: 'right-pinky', hand: 'right' },
  '\\': { code: 'Backslash', finger: 'right-pinky', hand: 'right' },
  '|': { code: 'Backslash', finger: 'right-pinky', hand: 'right' },

  // Home Row
  'a': { code: 'KeyA', finger: 'left-pinky', hand: 'left' },
  's': { code: 'KeyS', finger: 'left-ring', hand: 'left' },
  'd': { code: 'KeyD', finger: 'left-middle', hand: 'left' },
  'f': { code: 'KeyF', finger: 'left-index', hand: 'left' },
  'g': { code: 'KeyG', finger: 'left-index', hand: 'left' }, // Virama / Hasant in Bijoy
  'h': { code: 'KeyH', finger: 'right-index', hand: 'right' },
  'j': { code: 'KeyJ', finger: 'right-index', hand: 'right' }, // ক in Bijoy
  'k': { code: 'KeyK', finger: 'right-middle', hand: 'right' }, // ত in Bijoy
  'l': { code: 'KeyL', finger: 'right-ring', hand: 'right' }, // দ in Bijoy
  ';': { code: 'Semicolon', finger: 'right-pinky', hand: 'right' }, // স in Bijoy
  ':': { code: 'Semicolon', finger: 'right-pinky', hand: 'right' },
  "'": { code: 'Quote', finger: 'right-pinky', hand: 'right' },
  '"': { code: 'Quote', finger: 'right-pinky', hand: 'right' },

  // Bottom Row
  'z': { code: 'KeyZ', finger: 'left-pinky', hand: 'left' }, // ্র / ্য in Bijoy
  'x': { code: 'KeyX', finger: 'left-ring', hand: 'left' }, // ও / ৌ in Bijoy
  'c': { code: 'KeyC', finger: 'left-middle', hand: 'left' }, // ে / ৈ in Bijoy
  'v': { code: 'KeyV', finger: 'left-index', hand: 'left' }, // র / ল in Bijoy
  'b': { code: 'KeyB', finger: 'left-index', hand: 'left' }, // ন / ণ in Bijoy
  'n': { code: 'KeyN', finger: 'right-index', hand: 'right' }, // ষ / ঃ in Bijoy
  'm': { code: 'KeyM', finger: 'right-index', hand: 'right' }, // ম / ঁ in Bijoy
  ',': { code: 'Comma', finger: 'right-middle', hand: 'right' },
  '<': { code: 'Comma', finger: 'right-middle', hand: 'right' },
  '.': { code: 'Period', finger: 'right-ring', hand: 'right' },
  '>': { code: 'Period', finger: 'right-ring', hand: 'right' },
  '/': { code: 'Slash', finger: 'right-pinky', hand: 'right' },
  '?': { code: 'Slash', finger: 'right-pinky', hand: 'right' },

  // Space
  ' ': { code: 'Space', finger: 'thumb', hand: 'right' }
};

/**
 * Resolves precise physical keycode, finger, and hand assignment for any key character
 */
export function getPhysicalKeyInfo(rawKey: string): { code: string; finger: FingerAssignment; hand: Hand } {
  if (!rawKey || rawKey === ' ' || rawKey === 'Space') {
    return { code: 'Space', finger: 'thumb', hand: 'right' };
  }

  const lower = rawKey.toLowerCase();
  if (PHYSICAL_KEY_MAP[lower]) {
    return PHYSICAL_KEY_MAP[lower];
  }
  if (PHYSICAL_KEY_MAP[rawKey]) {
    return PHYSICAL_KEY_MAP[rawKey];
  }

  // Alpha fallback
  if (/^[a-z]$/i.test(rawKey)) {
    return {
      code: `Key${rawKey.toUpperCase()}`,
      finger: 'left-index',
      hand: 'left'
    };
  }

  // Digit fallback
  if (/^[0-9]$/.test(rawKey)) {
    return {
      code: `Digit${rawKey}`,
      finger: 'right-pinky',
      hand: 'right'
    };
  }

  return { code: 'KeyF', finger: 'left-index', hand: 'left' };
}

/**
 * Returns the exact sequence of keystrokes and finger assignments needed to type a Bangla grapheme
 */
export function getKeystrokeGuidance(
  targetGrapheme: string,
  layoutId: KeyboardLayoutId
): GraphemeKeystroke[] {
  if (!targetGrapheme) return [];

  // Canonicalize Unicode
  const normalized = canonicalizeBanglaUnicode(targetGrapheme);

  // Space handling
  if (normalized === ' ' || normalized === '\u00A0' || normalized === '') {
    return [
      {
        key: ' ',
        code: 'Space',
        shift: false,
        finger: 'thumb',
        hand: 'right',
        note: 'স্পেসবার'
      }
    ];
  }

  if (layoutId === 'bijoy' || layoutId === 'jatiya') {
    // 1. Direct match in Bijoy map (including single characters, virama, nukta, and known conjuncts)
    const directSteps = BIJOY_CHAR_TO_KEYSTROKES[normalized];
    if (directSteps && directSteps.length > 0) {
      return directSteps.map((step) => {
        const keyInfo = getPhysicalKeyInfo(step.key);
        return {
          key: step.key,
          code: keyInfo.code,
          shift: step.shift,
          finger: keyInfo.finger,
          hand: keyInfo.hand,
          note: step.shift ? `Shift + ${step.key.toUpperCase()}` : undefined
        };
      });
    }

    // 2. Deconstruct multi-character clusters or conjuncts (e.g. ক + ্ + ত or চ + া)
    const parts = Array.from(normalized);
    const result: GraphemeKeystroke[] = [];

    for (const char of parts) {
      const charSteps = BIJOY_CHAR_TO_KEYSTROKES[char];
      if (charSteps && charSteps.length > 0) {
        for (const step of charSteps) {
          const keyInfo = getPhysicalKeyInfo(step.key);
          result.push({
            key: step.key,
            code: keyInfo.code,
            shift: step.shift,
            finger: keyInfo.finger,
            hand: keyInfo.hand,
            note: step.shift ? `Shift + ${step.key.toUpperCase()}` : undefined
          });
        }
      } else {
        // Fallback for ASCII or unmapped characters
        const keyInfo = getPhysicalKeyInfo(char);
        result.push({
          key: char,
          code: keyInfo.code,
          shift: false,
          finger: keyInfo.finger,
          hand: keyInfo.hand
        });
      }
    }

    if (result.length > 0) {
      return result;
    }
  } else if (layoutId === 'avro') {
    // 1. Direct match in Avro map
    const directSteps = AVRO_CHAR_TO_KEYSTROKES[normalized];
    if (directSteps && directSteps.length > 0) {
      return directSteps.map((step) => {
        const keyInfo = getPhysicalKeyInfo(step.key);
        return {
          key: step.key,
          code: keyInfo.code,
          shift: step.shift,
          finger: keyInfo.finger,
          hand: keyInfo.hand,
          note: step.shift ? `Shift + ${step.key.toUpperCase()}` : undefined
        };
      });
    }

    // 2. Grapheme breakdown for Avro
    const parts = Array.from(normalized);
    const result: GraphemeKeystroke[] = [];

    for (const char of parts) {
      const charSteps = AVRO_CHAR_TO_KEYSTROKES[char];
      if (charSteps && charSteps.length > 0) {
        for (const step of charSteps) {
          const keyInfo = getPhysicalKeyInfo(step.key);
          result.push({
            key: step.key,
            code: keyInfo.code,
            shift: step.shift,
            finger: keyInfo.finger,
            hand: keyInfo.hand,
            note: step.shift ? `Shift + ${step.key.toUpperCase()}` : undefined
          });
        }
      } else {
        const keyInfo = getPhysicalKeyInfo(char);
        result.push({
          key: char,
          code: keyInfo.code,
          shift: false,
          finger: keyInfo.finger,
          hand: keyInfo.hand
        });
      }
    }

    if (result.length > 0) {
      return result;
    }
  }

  // Safe fallback matching physical character
  const fallbackInfo = getPhysicalKeyInfo(normalized);
  return [
    {
      key: normalized,
      code: fallbackInfo.code,
      shift: false,
      finger: fallbackInfo.finger,
      hand: fallbackInfo.hand
    }
  ];
}

/**
 * Maps physical key input (event.key & event.code) to expected Bangla character in Bijoy directly
 */
export function translatePhysicalKeyToBijoy(key: string, code?: string | boolean, isShift?: boolean): string {
  let effectiveCode: string | undefined = typeof code === 'string' ? code : undefined;
  let effectiveShift: boolean = typeof code === 'boolean' ? code : (isShift || false);

  // If code is supplied (e.g. 'KeyW', 'KeyH', 'Digit1', 'Backslash', 'Semicolon'), check BIJOY_KEYMAP directly
  if (effectiveCode && BIJOY_KEYMAP[effectiveCode]) {
    const entry = BIJOY_KEYMAP[effectiveCode];
    const val = effectiveShift ? (entry.shiftLabel || entry.label) : entry.label;
    return canonicalizeBanglaUnicode(val);
  }

  // Fallback: match by key character
  const lower = key.toLowerCase();
  for (const entry of Object.values(BIJOY_KEYMAP)) {
    if (entry.key === lower || entry.label === key || entry.shiftLabel === key) {
      const val = effectiveShift ? (entry.shiftLabel || entry.label) : entry.label;
      return canonicalizeBanglaUnicode(val);
    }
  }

  return canonicalizeBanglaUnicode(key);
}
