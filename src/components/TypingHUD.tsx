import React, { useMemo } from 'react';
import { AlertCircle, Flame, Sparkles, Target, Timer, Zap, Newspaper } from 'lucide-react';
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
  subGraphemeTotal = 1
}) => {
  const total = graphemes.length;
  const progressPercent = total > 0 ? Math.min(100, Math.round((currentIndex / total) * 100)) : 0;
  const remainingSeconds = timeLimitSeconds ? Math.max(0, timeLimitSeconds - elapsedSeconds) : null;

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

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Newspaper Broadsheet Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-[#FCFBF8] p-3.5 border-2 border-[#141210]/30 shadow-2xs">
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
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-red-800">
            <Flame className="w-3 h-3 text-red-700 fill-red-700" />
            <span>ধারাবাহিকতা</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-numbers font-bold text-red-900 leading-tight">
            {combo > 0 ? `${combo}x` : '0'}
          </div>
        </div>

        {/* Errors Count */}
        <div className="flex flex-col border-r border-[#141210]/15 pr-2">
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-700" />
            <span>ভুল সংখ্যা</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono-numbers font-bold text-rose-700 leading-tight">
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
      <div className="relative bg-[#FCFBF8] p-6 sm:p-8 border-2 border-[#141210]/30 shadow-2xs rounded-xs min-h-[140px] flex flex-col justify-center">
        {/* Newspaper Column Header Tag */}
        <div className="flex items-center justify-between border-b border-[#141210]/15 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-[#141210]/60" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/60">
              EDITORIAL PROMPT &bull; টাইপিং অনুলিপি
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#141210]/50">
            {currentIndex}/{total} অক্ষর ({progressPercent}%)
          </span>
        </div>

        {/* The Text rendered as coherent Bangla words with perfect OpenType ligature shaping */}
        <div className="font-tiro text-2xl sm:text-3xl leading-[2.3] select-none text-[#141210] flex flex-wrap items-baseline gap-y-2">
          {wordTokens.map((token, tIdx) => {
            if (token.type === 'space') {
              const spaceIdx = token.graphemes[0].index;
              const isCompleted = spaceIdx < currentIndex;
              const isCurrent = spaceIdx === currentIndex;
              const hasError = errorIndices.has(spaceIdx);

              return (
                <span
                  key={`space-${tIdx}-${spaceIdx}`}
                  className={`inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded-xs transition-colors ${
                    isCurrent
                      ? 'bg-[#141210] text-[#F5F2EB] font-mono font-bold shadow-xs'
                      : isCompleted
                      ? hasError
                        ? 'bg-rose-200 text-rose-800'
                        : 'text-[#141210]/20'
                      : 'text-[#141210]/20'
                  }`}
                >
                  <span className="font-mono text-base font-bold select-none">␣</span>
                  {isCurrent && (
                    <span className="inline-block w-0.5 h-5 bg-[#38BDF8] ml-1 animate-cursor-pulse"></span>
                  )}
                </span>
              );
            }

            // Word token: keeps all syllables together so words like "ভাষা" stay unbroken
            return (
              <span
                key={`word-${tIdx}`}
                className="inline-flex items-baseline flex-nowrap mr-1.5 my-0.5"
              >
                {token.graphemes.map(({ char, index }) => {
                  const isCompleted = index < currentIndex;
                  const isCurrent = index === currentIndex;
                  const hasError = errorIndices.has(index);

                  let styleClass = 'text-[#141210]/40'; // pending

                  if (isCompleted) {
                    styleClass = hasError
                      ? 'text-rose-700 bg-rose-100 underline decoration-rose-600 decoration-2 px-0.5'
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
                          <span className="inline-block w-0.5 h-6 bg-[#38BDF8] align-middle ml-0.5 animate-cursor-pulse"></span>
                          {subGraphemeTotal > 1 && subGraphemeIndex > 0 && (
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#38BDF8] rounded-full"></span>
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

        {/* Keystroke Guidance Hint Bar */}
        {keystrokeGuide && keystrokeGuide.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#141210]/15 flex flex-wrap items-center justify-between gap-2 text-xs font-tiro">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#141210]/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-700" />
                পরবর্তী কী (KEYSTROKE):
              </span>
              <div className="flex items-center gap-1.5">
                {keystrokeGuide.map((guide, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 text-xs font-mono font-bold uppercase rounded-xs transition-all ${
                      i === 0
                        ? 'bg-[#141210] text-[#F5F2EB] ring-2 ring-amber-500/80 shadow-xs'
                        : 'bg-[#EDE9DF] text-[#141210]/80 border border-[#141210]/20'
                    }`}
                  >
                    {guide.shift ? `SHIFT + ${guide.key.toUpperCase()}` : guide.key.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            {keystrokeGuide[0]?.finger && (
              <div className="text-xs text-[#141210]/80 font-tiro">
                নির্দিষ্ট আঙুল:{' '}
                <span className="font-bold text-[#141210] bg-[#EDE9DF] px-1.5 py-0.5 border border-[#141210]/20 rounded-xs">
                  {keystrokeGuide[0].finger.replace('-', ' ').toUpperCase()} ({keystrokeGuide[0].hand === 'left' ? 'বাম হাত' : 'ডান হাত'})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Mistake Diagnosis Tip */}
        {mistakeTip && (
          <div className="mt-3 p-2.5 bg-[#FFF1F2] border border-rose-300 text-rose-900 text-xs font-tiro flex items-center gap-2 rounded-xs shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
            <span className="font-medium">{mistakeTip}</span>
          </div>
        )}
      </div>
    </div>
  );
};
