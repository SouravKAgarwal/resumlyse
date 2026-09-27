import { Link } from "react-router-dom";
import { Github, Heart } from "lucide-react";
import { ResumlyseLogo } from "./Logo";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [healthStatus, setHealthStatus] = useState<
    "checking" | "healthy" | "offline"
  >("checking");

  const checkHealth = async () => {
    setHealthStatus("checking");
    try {
      const res = await fetch("/api", {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        setHealthStatus("healthy");
        return;
      }
      const fallback = await fetch("http://localhost:8000/api", {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (fallback.ok) {
        setHealthStatus("healthy");
        return;
      }
      setHealthStatus("offline");
    } catch {
      try {
        const fallback = await fetch("http://localhost:8000/api", {
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        });
        if (fallback.ok) {
          setHealthStatus("healthy");
          return;
        }
      } catch {
        // Both endpoints unreachable
      }
      setHealthStatus("offline");
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <>
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 mt-auto transition-colors duration-150">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-8 border-b border-stone-100 dark:border-stone-800">
            <div className="sm:col-span-2 space-y-3.5">
              <Link
                to="/"
                className="inline-flex items-center space-x-2.5 group"
              >
                <ResumlyseLogo className="w-7 h-7 transition-transform group-hover:scale-105" />
                <span className="font-serif font-semibold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                  resumlyse
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-sans max-w-md leading-relaxed">
                Precision resume auditing and ATS compatibility benchmarking.
                Evaluate structure, audit critical sections, and align candidate
                qualifications against targeted job descriptions.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 font-sans">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <Link
                    to="/"
                    className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/upload"
                    className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Start New Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs"
                    className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400 dark:text-stone-500 font-sans">
            <p>© {new Date().getFullYear()} resumlyse. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/SouravKAgarwal/resumlyse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-stone-200 dark:text-stone-700">·</span>
              <p className="inline-flex items-center gap-1">
                Made with{" "}
                <Heart className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </p>
              <span className="text-stone-200 dark:text-stone-700">·</span>
              <p
                className={`inline-flex items-center gap-1 ${
                  healthStatus === "healthy"
                    ? "text-green-500"
                    : healthStatus === "checking"
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                {healthStatus === "healthy" && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-stone-400">
                      All systems are operational
                    </span>
                  </>
                )}
                {healthStatus === "checking" && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    <span className="text-stone-400">Checking...</span>
                  </>
                )}
                {healthStatus === "offline" && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-stone-400">System down</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
