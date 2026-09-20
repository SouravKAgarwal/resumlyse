import React, { useState } from 'react';
import { SectionPresence } from '../types';
import { Check, X, Copy, CheckCheck } from 'lucide-react';

interface SectionAnalysisProps {
  sections: SectionPresence[];
}

export const SectionAnalysis: React.FC<SectionAnalysisProps> = ({ sections }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const presentCount = sections.filter((s) => s.present).length;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-stone-100 gap-2">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
            Section-by-Section Audit
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Integrity of essential resume components
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
          {presentCount} of {sections.length} Present
        </span>
      </div>

      <div className="space-y-2.5 sm:space-y-3 flex-1">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className={`p-3.5 sm:p-4 rounded-lg border transition-colors ${
              sec.present
                ? 'border-stone-200 bg-white hover:border-stone-300'
                : 'border-stone-200 bg-stone-50/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                    sec.present
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {sec.present ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </div>
                <h4 className={`text-xs sm:text-sm font-medium truncate ${sec.present ? 'text-stone-900' : 'text-stone-500'}`}>
                  {sec.section_name}
                </h4>
              </div>

              {sec.present && (
                <span className={`text-xs font-semibold shrink-0 pl-7.5 sm:pl-0 ${
                  sec.quality_score >= 75 ? 'text-emerald-800' :
                  sec.quality_score >= 55 ? 'text-stone-700' :
                  'text-amber-800'
                }`}>
                  {sec.quality_score}/100 Quality
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
              {sec.feedback}
            </p>

            {sec.suggested_content && (
              <div className="mt-3 p-2.5 sm:p-3 bg-stone-50 border-l-2 border-stone-400 rounded-r-md">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans">
                    Suggested Revision
                  </span>
                  <button
                    onClick={() => handleCopy(sec.suggested_content!, idx)}
                    className="inline-flex items-center space-x-1 text-[11px] font-medium text-stone-500 hover:text-stone-900 transition-colors py-0.5 px-1 rounded hover:bg-stone-200/50"
                    title="Copy suggested draft"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <CheckCheck className="w-3 h-3 text-emerald-700" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs font-serif italic text-stone-800 leading-relaxed break-words">
                  "{sec.suggested_content}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
