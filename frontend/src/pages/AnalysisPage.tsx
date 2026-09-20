import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FileText, BarChart2, CheckCircle2, AlertCircle, ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { ScoreCard } from '../components/ScoreCard';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { SectionAnalysis } from '../components/SectionAnalysis';
import { KeywordMatch } from '../components/KeywordMatch';
import { ExportButton } from '../components/ExportButton';
import { AnalysisResult } from '../types';
import { getAnalysis } from '../api/client';
import { useHistory } from '../context/HistoryContext';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { history } = useHistory();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [filename, setFilename] = useState<string>('');

  const numericId = id ? Number(id) : null;

  // Check if we have analysis data in location state (from UploadPage)
  const analysisDataFromState = location.state as { analysisData?: { id: number; filename: string; analysis: AnalysisResult } } || {};

  useEffect(() => {
    // If we have data from state, use it directly
    if (analysisDataFromState.analysisData) {
      setResult(analysisDataFromState.analysisData.analysis);
      setFilename(analysisDataFromState.analysisData.filename);
      setIsLoading(false);
      return;
    }

    // Otherwise, fall back to trying to fetch from storage (will fail in our stateless setup)
    if (!numericId || isNaN(numericId)) {
      setError('Invalid analysis record identifier.');
      setIsLoading(false);
      return;
    }

    const fetchResult = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAnalysis(numericId);
        setResult(data.analysis);
        setFilename(data.filename);
      } catch (err: any) {
        console.error('Failed to load analysis:', err);
        setError('Could not retrieve this document analysis. Analysis history is not available in this stateless deployment.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [numericId, analysisDataFromState]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-stone-700 animate-spin" />
        <p className="text-xs text-stone-500 font-sans">Loading document analysis...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-serif font-semibold text-stone-900">Analysis Not Found</h2>
        <p className="text-xs text-stone-500 leading-relaxed font-sans">{error || 'This analysis could not be displayed.'}</p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link
            to="/upload"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Upload Resume
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
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
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="hidden sm:inline">Upload Another Resume</span>
          <span className="sm:hidden">Upload Another</span>
        </button>

        <Link
          to="/upload"
          className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">New Analysis</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Document Meta Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3.5 sm:p-5 rounded-xl border border-stone-200 shadow-xs gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-serif font-semibold text-stone-900 truncate" title={filename}>
              {filename}
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-400 font-sans flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <span>
                {currentRecord
                  ? `Evaluated on ${new Date(currentRecord.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}`
                  : analysisDataFromState.analysisData
                  ? 'Just Analyzed'
                  : 'Benchmark Report'}
              </span>
              {((currentRecord && currentRecord.job_description) ||
                (analysisDataFromState.analysisData &&
                  /* We don't have job description in the analysis result from state,
                   but in a real implementation we might want to pass it */ false)) && (
                <span className="font-medium text-stone-600">• Role-specific Benchmark</span>
              )}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0 flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
          {numericId && <ExportButton analysisId={numericId} filename={filename} analysis={result} />}
        </div>
      </div>

      {/* Row 1: Score Widget (1/3) & Executive Summary (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <ScoreCard score={result.overall_score} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 lg:p-7 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-stone-100">
              <BarChart2 className="w-4 h-4 text-stone-600 shrink-0" />
              <h3 className="text-sm font-serif font-semibold text-stone-900 tracking-tight">
                Executive Verdict & Summary
              </h3>
            </div>

            <p className="text-stone-700 leading-relaxed text-xs sm:text-sm font-sans">
              {result.summary}
            </p>
          </div>

          {/* Quick KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3.5 sm:pt-5 mt-3.5 sm:mt-5 border-t border-stone-100">
            <div className="bg-stone-50 p-2.5 sm:p-3 rounded-lg border border-stone-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                ATS Score
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate block">
                {Math.round(result.overall_score)}/100
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 sm:p-3 rounded-lg border border-stone-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                Sections
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate block">
                {presentSectionsCount}/{result.sections.length} Present
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 sm:p-3 rounded-lg border border-stone-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                Keywords
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate block">
                {totalKeywordsCount > 0
                  ? `${Math.round((foundKeywordsCount / totalKeywordsCount) * 100)}% Match`
                  : 'General'}
              </span>
            </div>

            <div className="bg-stone-50 p-2.5 sm:p-3 rounded-lg border border-stone-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                Priority Fixes
              </span>
              <span className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate block">
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

          {/* Identified Strengths */}
          {result.strengths && result.strengths.length > 0 && (
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs">
              <div className="pb-3 mb-3 sm:mb-3.5 border-b border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                  <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
                    Identified Resume Strengths
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  {result.strengths.length} Highlights
                </span>
              </div>

              <div className="space-y-2">
                {result.strengths.map((str, idx) => (
                  <div
                    key={`str-${idx}`}
                    className="flex items-start text-xs sm:text-sm text-stone-700 bg-stone-50/70 p-2.5 sm:p-3 rounded-lg border border-stone-200/60"
                  >
                    <span className="text-stone-400 mr-2 sm:mr-2.5 shrink-0">—</span>
                    <span className="leading-relaxed font-sans">{str}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Critical Action Items & Section Audit */}
        <div className="space-y-4 sm:space-y-6">
          {/* Critical Action Items */}
          {result.critical_improvements.length > 0 && (
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-stone-200 shadow-xs">
              <div className="pb-3 mb-3 sm:mb-3.5 border-b border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  <h3 className="text-sm sm:text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
                    Critical Action Items
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 shrink-0">
                  {result.critical_improvements.length} Required Fixes
                </span>
              </div>

              <div className="space-y-2">
                {result.critical_improvements.map((item, idx) => (
                  <div
                    key={`crit-${idx}`}
                    className="flex items-start text-xs sm:text-sm text-stone-800 bg-stone-50/70 p-2.5 sm:p-3 rounded-lg border border-stone-200/60"
                  >
                    <span className="text-[10px] font-bold text-stone-500 mr-2 sm:mr-2.5 shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <span className="leading-relaxed font-sans">{item}</span>
                  </div>
                ))}
              </div>
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
