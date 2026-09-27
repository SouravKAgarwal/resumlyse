import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { ResumlyseLogo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  return (
    <header className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200/90 dark:border-stone-800 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Link */}
        <Link
          href="/"
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
          <ThemeToggle />

          <Link
            href="/docs"
            className="no-print inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-colors shrink-0 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent"
            title="API Documentation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API Docs</span>
            <span className="sm:hidden">Docs</span>
          </Link>

          <Link
            href="/upload"
            className="no-print inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors shrink-0"
            title="Upload Document"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Document</span>
            <span className="sm:hidden">Upload</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
