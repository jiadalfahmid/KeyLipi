import React, { useState, useEffect } from 'react';
import { FingerAssignment, Hand } from '../types';

interface KeyboardHandOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>;
  activeFinger: FingerAssignment | null;
  activeHand: Hand | null;
  activeKeyCode: string | null;
  activeKeyChar?: string;
  isShiftActive?: boolean;
  pressedFinger?: FingerAssignment | null;
  opacity?: number;
}

interface Point {
  x: number;
  y: number;
}

interface FingerGuideDef {
  id: FingerAssignment;
  hand: Hand;
  label: string;
  homeKey: string;
  homeKeyLabel: string;
  defaultAngle?: number;
  isThumb?: boolean;
}

const FINGER_DEFS: FingerGuideDef[] = [
  // Left Hand
  { id: 'left-pinky', hand: 'left', label: 'কনিষ্ঠা', homeKey: 'KeyA', homeKeyLabel: 'A' },
  { id: 'left-ring', hand: 'left', label: 'অনামিকা', homeKey: 'KeyS', homeKeyLabel: 'S' },
  { id: 'left-middle', hand: 'left', label: 'মধ্যমা', homeKey: 'KeyD', homeKeyLabel: 'D' },
  { id: 'left-index', hand: 'left', label: 'তর্জনী', homeKey: 'KeyF', homeKeyLabel: 'F' },
  { id: 'thumb', hand: 'left', label: 'বৃদ্ধাঙ্গুলি', homeKey: 'Space', homeKeyLabel: 'SPC', isThumb: true, defaultAngle: 35 },

  // Right Hand
  { id: 'thumb', hand: 'right', label: 'বৃদ্ধাঙ্গুলি', homeKey: 'Space', homeKeyLabel: 'SPC', isThumb: true, defaultAngle: -35 },
  { id: 'right-index', hand: 'right', label: 'তর্জনী', homeKey: 'KeyJ', homeKeyLabel: 'J' },
  { id: 'right-middle', hand: 'right', label: 'মধ্যমা', homeKey: 'KeyK', homeKeyLabel: 'K' },
  { id: 'right-ring', hand: 'right', label: 'অনামিকা', homeKey: 'KeyL', homeKeyLabel: 'L' },
  { id: 'right-pinky', hand: 'right', label: 'কনিষ্ঠা', homeKey: 'Semicolon', homeKeyLabel: ';' }
];

export const KeyboardHandOverlay: React.FC<KeyboardHandOverlayProps> = ({
  containerRef,
  activeFinger,
  activeHand,
  activeKeyCode,
  isShiftActive = false,
  opacity = 0.65
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [keyPositions, setKeyPositions] = useState<Record<string, Point>>({});

  const measureKeys = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    setDimensions({
      width: containerRect.width,
      height: containerRect.height
    });

    const positions: Record<string, Point> = {};
    const keyElements = containerRef.current.querySelectorAll('[id^="vkey-"]');

    keyElements.forEach((node) => {
      const el = node as HTMLElement;
      const code = el.id.replace('vkey-', '');
      const rect = el.getBoundingClientRect();
      positions[code] = {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
      };
    });

    setKeyPositions(positions);
  };

  useEffect(() => {
    measureKeys();

    const resizeObserver = new ResizeObserver(() => {
      measureKeys();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', measureKeys);
    const timer = setTimeout(measureKeys, 60);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureKeys);
      clearTimeout(timer);
    };
  }, [containerRef, activeKeyCode, isShiftActive]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null;
  }

  const { width, height } = dimensions;

  const getKeyPos = (code: string, fallbackXRatio: number, fallbackYRatio: number): Point => {
    if (keyPositions[code]) {
      return keyPositions[code];
    }
    return {
      x: width * fallbackXRatio,
      y: height * fallbackYRatio
    };
  };

  // Home key exact center positions
  const homePositions: Record<string, Point> = {
    KeyA: getKeyPos('KeyA', 0.15, 0.52),
    KeyS: getKeyPos('KeyS', 0.21, 0.52),
    KeyD: getKeyPos('KeyD', 0.28, 0.52),
    KeyF: getKeyPos('KeyF', 0.35, 0.52),
    KeyJ: getKeyPos('KeyJ', 0.55, 0.52),
    KeyK: getKeyPos('KeyK', 0.62, 0.52),
    KeyL: getKeyPos('KeyL', 0.68, 0.52),
    Semicolon: getKeyPos('Semicolon', 0.75, 0.52),
    ShiftLeft: getKeyPos('ShiftLeft', 0.07, 0.72),
    ShiftRight: getKeyPos('ShiftRight', 0.93, 0.72),
    Space: getKeyPos('Space', 0.46, 0.88)
  };

  const spaceCenter = homePositions.Space;
  const leftThumbHome = { x: spaceCenter.x - width * 0.055, y: spaceCenter.y };
  const rightThumbHome = { x: spaceCenter.x + width * 0.055, y: spaceCenter.y };

  // Shift logic
  const isLeftShiftNeeded = isShiftActive && (activeHand === 'right' || !activeHand);
  const isRightShiftNeeded = isShiftActive && activeHand === 'left';

  // Target key position for active finger
  let targetKeyPos: Point | null = null;
  if (activeKeyCode && keyPositions[activeKeyCode]) {
    targetKeyPos = keyPositions[activeKeyCode];
  } else if (activeKeyCode) {
    const foundKey = Object.keys(keyPositions).find((k) => k.toLowerCase() === activeKeyCode.toLowerCase());
    if (foundKey) targetKeyPos = keyPositions[foundKey];
  }

  // Render a finger column exactly like the user's reference image
  const renderFinger = (def: FingerGuideDef, index: number) => {
    const isShiftTarget =
      (def.id === 'left-pinky' && isLeftShiftNeeded) ||
      (def.id === 'right-pinky' && isRightShiftNeeded);

    const isActive =
      isShiftTarget ||
      (activeFinger === def.id && (def.id === 'thumb' ? activeHand === def.hand || activeHand === null : true));

    // Home position for this finger
    let homePos = homePositions[def.homeKey] || { x: 0, y: 0 };
    if (def.isThumb) {
      homePos = def.hand === 'left' ? leftThumbHome : rightThumbHome;
    }

    // Bottom Base anchor directly under the home position at the bottom edge of keyboard
    let basePos: Point;
    if (def.isThumb) {
      basePos = {
        x: def.hand === 'left' ? homePos.x - 22 : homePos.x + 22,
        y: height + 8
      };
    } else {
      basePos = {
        x: homePos.x,
        y: height + 8
      };
    }

    // Fingertip position: reaches to target key if active, otherwise rests at home
    let tipPos = homePos;
    if (isShiftTarget) {
      tipPos = def.hand === 'left' ? homePositions.ShiftLeft : homePositions.ShiftRight;
    } else if (isActive && targetKeyPos) {
      tipPos = targetKeyPos;
    }

    // Geometry of the finger column
    const dx = tipPos.x - basePos.x;
    const dy = tipPos.y - basePos.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const fingerWidth = def.isThumb ? 26 : 22;
    const halfW = fingerWidth / 2;

    // Corner points of the rounded cylinder/stick
    const b1 = { x: basePos.x + nx * halfW, y: basePos.y + ny * halfW };
    const b2 = { x: basePos.x - nx * halfW, y: basePos.y - ny * halfW };
    const t1 = { x: tipPos.x + nx * halfW, y: tipPos.y + ny * halfW };
    const t2 = { x: tipPos.x - nx * halfW, y: tipPos.y - ny * halfW };

    // Semicircular top cap control point
    const capX = tipPos.x + (dx / len) * (halfW * 0.95);
    const capY = tipPos.y + (dy / len) * (halfW * 0.95);

    const fingerPath = `M ${b1.x} ${b1.y} L ${t1.x} ${t1.y} Q ${capX} ${capY} ${t2.x} ${t2.y} L ${b2.x} ${b2.y} Z`;

    // Colors matching screenshot:
    // Resting: warm translucent beige/peach `rgba(224, 185, 155, 0.45)`, border `rgba(180, 125, 90, 0.55)`
    // Active: vibrant cyan/blue `rgba(14, 165, 233, 0.55)`, border `#0284C7`
    const fillColor = isActive ? 'rgba(56, 189, 248, 0.55)' : 'rgba(235, 205, 178, 0.45)';
    const strokeColor = isActive ? '#0284C7' : 'rgba(185, 130, 95, 0.55)';
    const strokeWidth = isActive ? 2.2 : 1.4;

    return (
      <g key={`${def.id}-${def.hand}-${index}`} className="transition-all duration-150 ease-out select-none">
        {/* Active Halo Glow */}
        {isActive && (
          <path
            d={fingerPath}
            fill="#38BDF8"
            opacity="0.4"
            filter="url(#cyanGlow)"
          />
        )}

        {/* Translucent Finger Stick Body */}
        <path
          d={fingerPath}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />

        {/* Center Knuckle Crease Line near base */}
        <line
          x1={basePos.x + dx * 0.3 - nx * 4}
          y1={basePos.y + dy * 0.3 - ny * 4}
          x2={basePos.x + dx * 0.3 + nx * 4}
          y2={basePos.y + dy * 0.3 + ny * 4}
          stroke={isActive ? '#0284C7' : 'rgba(185, 130, 95, 0.6)'}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Resting Home Key Indicator Ring */}
        {!isActive && (
          <g>
            <circle
              cx={homePos.x}
              cy={homePos.y}
              r={def.isThumb ? 10 : 8.5}
              fill="rgba(255, 255, 255, 0.6)"
              stroke="rgba(185, 130, 95, 0.7)"
              strokeWidth="1.2"
              strokeDasharray="2.5 2"
            />
            <text
              x={homePos.x}
              y={homePos.y + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={def.isThumb ? '7.5' : '9'}
              fontFamily="monospace"
              fontWeight="bold"
              fill="rgba(100, 60, 40, 0.7)"
            >
              {def.homeKeyLabel}
            </text>
          </g>
        )}

        {/* Active Fingertip Target Touch Circle & Icon (Like in screenshot) */}
        {isActive && (
          <g>
            <circle
              cx={tipPos.x}
              cy={tipPos.y}
              r={12}
              fill="rgba(2, 132, 199, 0.3)"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeDasharray="3 2"
            />
            <circle
              cx={tipPos.x}
              cy={tipPos.y}
              r={5}
              fill="#FFFFFF"
            />
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 overflow-visible select-none"
      style={{ width, height }}
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        style={{ opacity }}
      >
        <defs>
          <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Render all 10 fingers */}
        {FINGER_DEFS.map((def, idx) => renderFinger(def, idx))}
      </svg>
    </div>
  );
};
