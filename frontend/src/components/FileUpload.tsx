import React, { useCallback, useRef, useState } from "react";
import { Upload, X, Check } from "lucide-react";
import { useToast } from "../context/ToastContext";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

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
    const validTypes = [".pdf", ".docx", ".txt", ".rtf"];
    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(extension)) {
      toast(
        "Please upload a valid format: .pdf, .docx, .txt, or .rtf",
        "warning",
      );
    } else if (file.size > maxSizeInBytes) {
      toast(
        "File size exceeds the 10MB limit. Please select a smaller file.",
        "warning",
      );
    } else {
      onFileSelect(file);
    }
  };

  const getFileExtension = (filename: string) => {
    return (
      filename
        .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
        .toUpperCase() || "DOC"
    );
  };

  const getFileIcon = (filename: string) => {
    const extension = filename
      .substring(filename.lastIndexOf("."))
      .toLowerCase();

    // Return appropriate SVG icon based on file type with specific colors
    switch (extension) {
      case ".pdf":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-label="PDF"
            role="img"
            viewBox="0 0 512 512"
          >
            <rect width="512" height="512" rx="15%" fill="#c80a0a" />
            <path
              fill="#ffffff"
              d="M413 302c-9-10-29-15-56-15-16 0-33 2-53 5a252 252 0 0 1-52-69c10-30 17-59 17-81 0-17-6-44-30-44-7 0-13 4-17 10-10 18-6 58 13 100a898 898 0 0 1-50 117c-53 22-88 46-91 65-2 9 4 24 25 24 31 0 65-45 91-91a626 626 0 0 1 92-24c38 33 71 38 87 38 32 0 35-23 24-35zM227 111c8-12 26-8 26 16 0 16-5 42-15 72-18-42-18-75-11-88zM100 391c3-16 33-38 80-57-26 44-52 72-68 72-10 0-13-9-12-15zm197-98a574 574 0 0 0-83 22 453 453 0 0 0 36-84 327 327 0 0 0 47 62zm13 4c32-5 59-4 71-2 29 6 19 41-13 33-23-5-42-18-58-31z"
            />
          </svg>
        );
      case ".docx":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#FFF"
            stroke-miterlimit="10"
            stroke-width="2"
            viewBox="0 0 96 96"
          >
            <path
              stroke="#979593"
              d="M67.1716 7H27c-1.1046 0-2 .8954-2 2v78c0 1.1046.8954 2 2 2h58c1.1046 0 2-.8954 2-2V26.8284c0-.5304-.2107-1.0391-.5858-1.4142L68.5858 7.5858C68.2107 7.2107 67.702 7 67.1716 7z"
            />
            <path
              fill="none"
              stroke="#979593"
              d="M67 7v18c0 1.1046.8954 2 2 2h18"
            />
            <path
              fill="#C8C6C4"
              d="M79 61H48v-2h31c.5523 0 1 .4477 1 1s-.4477 1-1 1zm0-6H48v-2h31c.5523 0 1 .4477 1 1s-.4477 1-1 1zm0-6H48v-2h31c.5523 0 1 .4477 1 1s-.4477 1-1 1zm0-6H48v-2h31c.5523 0 1 .4477 1 1s-.4477 1-1 1zm0 24H48v-2h31c.5523 0 1 .4477 1 1s-.4477 1-1 1z"
            />
            <path
              fill="#185ABD"
              d="M12 74h32c2.2091 0 4-1.7909 4-4V38c0-2.2091-1.7909-4-4-4H12c-2.2091 0-4 1.7909-4 4v32c0 2.2091 1.7909 4 4 4z"
            />
            <path d="M21.6245 60.6455c.0661.522.109.9769.1296 1.3657h.0762c.0306-.3685.0889-.8129.1751-1.3349.0862-.5211.1703-.961.2517-1.319L25.7911 44h4.5702l3.6562 15.1272c.183.7468.3353 1.6973.457 2.8532h.0608c.0508-.7979.1777-1.7184.3809-2.7615L37.8413 44H42l-5.1183 22h-4.86l-3.4885-14.5744c-.1016-.4197-.2158-.9663-.3428-1.6417-.127-.6745-.2057-1.1656-.236-1.4724h-.0608c-.0407.358-.1195.8896-.2364 1.595-.1169.7062-.211 1.2273-.2819 1.565L24.1 66h-4.9357L14 44h4.2349l3.1843 15.3882c.0709.3165.1392.7362.2053 1.2573z" />
          </svg>
        );
      case ".txt":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="6" y1="7" x2="18" y2="7" />
            <line x1="6" y1="11" x2="18" y2="11" />
            <line x1="6" y1="15" x2="18" y2="15" />
          </svg>
        );
      case ".rtf":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="6" y1="7" x2="18" y2="7" />
            <line x1="8" y1="11" x2="18" y2="11" />
            <line x1="6" y1="15" x2="18" y2="15" />
          </svg>
        );
      default:
        // Fallback to generic document icon
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
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
              ? "border-stone-800 bg-stone-100/70"
              : "border-stone-300/80 bg-white hover:border-stone-400 hover:bg-stone-50/50"
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
            {["PDF", "DOCX", "TXT", "RTF"].map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 border border-stone-200 text-stone-600 uppercase"
              >
                {fmt}
              </span>
            ))}
            <span className="text-[11px] text-stone-400 ml-0.5 sm:ml-1">
              Up to 10MB
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 shrink-0">
              {/* File type icon - using proper SVGs */}
              {getFileIcon(selectedFile.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <p
                  className="text-xs sm:text-sm font-medium text-stone-900 truncate"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  <Check className="w-3 h-3 mr-0.5 stroke-[2.5]" /> Ready
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                {getFileExtension(selectedFile.name)} •{" "}
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
