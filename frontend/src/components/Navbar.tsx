import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Plus } from 'lucide-react';
import { ResumlyseLogo } from './Logo';
import { useHistory } from '../context/HistoryContext';

export const Navbar: React.FC = () => {
  const { history, setIsDrawerOpen } = useHistory();
  const location = useLocation();

  const isUploadPage = location.pathname === '/upload';

  return (
    <header className="bg-white border-b border-stone-200/90 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Link */}
        <Link
          to="/"
          className="flex items-center space-x-2 sm:space-x-2.5 text-left group focus:outline-none shrink-0"
        >
          <ResumlyseLogo className="w-7 h-7 sm:w-8 h-8 transition-transform group-hover:scale-105" />
          <span className="font-serif font-semibold text-base sm:text-lg text-stone-900 tracking-tight block">
            resumlyse
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {!isUploadPage && (
            <Link
              to="/upload"
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition-colors shrink-0"
              title="Upload Document"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
            </Link>
          )}

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors shrink-0"
            title="View past analyses"
          >
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>History</span>
            {history.length > 0 && (
              <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 bg-stone-100 text-stone-700 font-bold rounded-full text-[10px] border border-stone-200">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
