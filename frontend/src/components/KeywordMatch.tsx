import React, { useState, useMemo } from 'react';
import { KeywordMatch as KeywordMatchType } from '../types';
import { Check, X, Search } from 'lucide-react';

interface KeywordMatchProps {
  keywords: KeywordMatchType[];
}

export const KeywordMatch: React.FC<KeywordMatchProps> = ({ keywords }) => {
  const [filter, setFilter] = useState<'all' | 'found' | 'missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const foundCount = useMemo(
    () => keywords.filter((k) => k.found).length,
    [keywords]
  );
  const missingCount = keywords.length - foundCount;
  const matchPercentage = keywords.length > 0
    ? Math.round((foundCount / keywords.length) * 100)
    : 0;

  const filteredKeywords = useMemo(() => {
    return keywords.filter((item) => {
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'found'
          ? item.found
          : !item.found;

      const matchesSearch = item.keyword
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      return matchesFilter && matchesSearch;
    });
  }, [keywords, filter, searchQuery]);

  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Keyword & ATS Match Matrix
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mt-0.5">
            Target terminology alignment and detected contexts
          </p>
        </div>

        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 self-start sm:self-auto shrink-0">
          {matchPercentage}% Match ({foundCount}/{keywords.length})
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter keywords..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:border-stone-900 dark:focus:border-stone-400 focus:bg-white dark:focus:bg-stone-900 text-stone-900 dark:text-stone-100 font-sans placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start space-x-1 border border-stone-200 dark:border-stone-700 rounded-md p-0.5 bg-stone-50 dark:bg-stone-950/60 text-xs font-sans w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none text-center px-2 sm:px-2.5 py-1 rounded transition-colors text-[11px] sm:text-xs cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            All ({keywords.length})
          </button>
          <button
            onClick={() => setFilter('found')}
            className={`flex-1 sm:flex-none text-center px-2 sm:px-2.5 py-1 rounded transition-colors text-[11px] sm:text-xs cursor-pointer ${
              filter === 'found'
                ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 font-medium shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-400'
            }`}
          >
            Found ({foundCount})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`flex-1 sm:flex-none text-center px-2 sm:px-2.5 py-1 rounded transition-colors text-[11px] sm:text-xs cursor-pointer ${
              filter === 'missing'
                ? 'bg-white dark:bg-stone-800 text-rose-800 dark:text-rose-400 font-medium shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-rose-800 dark:hover:text-rose-400'
            }`}
          >
            Missing ({missingCount})
          </button>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg max-h-80 overflow-y-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800 text-xs">
          <thead className="bg-stone-50 dark:bg-stone-950/60 text-stone-500 dark:text-stone-400 font-medium uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-3 sm:px-3.5 py-2.5 text-left w-20 sm:w-24 whitespace-nowrap">Status</th>
              <th className="px-3 sm:px-3.5 py-2.5 text-left w-1/3 whitespace-nowrap">Keyword</th>
              <th className="px-3 sm:px-3.5 py-2.5 text-left min-w-[160px]">Detected Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
            {filteredKeywords.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-stone-400 dark:text-stone-500 italic">
                  No matching keywords found.
                </td>
              </tr>
            ) : (
              filteredKeywords.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-850/50 transition-colors">
                  <td className="px-3 sm:px-3.5 py-2 whitespace-nowrap">
                    {item.found ? (
                      <span className="inline-flex items-center text-emerald-800 dark:text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5 mr-1 stroke-[2.5]" /> Found
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-rose-800 dark:text-rose-400 font-medium">
                        <X className="w-3.5 h-3.5 mr-1 stroke-[2.5]" /> Missing
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-3.5 py-2 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                    {item.keyword}
                  </td>
                  <td className="px-3 sm:px-3.5 py-2 text-stone-600 dark:text-stone-300 font-sans">
                    {item.context ? (
                      <span className="font-serif italic text-stone-700 dark:text-stone-300 block truncate max-w-[160px] sm:max-w-xs md:max-w-md" title={item.context}>
                        "{item.context}"
                      </span>
                    ) : (
                      <span className="text-stone-400 dark:text-stone-500 italic">Not mentioned</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
