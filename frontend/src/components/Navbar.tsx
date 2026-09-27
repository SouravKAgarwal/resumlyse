import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, BookOpen, Sun, Moon } from "lucide-react";
import { ResumlyseLogo } from "./Logo";
import { useTheme } from "../context/ThemeContext";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();

  const isUploadPage = location.pathname === "/upload";
  const isDocsPage = location.pathname === "/docs";

  return (
    <header className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200/90 dark:border-stone-800 sticky top-0 z-30 transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Link */}
        <Link
          to="/"
          className="flex items-center space-x-2 sm:space-x-2.5 text-left group focus:outline-none shrink-0"
        >
          <ResumlyseLogo className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105" />
          <span className="font-serif font-semibold text-base sm:text-lg text-stone-900 dark:text-stone-100 tracking-tight block">
            resumlyse
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            className="no-print p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent transition-colors cursor-pointer"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          <Link
            to="/docs"
            className={`no-print inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-colors shrink-0 ${
              isDocsPage
                ? "text-stone-900 dark:text-stone-100 bg-stone-200/80 dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent"
            }`}
            title="API Documentation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API Docs</span>
            <span className="sm:hidden">Docs</span>
          </Link>

          {!isUploadPage && (
            <Link
              to="/upload"
              className="no-print inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors shrink-0"
              title="Upload Document (Ctrl+U)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
              <kbd className="hidden lg:inline-flex ml-1.5 px-1 py-0.5 text-[9px] font-mono font-medium text-stone-400 dark:text-stone-500 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded">
                ⌘U
              </kbd>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
