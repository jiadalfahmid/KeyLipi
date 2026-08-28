import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Flame, Pause, Sparkles, Target, Timer, Zap, Newspaper, Play } from 'lucide-react';
import { GraphemeKeystroke } from '../types';

interface TypingHUDProps {
  graphemes: string[];
  currentIndex: number;
  errorIndices: Set<number>;
  currentInputChar?: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  errorCount: number;
  combo: number;
  elapsedSeconds: number;
  timeLimitSeconds?: number;
  keystrokeGuide?: GraphemeKeystroke[];
  mistakeTip?: string | null;
  subGraphemeIndex?: number;
  subGraphemeTotal?: number;
  isPaused?: boolean;
  onResume?: () => void;
  showTwoLineCarousel?: boolean;
}

export const TypingHUD: React.FC<TypingHUDProps> = ({
  graphemes,
  currentIndex,
  errorIndices,
  wpm,
  cpm,
  accuracy,
  errorCount,
  combo,
  elapsedSeconds,
  timeLimitSeconds,
  keystrokeGuide,
  mistakeTip,
  subGraphemeIndex = 0,
  subGraphemeTotal = 1,
  isPaused = false,
  onResume,
  showTwoLineCarousel = true
}) => {
  const total = graphemes.length;
  const progressPercent = total > 0 ? Math.min(100, Math.round((currentIndex / total) * 100)) : 0;
  const remainingSeconds = timeLimitSeconds ? Math.max(0, timeLimitSeconds - elapsedSeconds) : null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerWordsRef = useRef<HTMLDivElement | null>(null);
  const activeTokenRef = useRef<HTMLSpanElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Group grapheme clusters into word tokens for genuine typography layout
  const wordTokens = useMemo(() => {
    const tokens: {
      type: 'word' | 'space';
      graphemes: { char: string; index: number }[];
    }[] = [];

    let currentWord: { char: string; index: number }[] = [];

    graphemes.forEach((g, idx) => {
      if (g === ' ' || g === '\u00A0') {
        if (currentWord.length > 0) {
          tokens.push({ type: 'word', graphemes: currentWord });
          currentWord = [];
        }
        tokens.push({ type: 'space', graphemes: [{ char: ' ', index: idx }] });
      } else {
        currentWord.push({ char: g, index: idx });
      }
    });

    if (currentWord.length > 0) {
      tokens.push({ type: 'word', graphemes: currentWord });
    }

    return tokens;
  }, [graphemes]);

  // Dynamic 2-line smooth reveal & centering: Keeps active line centered in 2-line viewport (10FastFingers style)
  useEffect(() => {
    if (!showTwoLineCarousel || !activeTokenRef.current || !innerWordsRef.current) {
      setScrollY(0);
      return;
    }

    const tokenEl = activeTokenRef.current;
    const tokenTop = tokenEl.offsetTop;

    // A single typographic line is ~46-54px high. If tokenTop is on line 2 or beyond, scroll smoothly.
    if (tokenTop > 36) {
      // Keep current active line on the first line or middle of the 2-line window
      const newScroll = Math.max(0, tokenTop - 10);
      setScrollY(newScroll);
    } else {
      setScrollY(0);
    }
  }, [currentIndex, showTwoLineCarousel, wordTokens]);

  return (
    <div className="w-full flex flex-col gap-3 relative">
      {/* Top Newspaper Broadsheet Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-[#FCFBF8] p-3 sm:p-3.5 border-2 border-[#141210]/30 shadow-2xs">
        {/* WPM Metric */}
        <div className="flex flex-col border-r border-[#141210]/15 pr-2">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-[#141210]/60">
            <Zap className="w-3 h-3 text-[#141210]" />
            <span>NET WPM</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-numbers font-bold text-[#141210] leading-tight">
            {wpm}
          </div>
        </div>

        {/* Accuracy Metric */}
        <div className="flex flex-col border-r border-[#141210]/15 pr-2">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-[#141210]/60">
            <Target className="w-3 h-3 text-emerald-800" />
            <span>নির্ভুলতা (ACC)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-numbers font-bold text-[#141210] leading-tight">
            {accuracy}%
          </div>
        </div>

        {/* Combo Multiplier */}
        <div className="flex flex-col border-r border-[#141210]/15 pr-2">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-[#8B0000]">
            <Flame className="w-3 h-3 text-[#8B0000] fill-[#8B0000]" />
            <span>ধারাবাহিকতা</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-numbers font-bold text-[#8B0000] leading-tight">
            {combo > 0 ? `${combo}x` : '0'}
          </div>
        </div>

        {/* Errors Count */}
        <div className="flex flex-col border-r border-[#141210]/15 pr-2">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-[#8B0000]">
            <AlertCircle className="w-3 h-3 text-[#8B0000]" />
            <span>ভুল সংখ্যা</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-numbers font-bold text-[#8B0000] leading-tight">
            {errorCount}
          </div>
        </div>

        {/* Timer / CPM */}
        <div className="flex flex-col col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-[#141210]/60">
            <Timer className="w-3 h-3 text-[#141210]" />
            <span>{remainingSeconds !== null ? 'অবশিষ্ট সময়' : 'ব্যয়িত সময়'}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-numbers font-bold text-[#141210] leading-tight">
            {remainingSeconds !== null ? formatTime(remainingSeconds) : formatTime(elapsedSeconds)}
          </div>
        </div>
      </div>

      {/* Broadsheet Typesetting Column Rule Line */}
      <div className="w-full bg-[#EDE9DF] h-1.5 overflow-hidden border border-[#141210]/20">
        <div
          className="bg-[#141210] h-full transition-all duration-150 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Target Text Display Broadsheet Article Box */}
      <div className="relative bg-[#FCFBF8] p-5 sm:p-7 border-2 border-[#141210]/30 shadow-2xs rounded-xs min-h-[140px] flex flex-col justify-center overflow-hidden">
        {/* Idle Pause Overlay (Monkeytype Style) */}
        {isPaused && (
          <div
            onClick={onResume}
            className="absolute inset-0 z-30 bg-[#141210]/40 backdrop-blur-xs flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 select-none animate-fadeIn"
          >
            <div className="bg-[#FCFBF8] border-2 border-[#141210] px-6 py-4 sm:px-8 sm:py-5 shadow-2xl flex flex-col items-center text-center gap-2 max-w-sm rounded-xs">
              <div className="w-9 h-9 rounded-full bg-[#EDE9DF] border border-[#141210]/30 flex items-center justify-center text-[#8B0000]">
                <Pause className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-[0.25em] text-[#8B0000]">
                টাইপিং সাময়িক বিরতি • PAUSED
              </span>
              <p className="text-base font-tiro font-bold text-[#141210] mt-0.5">
                চালিয়ে যেতে যেকোনো কী চাপুন
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#141210]/70 bg-[#EDE9DF] px-2.5 py-1 border border-[#141210]/20 rounded-xs mt-1">
                <Play className="w-3 h-3 text-emerald-700 fill-emerald-700" />
                <span>Press any key to resume</span>
              </div>
            </div>
          </div>
        )}

        {/* Newspaper Column Header Tag */}
        <div className="flex items-center justify-between border-b border-[#141210]/15 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-[#141210]/60" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/60">
              EDITORIAL TEXT STREAM &bull; টাইপিং অনুলিপি (২-লাইন ভিউ)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#141210]/60 font-semibold">
            {currentIndex}/{total} অক্ষর ({progressPercent}%)
          </span>
        </div>

        {/* 2-Line Smooth Carousel Window Container (10FastFingers style) */}
        <div
          ref={containerRef}
          className={`relative overflow-hidden w-full transition-all duration-300 ${
            isPaused ? 'filter blur-[2px] opacity-40' : ''
          } ${showTwoLineCarousel ? 'h-[96px] sm:h-[110px] md:h-[120px]' : 'min-h-[96px]'}`}
        >
          <div
            ref={innerWordsRef}
            className="font-tiro text-2xl sm:text-3xl leading-[2.1] select-none text-[#141210] flex flex-wrap items-baseline gap-y-2 transition-transform duration-200 ease-out"
            style={
              showTwoLineCarousel
                ? { transform: `translateY(-${scrollY}px)` }
                : undefined
            }
          >
            {wordTokens.map((token, tIdx) => {
              if (token.type === 'space') {
                const spaceIdx = token.graphemes[0].index;
                const isCompleted = spaceIdx < currentIndex;
                const isCurrent = spaceIdx === currentIndex;
                const hasError = errorIndices.has(spaceIdx);

                return (
                  <span
                    key={`space-${tIdx}-${spaceIdx}`}
                    ref={isCurrent ? activeTokenRef : null}
                    className={`inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded-xs transition-colors ${
                      isCurrent
                        ? 'bg-[#141210] text-[#F5F2EB] font-mono font-bold shadow-xs'
                        : isCompleted
                        ? hasError
                          ? 'bg-[#8B0000]/20 text-[#8B0000] underline font-bold'
                          : 'text-[#141210]/20'
                        : 'text-[#141210]/20'
                    }`}
                  >
                    <span className="font-mono text-base font-bold select-none">␣</span>
                    {isCurrent && (
                      <span className="inline-block w-0.5 h-5 bg-[#8B0000] ml-1 animate-cursor-pulse"></span>
                    )}
                  </span>
                );
              }

              // Check if current active index is within this word
              const containsCurrent = token.graphemes.some((g) => g.index === currentIndex);

              return (
                <span
                  key={`word-${tIdx}`}
                  ref={containsCurrent ? activeTokenRef : null}
                  className="inline-flex items-baseline flex-nowrap mr-2 my-0.5"
                >
                  {token.graphemes.map(({ char, index }) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const hasError = errorIndices.has(index);

                    let styleClass = 'text-[#141210]/40'; // pending untyped

                    if (isCompleted) {
                      styleClass = hasError
                        ? 'text-[#8B0000] bg-[#8B0000]/10 underline decoration-[#8B0000] decoration-2 px-0.5 font-bold'
                        : 'text-[#141210] font-semibold';
                    } else if (isCurrent) {
                      styleClass =
                        'text-[#FFFFFF] bg-[#141210] px-1.5 py-0.5 rounded-xs font-bold shadow-xs ring-1 ring-[#141210]';
                    }

                    return (
                      <span
                        key={index}
                        className={`relative inline-block transition-colors duration-75 ${styleClass}`}
                      >
                        {char}
                        {isCurrent && (
                          <>
                            <span className="inline-block w-0.5 h-6 bg-[#8B0000] align-middle ml-0.5 animate-cursor-pulse"></span>
                            {subGraphemeTotal > 1 && subGraphemeIndex > 0 && (
                              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#8B0000] rounded-full"></span>
                            )}
                          </>
                        )}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </div>
        </div>

        {/* Keystroke Guidance Hint Bar */}
        {keystrokeGuide && keystrokeGuide.length > 0 && (() => {
          const currentGuide = keystrokeGuide[0];
          const fingerNamesBn: Record<string, { bn: string; en: string }> = {
            'left-pinky': { bn: 'বাম কনিষ্ঠা', en: 'Left Pinky' },
            'left-ring': { bn: 'বাম অনামিকা', en: 'Left Ring' },
            'left-middle': { bn: 'বাম মধ্যমা', en: 'Left Middle' },
            'left-index': { bn: 'বাম তর্জনী', en: 'Left Index' },
            'thumb': { bn: 'বৃদ্ধাঙ্গুলি', en: 'Thumb' },
            'right-index': { bn: 'ডান তর্জনী', en: 'Right Index' },
            'right-middle': { bn: 'ডান মধ্যমা', en: 'Right Middle' },
            'right-ring': { bn: 'ডান অনামিকা', en: 'Right Ring' },
            'right-pinky': { bn: 'ডান কনিষ্ঠা', en: 'Right Pinky' }
          };

          const fingerInfo = currentGuide?.finger ? fingerNamesBn[currentGuide.finger] : null;
          const isSpace = currentGuide?.key === ' ' || currentGuide?.code === 'Space';

          // Shift finger coordination: Opposite hand pinky
          let shiftFingerHint = '';
          if (currentGuide?.shift) {
            shiftFingerHint = currentGuide.hand === 'left' ? 'ডান কনিষ্ঠা (Shift) + ' : 'বাম কনিষ্ঠা (Shift) + ';
          }

          return (
            <div className="mt-4 pt-3 border-t border-[#141210]/15 flex flex-wrap items-center justify-between gap-3 text-xs font-tiro">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/60 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B0000]" />
                  পরবর্তী কী (KEYSTROKE):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {keystrokeGuide.map((guide, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1 ${
                        i === 0
                          ? 'bg-[#8B0000] text-[#F5F2EB] shadow-xs'
                          : 'bg-[#EDE9DF] text-[#141210]/80 border border-[#141210]/20'
                      }`}
                    >
                      {guide.key === ' ' ? (
                        'স্পেসবার (SPACE)'
                      ) : guide.shift ? (
                        `SHIFT + ${guide.key.toUpperCase()}`
                      ) : (
                        guide.key.toUpperCase()
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {fingerInfo && (
                <div className="text-xs text-[#141210]/90 font-tiro flex items-center gap-1.5 bg-[#EDE9DF]/80 px-2.5 py-1 border border-[#141210]/20 rounded-xs">
                  <span className="text-[#141210]/60 text-[10px] font-mono font-bold uppercase">
                    নির্দিষ্ট আঙুল:
                  </span>
                  <span className="font-bold text-[#141210]">
                    {isSpace
                      ? 'বৃদ্ধাঙ্গুলি (Thumb: Spacebar)'
                      : `${shiftFingerHint}${fingerInfo.bn} (${fingerInfo.en})`}
                  </span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Mistake Diagnosis Tip */}
        {mistakeTip && (
          <div className="mt-3 p-2.5 bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000] text-xs font-tiro flex items-center gap-2 rounded-xs shadow-2xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#8B0000]" />
            <span>{mistakeTip}</span>
          </div>
        )}
      </div>
    </div>
  );
};

