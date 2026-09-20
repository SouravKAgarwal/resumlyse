import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck, Target, Layers } from 'lucide-react';

export const HomePage: React.FC = () => {

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
    </div>
  );
};
