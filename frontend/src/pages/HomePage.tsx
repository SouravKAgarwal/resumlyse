import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck, Target, Layers, Clock, ChevronRight } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';

export const HomePage: React.FC = () => {
  const { history } = useHistory();

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-16 animate-in fade-in duration-200">
      {/* Hero Section */}
      <div className="text-center space-y-4 sm:space-y-5 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium text-stone-900 tracking-tight leading-tight">
          Precision evaluation for modern resumes.
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-stone-600 font-sans leading-relaxed">
          Audit applicant tracking readability, discover missing keywords for specific job postings, and access actionable section revisions.
        </p>

        <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            to="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-colors shadow-xs group"
          >
            <span>Start Resume Analysis</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/70">
            <FileCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-serif font-semibold text-stone-900">
            Structural Audit
          </h3>
          <p className="text-xs text-stone-500 font-sans leading-relaxed">
            Verify essential sections, contact metadata, and parseable layout hierarchy for automated tracking systems.
          </p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/70">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-serif font-semibold text-stone-900">
            Target Role Matching
          </h3>
          <p className="text-xs text-stone-500 font-sans leading-relaxed">
            Compare against target job descriptions to extract missing skills, technical qualifications, and keywords.
          </p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs space-y-3 sm:col-span-2 md:col-span-1">
          <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 border border-stone-200/70">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-serif font-semibold text-stone-900">
            Actionable Drafts
          </h3>
          <p className="text-xs text-stone-500 font-sans leading-relaxed">
            Receive section quality ratings and copy-ready draft content directly tailored to improve recruiter impact.
          </p>
        </div>
      </div>

      {/* Recent Analyses Section (if available) */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <h2 className="text-sm font-serif font-semibold text-stone-900 tracking-tight">
                Recent Document Analyses
              </h2>
            </div>
            <Link
              to="/upload"
              className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors underline-offset-2 hover:underline"
            >
              Analyze New Document
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {history.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to={`/analysis/${item.id}`}
                className="py-3 px-2 flex items-center justify-between hover:bg-stone-50/70 rounded-lg transition-colors group gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-stone-900 group-hover:text-stone-700 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {item.job_description && ' • Targeted Role'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                    {Math.round(item.overall_score)}/100
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
