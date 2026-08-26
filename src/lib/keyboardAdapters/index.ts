import { GraphemeKeystroke, KeyboardLayoutDefinition, KeyboardLayoutId } from '../../types';
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
 * Returns the exact sequence of keystrokes and finger assignments needed to type a Bangla grapheme
 */
export function getKeystrokeGuidance(
  targetGrapheme: string,
  layoutId: KeyboardLayoutId
): GraphemeKeystroke[] {
  const layout = KEYBOARD_LAYOUTS[layoutId] || KEYBOARD_LAYOUTS.bijoy;
  const keymap = layout.keymap;

  if (layoutId === 'bijoy' || layoutId === 'jatiya') {
    // Check direct lookup
    const directSteps = BIJOY_CHAR_TO_KEYSTROKES[targetGrapheme];
    if (directSteps && directSteps.length > 0) {
      return directSteps.map((step) => {
        const foundKeyEntry = Object.values(keymap).find(
          (k) => k.key.toLowerCase() === step.key.toLowerCase()
        );
        return {
          key: step.key,
          code: foundKeyEntry?.code || `Key${step.key.toUpperCase()}`,
          shift: step.shift,
          finger: foundKeyEntry?.finger || 'right-index',
          hand: foundKeyEntry?.hand || 'right',
          note: step.shift ? 'Shift + Key' : undefined
        };
      });
    }

    // Deconstruct conjunct (e.g., ক্ষ = ক + ্ + ষ => j + g + n)
    if (targetGrapheme.length > 1 || targetGrapheme.includes('্')) {
      const parts = Array.from(targetGrapheme);
      const result: GraphemeKeystroke[] = [];
      for (const char of parts) {
        const charSteps = BIJOY_CHAR_TO_KEYSTROKES[char] || [{ key: char, shift: false }];
        for (const step of charSteps) {
          const found = Object.values(keymap).find(
            (k) => k.key.toLowerCase() === step.key.toLowerCase()
          );
          result.push({
            key: step.key,
            code: found?.code || `Key${step.key.toUpperCase()}`,
            shift: step.shift,
            finger: found?.finger || 'right-index',
            hand: found?.hand || 'right',
            note: step.shift ? `Shift + ${step.key.toUpperCase()}` : undefined
          });
        }
      }
      return result;
    }
  } else if (layoutId === 'avro') {
    const directSteps = AVRO_CHAR_TO_KEYSTROKES[targetGrapheme];
    if (directSteps && directSteps.length > 0) {
      return directSteps.map((step) => {
        const foundKeyEntry = Object.values(keymap).find(
          (k) => k.key.toLowerCase() === step.key.toLowerCase()
        );
        return {
          key: step.key,
          code: foundKeyEntry?.code || `Key${step.key.toUpperCase()}`,
          shift: step.shift,
          finger: foundKeyEntry?.finger || 'right-index',
          hand: foundKeyEntry?.hand || 'right',
          note: step.shift ? `Shift + ${step.key.toUpperCase()}` : undefined
        };
      });
    }

    // Grapheme breakdown for Avro
    if (targetGrapheme.length > 1) {
      const parts = Array.from(targetGrapheme);
      const result: GraphemeKeystroke[] = [];
      for (const char of parts) {
        const charSteps = AVRO_CHAR_TO_KEYSTROKES[char] || [{ key: char, shift: false }];
        for (const step of charSteps) {
          const found = Object.values(keymap).find(
            (k) => k.key.toLowerCase() === step.key.toLowerCase()
          );
          result.push({
            key: step.key,
            code: found?.code || `Key${step.key.toUpperCase()}`,
            shift: step.shift,
            finger: found?.finger || 'right-index',
            hand: found?.hand || 'right',
            note: step.shift ? `Shift + ${step.key.toUpperCase()}` : undefined
          });
        }
      }
      return result;
    }
  }

  // Fallback default
  return [
    {
      key: targetGrapheme,
      code: 'Space',
      shift: false,
      finger: 'thumb',
      hand: 'right'
    }
  ];
}

/**
 * Maps physical key input (event.key & event.code) to expected Bangla character in Bijoy directly
 */
export function translatePhysicalKeyToBijoy(key: string, code?: string | boolean, isShift?: boolean): string {
  // Support overload if called as translatePhysicalKeyToBijoy(key, isShift)
  let effectiveCode: string | undefined = typeof code === 'string' ? code : undefined;
  let effectiveShift: boolean = typeof code === 'boolean' ? code : (isShift || false);

  // If code is supplied (e.g. 'KeyH', 'Digit1', 'Semicolon'), check BIJOY_KEYMAP directly
  if (effectiveCode && BIJOY_KEYMAP[effectiveCode]) {
    const entry = BIJOY_KEYMAP[effectiveCode];
    return effectiveShift ? (entry.shiftLabel || entry.label) : entry.label;
  }

  // Fallback: match by key character
  const lower = key.toLowerCase();
  for (const entry of Object.values(BIJOY_KEYMAP)) {
    if (entry.key === lower || entry.label === key || entry.shiftLabel === key) {
      return effectiveShift ? (entry.shiftLabel || entry.label) : entry.label;
    }
  }

  return key;
}
