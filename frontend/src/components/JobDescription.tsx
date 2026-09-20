import React from 'react';
import { Target, XCircle } from 'lucide-react';

interface JobDescriptionProps {
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const JobDescription: React.FC<JobDescriptionProps> = ({
  jobDescription,
  setJobDescription,
  enabled,
  setEnabled,
}) => {
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      enabled
        ? 'bg-white border-stone-300 shadow-xs'
        : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
    }`}>
      <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            enabled ? 'bg-stone-900 text-white' : 'bg-stone-200/80 text-stone-600'
          }`}>
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h3 className="text-sm font-serif font-medium text-stone-900 tracking-tight">
                Target Role Benchmark
              </h3>
              <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                Optional
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-sans leading-relaxed">
              Compare your resume against a specific job posting to uncover missing keywords.
            </p>
          </div>
        </div>

        {/* Notion-style subtle toggle */}
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            enabled ? 'bg-stone-900' : 'bg-stone-300'
          }`}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-stone-100 animate-in fade-in duration-150">
          <div className="relative">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description or requirements here..."
              rows={4}
              className="w-full p-3 sm:p-3.5 text-xs sm:text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-900 focus:border-stone-900 focus:bg-white transition-all resize-y placeholder:text-stone-400 font-sans leading-relaxed"
            />
            {jobDescription && (
              <button
                onClick={() => setJobDescription('')}
                className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700 p-1"
                title="Clear text"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-stone-400 font-sans">
            <span>Tip: Include requirements and skills for optimal ATS matching.</span>
            <span className="self-end sm:self-auto shrink-0">{wordCount} words • {jobDescription.length} chars</span>
          </div>
        </div>
      )}
    </div>
  );
};
