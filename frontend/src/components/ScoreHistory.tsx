import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

interface HistoryEntry {
  filename: string;
  score: number;
  timestamp: string;
}

const STORAGE_KEY = 'resumlyse_score_history';

export function saveScoreToHistory(filename: string, score: number) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const history: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    history.push({
      filename,
      score,
      timestamp: new Date().toISOString(),
    });
    // Keep last 10 entries
    if (history.length > 10) history.splice(0, history.length - 10);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    /* silent */
  }
}

export function getScoreHistory(): HistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface ScoreHistoryProps {
  currentScore: number;
}

export const ScoreHistory: React.FC<ScoreHistoryProps> = ({ currentScore }) => {
  const history = useMemo(() => getScoreHistory(), []);

  if (history.length < 2) return null;

  const previousEntry = history[history.length - 2];
  const delta = currentScore - previousEntry.score;
  const maxScore = Math.max(...history.map((h) => h.score), 1);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-stone-500 shrink-0" />
          <h3 className="text-sm font-serif font-semibold text-stone-900 tracking-tight truncate">
            Session Progress
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 shrink-0">
          {history.length} Analyses
        </span>
      </div>

      {/* Score bar chart */}
      <div className="flex items-end gap-1.5 h-16 mb-3">
        {history.map((entry, idx) => {
          const isLatest = idx === history.length - 1;
          const heightPct = Math.max((entry.score / maxScore) * 100, 8);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <span
                className={`text-[9px] font-bold ${isLatest ? 'text-stone-900' : 'text-stone-400'}`}
              >
                {entry.score}
              </span>
              <div
                className={`w-full rounded-sm transition-all duration-300 ${
                  isLatest ? 'bg-stone-800' : 'bg-stone-200'
                }`}
                style={{ height: `${heightPct}%` }}
                title={`${entry.filename}: ${entry.score}/100`}
              />
            </div>
          );
        })}
      </div>

      {/* Delta indicator */}
      <div
        className={`flex items-center gap-1.5 text-xs font-medium ${
          delta > 0
            ? 'text-emerald-800'
            : delta < 0
              ? 'text-rose-800'
              : 'text-stone-500'
        }`}
      >
        {delta > 0 ? (
          <TrendingUp className="w-3.5 h-3.5" />
        ) : delta < 0 ? (
          <TrendingDown className="w-3.5 h-3.5" />
        ) : (
          <Minus className="w-3.5 h-3.5" />
        )}
        <span>
          {delta > 0 ? '+' : ''}
          {delta} points vs. previous analysis
        </span>
      </div>
    </div>
  );
};
