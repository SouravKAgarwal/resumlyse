import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Plus, X } from 'lucide-react';
import { HistoryList } from './HistoryList';
import { useHistory } from '../context/HistoryContext';

export const HistoryDrawer: React.FC = () => {
  const { history, isDrawerOpen, setIsDrawerOpen, deleteRecord } = useHistory();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const currentId = id ? Number(id) : null;

  if (!isDrawerOpen) return null;

  const handleSelect = (selectedId: number) => {
    navigate(`/analysis/${selectedId}`);
    setIsDrawerOpen(false);
  };

  const handleNewAnalysis = () => {
    navigate('/upload');
    setIsDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-stone-950/30 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-96 max-w-full sm:max-w-sm bg-white shadow-2xl border-l border-stone-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-3.5 sm:p-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-stone-900">
              <Clock className="w-4 h-4 text-stone-500" />
              <h3 className="font-serif font-semibold text-base">Past Analyses</h3>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Action */}
          <div className="p-3 bg-stone-50 border-b border-stone-100">
            <button
              onClick={handleNewAnalysis}
              className="w-full py-2 px-3 text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center justify-center shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Start New Analysis
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-hidden">
            <HistoryList
              history={history}
              onSelect={handleSelect}
              onDelete={deleteRecord}
              selectedId={currentId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
