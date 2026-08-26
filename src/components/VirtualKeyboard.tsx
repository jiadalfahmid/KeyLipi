import React, { useState } from 'react';
import { KEYBOARD_LAYOUTS } from '../lib/keyboardAdapters';
import { FingerAssignment, KeyboardLayoutId } from '../types';
import { HandGuides } from './HandGuides';
import { KeyboardHandOverlay } from './KeyboardHandOverlay';
import { soundFx } from '../lib/audio';
import { Layers, Sliders, EyeOff, Volume2, Sparkles } from 'lucide-react';

interface VirtualKeyboardProps {
  layoutId: KeyboardLayoutId;
  activeKeyChar?: string;
  activeKeyCode?: string;
  isShiftActive?: boolean;
  pressedKeyCode?: string | null;
  onVirtualKeyPress?: (key: string, isShift: boolean) => void;
  showHandGuide?: boolean;
  defaultGuideMode?: 'overlay' | 'bottom' | 'hidden';
}

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
  const [localShift, setLocalShift] = useState(false);
  const [guideMode, setGuideMode] = useState<'overlay' | 'bottom' | 'hidden'>(defaultGuideMode);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.65);
  const [soundTheme, setSoundTheme] = useState<'poly-colors' | 'cherry-blue' | 'creamy' | 'typewriter' | 'silent'>('poly-colors');

  const layout = KEYBOARD_LAYOUTS[layoutId] || KEYBOARD_LAYOUTS.bijoy;
  const keymap = layout.keymap;

  const currentShift = isShiftActive || localShift;

  // Finger zone color subtle borders (matching the 10 distinct color/sound zones)
  const getFingerBorder = (finger: FingerAssignment) => {
    switch (finger) {
      case 'left-pinky':
      case 'right-pinky':
        return 'border-b-2 border-b-rose-500';
      case 'left-ring':
      case 'right-ring':
        return 'border-b-2 border-b-amber-500';
      case 'left-middle':
      case 'right-middle':
        return 'border-b-2 border-b-sky-500';
      case 'left-index':
      case 'right-index':
        return 'border-b-2 border-b-emerald-500';
      case 'thumb':
        return 'border-b-2 border-b-purple-500';
      default:
        return 'border-b border-[#141210]/15';
    }
  };

  // Keyboard Rows layout definitions
  const row1 = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'];
  const row2 = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'];
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
    if (activeKeyChar === ' ') {
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
    if (activeKeyChar === ' ') {
      activeFinger = 'thumb';
      activeHand = null;
    } else {
      const entry = (Object.values(keymap) as import('../types').KeyMapEntry[]).find(
        (k) =>
          k.label === activeKeyChar ||
          k.shiftLabel === activeKeyChar ||
          k.key.toLowerCase() === activeKeyChar.toLowerCase()
      );
      if (entry) {
        activeFinger = entry.finger;
        activeHand = entry.hand;
      }
    }
  }

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

  const renderKey = (code: string, widthClass: string = 'flex-1') => {
    const entry = keymap[code];
    if (!entry) return null;

    const isActive = isKeyActive(code);
    const isPressed = pressedKeyCode === code;

    const mainLabel = currentShift ? (entry.shiftLabel || entry.label) : entry.label;
    const subLabel = currentShift ? entry.label : entry.shiftLabel;
    const latinKey = entry.key.toUpperCase();

    return (
      <button
        key={code}
        type="button"
        onClick={() => handleKeyClick(code)}
        className={`relative h-12 sm:h-13 ${widthClass} rounded-xs border transition-all duration-100 flex flex-col justify-between p-1 select-none text-left cursor-pointer ${getFingerBorder(
          entry.finger
        )} ${
          isPressed
            ? 'bg-[#0284C7] text-[#FFFFFF] translate-y-0.5 shadow-inner scale-[0.98]'
            : isActive
            ? 'bg-[#0284C7] text-[#FFFFFF] shadow-md ring-2 ring-[#0284C7] ring-offset-1 -translate-y-0.5'
            : 'bg-[#FCFBF8] text-[#141210] hover:bg-[#EDE9DF] border-[#141210]/20 shadow-xs'
        }`}
      >
        {/* Top small corner latin key + shifted preview */}
        <div className={`flex justify-between items-center w-full text-[9px] font-mono leading-none ${isActive ? 'text-white/85' : 'text-[#141210]/50'}`}>
          <span>{latinKey}</span>
          {subLabel && <span className="font-tiro font-bold">{subLabel}</span>}
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

        {/* Active Key Beacon */}
        {isActive && (
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-200 animate-ping"></div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full bg-[#EDE9DF]/90 p-4 sm:p-5 border-2 border-[#141210]/30 shadow-sm rounded-xs flex flex-col gap-2">
      {/* Newspaper Keyboard Header Bar */}
      <div className="flex flex-wrap justify-between items-center pb-2 border-b border-[#141210]/15 text-xs font-tiro gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#141210]/70 bg-[#141210]/10 px-1.5 py-0.5 rounded-xs">
            টাইপরাইটার ও লেআউট:
          </span>
          <span className="font-tiro font-bold text-sm text-[#141210]">
            {layout.nativeName} ({layout.name})
          </span>
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

          {/* Finger Overlay Mode Switcher */}
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
                title="কীবোর্ডের উপর আঙুল প্রদর্শন"
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

          {/* Opacity controls */}
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

      {/* Keyboard Matrix Container with Floating Translucent Finger Overlay (No Palm) */}
      <div className="relative w-full flex flex-col gap-1 sm:gap-1.5 select-none">
        {/* Animated Finger Overlay Directly on Top of Keys */}
        {showHandGuide && guideMode === 'overlay' && (
          <KeyboardHandOverlay
            activeFinger={activeFinger}
            activeHand={activeHand}
            activeKeyChar={activeKeyChar}
            activeKeyCode={resolvedActiveKeyCode}
            isShiftActive={currentShift}
            pressedFinger={pressedFinger}
            opacity={overlayOpacity}
          />
        )}

        {/* Row 1: Number Row */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          {row1.map((c) => renderKey(c))}
          <div className="w-14 sm:w-16 h-12 sm:h-13 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            Bksp
          </div>
        </div>

        {/* Row 2: Top Row */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          <div className="w-10 sm:w-12 h-12 sm:h-13 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            Tab
          </div>
          {row2.map((c) => renderKey(c))}
          <div className="w-10 sm:w-12 h-12 sm:h-13 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            \
          </div>
        </div>

        {/* Row 3: Home Row */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          <div className="w-12 sm:w-14 h-12 sm:h-13 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            Caps
          </div>
          {row3.map((c) => renderKey(c))}
          <div className="w-14 sm:w-18 h-12 sm:h-13 bg-[#141210]/15 border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase font-bold text-[#141210] rounded-xs">
            Enter
          </div>
        </div>

        {/* Row 4: Bottom Row */}
        <div className="flex gap-1 sm:gap-1.5 w-full">
          <button
            type="button"
            onClick={() => setLocalShift((prev) => !prev)}
            className={`w-14 sm:w-18 h-12 sm:h-13 border text-[10px] font-mono uppercase font-bold flex items-center justify-center cursor-pointer transition-colors rounded-xs ${
              currentShift ? 'bg-[#141210] text-[#F5F2EB]' : 'bg-[#FCFBF8] border-[#141210]/25 text-[#141210]'
            }`}
          >
            Shift
          </button>
          {row4.map((c) => renderKey(c))}
          <button
            type="button"
            onClick={() => setLocalShift((prev) => !prev)}
            className={`w-14 sm:w-18 h-12 sm:h-13 border text-[10px] font-mono uppercase font-bold flex items-center justify-center cursor-pointer transition-colors rounded-xs ${
              currentShift ? 'bg-[#141210] text-[#F5F2EB]' : 'bg-[#FCFBF8] border-[#141210]/25 text-[#141210]'
            }`}
          >
            Shift
          </button>
        </div>

        {/* Row 5: Spacebar */}
        <div className="flex gap-1 sm:gap-1.5 w-full justify-center">
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            Ctrl
          </div>
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            Alt
          </div>
          <button
            type="button"
            onClick={() => {
              soundFx.playKeyClick('thumb', 'right');
              onVirtualKeyPress?.(' ', false);
            }}
            className={`w-64 sm:w-80 h-10 rounded-xs border text-xs font-tiro font-bold uppercase flex items-center justify-center cursor-pointer transition-all ${
              isKeyActive('Space')
                ? 'bg-[#0284C7] text-[#FFFFFF] ring-2 ring-[#0284C7]'
                : 'bg-[#FCFBF8] text-[#141210]/70 hover:bg-[#EDE9DF] border-[#141210]/25'
            }`}
          >
            Space (স্পেসবার)
          </button>
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            Alt
          </div>
          <div className="w-12 h-10 bg-[#FCFBF8] border border-[#141210]/25 flex items-center justify-center text-[10px] font-mono uppercase text-[#141210]/60 rounded-xs">
            Ctrl
          </div>
        </div>
      </div>

      {/* Hand guides when in 'bottom' mode */}
      {showHandGuide && guideMode === 'bottom' && (
        <HandGuides
          activeFinger={activeFinger}
          activeHand={activeHand}
          activeKeyChar={activeKeyChar}
          activeKeyCode={activeKeyCode}
          isShiftActive={currentShift}
          pressedFinger={pressedFinger}
        />
      )}
    </div>
  );
};
