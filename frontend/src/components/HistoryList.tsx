import React, { useState, useMemo } from 'react';
import { AnalysisRecord } from '../types';
import { Trash2, ChevronRight, Search, FileText } from 'lucide-react';
import { useDialog } from '../context/DialogContext';

interface HistoryListProps {
  history: AnalysisRecord[];
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  selectedId: number | null;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onDelete,
  selectedId,
}) => {
  const [query, setQuery] = useState('');
  const { showConfirm } = useDialog();

  const filteredHistory = useMemo(() => {
    return history.filter((rec) =>
      rec.filename.toLowerCase().includes(query.toLowerCase().trim())
    );
  }, [history, query]);

  if (history.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-stone-400 text-xs font-sans">
        <FileText className="w-8 h-8 mx-auto mb-2 text-stone-300" />
        No past analyses recorded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Filter */}
      <div className="p-3 border-b border-stone-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search past analyses..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-stone-900 focus:bg-white text-stone-900 placeholder:text-stone-400 font-sans"
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-400">
            No matching documents found.
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {filteredHistory.map((record) => {
              const date = new Date(record.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isSelected = selectedId === record.id;

              return (
                <li
                  key={record.id}
                  onClick={() => onSelect(record.id)}
                  className={`p-3.5 transition-colors cursor-pointer group flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-stone-100 border-l-2 border-stone-900'
                      : 'hover:bg-stone-50/70 border-l-2 border-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p
                        className="text-xs font-medium text-stone-900 truncate pr-2"
                        title={record.filename}
                      >
                        {record.filename}
                      </p>
                      <span className="text-xs font-semibold text-stone-800 bg-white px-1.5 py-0.2 rounded border border-stone-200">
                        {Math.round(record.overall_score)}
                      </span>
                    </div>

                    <div className="flex items-center text-[10px] text-stone-400 space-x-2">
                      <span>{date}</span>
                      {record.job_description && (
                        <span className="px-1 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                          Role Matched
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showConfirm(
                          `Are you sure you want to delete the analysis for "${record.filename}"? This action cannot be undone.`,
                          () => onDelete(record.id),
                          'Delete Document',
                          'Delete',
                          'Cancel'
                        );
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-md transition-all opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700 shrink-0" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
