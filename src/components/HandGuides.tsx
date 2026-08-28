import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, Info, Keyboard } from 'lucide-react';
import { FingerAssignment, Hand } from '../types';

interface HandGuidesProps {
  activeFinger: FingerAssignment | null;
  activeHand: Hand | null;
  activeKeyChar?: string;
  activeKeyCode?: string;
  isShiftActive?: boolean;
  pressedFinger?: FingerAssignment | null;
}

interface FingerConfig {
  id: FingerAssignment;
  hand: Hand;
  nameBn: string;
  nameEn: string;
  keys: string;
  colorName: string;
  bgHex: string;
  accentHex: string;
  glowHex: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  tipX: number;
  tipY: number;
  homeKey?: string;
  hasBump?: boolean;
}

export const HandGuides: React.FC<HandGuidesProps> = ({
  activeFinger,
  activeHand,
  activeKeyChar = '',
  activeKeyCode = '',
  isShiftActive = false,
  pressedFinger = null
}) => {
  const [viewMode, setViewMode] = useState<'animated-hands' | 'compact'>('animated-hands');

  // Opposite hand pinky shift rule:
  // If the active key is on the right hand and shift is needed -> left pinky presses Shift
  // If active key is on the left hand and shift is needed -> right pinky presses Shift
  const isLeftShiftActive = isShiftActive && (activeHand === 'right' || !activeHand);
  const isRightShiftActive = isShiftActive && activeHand === 'left';

  // Finger definitions with geometry for SVG rendering
  const leftFingers: FingerConfig[] = [
    {
      id: 'left-pinky',
      hand: 'left',
      nameBn: 'কনিষ্ঠা',
      nameEn: 'Pinky',
      keys: 'A Q Z 1 ~ Shift',
      colorName: 'Rose',
      bgHex: '#FFE4E6',
      accentHex: '#E11D48',
      glowHex: 'rgba(225, 29, 72, 0.4)',
      x: 20,
      y: 50,
      width: 22,
      height: 60,
      rx: 11,
      tipX: 31,
      tipY: 50,
      homeKey: 'A'
    },
    {
      id: 'left-ring',
      hand: 'left',
      nameBn: 'অনামিকা',
      nameEn: 'Ring',
      keys: 'S W X 2',
      colorName: 'Amber',
      bgHex: '#FEF3C7',
      accentHex: '#D97706',
      glowHex: 'rgba(217, 119, 6, 0.4)',
      x: 48,
      y: 26,
      width: 23,
      height: 84,
      rx: 11.5,
      tipX: 59.5,
      tipY: 26,
      homeKey: 'S'
    },
    {
      id: 'left-middle',
      hand: 'left',
      nameBn: 'মধ্যমা',
      nameEn: 'Middle',
      keys: 'D E C 3',
      colorName: 'Sky',
      bgHex: '#E0F2FE',
      accentHex: '#0284C7',
      glowHex: 'rgba(2, 132, 199, 0.4)',
      x: 77,
      y: 12,
      width: 24,
      height: 98,
      rx: 12,
      tipX: 89,
      tipY: 12,
      homeKey: 'D'
    },
    {
      id: 'left-index',
      hand: 'left',
      nameBn: 'তর্জনী',
      nameEn: 'Index',
      keys: 'F G R T V B 4 5',
      colorName: 'Emerald',
      bgHex: '#D1FAE5',
      accentHex: '#059669',
      glowHex: 'rgba(5, 150, 105, 0.4)',
      x: 107,
      y: 28,
      width: 24,
      height: 82,
      rx: 12,
      tipX: 119,
      tipY: 28,
      homeKey: 'F',
      hasBump: true
    },
    {
      id: 'thumb',
      hand: 'left',
      nameBn: 'বৃদ্ধাঙ্গুলি',
      nameEn: 'Thumb',
      keys: 'Space',
      colorName: 'Purple',
      bgHex: '#EDE9FE',
      accentHex: '#7C3AED',
      glowHex: 'rgba(124, 58, 237, 0.4)',
      x: 136,
      y: 80,
      width: 24,
      height: 52,
      rx: 12,
      tipX: 148,
      tipY: 80,
      homeKey: 'Space'
    }
  ];

  const rightFingers: FingerConfig[] = [
    {
      id: 'thumb',
      hand: 'right',
      nameBn: 'বৃদ্ধাঙ্গুলি',
      nameEn: 'Thumb',
      keys: 'Space',
      colorName: 'Purple',
      bgHex: '#EDE9FE',
      accentHex: '#7C3AED',
      glowHex: 'rgba(124, 58, 237, 0.4)',
      x: 20,
      y: 80,
      width: 24,
      height: 52,
      rx: 12,
      tipX: 32,
      tipY: 80,
      homeKey: 'Space'
    },
    {
      id: 'right-index',
      hand: 'right',
      nameBn: 'তর্জনী',
      nameEn: 'Index',
      keys: 'J H U Y N M 6 7',
      colorName: 'Emerald',
      bgHex: '#D1FAE5',
      accentHex: '#059669',
      glowHex: 'rgba(5, 150, 105, 0.4)',
      x: 49,
      y: 28,
      width: 24,
      height: 82,
      rx: 12,
      tipX: 61,
      tipY: 28,
      homeKey: 'J',
      hasBump: true
    },
    {
      id: 'right-middle',
      hand: 'right',
      nameBn: 'মধ্যমা',
      nameEn: 'Middle',
      keys: 'K I , 8',
      colorName: 'Sky',
      bgHex: '#E0F2FE',
      accentHex: '#0284C7',
      glowHex: 'rgba(2, 132, 199, 0.4)',
      x: 79,
      y: 12,
      width: 24,
      height: 98,
      rx: 12,
      tipX: 91,
      tipY: 12,
      homeKey: 'K'
    },
    {
      id: 'right-ring',
      hand: 'right',
      nameBn: 'অনামিকা',
      nameEn: 'Ring',
      keys: 'L O . 9',
      colorName: 'Amber',
      bgHex: '#FEF3C7',
      accentHex: '#D97706',
      glowHex: 'rgba(217, 119, 6, 0.4)',
      x: 109,
      y: 26,
      width: 23,
      height: 84,
      rx: 11.5,
      tipX: 120.5,
      tipY: 26,
      homeKey: 'L'
    },
    {
      id: 'right-pinky',
      hand: 'right',
      nameBn: 'কনিষ্ঠা',
      nameEn: 'Pinky',
      keys: '; P / [ ] 0 Shift',
      colorName: 'Rose',
      bgHex: '#FFE4E6',
      accentHex: '#E11D48',
      glowHex: 'rgba(225, 29, 72, 0.4)',
      x: 138,
      y: 50,
      width: 22,
      height: 60,
      rx: 11,
      tipX: 149,
      tipY: 50,
      homeKey: ';'
    }
  ];

  // Helper to determine if a specific finger on a specific hand is active
  const isFingerActive = (f: FingerConfig): boolean => {
    // Check if finger is the primary striking finger
    if (activeFinger === f.id) {
      if (f.id === 'thumb') return true;
      if (activeHand === null || activeHand === f.hand) return true;
    }
    // Check if left pinky is active for Shift
    if (f.id === 'left-pinky' && isLeftShiftActive) {
      return true;
    }
    // Check if right pinky is active for Shift
    if (f.id === 'right-pinky' && isRightShiftActive) {
      return true;
    }
    return false;
  };

  // Helper to determine if a finger is currently physically pressed down
  const isFingerPressed = (f: FingerConfig): boolean => {
    return pressedFinger === f.id;
  };

  // Render an individual animated SVG Hand
  const renderSvgHand = (handType: Hand, fingers: FingerConfig[], titleBn: string, titleEn: string) => {
    const isShiftPinkyActive =
      (handType === 'left' && isLeftShiftActive) || (handType === 'right' && isRightShiftActive);

    return (
      <div className="flex-1 min-w-[240px] max-w-[320px] bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-sm p-3 shadow-xs flex flex-col items-center">
        {/* Hand Title Header */}
        <div className="w-full flex justify-between items-center pb-2 mb-2 border-b border-[#1A1A1A]/10 text-xs">
          <span className="font-serif-editorial font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1A1A1A]"></span>
            {titleBn} ({titleEn})
          </span>
          <span className="text-[10px] font-mono text-[#1A1A1A]/50 uppercase">
            {handType === 'left' ? 'A S D F Base' : 'J K L ; Base'}
          </span>
        </div>

        {/* SVG Interactive Animated Hand Container */}
        <div className="relative w-full aspect-[180/160] max-h-[175px] flex items-center justify-center select-none">
          <svg
            viewBox="0 0 180 170"
            className="w-full h-full drop-shadow-xs"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Radial gradient glow for active fingertip beacons */}
              <filter id={`glow-${handType}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Palm & Wrist Base */}
            <path
              d={
                handType === 'left'
                  ? 'M 22 105 C 18 135 30 162 55 165 L 135 165 C 158 162 165 130 155 110 C 145 95 130 90 120 95 C 110 85 90 85 80 88 C 70 85 50 88 45 92 C 35 90 25 95 22 105 Z'
                  : 'M 158 105 C 162 135 150 162 125 165 L 45 165 C 22 162 15 130 25 110 C 35 95 50 90 60 95 C 70 85 90 85 100 88 C 110 85 130 88 135 92 C 145 90 155 95 158 105 Z'
              }
              fill="#F5F3EF"
              stroke="#D4CEBE"
              strokeWidth="1.5"
            />

            {/* Wrist Rest Band */}
            <rect
              x={handType === 'left' ? 45 : 35}
              y="156"
              width="100"
              height="8"
              rx="4"
              fill="#EAE8E3"
              stroke="#C9C2B0"
              strokeWidth="1"
            />

            {/* Fingers Rendering with Framer Motion Animation */}
            {fingers.map((f) => {
              const active = isFingerActive(f);
              const pressed = isFingerPressed(f);
              const isShiftIndicator =
                (f.id === 'left-pinky' && isLeftShiftActive) ||
                (f.id === 'right-pinky' && isRightShiftActive);

              return (
                <g key={f.id + f.hand}>
                  {/* Active Beacon Pulse Rings */}
                  {active && (
                    <motion.circle
                      cx={f.tipX}
                      cy={f.tipY}
                      r={14}
                      fill={f.glowHex}
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* Animated Finger Element */}
                  <motion.g
                    initial={false}
                    animate={
                      pressed
                        ? { y: 4, scaleY: 0.96 }
                        : active
                        ? {
                            y: [-1, -7, -1],
                            transition: {
                              duration: 0.85,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }
                          }
                        : { y: 0, scaleY: 1 }
                    }
                    style={{ originX: `${f.tipX}px`, originY: '140px' }}
                  >
                    {/* Finger Body Rectangle / Capsule */}
                    <rect
                      x={f.x}
                      y={f.y}
                      width={f.width}
                      height={f.height}
                      rx={f.rx}
                      fill={active ? f.bgHex : '#FAF8F5'}
                      stroke={active ? f.accentHex : '#D4CEBE'}
                      strokeWidth={active ? '2.5' : '1.5'}
                      className="transition-colors duration-150"
                    />

                    {/* Fingertip Highlight / Contact Pad */}
                    <circle
                      cx={f.tipX}
                      cy={f.tipY + 11}
                      r={active ? 7.5 : 5.5}
                      fill={active ? f.accentHex : f.bgHex}
                      opacity={active ? 1 : 0.75}
                      className="transition-all duration-150"
                    />

                    {/* Finger Nail Polish / Accent Tip */}
                    <path
                      d={`M ${f.tipX - 6} ${f.tipY + 5} Q ${f.tipX} ${f.tipY + 2} ${f.tipX + 6} ${f.tipY + 5}`}
                      stroke={active ? '#FFFFFF' : f.accentHex}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    {/* Tactile Bump for Home Anchor (F or J) */}
                    {f.hasBump && (
                      <g>
                        <rect
                          x={f.tipX - 4}
                          y={f.tipY + 22}
                          width="8"
                          height="2"
                          rx="1"
                          fill="#1A1A1A"
                          opacity="0.8"
                        />
                        <text
                          x={f.tipX}
                          y={f.tipY + 34}
                          textAnchor="middle"
                          fontSize="6.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#1A1A1A"
                          opacity="0.6"
                        >
                          BUMP
                        </text>
                      </g>
                    )}

                    {/* Home Key Label on Finger Base */}
                    {f.homeKey && !f.hasBump && (
                      <text
                        x={f.tipX}
                        y={f.tipY + 26}
                        textAnchor="middle"
                        fontSize="7"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill="#1A1A1A"
                        opacity={active ? '0.9' : '0.4'}
                      >
                        {f.homeKey}
                      </text>
                    )}

                    {/* Floating Target Key Indicator Badge */}
                    {active && (
                      <g>
                        {/* Target badge background */}
                        <motion.rect
                          x={f.tipX - 16}
                          y={f.tipY - 22}
                          width="32"
                          height="18"
                          rx="3"
                          fill="#8B0000"
                          stroke="#F5F2EB"
                          strokeWidth="1"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="drop-shadow-md"
                        />
                        {/* Downward pointer triangle */}
                        <polygon
                          points={`${f.tipX - 3},${f.tipY - 4} ${f.tipX + 3},${f.tipY - 4} ${f.tipX},${f.tipY - 1}`}
                          fill="#8B0000"
                        />
                        {/* Target key text inside badge */}
                        <text
                          x={f.tipX}
                          y={f.tipY - 10}
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          fill="#F5F2EB"
                        >
                          {isShiftIndicator
                            ? 'SHIFT'
                            : activeKeyChar
                            ? activeKeyChar.length > 2
                              ? activeKeyChar.slice(0, 2)
                              : activeKeyChar
                            : f.homeKey}
                        </text>
                      </g>
                    )}
                  </motion.g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Finger Quick Labels Bar */}
        <div className="w-full grid grid-cols-5 gap-1 pt-2 border-t border-[#141210]/15 text-center">
          {fingers.map((f) => {
            const active = isFingerActive(f);
            return (
              <div
                key={`lbl-${f.id}-${f.hand}`}
                className={`py-1 px-0.5 rounded-xs transition-all duration-150 flex flex-col items-center ${
                  active
                    ? 'bg-[#141210] text-[#F5F2EB] shadow-xs'
                    : 'bg-[#EDE9DF]/60 text-[#141210]/70 hover:bg-[#EDE9DF]'
                }`}
              >
                <span className="text-[9px] font-tiro font-bold leading-tight truncate w-full">
                  {f.nameBn}
                </span>
                <span
                  className="text-[8px] font-mono leading-none opacity-70 truncate w-full"
                  title={f.keys}
                >
                  {f.nameEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Determine friendly active instruction text
  const getActiveInstruction = () => {
    if (!activeFinger && !activeKeyChar) {
      return {
        bn: 'হাত দুটি A S D F এবং J K L ; হোম কীতে স্বাভাবিকভাবে রাখুন।',
        en: 'Rest fingers comfortably on A S D F and J K L ; home keys.',
        fingerText: 'হোম পজিশন (Home Anchors)'
      };
    }

    if (activeFinger === 'thumb') {
      return {
        bn: 'ডান অথবা বাম বৃদ্ধাঙ্গুলি দিয়ে স্পেসবার (Spacebar) আলতো চাপ দিন।',
        en: 'Strike the Spacebar with your thumb.',
        fingerText: 'বৃদ্ধাঙ্গুলি &rarr; Spacebar'
      };
    }

    let strikingHandText = activeHand === 'left' ? 'বাম হাত' : 'ডান হাত';
    let fingerName = '';
    const allFingers = [...leftFingers, ...rightFingers];
    const match = allFingers.find((f) => f.id === activeFinger && (!activeHand || f.hand === activeHand));
    if (match) {
      fingerName = `${match.nameBn} (${match.nameEn})`;
    }

    if (isShiftActive) {
      const shiftPinkyText = activeHand === 'right' ? 'বাম কনিষ্ঠা (Left Pinky: Shift)' : 'ডান কনিষ্ঠা (Right Pinky: Shift)';
      return {
        bn: `${shiftPinkyText} চেপে ধরে ${strikingHandText}ের ${fingerName} দিয়ে '${activeKeyChar}' চাপুন।`,
        en: `Hold ${shiftPinkyText} and strike '${activeKeyChar}' with ${strikingHandText} ${fingerName}.`,
        fingerText: `${shiftPinkyText} + ${strikingHandText} ${fingerName}`
      };
    }

    return {
      bn: `${strikingHandText}ের ${fingerName} দিয়ে '${activeKeyChar}' কি চাপুন ও হোম কীতে ফিরুন।`,
      en: `Strike '${activeKeyChar}' using ${strikingHandText} ${fingerName} and return to home base.`,
      fingerText: `${strikingHandText} ${fingerName} &rarr; '${activeKeyChar}'`
    };
  };

  const instruction = getActiveInstruction();

  return (
    <div className="w-full bg-[#EDE9DF]/60 border-2 border-[#141210]/20 rounded-xs p-3 sm:p-4 flex flex-col gap-3 font-tiro shadow-2xs">
      {/* Hand Guide Header with Live Step Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#141210]/15 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#8B0000] text-[#F5F2EB] flex items-center justify-center text-xs shadow-2xs">
            <Keyboard className="w-3 h-3" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#8B0000] block">
              FINGER MECHANICS &bull; টাচ-টাইপিং আঙুল নির্দেশিকা
            </span>
            <span className="text-xs font-tiro font-bold text-[#141210]">
              {instruction.fingerText}
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 font-mono">
          <button
            type="button"
            onClick={() => setViewMode('animated-hands')}
            className={`px-2.5 py-1 text-[11px] font-bold transition-all rounded-xs cursor-pointer ${
              viewMode === 'animated-hands'
                ? 'bg-[#141210] text-[#F5F2EB] shadow-xs'
                : 'bg-[#FCFBF8] text-[#141210]/70 border border-[#141210]/20 hover:bg-[#EDE9DF]'
            }`}
          >
            হাত অ্যানিমেশন (Hands)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('compact')}
            className={`px-2.5 py-1 text-[11px] font-bold transition-all rounded-xs cursor-pointer ${
              viewMode === 'compact'
                ? 'bg-[#141210] text-[#F5F2EB] shadow-xs'
                : 'bg-[#FCFBF8] text-[#141210]/70 border border-[#141210]/20 hover:bg-[#EDE9DF]'
            }`}
          >
            কমপ্যাক্ট বার (Compact)
          </button>
        </div>
      </div>

      {/* Main Animated Hands Section */}
      <AnimatePresence mode="wait">
        {viewMode === 'animated-hands' ? (
          <motion.div
            key="animated-hands-view"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-col gap-3"
          >
            {/* Live Instruction Pill */}
            <div className="bg-[#FCFBF8] border border-[#141210]/15 p-2.5 rounded-xs flex items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <p className="font-tiro font-bold text-[#141210]">
                  {instruction.bn}
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#141210]/60 hidden sm:inline-block">
                F ও J কীদ্বয়ে উঁচু দাগ (Tactile Bumps) হাতকে সঠিক অবস্থানে রাখে
              </span>
            </div>

            {/* Left & Right 2D Animated Hands Display */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {renderSvgHand('left', leftFingers, 'বাম হাত', 'Left Hand')}
              {renderSvgHand('right', rightFingers, 'ডান হাত', 'Right Hand')}
            </div>
          </motion.div>
        ) : (
          /* Compact Finger Color Zones Bar */
          <motion.div
            key="compact-view"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FCFBF8] border border-[#141210]/20 text-xs rounded-xs shadow-2xs"
          >
            {/* Left Hand Compact */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8B0000]">
                বাম হাত:
              </span>
              <div className="flex items-center gap-1">
                {leftFingers.map((f) => {
                  const active = isFingerActive(f);
                  return (
                    <span
                      key={`comp-l-${f.id}`}
                      className={`px-2 py-0.5 text-[11px] font-tiro rounded-xs transition-all ${
                        active
                          ? 'bg-[#141210] text-[#F5F2EB] font-bold ring-2 ring-[#8B0000]'
                          : 'bg-[#EDE9DF] text-[#141210]/70 border border-[#141210]/15'
                      }`}
                      title={`${f.nameEn} (${f.keys})`}
                    >
                      {f.nameBn}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Thumb */}
            <div className="flex items-center gap-1">
              <span
                className={`px-2.5 py-0.5 text-[11px] font-tiro rounded-xs transition-all ${
                  activeFinger === 'thumb'
                    ? 'bg-[#141210] text-[#F5F2EB] font-bold ring-2 ring-[#8B0000]'
                    : 'bg-[#EDE9DF] text-[#141210]/70 border border-[#141210]/15'
                }`}
                title="Thumb (Spacebar)"
              >
                বৃদ্ধাঙ্গুলি (Space)
              </span>
            </div>

            {/* Right Hand Compact */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {rightFingers.map((f) => {
                  const active = isFingerActive(f);
                  return (
                    <span
                      key={`comp-r-${f.id}`}
                      className={`px-2 py-0.5 text-[11px] font-tiro rounded-xs transition-all ${
                        active
                          ? 'bg-[#141210] text-[#F5F2EB] font-bold ring-2 ring-[#8B0000]'
                          : 'bg-[#EDE9DF] text-[#141210]/70 border border-[#141210]/15'
                      }`}
                      title={`${f.nameEn} (${f.keys})`}
                    >
                      {f.nameBn}
                    </span>
                  );
                })}
              </div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8B0000]">
                : ডান হাত
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
