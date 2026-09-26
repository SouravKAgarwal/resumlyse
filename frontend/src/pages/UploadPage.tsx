import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Briefcase } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { JobDescription } from '../components/JobDescription';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { analyzeResume } from '../api/client';
import { useDialog } from '../context/DialogContext';
import { saveScoreToHistory } from '../components/ScoreHistory';

const INDUSTRY_PRESETS = [
  { id: 'general', label: 'General' },
  { id: 'software', label: 'Software Engineering' },
  { id: 'data', label: 'Data Science / ML' },
  { id: 'product', label: 'Product Management' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finance', label: 'Finance' },
  { id: 'design', label: 'Design / UX' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'sales', label: 'Sales' },
  { id: 'legal', label: 'Legal' },
] as const;

const INDUSTRY_CONTEXT: Record<string, string> = {
  software:
    'The candidate is applying for a Software Engineering role. Prioritize: programming languages, frameworks, system design, CI/CD, testing, version control, cloud platforms (AWS/GCP/Azure), and quantified engineering impact.',
  data: 'The candidate is applying for a Data Science / Machine Learning role. Prioritize: Python, R, SQL, statistical modeling, ML frameworks (TensorFlow, PyTorch, scikit-learn), data pipelines, A/B testing, and research publications.',
  product:
    'The candidate is applying for a Product Management role. Prioritize: product strategy, roadmapping, user research, metrics-driven decision making, cross-functional leadership, Agile/Scrum, and go-to-market experience.',
  marketing:
    'The candidate is applying for a Marketing role. Prioritize: campaign management, SEO/SEM, analytics tools, content strategy, brand development, growth metrics, and conversion optimization.',
  finance:
    'The candidate is applying for a Finance role. Prioritize: financial modeling, valuation, Excel/VBA, regulatory compliance, risk management, CFA/CPA certifications, and quantified P&L impact.',
  design:
    'The candidate is applying for a Design / UX role. Prioritize: user research, wireframing, prototyping tools (Figma, Sketch), design systems, accessibility standards, usability testing, and portfolio links.',
  healthcare:
    'The candidate is applying for a Healthcare role. Prioritize: clinical certifications, patient care metrics, HIPAA compliance, EMR systems, continuing education, and regulatory knowledge.',
  sales:
    'The candidate is applying for a Sales / Business Development role. Prioritize: quota attainment, pipeline management, CRM tools (Salesforce), negotiation, client relationships, and revenue growth metrics.',
  legal:
    'The candidate is applying for a Legal role. Prioritize: bar admission, practice areas, case management, regulatory compliance, contract drafting, and legal research tools.',
};

export const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jdEnabled, setJdEnabled] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('general');
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
      // Build the full job description with industry context prefix
      let fullJd = jdEnabled && jobDescription ? jobDescription : undefined;
      if (selectedIndustry !== 'general') {
        const industryPrefix = INDUSTRY_CONTEXT[selectedIndustry] || '';
        fullJd = fullJd
          ? `${industryPrefix}\n\n---\n\nJOB POSTING:\n${fullJd}`
          : industryPrefix;
      }

      const data = await analyzeResume(file, fullJd);

      // Save score to session history
      saveScoreToHistory(data.filename, data.analysis.overall_score);

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

        {/* Industry Preset Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-sans">
            2. Industry Focus
          </label>
          <div className="rounded-xl border border-stone-200 bg-stone-50/60 hover:border-stone-300 transition-all p-4 sm:p-5">
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-stone-200/80 text-stone-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-medium text-stone-900 tracking-tight">
                  Target Industry
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 font-sans leading-relaxed">
                  Select your field for industry-specific keyword and section evaluation.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INDUSTRY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedIndustry(preset.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    selectedIndustry === preset.id
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 font-sans">
            3. Target Role Benchmark (Optional)
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
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
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
