import React from 'react';
import { motion } from 'motion/react';
import { FingerAssignment, Hand } from '../types';

export interface KeyboardHandOverlayProps {
  activeFinger: FingerAssignment | null;
  activeHand: Hand | null;
  activeKeyChar?: string;
  activeKeyCode?: string;
  isShiftActive?: boolean;
  pressedFinger?: FingerAssignment | null;
  opacity?: number;
}

// Normalized coordinate centers (0-1000 X, 0-270 Y) for standard ANSI/ISO keyboard layout
export const KEY_COORDINATES: Record<
  string,
  { x: number; y: number; finger: FingerAssignment; hand: Hand; label: string }
> = {
  // Row 1: Number Row (Y = 28)
  Backquote: { x: 33, y: 28, finger: 'left-pinky', hand: 'left', label: '`' },
  Digit1: { x: 99, y: 28, finger: 'left-pinky', hand: 'left', label: '1' },
  Digit2: { x: 165, y: 28, finger: 'left-ring', hand: 'left', label: '2' },
  Digit3: { x: 231, y: 28, finger: 'left-middle', hand: 'left', label: '3' },
  Digit4: { x: 297, y: 28, finger: 'left-index', hand: 'left', label: '4' },
  Digit5: { x: 363, y: 28, finger: 'left-index', hand: 'left', label: '5' },
  Digit6: { x: 429, y: 28, finger: 'right-index', hand: 'right', label: '6' },
  Digit7: { x: 495, y: 28, finger: 'right-index', hand: 'right', label: '7' },
  Digit8: { x: 561, y: 28, finger: 'right-middle', hand: 'right', label: '8' },
  Digit9: { x: 627, y: 28, finger: 'right-ring', hand: 'right', label: '9' },
  Digit0: { x: 693, y: 28, finger: 'right-pinky', hand: 'right', label: '0' },
  Minus: { x: 759, y: 28, finger: 'right-pinky', hand: 'right', label: '-' },
  Equal: { x: 825, y: 28, finger: 'right-pinky', hand: 'right', label: '=' },
  Backspace: { x: 930, y: 28, finger: 'right-pinky', hand: 'right', label: 'Bksp' },

  // Row 2: Top Row (Y = 84)
  Tab: { x: 30, y: 84, finger: 'left-pinky', hand: 'left', label: 'Tab' },
  KeyQ: { x: 96, y: 84, finger: 'left-pinky', hand: 'left', label: 'Q' },
  KeyW: { x: 167, y: 84, finger: 'left-ring', hand: 'left', label: 'W' },
  KeyE: { x: 238, y: 84, finger: 'left-middle', hand: 'left', label: 'E' },
  KeyR: { x: 309, y: 84, finger: 'left-index', hand: 'left', label: 'R' },
  KeyT: { x: 380, y: 84, finger: 'left-index', hand: 'left', label: 'T' },
  KeyY: { x: 451, y: 84, finger: 'right-index', hand: 'right', label: 'Y' },
  KeyU: { x: 522, y: 84, finger: 'right-index', hand: 'right', label: 'U' },
  KeyI: { x: 593, y: 84, finger: 'right-middle', hand: 'right', label: 'I' },
  KeyO: { x: 664, y: 84, finger: 'right-ring', hand: 'right', label: 'O' },
  KeyP: { x: 735, y: 84, finger: 'right-pinky', hand: 'right', label: 'P' },
  BracketLeft: { x: 806, y: 84, finger: 'right-pinky', hand: 'right', label: '[' },
  BracketRight: { x: 877, y: 84, finger: 'right-pinky', hand: 'right', label: ']' },
  Backslash: { x: 955, y: 84, finger: 'right-pinky', hand: 'right', label: '\\' },

  // Row 3: Home Row (Y = 140) - ASDF JKL;
  CapsLock: { x: 38, y: 140, finger: 'left-pinky', hand: 'left', label: 'Caps' },
  KeyA: { x: 113, y: 140, finger: 'left-pinky', hand: 'left', label: 'A' },
  KeyS: { x: 187, y: 140, finger: 'left-ring', hand: 'left', label: 'S' },
  KeyD: { x: 261, y: 140, finger: 'left-middle', hand: 'left', label: 'D' },
  KeyF: { x: 335, y: 140, finger: 'left-index', hand: 'left', label: 'F' },
  KeyG: { x: 409, y: 140, finger: 'left-index', hand: 'left', label: 'G' },
  KeyH: { x: 483, y: 140, finger: 'right-index', hand: 'right', label: 'H' },
  KeyJ: { x: 557, y: 140, finger: 'right-index', hand: 'right', label: 'J' },
  KeyK: { x: 631, y: 140, finger: 'right-middle', hand: 'right', label: 'K' },
  KeyL: { x: 705, y: 140, finger: 'right-ring', hand: 'right', label: 'L' },
  Semicolon: { x: 779, y: 140, finger: 'right-pinky', hand: 'right', label: ';' },
  Quote: { x: 853, y: 140, finger: 'right-pinky', hand: 'right', label: "'" },
  Enter: { x: 942, y: 140, finger: 'right-pinky', hand: 'right', label: 'Enter' },

  // Row 4: Bottom Row (Y = 196)
  ShiftLeft: { x: 48, y: 196, finger: 'left-pinky', hand: 'left', label: 'Shift' },
  KeyZ: { x: 135, y: 196, finger: 'left-pinky', hand: 'left', label: 'Z' },
  KeyX: { x: 212, y: 196, finger: 'left-ring', hand: 'left', label: 'X' },
  KeyC: { x: 289, y: 196, finger: 'left-middle', hand: 'left', label: 'C' },
  KeyV: { x: 366, y: 196, finger: 'left-index', hand: 'left', label: 'V' },
  KeyB: { x: 443, y: 196, finger: 'left-index', hand: 'left', label: 'B' },
  KeyN: { x: 520, y: 196, finger: 'right-index', hand: 'right', label: 'N' },
  KeyM: { x: 597, y: 196, finger: 'right-index', hand: 'right', label: 'M' },
  Comma: { x: 674, y: 196, finger: 'right-middle', hand: 'right', label: ',' },
  Period: { x: 751, y: 196, finger: 'right-ring', hand: 'right', label: '.' },
  Slash: { x: 828, y: 196, finger: 'right-pinky', hand: 'right', label: '/' },
  ShiftRight: { x: 938, y: 196, finger: 'right-pinky', hand: 'right', label: 'Shift' },

  // Row 5: Space Row (Y = 248)
  ControlLeft: { x: 50, y: 248, finger: 'left-pinky', hand: 'left', label: 'Ctrl' },
  AltLeft: { x: 130, y: 248, finger: 'thumb', hand: 'left', label: 'Alt' },
  Space: { x: 500, y: 248, finger: 'thumb', hand: 'right', label: 'Space' },
  AltRight: { x: 870, y: 248, finger: 'thumb', hand: 'right', label: 'Alt' },
  ControlRight: { x: 950, y: 248, finger: 'right-pinky', hand: 'right', label: 'Ctrl' }
};

interface FingerMeta {
  id: FingerAssignment;
  hand: Hand;
  fingerIndex: number;
  homeKeyCode: string;
  homeX: number;
  homeY: number;
  baseX: number;
  baseY: number;
  accentColor: string;
  colorName: string;
  glowColor: string;
  hasTactileBump?: boolean;
}

// 10 Individual Floating Fingers without bulky palm
const HAND_FINGERS: FingerMeta[] = [
  // Left Hand Fingers (Pinky, Ring, Middle, Index, Thumb)
  {
    id: 'left-pinky',
    hand: 'left',
    fingerIndex: 0,
    homeKeyCode: 'KeyA',
    homeX: 113,
    homeY: 140,
    baseX: 113,
    baseY: 268,
    accentColor: '#E11D48',
    colorName: 'Rose',
    glowColor: 'rgba(225, 29, 72, 0.55)'
  },
  {
    id: 'left-ring',
    hand: 'left',
    fingerIndex: 1,
    homeKeyCode: 'KeyS',
    homeX: 187,
    homeY: 140,
    baseX: 187,
    baseY: 268,
    accentColor: '#D97706',
    colorName: 'Amber',
    glowColor: 'rgba(217, 119, 6, 0.55)'
  },
  {
    id: 'left-middle',
    hand: 'left',
    fingerIndex: 2,
    homeKeyCode: 'KeyD',
    homeX: 261,
    homeY: 140,
    baseX: 261,
    baseY: 268,
    accentColor: '#0284C7',
    colorName: 'Sky',
    glowColor: 'rgba(2, 132, 199, 0.55)'
  },
  {
    id: 'left-index',
    hand: 'left',
    fingerIndex: 3,
    homeKeyCode: 'KeyF',
    homeX: 335,
    homeY: 140,
    baseX: 335,
    baseY: 268,
    accentColor: '#059669',
    colorName: 'Emerald',
    glowColor: 'rgba(5, 150, 105, 0.55)',
    hasTactileBump: true
  },
  {
    id: 'thumb',
    hand: 'left',
    fingerIndex: 4,
    homeKeyCode: 'Space',
    homeX: 435,
    homeY: 248,
    baseX: 420,
    baseY: 268,
    accentColor: '#7C3AED',
    colorName: 'Purple',
    glowColor: 'rgba(124, 58, 237, 0.55)'
  },

  // Right Hand Fingers (Thumb, Index, Middle, Ring, Pinky)
  {
    id: 'thumb',
    hand: 'right',
    fingerIndex: 4,
    homeKeyCode: 'Space',
    homeX: 565,
    homeY: 248,
    baseX: 580,
    baseY: 268,
    accentColor: '#7C3AED',
    colorName: 'Purple',
    glowColor: 'rgba(124, 58, 237, 0.55)'
  },
  {
    id: 'right-index',
    hand: 'right',
    fingerIndex: 3,
    homeKeyCode: 'KeyJ',
    homeX: 557,
    homeY: 140,
    baseX: 557,
    baseY: 268,
    accentColor: '#0284C7', // Vivid Cyan / Blue like in the reference image
    colorName: 'Emerald',
    glowColor: 'rgba(2, 132, 199, 0.65)',
    hasTactileBump: true
  },
  {
    id: 'right-middle',
    hand: 'right',
    fingerIndex: 2,
    homeKeyCode: 'KeyK',
    homeX: 631,
    homeY: 140,
    baseX: 631,
    baseY: 268,
    accentColor: '#0284C7',
    colorName: 'Sky',
    glowColor: 'rgba(2, 132, 199, 0.55)'
  },
  {
    id: 'right-ring',
    hand: 'right',
    fingerIndex: 1,
    homeKeyCode: 'KeyL',
    homeX: 705,
    homeY: 140,
    baseX: 705,
    baseY: 268,
    accentColor: '#D97706',
    colorName: 'Amber',
    glowColor: 'rgba(217, 119, 6, 0.55)'
  },
  {
    id: 'right-pinky',
    hand: 'right',
    fingerIndex: 0,
    homeKeyCode: 'Semicolon',
    homeX: 779,
    homeY: 140,
    baseX: 779,
    baseY: 268,
    accentColor: '#E11D48',
    colorName: 'Rose',
    glowColor: 'rgba(225, 29, 72, 0.55)'
  }
];

export const KeyboardHandOverlay: React.FC<KeyboardHandOverlayProps> = ({
  activeFinger,
  activeHand,
  activeKeyChar = '',
  activeKeyCode = '',
  isShiftActive = false,
  pressedFinger = null,
  opacity = 0.65
}) => {
  const isLeftShiftRequired = isShiftActive && (activeHand === 'right' || !activeHand);
  const isRightShiftRequired = isShiftActive && activeHand === 'left';
  const activeKeyCoord = activeKeyCode ? KEY_COORDINATES[activeKeyCode] : null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden transition-opacity duration-200"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1000 270"
        className="w-full h-full object-fill select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Frosted Realistic Human Skin Shading Gradients (typing.com 3D translucent style) */}
          <linearGradient id="realSkinFinger" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C49E89" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#E2BEA8" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#EFCFBD" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F9DFCF" stopOpacity="0.9" />
          </linearGradient>

          {/* Glowing Active Finger Cyan/Blue Gradient (exactly matching the reference image) */}
          <linearGradient id="activeCyanFinger" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
            <stop offset="35%" stopColor="#0EA5E9" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#0284C7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0.98" />
          </linearGradient>

          {/* Realistic 3D Soft Shadow for fingers */}
          <filter id="softHandShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#2B1810" floodOpacity="0.25" />
          </filter>

          {/* Electric Blue Key Aura */}
          <filter id="electricAura" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#0284C7" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* ================= HOME ROW TACTILE ANCHOR RINGS ================= */}
        {HAND_FINGERS.map((f, i) => (
          <g key={`home-anchor-${i}`}>
            <circle
              cx={f.homeX}
              cy={f.homeY}
              r={13}
              fill="none"
              stroke={f.accentColor}
              strokeWidth="1.2"
              strokeDasharray="2 3"
              opacity="0.45"
            />
            {f.hasTactileBump && (
              <line
                x1={f.homeX - 5}
                y1={f.homeY + 10}
                x2={f.homeX + 5}
                y2={f.homeY + 10}
                stroke="#141210"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.75"
              />
            )}
          </g>
        ))}

        {/* ================= 10 DYNAMIC REACHING FINGERS (NO PALM) ================= */}
        {HAND_FINGERS.map((finger, idx) => {
          let isActive = false;
          let isShiftFinger = false;
          let targetX = finger.homeX;
          let targetY = finger.homeY;

          // Shift keys navigation
          if (finger.id === 'left-pinky' && isLeftShiftRequired) {
            isActive = true;
            isShiftFinger = true;
            targetX = KEY_COORDINATES.ShiftLeft.x;
            targetY = KEY_COORDINATES.ShiftLeft.y;
          } else if (finger.id === 'right-pinky' && isRightShiftRequired) {
            isActive = true;
            isShiftFinger = true;
            targetX = KEY_COORDINATES.ShiftRight.x;
            targetY = KEY_COORDINATES.ShiftRight.y;
          } else if (
            (activeFinger === finger.id && (activeHand === null || activeHand === finger.hand)) ||
            (activeKeyCode &&
              KEY_COORDINATES[activeKeyCode]?.finger === finger.id &&
              KEY_COORDINATES[activeKeyCode]?.hand === finger.hand)
          ) {
            isActive = true;
            if (activeKeyCoord) {
              targetX = activeKeyCoord.x;
              targetY = activeKeyCoord.y;
            }
          }

          const isPressed = pressedFinger === finger.id;

          // Anatomical calculations for individual finger
          const bx = finger.baseX;
          const by = finger.baseY;
          const tx = targetX;
          const ty = targetY;

          const dx = tx - bx;
          const dy = ty - by;
          const len = Math.max(1, Math.hypot(dx, dy));
          const nx = -dy / len;
          const ny = dx / len;

          const isThumb = finger.id === 'thumb';
          const baseHalfW = isThumb ? 13 : 11;
          const knuckleHalfW = isThumb ? 12 : 10;
          const tipHalfW = isThumb ? 11 : 9;

          const pipX = bx + dx * 0.45;
          const pipY = by + dy * 0.45;
          const dipX = bx + dx * 0.78;
          const dipY = by + dy * 0.78;

          // Smooth curved finger boundary path
          const p1x = bx - nx * baseHalfW;
          const p1y = by - ny * baseHalfW;
          const p2x = pipX - nx * knuckleHalfW;
          const p2y = pipY - ny * knuckleHalfW;
          const p3x = dipX - nx * (tipHalfW + 0.8);
          const p3y = dipY - ny * (tipHalfW + 0.8);
          const p4x = tx - nx * tipHalfW;
          const p4y = ty - ny * tipHalfW;

          const p5x = tx + nx * tipHalfW;
          const p5y = ty + ny * tipHalfW;
          const p6x = dipX + nx * (tipHalfW + 0.8);
          const p6y = dipY + ny * (tipHalfW + 0.8);
          const p7x = pipX + nx * knuckleHalfW;
          const p7y = pipY + ny * knuckleHalfW;
          const p8x = bx + nx * baseHalfW;
          const p8y = by + ny * baseHalfW;

          const realisticFingerPath = `
            M ${p1x} ${p1y}
            Q ${p2x} ${p2y} ${p3x} ${p3y}
            L ${p4x} ${p4y}
            A ${tipHalfW} ${tipHalfW} 0 0 1 ${p5x} ${p5y}
            L ${p6x} ${p6y}
            Q ${p7x} ${p7y} ${p8x} ${p8y}
            Z
          `;

          const fingerAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

          return (
            <g key={`isolated-finger-${finger.id}-${finger.hand}-${idx}`}>
              {/* Active Key Blue Glow Background (Matching key blue fill from reference image) */}
              {isActive && (
                <g filter="url(#electricAura)">
                  {/* Highlighted Target Keycap Square */}
                  <rect
                    x={tx - 18}
                    y={ty - 18}
                    width={36}
                    height={36}
                    rx={6}
                    fill="#0284C7"
                    opacity="0.85"
                  />
                  <motion.circle
                    cx={tx}
                    cy={ty}
                    r={22}
                    fill="#38BDF8"
                    initial={{ scale: 0.85, opacity: 0.8 }}
                    animate={{ scale: [0.9, 1.35, 0.9], opacity: [0.8, 0.35, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </g>
              )}

              {/* Dynamic Reaching Finger */}
              <motion.g
                initial={false}
                animate={
                  isPressed
                    ? { scaleY: 0.96, y: 2.5 }
                    : isActive
                    ? { y: [-1, -3, -1] }
                    : { y: 0, scaleY: 1 }
                }
                transition={
                  isActive
                    ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
                    : { type: 'spring', damping: 20, stiffness: 300 }
                }
                filter="url(#softHandShadow)"
              >
                {/* Finger Body Fill */}
                <motion.path
                  d={realisticFingerPath}
                  fill={isActive ? 'url(#activeCyanFinger)' : 'url(#realSkinFinger)'}
                  stroke={isActive ? '#0284C7' : '#C09982'}
                  strokeWidth={isActive ? 2.2 : 1.1}
                  strokeLinejoin="round"
                  opacity={isActive ? 0.95 : 0.82}
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                />

                {/* Subsurface 3D Spine Highlight */}
                <path
                  d={`M ${bx} ${by} Q ${pipX} ${pipY} ${dipX} ${dipY}`}
                  fill="none"
                  stroke={isActive ? '#BAE6FD' : '#FFFFFF'}
                  strokeWidth={isThumb ? 4 : 2.8}
                  strokeLinecap="round"
                  opacity={isActive ? 0.7 : 0.4}
                />

                {/* Knuckle Joint Creases */}
                <g opacity={isActive ? 0.8 : 0.45}>
                  <path
                    d={`M ${pipX - nx * 5} ${pipY - ny * 5} Q ${pipX} ${pipY} ${pipX + nx * 5} ${pipY + ny * 5}`}
                    fill="none"
                    stroke={isActive ? '#0284C7' : '#9E7761'}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${dipX - nx * 4.5} ${dipY - ny * 4.5} Q ${dipX} ${dipY} ${dipX + nx * 4.5} ${dipY + ny * 4.5}`}
                    fill="none"
                    stroke={isActive ? '#0284C7' : '#9E7761'}
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                </g>

                {/* Human Fingernail on Dorsal Tip */}
                <g transform={`rotate(${fingerAngleDeg}, ${tx}, ${ty})`}>
                  <rect
                    x={tx - (isThumb ? 7 : 5.5)}
                    y={ty - (isThumb ? 8.5 : 7.5)}
                    width={isThumb ? 14 : 11}
                    height={isThumb ? 12 : 10}
                    rx={isThumb ? 4.5 : 3.5}
                    fill={isActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 240, 240, 0.75)'}
                    stroke={isActive ? '#FFFFFF' : '#D4A894'}
                    strokeWidth={isActive ? 1.4 : 0.8}
                  />
                  {/* Nail white tip highlight */}
                  <path
                    d={`M ${tx - (isThumb ? 5.5 : 4.5)} ${ty - (isThumb ? 7 : 6.2)} Q ${tx} ${ty - (isThumb ? 8.5 : 7.5)} ${tx + (isThumb ? 5.5 : 4.5)} ${ty - (isThumb ? 7 : 6.2)}`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </g>

                {/* Center Key Character Label on Active Finger Tip */}
                <text
                  x={tx}
                  y={ty + 3.5}
                  textAnchor="middle"
                  fontSize={isActive ? '10' : '8'}
                  fontFamily="'Tiro Bangla', sans-serif"
                  fontWeight="bold"
                  fill={isActive ? '#FFFFFF' : '#141210'}
                  opacity={isActive ? 1 : 0.75}
                >
                  {isShiftFinger
                    ? 'SHIFT'
                    : isActive && activeKeyChar
                    ? activeKeyChar.length > 2
                      ? activeKeyChar.slice(0, 2)
                      : activeKeyChar
                    : finger.homeKeyCode === 'Space'
                    ? 'SPC'
                    : finger.homeKeyCode.replace('Key', '')}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
