import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck, Target, Layers, Upload, ScanSearch, ClipboardCheck, ChevronDown } from 'lucide-react';

export const HomePage: React.FC = () => {

  return (
    <div>

      {/* ═══════════════════════════════════════════
          Full-viewport hero cover
          ═══════════════════════════════════════════ */}
      <section className="hero-glow relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] px-4 sm:px-6">

        {/* Content */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto animate-fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-stone-900 tracking-tight leading-[1.1]">
            Know exactly where
            <br />
            your resume stands.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-500 font-sans leading-relaxed max-w-md mx-auto">
            ATS readability audit, keyword gap analysis, and section-level
            rewrites — all from a single upload.
          </p>

          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-lg group"
            >
              <span>Upload Resume</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="text-xs text-stone-400 font-sans">
              PDF & DOCX · No sign-up
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-bounce">
          <ChevronDown className="w-5 h-5 text-stone-400" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Content sections below the fold
          ═══════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 sm:space-y-28">

        {/* ── What you get ── */}
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400">
              What you get
            </p>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 tracking-tight">
              Everything to make your resume land.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {([
              {
                icon: FileCheck,
                title: 'Structural Audit',
                desc: 'Validates sections, contact fields, and layout hierarchy against what ATS parsers expect.',
              },
              {
                icon: Target,
                title: 'Keyword Matching',
                desc: 'Surfaces missing skills, qualifications, and phrases from any job description you paste in.',
              },
              {
                icon: Layers,
                title: 'Draft Rewrites',
                desc: 'Generates copy-ready improvements for weak sections, tuned to recruiter expectations.',
              },
            ] as const).map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`animate-fade-up stagger-${i + 1} group bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/80 space-y-3.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-stone-300`}
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200/60 flex items-center justify-center text-stone-600 transition-colors duration-200 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-serif font-semibold text-stone-900 tracking-tight">
                  {title}
                </h3>
                <p className="text-xs text-stone-500 font-sans leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400">
              Three steps
            </p>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 tracking-tight">
              From upload to polished resume.
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line — desktop only */}
            <div className="hidden sm:block absolute top-7 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-stone-200" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-5">
              {([
                { icon: Upload,         title: 'Upload',  desc: 'Drop a PDF or DOCX — nothing else needed.' },
                { icon: ScanSearch,     title: 'Analyze', desc: 'AI scores structure, keywords, and ATS compatibility.' },
                { icon: ClipboardCheck, title: 'Improve', desc: 'Review fixes and export polished draft sections.' },
              ] as const).map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className={`animate-fade-up stagger-${i + 4} flex flex-col items-center text-center space-y-3`}
                >
                  <div className="relative z-10 w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-serif font-semibold text-stone-900">{title}</h3>
                  <p className="text-xs text-stone-500 font-sans leading-relaxed max-w-[220px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="animate-fade-up stagger-6">
          <div className="text-center py-10 sm:py-14 px-6 rounded-2xl bg-stone-900 space-y-5">
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-tight">
              Ready to see your score?
            </h2>
            <p className="text-sm text-stone-400 font-sans max-w-sm mx-auto leading-relaxed">
              Upload your resume and get a full ATS audit with actionable
              improvements in under a minute.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2.5 px-7 py-3 bg-white hover:bg-stone-50 text-stone-900 text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
