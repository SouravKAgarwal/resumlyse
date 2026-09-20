import React from 'react';
import { CategoryScore } from '../types';

interface SuggestionListProps {
  categories: CategoryScore[];
  criticalImprovements: string[];
  strengths?: string[];
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  categories,
  criticalImprovements,
  strengths = [],
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Identified Strengths */}
      {strengths && strengths.length > 0 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs">
          <div className="pb-3 mb-3 sm:mb-3.5 border-b border-stone-100 flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
              Identified Strengths
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
              {strengths.length} Highlights
            </span>
          </div>

          <div className="space-y-2">
            {strengths.map((str, idx) => (
              <div
                key={`str-${idx}`}
                className="flex items-start text-xs sm:text-sm text-stone-700 bg-stone-50/70 p-2.5 sm:p-3 rounded-lg border border-stone-200/60"
              >
                <span className="text-stone-400 mr-2 sm:mr-2.5 shrink-0">—</span>
                <span className="leading-relaxed font-sans">{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Action Items */}
      {criticalImprovements.length > 0 && (
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs">
          <div className="pb-3 mb-3 sm:mb-3.5 border-b border-stone-100 flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
              Priority Action Items
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 shrink-0">
              {criticalImprovements.length} Action Items
            </span>
          </div>

          <div className="space-y-2">
            {criticalImprovements.map((item, idx) => (
              <div
                key={`crit-${idx}`}
                className="flex items-start text-xs sm:text-sm text-stone-800 bg-stone-50/70 p-2.5 sm:p-3 rounded-lg border border-stone-200/60"
              >
                <span className="text-[10px] font-bold text-stone-500 mr-2 sm:mr-2.5 shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <span className="leading-relaxed font-sans">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Level Recommendations */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs">
        <div className="pb-3 mb-3 sm:mb-4 border-b border-stone-100">
          <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight">
            Strategic Recommendations by Category
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Targeted revisions for recruiter impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {categories.map((cat, idx) => {
            if (!cat.suggestions || cat.suggestions.length === 0) return null;

            return (
              <div
                key={`cat-${idx}`}
                className="p-3.5 sm:p-4 rounded-lg border border-stone-200 bg-stone-50/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-stone-900 truncate mr-2">
                      {cat.category}
                    </h4>
                    <span className="text-[11px] font-bold text-stone-600 shrink-0">
                      {Math.round(cat.score)}%
                    </span>
                  </div>

                  <ul className="space-y-1.5 sm:space-y-2">
                    {cat.suggestions.map((suggestion, sIdx) => (
                      <li
                        key={`sugg-${idx}-${sIdx}`}
                        className="flex items-start text-xs text-stone-600 leading-relaxed font-sans"
                      >
                        <span className="text-stone-400 mr-2 shrink-0">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
