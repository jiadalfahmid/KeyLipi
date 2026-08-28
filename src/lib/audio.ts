/**
 * Web Audio API Sound Synthesizer for Mechanical Keyboard Feedback
 * Generates immediate, latency-free synthesized audio effects with 10 distinct acoustic profiles
 * mapped to individual fingers, key zones, and switch color categories.
 */

import { FingerAssignment } from '../types';

export interface FingerSoundProfile {
  name: string;
  fingerId: FingerAssignment;
  hand: 'left' | 'right';
  colorName: string;
  hexColor: string;
  baseFreq: number;
  decayTime: number;
  noiseFilterFreq: number;
  noiseGain: number;
  oscType: OscillatorType;
  harmonicMultiplier: number;
}

export const FINGER_SOUND_PROFILES: Record<string, FingerSoundProfile> = {
  'left-pinky': {
    name: 'Left Pinky (Crimson Snap)',
    fingerId: 'left-pinky',
    hand: 'left',
    colorName: 'Rose/Crimson',
    hexColor: '#E11D48',
    baseFreq: 580,
    decayTime: 0.038,
    noiseFilterFreq: 2800,
    noiseGain: 0.35,
    oscType: 'triangle',
    harmonicMultiplier: 1.85
  },
  'left-ring': {
    name: 'Left Ring (Amber Clack)',
    fingerId: 'left-ring',
    hand: 'left',
    colorName: 'Amber/Orange',
    hexColor: '#D97706',
    baseFreq: 490,
    decayTime: 0.042,
    noiseFilterFreq: 2200,
    noiseGain: 0.32,
    oscType: 'triangle',
    harmonicMultiplier: 1.65
  },
  'left-middle': {
    name: 'Left Middle (Sky Pop)',
    fingerId: 'left-middle',
    hand: 'left',
    colorName: 'Sky Blue',
    hexColor: '#0284C7',
    baseFreq: 420,
    decayTime: 0.045,
    noiseFilterFreq: 1800,
    noiseGain: 0.3,
    oscType: 'sine',
    harmonicMultiplier: 1.5
  },
  'left-index': {
    name: 'Left Index (Emerald Thud)',
    fingerId: 'left-index',
    hand: 'left',
    colorName: 'Emerald Green',
    hexColor: '#059669',
    baseFreq: 350,
    decayTime: 0.05,
    noiseFilterFreq: 1450,
    noiseGain: 0.28,
    oscType: 'sine',
    harmonicMultiplier: 1.35
  },
  'left-thumb': {
    name: 'Left Thumb (Deep Bass Spacebar)',
    fingerId: 'thumb',
    hand: 'left',
    colorName: 'Purple/Indigo',
    hexColor: '#7C3AED',
    baseFreq: 175,
    decayTime: 0.075,
    noiseFilterFreq: 900,
    noiseGain: 0.42,
    oscType: 'sine',
    harmonicMultiplier: 1.15
  },
  'right-thumb': {
    name: 'Right Thumb (Heavy Spacebar Resonance)',
    fingerId: 'thumb',
    hand: 'right',
    colorName: 'Purple/Indigo',
    hexColor: '#7C3AED',
    baseFreq: 190,
    decayTime: 0.07,
    noiseFilterFreq: 950,
    noiseGain: 0.4,
    oscType: 'sine',
    harmonicMultiplier: 1.18
  },
  'right-index': {
    name: 'Right Index (Emerald Thud)',
    fingerId: 'right-index',
    hand: 'right',
    colorName: 'Emerald Green',
    hexColor: '#059669',
    baseFreq: 370,
    decayTime: 0.048,
    noiseFilterFreq: 1500,
    noiseGain: 0.28,
    oscType: 'sine',
    harmonicMultiplier: 1.35
  },
  'right-middle': {
    name: 'Right Middle (Sky Pop)',
    fingerId: 'right-middle',
    hand: 'right',
    colorName: 'Sky Blue',
    hexColor: '#0284C7',
    baseFreq: 440,
    decayTime: 0.044,
    noiseFilterFreq: 1850,
    noiseGain: 0.3,
    oscType: 'sine',
    harmonicMultiplier: 1.52
  },
  'right-ring': {
    name: 'Right Ring (Amber Clack)',
    fingerId: 'right-ring',
    hand: 'right',
    colorName: 'Amber/Orange',
    hexColor: '#D97706',
    baseFreq: 510,
    decayTime: 0.04,
    noiseFilterFreq: 2300,
    noiseGain: 0.32,
    oscType: 'triangle',
    harmonicMultiplier: 1.68
  },
  'right-pinky': {
    name: 'Right Pinky (Crimson Snap)',
    fingerId: 'right-pinky',
    hand: 'right',
    colorName: 'Rose/Crimson',
    hexColor: '#E11D48',
    baseFreq: 600,
    decayTime: 0.035,
    noiseFilterFreq: 2900,
    noiseGain: 0.36,
    oscType: 'triangle',
    harmonicMultiplier: 1.88
  }
};

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private soundTheme: 'poly-colors' | 'cherry-blue' | 'creamy' | 'typewriter' | 'silent' = 'poly-colors';
  private masterGain: GainNode | null = null;

  constructor() {
    // Auto-listen to user gesture to unlock Web Audio API immediately
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initContext();
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
    }
  }

  public initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch {
      // Ignore browser audio policy restriction until first click
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public setTheme(theme: 'poly-colors' | 'cherry-blue' | 'creamy' | 'typewriter' | 'silent') {
    this.soundTheme = theme;
  }

  public getTheme() {
    return this.soundTheme;
  }

  /**
   * Play key click with dedicated acoustic profile per finger / color zone
   * @param fingerOrKey Optional finger identifier or key code
   * @param hand Optional 'left' or 'right'
   */
  public playKeyClick(fingerOrKey?: FingerAssignment | string, hand?: 'left' | 'right') {
    if (!this.isEnabled || this.soundTheme === 'silent') return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const dest = this.masterGain || ctx.destination;

    // Resolve which finger profile to use
    let profileKey = 'right-index';
    if (fingerOrKey) {
      if (fingerOrKey === 'thumb' || fingerOrKey === 'Space' || fingerOrKey === ' ') {
        profileKey = hand === 'left' ? 'left-thumb' : 'right-thumb';
      } else if (FINGER_SOUND_PROFILES[fingerOrKey]) {
        profileKey = fingerOrKey;
      } else if (fingerOrKey.startsWith('left-') || fingerOrKey.startsWith('right-')) {
        profileKey = fingerOrKey;
      } else {
        // Map common keycodes to fingers
        const leftPinkyKeys = ['KeyA', 'KeyQ', 'KeyZ', 'Digit1', 'Backquote', 'Tab', 'CapsLock', 'ShiftLeft', '1', 'q', 'a', 'z'];
        const leftRingKeys = ['KeyS', 'KeyW', 'KeyX', 'Digit2', '2', 'w', 's', 'x'];
        const leftMiddleKeys = ['KeyD', 'KeyE', 'KeyC', 'Digit3', '3', 'e', 'd', 'c'];
        const leftIndexKeys = ['KeyF', 'KeyR', 'KeyV', 'KeyG', 'KeyT', 'KeyB', 'Digit4', 'Digit5', '4', '5', 'r', 't', 'f', 'g', 'v', 'b'];
        const rightIndexKeys = ['KeyJ', 'KeyU', 'KeyM', 'KeyH', 'KeyY', 'KeyN', 'Digit6', 'Digit7', '6', '7', 'y', 'u', 'h', 'j', 'n', 'm'];
        const rightMiddleKeys = ['KeyK', 'KeyI', 'Comma', 'Digit8', '8', 'i', 'k', ','];
        const rightRingKeys = ['KeyL', 'KeyO', 'Period', 'Digit9', '9', 'o', 'l', '.'];
        const rightPinkyKeys = [
          'Semicolon',
          'Quote',
          'KeyP',
          'Slash',
          'BracketLeft',
          'BracketRight',
          'Enter',
          'Backspace',
          'Digit0',
          'Minus',
          'Equal',
          'ShiftRight',
          '0',
          'p',
          ';',
          '/',
          '-',
          '='
        ];

        const fLower = fingerOrKey.toLowerCase();
        if (leftPinkyKeys.includes(fingerOrKey) || leftPinkyKeys.includes(fLower)) profileKey = 'left-pinky';
        else if (leftRingKeys.includes(fingerOrKey) || leftRingKeys.includes(fLower)) profileKey = 'left-ring';
        else if (leftMiddleKeys.includes(fingerOrKey) || leftMiddleKeys.includes(fLower)) profileKey = 'left-middle';
        else if (leftIndexKeys.includes(fingerOrKey) || leftIndexKeys.includes(fLower)) profileKey = 'left-index';
        else if (rightIndexKeys.includes(fingerOrKey) || rightIndexKeys.includes(fLower)) profileKey = 'right-index';
        else if (rightMiddleKeys.includes(fingerOrKey) || rightMiddleKeys.includes(fLower)) profileKey = 'right-middle';
        else if (rightRingKeys.includes(fingerOrKey) || rightRingKeys.includes(fLower)) profileKey = 'right-ring';
        else if (rightPinkyKeys.includes(fingerOrKey) || rightPinkyKeys.includes(fLower)) profileKey = 'right-pinky';
      }
    }

    const profile = FINGER_SOUND_PROFILES[profileKey] || FINGER_SOUND_PROFILES['right-index'];

    if (this.soundTheme === 'poly-colors') {
      // 10-Color Polyphonic Mechanical Switch Audio Synthesizer
      // 1. Mechanical switch click transient (filtered noise burst)
      const noise = ctx.createBufferSource();
      const noiseLen = Math.floor(ctx.sampleRate * Math.max(0.02, profile.decayTime * 0.5));
      const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseLen; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseLen * 0.3));
      }
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = profile.noiseFilterFreq + (Math.random() * 60 - 30);
      filter.Q.value = 3.2;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(profile.noiseGain, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decayTime * 0.7);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(dest);
      noise.start(now);

      // 2. Fundamental Key Body Resonance Oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = profile.oscType;

      const startFreq = profile.baseFreq + (Math.random() * 12 - 6);
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.4, now + profile.decayTime);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decayTime);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(now);
      osc.stop(now + profile.decayTime + 0.005);

      // 3. Secondary harmonic tactile overtone
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(startFreq * profile.harmonicMultiplier, now);
      subOsc.frequency.exponentialRampToValueAtTime(startFreq * 0.7, now + profile.decayTime * 0.6);

      subGain.gain.setValueAtTime(0.16, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decayTime * 0.6);

      subOsc.connect(subGain);
      subGain.connect(dest);
      subOsc.start(now);
      subOsc.stop(now + profile.decayTime * 0.65);
    } else if (this.soundTheme === 'cherry-blue') {
      // Crisp mechanical click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.038);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.042);
    } else if (this.soundTheme === 'creamy') {
      // Deep creamy thock
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240 + Math.random() * 25, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.065);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (this.soundTheme === 'typewriter') {
      // Metallic typewriter strike
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(950 + Math.random() * 100, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.045);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  public playError() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const dest = this.masterGain || ctx.destination;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.09);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.095);
  }

  public playMistakeBeep() {
    this.playError();
  }

  public playComboChime(combo: number) {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const dest = this.masterGain || ctx.destination;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 440;
    const step = Math.min(combo, 25);
    const freq = baseFreq * Math.pow(2, step / 12);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playSuccessFanfare() {
    if (!this.isEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const dest = this.masterGain || ctx.destination;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const now = ctx.currentTime + index * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.29);
    });
  }
}

export const soundFx = new SoundSynthesizer();
