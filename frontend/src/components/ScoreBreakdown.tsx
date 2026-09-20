import React, { useState } from 'react';
import { CategoryScore } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreBreakdownProps {
  scores: CategoryScore[];
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores }) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const toggleIndex = (idx: number) => {
    setExpandedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'bg-stone-800 text-stone-900';
    if (s >= 55) return 'bg-stone-600 text-stone-700';
    return 'bg-stone-400 text-stone-600';
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-stone-100 gap-2">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
            Evaluation Breakdown
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Performance metrics across evaluation dimensions
          </p>
        </div>
        <button
          onClick={() => {
            if (expandedIndices.length === scores.length) {
              setExpandedIndices([]);
            } else {
              setExpandedIndices(scores.map((_, i) => i));
            }
          }}
          className="text-xs text-stone-500 hover:text-stone-900 font-medium underline-offset-2 hover:underline transition-colors shrink-0 py-1"
        >
          {expandedIndices.length === scores.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-2 sm:space-y-2.5">
        {scores.map((cat, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          const colorClass = getScoreColor(cat.score);

          return (
            <div
              key={cat.category}
              className={`border rounded-lg transition-colors overflow-hidden ${
                isExpanded ? 'border-stone-300 bg-stone-50/30' : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div
                onClick={() => toggleIndex(idx)}
                className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-2 sm:gap-3 hover:bg-stone-50/60 transition-colors"
              >
                <div className="flex items-center justify-between sm:justify-start space-x-2.5 min-w-0 sm:w-2/5">
                  <span className="font-medium text-xs sm:text-sm text-stone-900 truncate">
                    {cat.category}
                  </span>
                  {cat.weight > 0 && (
                    <span className="text-[9px] uppercase font-bold text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded shrink-0">
                      {Math.round(cat.weight * 100)}%
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2.5 sm:space-x-3 flex-1 sm:w-1/2">
                  <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass.split(' ')[0]} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(4, cat.score)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-stone-800 w-9 sm:w-10 text-right shrink-0">
                    {Math.round(cat.score)}%
                  </span>
                  <div className="text-stone-400 pl-0.5 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-3.5 sm:p-4 bg-white border-t border-stone-100 text-xs animate-in fade-in duration-150 space-y-2.5 sm:space-y-3">
                  <p className="text-stone-700 leading-relaxed font-sans bg-stone-50 p-2.5 sm:p-3 rounded border border-stone-200/60">
                    {cat.feedback}
                  </p>

                  {cat.suggestions && cat.suggestions.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5 font-sans">
                        Targeted Suggestions
                      </span>
                      <ul className="space-y-1.5">
                        {cat.suggestions.map((suggestion, sIdx) => (
                          <li
                            key={sIdx}
                            className="flex items-start text-stone-600 leading-relaxed font-sans"
                          >
                            <span className="text-stone-400 mr-2 shrink-0">—</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
