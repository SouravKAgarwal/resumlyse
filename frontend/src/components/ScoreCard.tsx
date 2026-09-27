import React, { useState, useEffect } from 'react';

interface ScoreCardProps {
  score: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const roundedScore = Math.round(score);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score from 0 → roundedScore with ease-out cubic
  useEffect(() => {
    let start: number | null = null;
    let frameId: number;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(eased * roundedScore));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [roundedScore]);

  const getTier = (s: number) => {
    if (s >= 75) {
      return {
        label: 'ATS Optimized',
        sublabel: 'Meets high ATS benchmark standards',
        color: 'text-emerald-800 dark:text-emerald-300',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
        borderColor: 'border-emerald-200 dark:border-emerald-800/60',
        ringColor: '#16a34a',
      };
    }
    if (s >= 60) {
      return {
        label: 'Competitive',
        sublabel: 'Solid foundation, targeted tweaks advised',
        color: 'text-stone-800 dark:text-stone-200',
        bgColor: 'bg-stone-100 dark:bg-stone-800',
        borderColor: 'border-stone-200 dark:border-stone-700',
        ringColor: '#78716c',
      };
    }
    if (s >= 45) {
      return {
        label: 'Needs Polish',
        sublabel: 'Key content and formatting gaps detected',
        color: 'text-amber-800 dark:text-amber-300',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40',
        borderColor: 'border-amber-200 dark:border-amber-800/60',
        ringColor: '#d97706',
      };
    }
    return {
      label: 'Critical Gaps',
      sublabel: 'Substantial structural revisions required',
      color: 'text-rose-800 dark:text-rose-300',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200 dark:border-rose-800/60',
      ringColor: '#e11d48',
    };
  };

  const tier = getTier(roundedScore);

  // SVG Circular Gauge calculation — uses animatedScore for smooth fill
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col items-center justify-between h-full">
      <div className="w-full flex items-center justify-between pb-2.5 sm:pb-3 border-b border-stone-100 dark:border-stone-800 gap-2">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 font-sans">
          Overall ATS Score
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tier.bgColor} ${tier.color} border ${tier.borderColor} shrink-0`}>
          {tier.label}
        </span>
      </div>

      <div className="relative flex items-center justify-center my-3 sm:my-4">
        <svg className="w-32 h-32 sm:w-36 sm:h-36 transform -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="text-stone-100 dark:text-stone-800"
            strokeWidth="9"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={tier.ringColor}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-none"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            {animatedScore}
          </span>
          <span className="text-[10px] sm:text-[11px] font-sans text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      <div className="w-full text-center pt-2.5 sm:pt-3 border-t border-stone-100 dark:border-stone-800">
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
          {tier.sublabel}
        </p>
      </div>
    </div>
  );
};
