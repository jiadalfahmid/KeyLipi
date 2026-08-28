import { FingerAssignment, Hand, KeyboardLayoutId } from '../types';
import { matchAvroKeystroke, transliterateAvro } from './avroPhoneticEngine';
import { getKeystrokeGuidance, getPhysicalKeyInfo, translatePhysicalKeyToBijoy } from './keyboardAdapters';
import { canonicalizeBanglaUnicode } from './unicode';

export interface InputValidationState {
  avroBuffer: string;
  pendingVirama: boolean;
  expectedToken: string;
  currentGrapheme: string;
}

export interface InputValidationResult {
  action: 'accept' | 'buffer' | 'reject' | 'modifier' | 'backspace' | 'space';
  charProduced?: string;
  newBuffer?: string;
  newPendingVirama?: boolean;
  errorMessage?: string;
  finger?: FingerAssignment;
  hand?: Hand;
  keyCode?: string;
}

/**
 * Validates and filters physical keyboard input before it reaches display or scoring
 */
export function validateKeystroke(
  event: { key: string; code?: string; shiftKey?: boolean },
  layout: KeyboardLayoutId,
  state: InputValidationState
): InputValidationResult {
  const { key, code, shiftKey = false } = event;

  // 1. Modifier and non-character control keys filter
  const modifierKeys = [
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'CapsLock',
    'Tab',
    'Escape',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    'Insert',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12'
  ];

  if (
    modifierKeys.includes(key) ||
    (code && (code.startsWith('Shift') || code.startsWith('Control') || code.startsWith('Alt') || code.startsWith('Meta')))
  ) {
    return { action: 'modifier' };
  }

  // 2. Backspace handler
  if (key === 'Backspace') {
    return { action: 'backspace' };
  }

  // 3. Spacebar handler
  if (code === 'Space' || key === ' ') {
    return {
      action: 'space',
      charProduced: ' ',
      newBuffer: '',
      newPendingVirama: false,
      finger: 'thumb',
      hand: 'right',
      keyCode: 'Space'
    };
  }

  // 4. Bijoy & Jatiya Fixed Layout Validation
  if (layout === 'bijoy' || layout === 'jatiya') {
    const rawBangla = translatePhysicalKeyToBijoy(key, code, shiftKey);
    const normalizedBangla = canonicalizeBanglaUnicode(rawBangla);
    const keyInfo = getPhysicalKeyInfo(key);

    // Check for double virama spam (e.g. pressing 'g' consecutively)
    if (normalizedBangla === '্' && state.pendingVirama) {
      return {
        action: 'reject',
        errorMessage: 'হসন্ত কি (g) একবার চাপার পর পরবর্তী বর্ণ বা কার কি চাপুন।',
        finger: keyInfo.finger,
        hand: keyInfo.hand,
        keyCode: keyInfo.code
      };
    }

    return {
      action: 'accept',
      charProduced: normalizedBangla,
      newPendingVirama: normalizedBangla === '্' && !state.pendingVirama,
      finger: keyInfo.finger,
      hand: keyInfo.hand,
      keyCode: keyInfo.code
    };
  }

  // 5. Avro Phonetic Engine Validation
  if (layout === 'avro') {
    const expectedNorm = canonicalizeBanglaUnicode(state.expectedToken || state.currentGrapheme);

    // Direct match from OS Bengali IME
    if (key === expectedNorm || key === state.currentGrapheme) {
      return {
        action: 'accept',
        charProduced: key,
        newBuffer: '',
        finger: 'left-index',
        hand: 'left',
        keyCode: code || 'KeyF'
      };
    }

    const res = matchAvroKeystroke(key, expectedNorm, state.avroBuffer, state.currentGrapheme);
    const keyInfo = getPhysicalKeyInfo(key);

    if (res.isMatch) {
      return {
        action: 'accept',
        charProduced: expectedNorm,
        newBuffer: '',
        finger: keyInfo.finger,
        hand: keyInfo.hand,
        keyCode: keyInfo.code
      };
    }

    if (res.newBuffer.length > 0 && res.newBuffer !== state.avroBuffer && res.isPrefix) {
      return {
        action: 'buffer',
        newBuffer: res.newBuffer,
        finger: keyInfo.finger,
        hand: keyInfo.hand,
        keyCode: keyInfo.code
      };
    }

    // Direct transliteration fallback on mismatch
    const transliterated = transliterateAvro(key);
    return {
      action: 'accept',
      charProduced: transliterated || key,
      newBuffer: '',
      finger: keyInfo.finger,
      hand: keyInfo.hand,
      keyCode: keyInfo.code
    };
  }

  // Generic fallback
  const fallbackInfo = getPhysicalKeyInfo(key);
  return {
    action: 'accept',
    charProduced: canonicalizeBanglaUnicode(key),
    finger: fallbackInfo.finger,
    hand: fallbackInfo.hand,
    keyCode: fallbackInfo.code
  };
}
