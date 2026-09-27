"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCheck,
} from "lucide-react";
import { ScoreCard } from "@/components/ScoreCard";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { SectionAnalysis } from "@/components/SectionAnalysis";
import { KeywordMatch } from "@/components/KeywordMatch";
import { ExportButton } from "@/components/ExportButton";
import { useToast } from "@/context/ToastContext";
import { useAnalysis } from "@/context/AnalysisContext";

export const AnalysisView: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { analysisData, isLoading } = useAnalysis();

  // Collapsible section state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Copy-all state
  const [copiedAll, setCopiedAll] = useState(false);

  const result = analysisData?.analysis ?? null;
  const filename = analysisData?.filename ?? "";

  const handleCopyAll = () => {
    if (!result) return;
    const text = result.critical_improvements
      .map((item, i) => `${i + 1}. ${item}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    toast("All action items copied to clipboard", "success");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-stone-700 dark:text-stone-300 animate-spin" />
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
          Loading document analysis...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/50">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
          Analysis Not Found
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
          No analysis data available. Please upload a resume to see analysis results.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link
            href="/upload"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-medium rounded-lg transition-colors"
          >
            Upload Resume
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium rounded-lg transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  // Quick KPI numbers
  const presentSectionsCount = result.sections.filter((s) => s.present).length;
  const foundKeywordsCount = result.keyword_matches.filter((k) => k.found).length;
  const totalKeywordsCount = result.keyword_matches.length;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="no-print flex items-center justify-between gap-2">
        <button
          onClick={() => router.push("/upload")}
          className="inline-flex items-center text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="hidden sm:inline">Upload Another Resume</span>
          <span className="sm:hidden">Upload Another</span>
        </button>

        <Link
          href="/upload"
          className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-stone-100 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-lg transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">New Analysis</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Document Meta Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-stone-900 p-3.5 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              className="text-sm sm:text-base font-serif font-semibold text-stone-900 dark:text-stone-100 truncate"
              title={filename}
            >
              {filename}
            </h2>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0 flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
          <ExportButton filename={filename} analysis={result} />
        </div>
      </div>

      {/* Row 1: Score Widget (1/3) & Executive Summary (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <ScoreCard score={result.overall_score} />
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-xl p-4 sm:p-6 lg:p-7 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-stone-100 dark:border-stone-800">
              <BarChart2 className="w-4 h-4 text-stone-600 dark:text-stone-400 shrink-0" />
              <h3 className="text-sm font-serif font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
                Executive Verdict & Summary
              </h3>
            </div>

            <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-xs sm:text-sm font-sans">
              {result.summary}
            </p>
          </div>

          {/* Quick KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3.5 sm:pt-5 mt-3.5 sm:mt-5 border-t border-stone-100 dark:border-stone-800">
            <div className="bg-stone-50 dark:bg-stone-950/40 p-2.5 sm:p-3 rounded-lg border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-0.5">
                ATS Score
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate block">
                {Math.round(result.overall_score)}/100
              </span>
            </div>

            <div className="bg-stone-50 dark:bg-stone-950/40 p-2.5 sm:p-3 rounded-lg border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-0.5">
                Sections
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate block">
                {presentSectionsCount}/{result.sections.length} Present
              </span>
            </div>

            <div className="bg-stone-50 dark:bg-stone-950/40 p-2.5 sm:p-3 rounded-lg border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-0.5">
                Keywords
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate block">
                {totalKeywordsCount > 0
                  ? `${Math.round((foundKeywordsCount / totalKeywordsCount) * 100)}% Match`
                  : "General"}
              </span>
            </div>

            <div className="bg-stone-50 dark:bg-stone-950/40 p-2.5 sm:p-3 rounded-lg border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-0.5">
                Priority Fixes
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-stone-100 truncate block">
                {result.critical_improvements.length} Items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Dense 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Left Column: Category Breakdown & Strengths */}
        <div className="space-y-4 sm:space-y-6">
          <ScoreBreakdown scores={result.category_scores} />

          {/* Identified Strengths — Collapsible */}
          {result.strengths && result.strengths.length > 0 && (
            <div className="bg-white dark:bg-stone-900 rounded-xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div
                className="pb-3 mb-3 sm:mb-3.5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 cursor-pointer select-none"
                onClick={() => toggleSection("strengths")}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 dark:text-stone-100 tracking-tight truncate">
                    Identified Resume Strengths
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                    {result.strengths.length} Highlights
                  </span>
                  {collapsedSections.strengths ? (
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  )}
                </div>
              </div>

              {!collapsedSections.strengths && (
                <div className="space-y-2 animate-in fade-in duration-150">
                  {result.strengths.map((str, idx) => (
                    <div
                      key={`str-${idx}`}
                      className="flex items-start text-xs sm:text-sm text-stone-700 dark:text-stone-300 bg-stone-50/70 dark:bg-stone-950/40 p-2.5 sm:p-3 rounded-lg border border-stone-200/60 dark:border-stone-800"
                    >
                      <span className="text-stone-400 dark:text-stone-500 mr-2 sm:mr-2.5 shrink-0">
                        —
                      </span>
                      <span className="leading-relaxed font-sans">{str}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Critical Action Items & Section Audit */}
        <div className="space-y-4 sm:space-y-6">
          {/* Critical Action Items — Collapsible + Copy All */}
          {result.critical_improvements.length > 0 && (
            <div className="bg-white dark:bg-stone-900 rounded-xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div
                className="pb-3 mb-3 sm:mb-3.5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 cursor-pointer select-none"
                onClick={() => toggleSection("critical")}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <AlertCircle className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0" />
                  <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 dark:text-stone-100 tracking-tight truncate">
                    Critical Action Items
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Copy All button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAll();
                    }}
                    className="no-print inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors py-0.5 px-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    title="Copy all action items"
                  >
                    {copiedAll ? (
                      <>
                        <CheckCheck className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="hidden sm:inline">Copy All</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                    {result.critical_improvements.length} Required Fixes
                  </span>
                  {collapsedSections.critical ? (
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                  )}
                </div>
              </div>

              {!collapsedSections.critical && (
                <div className="space-y-2 animate-in fade-in duration-150">
                  {result.critical_improvements.map((item, idx) => (
                    <div
                      key={`crit-${idx}`}
                      className="flex items-start text-xs sm:text-sm text-stone-800 dark:text-stone-200 bg-stone-50/70 dark:bg-stone-950/40 p-2.5 sm:p-3 rounded-lg border border-stone-200/60 dark:border-stone-800"
                    >
                      <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 mr-2 sm:mr-2.5 shrink-0 mt-0.5">
                        #{idx + 1}
                      </span>
                      <span className="leading-relaxed font-sans">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section-by-Section Analysis */}
          <SectionAnalysis sections={result.sections} />
        </div>
      </div>

      {/* Row 3: Keyword & ATS Match Table (if keywords present) */}
      {result.keyword_matches.length > 0 && (
        <div>
          <KeywordMatch keywords={result.keyword_matches} />
        </div>
      )}
    </div>
  );
};
