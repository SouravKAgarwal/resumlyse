import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import { useDialog } from '../context/DialogContext';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { showAlert } = useDialog();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    const validTypes = ['.pdf', '.docx', '.txt', '.rtf'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (validTypes.includes(extension)) {
      onFileSelect(file);
    } else {
      showAlert(
        'Please upload a valid document format (.pdf, .docx, .txt, or .rtf).',
        'Unsupported File Format',
        'warning'
      );
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toUpperCase() || 'DOC';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-stone-800 bg-stone-100/70'
              : 'border-stone-300/80 bg-white hover:border-stone-400 hover:bg-stone-50/50'
          }`}
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mb-3 text-stone-700">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <h3 className="text-sm sm:text-base font-serif font-medium text-stone-900 tracking-tight">
            Select a document or drag it here
          </h3>
          <p className="text-xs text-stone-500 mt-1 font-sans max-w-xs sm:max-w-md">
            Drop your resume to evaluate ATS readability and structural metrics
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3.5 sm:mt-4">
            {['PDF', 'DOCX', 'TXT', 'RTF'].map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 border border-stone-200 text-stone-600 uppercase"
              >
                {fmt}
              </span>
            ))}
            <span className="text-[11px] text-stone-400 ml-0.5 sm:ml-1">Up to 10MB</span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-xs sm:text-sm font-medium text-stone-900 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  <Check className="w-3 h-3 mr-0.5 stroke-[2.5]" /> Ready
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                {getFileExtension(selectedFile.name)} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Replace
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
              title="Remove document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleChange}
        accept=".pdf,.docx,.txt,.rtf"
      />
    </div>
  );
};
