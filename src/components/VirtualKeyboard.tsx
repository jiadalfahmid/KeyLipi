import React, { useState, useRef } from 'react';
import { KEYBOARD_LAYOUTS, getKeystrokeGuidance, getPhysicalKeyInfo } from '../lib/keyboardAdapters';
import { FingerAssignment, Hand, KeyboardLayoutId } from '../types';
import { HandGuides } from './HandGuides';
import { KeyboardHandOverlay } from './KeyboardHandOverlay';
import { soundFx } from '../lib/audio';
import { Layers, EyeOff, Volume2, Sparkles, Hand as HandIcon, Sliders } from 'lucide-react';

interface VirtualKeyboardProps {
  layoutId: KeyboardLayoutId;
  activeKeyChar?: string;
  activeKeyCode?: string;
  isShiftActive?: boolean;
  pressedKeyCode?: string | null;
  onVirtualKeyPress?: (key: string, isShift: boolean) => void;
  showHandGuide?: boolean;
  defaultGuideMode?: 'overlay' | 'bottom' | 'compact' | 'hidden';
}

interface FingerDetails {
  bn: string;
  short: string;
  en: string;
  handBn: string;
  accentColor: string;
  borderClass: string;
  bgClass: string;
}

const getFingerDetails = (finger: FingerAssignment, hand: Hand): FingerDetails => {
  if (finger === 'thumb') {
    return {
      bn: 'বৃদ্ধাঙ্গুলি',
      short: 'বৃদ্ধা',
      en: 'Thumb',
      handBn: hand === 'left' ? 'বাম' : 'ডান',
      accentColor: '#7C3AED',
      borderClass: 'border-b-2 border-b-purple-500',
      bgClass: 'bg-purple-100 text-purple-900'
    };
  }

  const isLeft = hand === 'left' || finger.startsWith('left-');
  const handBn = isLeft ? 'বাম' : 'ডান';
  const handEn = isLeft ? 'L' : 'R';

  if (finger.includes('pinky')) {
    return {
      bn: `${handBn} কনিষ্ঠা`,
      short: `${handBn[0]}-কনি`,
      en: `${handEn}.Pinky`,
      handBn,
      accentColor: '#E11D48',
      borderClass: 'border-b-2 border-b-rose-500',
      bgClass: 'bg-rose-100 text-rose-900'
    };
  }
  if (finger.includes('ring')) {
    return {
      bn: `${handBn} অনামিকা`,
      short: `${handBn[0]}-অনা`,
      en: `${handEn}.Ring`,
      handBn,
      accentColor: '#D97706',
      borderClass: 'border-b-2 border-b-amber-500',
      bgClass: 'bg-amber-100 text-amber-900'
    };
  }
  if (finger.includes('middle')) {
    return {
      bn: `${handBn} মধ্যমা`,
      short: `${handBn[0]}-মধ্য`,
      en: `${handEn}.Middle`,
      handBn,
      accentColor: '#0284C7',
      borderClass: 'border-b-2 border-b-sky-500',
      bgClass: 'bg-sky-100 text-sky-900'
    };
  }
  // Index
  return {
    bn: `${handBn} তর্জনী`,
    short: `${handBn[0]}-তর্জ`,
    en: `${handEn}.Index`,
    handBn,
    accentColor: '#059669',
    borderClass: 'border-b-2 border-b-emerald-500',
    bgClass: 'bg-emerald-100 text-emerald-900'
  };
};

// Home Row tactile anchor positions
const HOME_ROW_KEYS: Record<string, { finger: FingerAssignment; hand: Hand; isBump?: boolean; nameBn: string }> = {
  KeyA: { finger: 'left-pinky', hand: 'left', nameBn: 'কনিষ্ঠা' },
  KeyS: { finger: 'left-ring', hand: 'left', nameBn: 'অনামিকা' },
  KeyD: { finger: 'left-middle', hand: 'left', nameBn: 'মধ্যমা' },
  KeyF: { finger: 'left-index', hand: 'left', isBump: true, nameBn: 'তর্জনী' },
  KeyJ: { finger: 'right-index', hand: 'right', isBump: true, nameBn: 'তর্জনী' },
  KeyK: { finger: 'right-middle', hand: 'right', nameBn: 'মধ্যমা' },
  KeyL: { finger: 'right-ring', hand: 'right', nameBn: 'অনামিকা' },
  Semicolon: { finger: 'right-pinky', hand: 'right', nameBn: 'কনিষ্ঠা' }
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  layoutId,
  activeKeyChar = '',
  activeKeyCode = '',
  isShiftActive = false,
  pressedKeyCode = null,
  onVirtualKeyPress,
  showHandGuide = true,
  defaultGuideMode = 'overlay'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localShift, setLocalShift] = useState(false);
  const [guideMode, setGuideMode] = useState<'overlay' | 'bottom' | 'compact' | 'hidden'>(
    defaultGuideMode === 'hidden'
      ? 'hidden'
      : defaultGuideMode === 'bottom'
      ? 'bottom'
      : defaultGuideMode === 'compact'
      ? 'compact'
      : 'overlay'
  );
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.65);
  const [soundTheme, setSoundTheme] = useState<'poly-colors' | 'cherry-blue' | 'creamy' | 'typewriter' | 'silent'>('poly-colors');

  const layout = KEYBOARD_LAYOUTS[layoutId] || KEYBOARD_LAYOUTS.bijoy;
  const keymap = layout.keymap;

  const currentShift = isShiftActive || localShift;

  // Keyboard Rows layout definitions
  const row1 = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'];
  const row2 = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'];
  const row3 = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'];
  const row4 = ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash'];

  // Check which key is currently active
  const isKeyActive = (code: string) => {
    if (activeKeyCode && activeKeyCode === code) return true;
    const entry = keymap[code];
    if (!entry) return false;
    if (activeKeyChar) {
      return (
        entry.label === activeKeyChar ||
        entry.shiftLabel === activeKeyChar ||
        entry.key.toLowerCase() === activeKeyChar.toLowerCase()
      );
    }
    return false;
  };

  // Resolve effective active key code
  let resolvedActiveKeyCode = activeKeyCode;
  if (!resolvedActiveKeyCode && activeKeyChar) {
    if (activeKeyChar === ' ' || activeKeyChar === '\u00A0') {
      resolvedActiveKeyCode = 'Space';
    } else {
      const entryPair = (Object.entries(keymap) as [string, import('../types').KeyMapEntry][]).find(
        ([_, k]) =>
          k.label === activeKeyChar ||
          k.shiftLabel === activeKeyChar ||
          k.key.toLowerCase() === activeKeyChar.toLowerCase()
      );
      if (entryPair) {
        resolvedActiveKeyCode = entryPair[0];
      } else {
        const guidance = getKeystrokeGuidance(activeKeyChar, layoutId);
        if (guidance.length > 0 && guidance[0].code) {
          resolvedActiveKeyCode = guidance[0].code;
        } else {
          const info = getPhysicalKeyInfo(activeKeyChar);
          resolvedActiveKeyCode = info.code;
        }
      }
    }
  }

  // Determine active finger for hand guides
  let activeFinger: FingerAssignment | null = null;
  let activeHand: 'left' | 'right' | null = null;
  if (resolvedActiveKeyCode && keymap[resolvedActiveKeyCode]) {
    activeFinger = keymap[resolvedActiveKeyCode].finger;
    activeHand = keymap[resolvedActiveKeyCode].hand;
  } else if (activeKeyChar) {
    if (activeKeyChar === ' ' || activeKeyChar === '\u00A0') {
      activeFinger = 'thumb';
      activeHand = 'right';
    } else {
      const guidance = getKeystrokeGuidance(activeKeyChar, layoutId);
      if (guidance.length > 0) {
        activeFinger = guidance[0].finger;
        activeHand = guidance[0].hand;
      } else {
        const info = getPhysicalKeyInfo(activeKeyChar);
        activeFinger = info.finger;
        activeHand = info.hand;
      }
    }
  }

  const isLeftShiftRequired = currentShift && (activeHand === 'right' || !activeHand);
  const isRightShiftRequired = currentShift && activeHand === 'left';

  const pressedFinger: FingerAssignment | null =
    pressedKeyCode && keymap[pressedKeyCode] ? keymap[pressedKeyCode].finger : null;

  const handleKeyClick = (code: string) => {
    const entry = keymap[code];
    if (!entry) return;
    soundFx.playKeyClick(entry.finger, entry.hand);
    onVirtualKeyPress?.(entry.key, currentShift);
  };

  const handleSoundThemeChange = (theme: 'poly-colors' | 'cherry-blue' | 'creamy' | 'typewriter' | 'silent') => {
    setSoundTheme(theme);
    soundFx.setTheme(theme);
    if (theme !== 'silent') {
      soundFx.playKeyClick('right-index', 'right');
    }
  };

  const activeFingerDetails = activeFinger
    ? getFingerDetails(activeFinger, activeHand || 'left')
    : null;

  const renderKey = (code: string, widthClass: string = 'flex-1') => {
    const entry = keymap[code];
    if (!entry) return null;

    const isActive = isKeyActive(code);
    const isPressed = pressedKeyCode === code;
    const homeInfo = HOME_ROW_KEYS[code];
    const fingerDetails = getFingerDetails(entry.finger, entry.hand);

    const mainLabel = currentShift ? (entry.shiftLabel || entry.label) : entry.label;
    const subLabel = currentShift ? entry.label : entry.shiftLabel;
    const latinKey = entry.key.toUpperCase();

    return (
      <button
        key={code}
        id={`vkey-${code}`}
        type="button"
        onClick={() => handleKeyClick(code)}
        className={`relative h-12 sm:h-14 ${widthClass} rounded-xs border transition-all duration-100 flex flex-col justify-between p-1 select-none text-left cursor-pointer ${
          fingerDetails.borderClass
        } ${
          isPressed
            ? 'bg-[#0284C7] text-[#FFFFFF] translate-y-0.5 shadow-inner scale-[0.98]'
            : isActive
            ? 'bg-[#0284C7] text-[#FFFFFF] shadow-md ring-2 ring-[#0284C7] ring-offset-1 -translate-y-0.5 z-10'
            : 'bg-[#FCFBF8] text-[#141210] hover:bg-[#EDE9DF] border-[#141210]/20 shadow-xs'
        }`}
      >
        {/* Active Target Finger Floating Indicator Pill */}
        {isActive && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B0000] text-[#F5F2EB] text-[9px] font-tiro font-bold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap z-30 flex items-center gap-1 border border-white/40">
            <span>{fingerDetails.bn}</span>
          </div>
        )}

        {/* Top small corner latin key + shifted preview */}
        <div className={`flex justify-between items-center w-full text-[9px] font-mono leading-none ${isActive ? 'text-white/85' : 'text-[#141210]/50'}`}>
          <span className="font-bold">{latinKey}</span>
          {subLabel && <span className="font-tiro font-bold opacity-80">{subLabel}</span>}
        </div>

        {/* Center Primary Bengali glyph with Tiro Bangla elegance */}
        <div className="flex justify-center items-center flex-1">
          <span
            className={`font-tiro font-bold leading-none ${
              mainLabel.length > 2 ? 'text-xs' : 'text-base sm:text-lg'
            }`}
          >
            {mainLabel}
          </span>
        </div>

        {/* Bottom Tactile Home Anchor Indicator / Bump */}
        <div className="flex justify-between items-center w-full text-[8px] font-tiro leading-none pt-0.5">
          {homeInfo ? (
            <div className={`flex items-center gap-1 ${isActive ? 'text-white/80' : 'text-[#141210]/60'}`}>
              {homeInfo.isBump && (
                <span className={`w-3 h-0.5 rounded-full font-bold ${isActive ? 'bg-white' : 'bg-[#141210]'}`} title="Tactile Bump (উঁচু দাগ)"></span>
              )}
              <span className="text-[7.5px] font-bold opacity-75">{homeInfo.nameBn}</span>
            </div>
          ) : (
            <span />
          )}

          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-200 animate-ping"></span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="w-full bg-[#EDE9DF]/90 p-4 sm:p-5 border-2 border-[#141210]/30 shadow-sm rounded-xs flex flex-col gap-3">
      {/* Newspaper Keyboard Header Bar */}
      <div className="flex flex-wrap justify-between items-center pb-2 border-b border-[#141210]/15 text-xs font-tiro gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[#141210]/80">
            টাইপরাইটার ও লেআউট:
          </span>
          <span className="font-tiro font-bold text-sm text-[#141210]">
            {layout.nativeName} ({layout.name})
          </span>

          {/* Real-time Target Finger Badge */}
          {activeFingerDetails && (
            <div className="flex items-center gap-1.5 bg-[#FCFBF8] border border-[#141210]/20 px-2 py-0.5 rounded-xs shadow-2xs">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeFingerDetails.accentColor }}></span>
              <span className="text-[11px] font-bold text-[#8B0000]">
                {activeFingerDetails.bn}
              </span>
              <span className="text-[10px] font-mono text-[#141210]/60">
                ({activeFingerDetails.en})
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sound Themes Selector */}
          <div className="flex items-center gap-1 bg-[#FCFBF8] border border-[#141210]/25 rounded-xs px-2 py-1 text-[11px] font-tiro shadow-2xs">
            <Volume2 className="w-3.5 h-3.5 text-[#141210]/75" />
            <span className="text-[11px] font-bold text-[#141210]/70 hidden sm:inline">শব্দ:</span>
            <select
              value={soundTheme}
              onChange={(e) => handleSoundThemeChange(e.target.value as any)}
              className="bg-transparent text-[#141210] font-bold text-[11px] outline-none cursor-pointer"
            >
              <option value="poly-colors">১০-আঙুল মেকানিক্যাল (10 Distinct Switch Tones)</option>
              <option value="typewriter">ক্লাসিক টাইপরাইটার (Typewriter Click)</option>
              <option value="cherry-blue">মেকানিক্যাল ব্লু (Cherry Blue)</option>
              <option value="creamy">ক্রিমি থক (Creamy Thock)</option>
              <option value="silent">শব্দহীন (Silent)</option>
            </select>
          </div>

          {/* Finger / Hand Guide Mode Switcher */}
          {showHandGuide && (
            <div className="flex items-center bg-[#FCFBF8] border border-[#141210]/25 rounded-xs p-0.5 text-[11px] font-tiro shadow-2xs">
              <button
                type="button"
                onClick={() => setGuideMode('overlay')}
                className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1 font-bold ${
                  guideMode === 'overlay'
                    ? 'bg-[#141210] text-[#F5F2EB]'
                    : 'text-[#141210]/70 hover:text-[#141210]'
                }`}
                title="কীবোর্ডের উপর আঙুল গাইড"
              >
                <Layers className="w-3 h-3" />
                আঙুল গাইড (Fingers)
              </button>
              <button
                type="button"
                onClick={() => setGuideMode('bottom')}
                className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1 font-bold ${
                  guideMode === 'bottom'
                    ? 'bg-[#141210] text-[#F5F2EB]'
                    : 'text-[#141210]/70 hover:text-[#141210]'
                }`}
                title="নিচে বিস্তারিত হাত গাইড"
              >
                নিচে গাইড (Bottom)
              </button>
              <button
                type="button"
                onClick={() => setGuideMode('hidden')}
                className={`px-1.5 py-0.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  guideMode === 'hidden'
                    ? 'bg-[#141210] text-[#F5F2EB]'
                    : 'text-[#141210]/70 hover:text-[#141210]'
                }`}
                title="লুকান"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Opacity controls for overlay mode */}
          {showHandGuide && guideMode === 'overlay' && (
            <div className="flex items-center gap-1 bg-[#FCFBF8] border border-[#141210]/25 rounded-xs px-1.5 py-0.5 text-[10px] font-mono text-[#141210]/70">
              <Sliders className="w-2.5 h-2.5 opacity-60" />
              {[0.45, 0.65, 0.85].map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOverlayOpacity(op)}
                  className={`px-1 rounded-xs cursor-pointer font-bold ${
                    overlayOpacity === op ? 'bg-[#141210] text-[#F5F2EB]' : 'hover:bg-[#EDE9DF]'
                  }`}
                >
                  {Math.round(op * 100)}%
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setLocalShift((prev) => !prev)}
            className={`px-2.5 py-1 text-xs font-mono font-bold border transition-colors cursor-pointer rounded-xs ${
              currentShift
                ? 'bg-[#141210] text-[#F5F2EB] border-[#141210]'
                : 'bg-[#FCFBF8] text-[#141210]/80 border-[#141210]/25 hover:bg-[#EDE9DF]'
            }`}
          >
            SHIFT: {currentShift ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Keyboard Matrix Container with Responsive Clean Keys and Precise Finger Overlay */}
      <div ref={containerRef} className="relative w-full flex flex-col gap-1 sm:gap-1.5 select-none">
        {/* Animated SVG Finger Overlay Mapped to Exact Key Positions */}
        {showHandGuide && guideMode === 'overlay' && (
          <KeyboardHandOverlay
            containerRef={containerRef}
            activeFinger={activeFinger}
            activeHand={activeHand}
            activeKeyCode={resolvedActiveKeyCode || null}
            activeKeyChar={activeKeyChar}
            isShiftActive={currentShift}
            pressedFinger={pressedFinger}
            opacity={overlayOpacity}
          />
        )}

        {/* Row 1: Number Row */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          {row1.map((c) => renderKey(c))}
          <div id="vkey-Backspace" className="w-14 sm:w-16 h-12 sm:h-14 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-rose-500">
            Bksp
          </div>
        </div>

        {/* Row 2: Top Row */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          <div id="vkey-Tab" className="w-10 sm:w-12 h-12 sm:h-14 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-rose-500">
            Tab
          </div>
          {row2.map((c) => renderKey(c))}
          <div id="vkey-Backslash" className="w-10 sm:w-12 h-12 sm:h-14 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-rose-500">
            \
          </div>
        </div>

        {/* Row 3: Home Row (ASDF JKL;) */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          <div id="vkey-CapsLock" className="w-12 sm:w-14 h-12 sm:h-14 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-rose-500">
            Caps
          </div>
          {row3.map((c) => renderKey(c))}
          <div id="vkey-Enter" className="w-14 sm:w-18 h-12 sm:h-14 bg-[#141210]/15 border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase font-bold text-[#141210] rounded-xs border-b-2 border-b-rose-500">
            Enter
          </div>
        </div>

        {/* Row 4: Bottom Row */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          {/* Left Shift Button with Pinky Shift Pulse */}
          <button
            id="vkey-ShiftLeft"
            type="button"
            onClick={() => setLocalShift((prev) => !prev)}
            className={`w-14 sm:w-18 h-12 sm:h-14 border text-[10px] font-mono uppercase font-bold flex flex-col items-center justify-center cursor-pointer transition-colors rounded-xs border-b-2 border-b-rose-500 ${
              isLeftShiftRequired
                ? 'bg-[#8B0000] text-white ring-2 ring-[#8B0000] animate-pulse'
                : currentShift
                ? 'bg-[#141210] text-[#F5F2EB]'
                : 'bg-[#FCFBF8] border-[#141210]/25 text-[#141210]'
            }`}
          >
            <span>Shift</span>
            {isLeftShiftRequired && (
              <span className="text-[7.5px] font-tiro font-normal text-white/90">বাম কনিষ্ঠা</span>
            )}
          </button>
          {row4.map((c) => renderKey(c))}
          {/* Right Shift Button with Pinky Shift Pulse */}
          <button
            id="vkey-ShiftRight"
            type="button"
            onClick={() => setLocalShift((prev) => !prev)}
            className={`w-14 sm:w-18 h-12 sm:h-14 border text-[10px] font-mono uppercase font-bold flex flex-col items-center justify-center cursor-pointer transition-colors rounded-xs border-b-2 border-b-rose-500 ${
              isRightShiftRequired
                ? 'bg-[#8B0000] text-white ring-2 ring-[#8B0000] animate-pulse'
                : currentShift
                ? 'bg-[#141210] text-[#F5F2EB]'
                : 'bg-[#FCFBF8] border-[#141210]/25 text-[#141210]'
            }`}
          >
            <span>Shift</span>
            {isRightShiftRequired && (
              <span className="text-[7.5px] font-tiro font-normal text-white/90">ডান কনিষ্ঠা</span>
            )}
          </button>
        </div>

        {/* Row 5: Spacebar & Modifiers */}
        <div className="flex gap-1 sm:gap-1.5 w-full justify-center">
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-rose-500">
            Ctrl
          </div>
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-purple-500">
            Alt
          </div>
          <button
            id="vkey-Space"
            type="button"
            onClick={() => {
              soundFx.playKeyClick('thumb', 'right');
              onVirtualKeyPress?.(' ', false);
            }}
            className={`w-64 sm:w-80 h-10 rounded-xs border text-xs font-tiro font-bold uppercase flex flex-col items-center justify-center cursor-pointer transition-all border-b-2 border-b-purple-500 ${
              isKeyActive('Space')
                ? 'bg-[#0284C7] text-[#FFFFFF] ring-2 ring-[#0284C7]'
                : 'bg-[#FCFBF8] text-[#141210]/70 hover:bg-[#EDE9DF] border-[#141210]/25'
            }`}
          >
            <span>Space (স্পেসবার)</span>
            <span className="text-[8px] font-tiro font-normal opacity-75">উভয় বৃদ্ধাঙ্গুলির অবস্থান (Thumbs)</span>
          </button>
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-purple-500">
            Alt
          </div>
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs border-b-2 border-b-rose-500">
            Ctrl
          </div>
        </div>
      </div>

      {/* Anatomical Hand & Finger Guide Display */}
      {showHandGuide && (guideMode === 'bottom' || guideMode === 'compact') && (
        <HandGuides
          activeFinger={activeFinger}
          activeHand={activeHand}
          activeKeyChar={activeKeyChar}
          activeKeyCode={resolvedActiveKeyCode}
          isShiftActive={currentShift}
          pressedFinger={pressedFinger}
        />
      )}
    </div>
  );
};

