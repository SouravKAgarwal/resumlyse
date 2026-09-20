import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportPDF } from '../api/client';
import { useDialog } from '../context/DialogContext';
import { AnalysisResult } from '../types';

interface ExportButtonProps {
  filename: string;
  analysis: AnalysisResult;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ filename, analysis }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { showAlert } = useDialog();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await exportPDF({ filename, analysis });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Analysis_${filename.replace(/\.[^/.]+$/, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      showAlert('Failed to export PDF report. Please check server connection and try again.', 'Export Failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full sm:w-auto inline-flex items-center justify-center px-3.5 py-2 sm:py-1.5 bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-800 text-xs font-medium rounded-lg transition-colors shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-stone-700 shrink-0" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 mr-1.5 text-stone-500 shrink-0" />
          <span>Export Report</span>
        </>
      )}
    </button>
  );
};
