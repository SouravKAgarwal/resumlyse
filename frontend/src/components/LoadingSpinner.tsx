import React, { useState, useEffect } from 'react';
import { FileText, Cpu, BarChart3, Check, Loader2 } from 'lucide-react';

interface Stage {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const STAGES: Stage[] = [
  {
    key: 'extracting',
    label: 'Extracting',
    title: 'Extracting Document Content',
    subtitle: 'Parsing document structure, raw text, and formatting metadata...',
    icon: FileText,
  },
  {
    key: 'processing',
    label: 'Processing',
    title: 'Processing Sections & Depth',
    subtitle: 'Auditing section completeness, impact metrics, and role relevance...',
    icon: Cpu,
  },
  {
    key: 'evaluating',
    label: 'Evaluating',
    title: 'Evaluating ATS Compatibility',
    subtitle: 'Computing compatibility scores, matching keywords, and generating insights...',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-3 sm:p-4 transition-all">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-stone-200 max-w-md w-full p-5 sm:p-8 relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Editorial Icon Indicator */}
        <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center mb-4 sm:mb-5">
          <div className="absolute inset-0 rounded-full border border-stone-200" />
          <div className="absolute inset-0 rounded-full border-t-2 border-stone-800 animate-spin" />
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-800">
            <ActiveIcon className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Title and Subtitle */}
        <div className="text-center min-h-[70px] sm:min-h-[80px] flex flex-col items-center justify-center">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200/80 mb-2">
            <Loader2 className="w-3 h-3 text-stone-600 animate-spin" />
            <span className="text-[10px] sm:text-[11px] font-medium text-stone-600 tracking-wide uppercase">
              Phase {currentStageIndex + 1} of 3
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 tracking-tight">
            {activeStage.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xs mt-1 leading-relaxed">
            {activeStage.subtitle}
          </p>
        </div>

        {/* 3-Step Milestone Status Badges */}
        <div className="w-full mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-stone-100 grid grid-cols-3 gap-1.5 sm:gap-2">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.key}
                className={`flex flex-col items-center p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                    : isCurrent
                    ? 'bg-stone-100 border-stone-300 text-stone-900 shadow-2xs'
                    : 'bg-stone-50/40 border-stone-200/60 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full mb-0.5 sm:mb-1">
                  {isCompleted ? (
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-stone-800 animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-medium truncate w-full">
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
