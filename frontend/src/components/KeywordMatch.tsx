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
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-stone-100">
        <div>
          <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight">
            Keyword & ATS Match Matrix
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Target terminology alignment and detected contexts
          </p>
        </div>

        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200 self-start sm:self-auto shrink-0">
          {matchPercentage}% Match ({foundCount}/{keywords.length})
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter keywords..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-stone-900 focus:bg-white text-stone-900 font-sans placeholder:text-stone-400"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start space-x-1 border border-stone-200 rounded-md p-0.5 bg-stone-50 text-xs font-sans w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none text-center px-2 sm:px-2.5 py-1 rounded transition-colors text-[11px] sm:text-xs ${
              filter === 'all'
                ? 'bg-white text-stone-900 font-medium shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            All ({keywords.length})
          </button>
          <button
            onClick={() => setFilter('found')}
            className={`flex-1 sm:flex-none text-center px-2 sm:px-2.5 py-1 rounded transition-colors text-[11px] sm:text-xs ${
              filter === 'found'
                ? 'bg-white text-emerald-800 font-medium shadow-xs'
                : 'text-stone-500 hover:text-emerald-800'
            }`}
          >
            Found ({foundCount})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`flex-1 sm:flex-none text-center px-2 sm:px-2.5 py-1 rounded transition-colors text-[11px] sm:text-xs ${
              filter === 'missing'
                ? 'bg-white text-rose-800 font-medium shadow-xs'
                : 'text-stone-500 hover:text-rose-800'
            }`}
          >
            Missing ({missingCount})
          </button>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="overflow-x-auto border border-stone-200 rounded-lg max-h-80 overflow-y-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-stone-200 text-xs">
          <thead className="bg-stone-50 text-stone-500 font-medium uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-3 sm:px-3.5 py-2.5 text-left w-20 sm:w-24 whitespace-nowrap">Status</th>
              <th className="px-3 sm:px-3.5 py-2.5 text-left w-1/3 whitespace-nowrap">Keyword</th>
              <th className="px-3 sm:px-3.5 py-2.5 text-left min-w-[160px]">Detected Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {filteredKeywords.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-stone-400 italic">
                  No matching keywords found.
                </td>
              </tr>
            ) : (
              filteredKeywords.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-3 sm:px-3.5 py-2 whitespace-nowrap">
                    {item.found ? (
                      <span className="inline-flex items-center text-emerald-800 font-medium">
                        <Check className="w-3.5 h-3.5 mr-1 stroke-[2.5]" /> Found
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-rose-800 font-medium">
                        <X className="w-3.5 h-3.5 mr-1 stroke-[2.5]" /> Missing
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-3.5 py-2 font-medium text-stone-900 whitespace-nowrap">
                    {item.keyword}
                  </td>
                  <td className="px-3 sm:px-3.5 py-2 text-stone-600 font-sans">
                    {item.context ? (
                      <span className="font-serif italic text-stone-700 block truncate max-w-[160px] sm:max-w-xs md:max-w-md" title={item.context}>
                        "{item.context}"
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">Not mentioned</span>
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
