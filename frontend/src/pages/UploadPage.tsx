import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { JobDescription } from '../components/JobDescription';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { analyzeResume } from '../api/client';
import { useDialog } from '../context/DialogContext';

export const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jdEnabled, setJdEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showAlert } = useDialog();

  const handleAnalyze = async () => {
    if (!file) {
      showAlert('Please choose a resume document before starting analysis.', 'Document Required', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await analyzeResume(
        file,
        jdEnabled && jobDescription ? jobDescription : undefined
      );
      // Navigate to the result page with the analysis data in state
      navigate('/analysis', { state: { analysisData: data } });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      const msg =
        err.response?.data?.detail ||
        'An error occurred while evaluating your document. Please verify the document format and try again.';
      setError(msg);
      showAlert(msg, 'Evaluation Error', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Home
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1 sm:space-y-1.5 pb-1 sm:pb-2">
        <h1 className="text-xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
          Submit Resume for Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-2xl leading-relaxed">
          Upload your document to audit formatting structure and compare keywords against job posting requirements.
        </p>
      </div>

      {/* Upload and Job Description Card */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs space-y-5 sm:space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-sans">
            1. Resume Document
          </label>
          <FileUpload
            selectedFile={file}
            onFileSelect={(f) => {
              setFile(f);
              setError(null);
            }}
            onClear={() => setFile(null)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-sans">
            2. Target Role Benchmark (Optional)
          </label>
          <JobDescription
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            enabled={jdEnabled}
            setEnabled={setJdEnabled}
          />
        </div>

        {error && (
          <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs sm:text-sm flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-stone-400 font-sans text-center sm:text-left">
            Evaluation checks layout hierarchy, sections, and keyword density.
          </p>
          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs text-center justify-center"
          >
            Analyze Document
          </button>
        </div>
      </div>

      {isAnalyzing && <LoadingSpinner />}
    </div>
  );
};
