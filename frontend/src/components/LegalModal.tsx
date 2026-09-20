import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Briefcase,
  FileCheck2,
  Database,
  EyeOff,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export type LegalModalTab = 'disclaimer' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalModalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'disclaimer',
}) => {
  const [activeTab, setActiveTab] = useState<LegalModalTab>(defaultTab);

  // Sync tab when opened with a specific defaultTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50 shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-serif font-semibold text-stone-900 tracking-tight truncate">
                Platform Terms & Compliance
              </h2>
              <p className="text-[11px] text-stone-500 font-sans">
                Evaluation guidelines, legal disclaimers, and data protection policies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors shrink-0"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50/80 px-4 sm:px-5 pt-2 shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors inline-flex items-center space-x-1.5 ${
              activeTab === 'disclaimer'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Legal & ATS Disclaimer</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors inline-flex items-center space-x-1.5 ${
              activeTab === 'privacy'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy & Data Security</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 font-sans text-xs sm:text-sm text-stone-700">
          {activeTab === 'disclaimer' ? (
            <div className="space-y-4">
              {/* Highlight callout banner */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-amber-900 flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-amber-950">Important Notice for Job Applicants</p>
                  <p className="text-amber-900/90 leading-relaxed">
                    resumlyse provides automated analysis and simulated compatibility ratings based on heuristic parsing models. All scores and recommendations are strictly advisory and for editorial self-improvement.
                  </p>
                </div>
              </div>

              {/* Section 1: No Guarantee of Employment */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-stone-900">
                  <Briefcase className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif font-semibold text-sm">
                    1. No Guarantee of Employment or Interviews
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Attaining a high compatibility score or following suggested recommendations does not guarantee interview invitations, recruitment advancement, or employment placement. Hiring decisions involve complex variables outside algorithmic inspection—including recruiter discretion, qualitative portfolio review, internal referral policies, and company headcount shifts.
                </p>
              </div>

              {/* Section 2: Simulated Heuristics & ATS Vendor Independence */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif font-semibold text-sm">
                    2. Heuristic Simulation & Vendor Independence
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Compatibility scores are estimated through structural parsing and keyword density heuristics. resumlyse is an independent benchmarking tool and is <strong>not affiliated with, endorsed by, sponsored by, or integrated with</strong> any proprietary ATS vendor, including but not limited to:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Workday', 'Taleo', 'Greenhouse', 'Lever', 'iCIMS', 'BambooHR', 'SmartRecruiters', 'SAP SuccessFactors'].map(
                    (vendor) => (
                      <span
                        key={vendor}
                        className="px-2 py-0.5 text-[10px] font-medium bg-stone-100 text-stone-600 rounded border border-stone-200"
                      >
                        {vendor}
                      </span>
                    )
                  )}
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  Each enterprise employer configures proprietary parsing filters and keyword weights differently. Our score reflects general ATS parsing best practices.
                </p>
              </div>

              {/* Section 3: AI Advisory Suggestions & Factual Truthfulness */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-stone-900">
                  <FileCheck2 className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif font-semibold text-sm">
                    3. AI-Assisted Advisory Suggestions & Candidate Verification
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Generated bullet rewrites, section improvements, and role suggestions are automated drafts created by artificial intelligence. You, as the candidate, are solely responsible for ensuring that all details, metrics, dates, and qualifications stated in your resume are 100% accurate, truthful, and substantiated before submitting to employers.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Privacy summary banner */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/90 rounded-xl text-emerald-900 flex items-start space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-emerald-950">Privacy & Data Minimization Commitment</p>
                  <p className="text-emerald-900/90 leading-relaxed">
                    resumlyse is engineered with privacy-by-design principles. Your resumes and career documents belong exclusively to you.
                  </p>
                </div>
              </div>

              {/* Privacy Item 1: Document Processing Purpose */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-stone-900">
                  <FileText className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif font-semibold text-sm">
                    1. Purpose of Document Processing
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Uploaded files (.pdf, .docx, .txt, .rtf) are processed solely to extract text, calculate section completeness, identify keywords, and output your evaluation score. Documents are not shared with employers or used to build public talent pools.
                </p>
              </div>

              {/* Privacy Item 2: Local Database Retention & Sovereignty */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-stone-900">
                  <Database className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif font-semibold text-sm">
                    2. Local Storage & Deletion Rights
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your evaluation history is preserved in your local SQLite database instance so that you can compare versions over time. You retain absolute control over your records: you can permanently delete individual analyses at any time via the <strong>History</strong> drawer.
                </p>
              </div>

              {/* Privacy Item 3: Zero Commercial Data Monetization */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-stone-900">
                  <EyeOff className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif font-semibold text-sm">
                    3. Zero Commercial Monetization or Third-Party Sale
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We strictly do not sell, rent, monetize, or distribute candidate resumes, contact details (phone, email, address), or job match data to third-party recruiters, advertising networks, or commercial data brokers.
                </p>
              </div>

              {/* Privacy Item 4: Document Format & Upload Boundaries */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-stone-900">
                  <Lock className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif font-semibold text-sm">
                    4. Security Constraints & Boundaries
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The platform enforces strict file extension validation (.pdf, .docx, .txt, .rtf) and a 10MB file size ceiling to safeguard system integrity. We do not collect credit cards, government identification, or passwords.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-stone-400 font-sans flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Policy effective: September 2026 • Platform Version 1.0</span>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
