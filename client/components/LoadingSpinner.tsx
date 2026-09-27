"use client";

import React, { useState, useEffect } from "react";
import { FileText, Cpu, BarChart3, Loader2 } from "lucide-react";

interface Stage {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const STAGES: Stage[] = [
  {
    key: "extracting",
    label: "Extracting",
    title: "Extracting Document Content",
    subtitle:
      "Parsing document structure, raw text, and formatting metadata...",
    icon: FileText,
  },
  {
    key: "processing",
    label: "Processing",
    title: "Processing Sections & Depth",
    subtitle:
      "Auditing section completeness, impact metrics, and role relevance...",
    icon: Cpu,
  },
  {
    key: "evaluating",
    label: "Evaluating",
    title: "Evaluating ATS Compatibility",
    subtitle:
      "Computing compatibility scores, matching keywords, and generating insights...",
    icon: BarChart3,
  },
];

export const LoadingSpinner: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    // Stage 0 -> Stage 1 after 3s, Stage 1 -> Stage 2 after 6.5s
    const timer1 = setTimeout(() => setCurrentStageIndex(1), 3000);
    const timer2 = setTimeout(() => setCurrentStageIndex(2), 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const activeStage = STAGES[currentStageIndex];
  const ActiveIcon = activeStage.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 dark:bg-black/60 backdrop-blur-xs p-3 sm:p-4 transition-all">
      <div className="bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 max-w-md w-full p-5 sm:p-8 relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        {/* Editorial Icon Indicator */}
        <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center mb-4 sm:mb-5">
          <div className="absolute inset-0 rounded-full border border-stone-200 dark:border-stone-800" />
          <div className="absolute inset-0 rounded-full border-t-2 border-stone-800 dark:border-stone-200 animate-spin" />
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-800 dark:text-stone-200">
            <ActiveIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Title and Subtitle */}
        <div className="text-center min-h-17.5 sm:min-h-20 flex flex-col items-center justify-center">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 mb-2">
            <Loader2 className="w-3 h-3 text-stone-600 dark:text-stone-300 animate-spin" />
            <span className="text-[10px] sm:text-[11px] font-medium text-stone-600 dark:text-stone-300 tracking-wide uppercase">
              Phase {currentStageIndex + 1} of 3
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            {activeStage.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xs mt-1 leading-relaxed">
            {activeStage.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
