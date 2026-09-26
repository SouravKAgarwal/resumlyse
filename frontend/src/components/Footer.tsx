import { Link } from "react-router-dom";
import { Github, Heart } from "lucide-react";
import { ResumlyseLogo } from "./Logo";

export const Footer = () => {
  return (
    <>
      <footer className="bg-white border-t border-stone-200 mt-auto">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-8 border-b border-stone-100">
            <div className="sm:col-span-2 space-y-3.5">
              <Link
                to="/"
                className="inline-flex items-center space-x-2.5 group"
              >
                <ResumlyseLogo className="w-7 h-7 transition-transform group-hover:scale-105" />
                <span className="font-serif font-semibold text-lg text-stone-900 tracking-tight">
                  resumlyse
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-md leading-relaxed">
                Precision resume auditing and ATS compatibility benchmarking.
                Evaluate structure, audit critical sections, and align candidate
                qualifications against targeted job descriptions.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <Link
                    to="/"
                    className="text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/upload"
                    className="text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Start New Analysis
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400 font-sans">
            <p>© {new Date().getFullYear()} resumlyse. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/SouravKAgarwal/resumlyse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-stone-200">·</span>
              <p className="inline-flex items-center gap-1">
                Made with <Heart className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
