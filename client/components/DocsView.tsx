"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Code2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type Language = "curl" | "python" | "javascript";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: string;
  example?: string;
}

interface EndpointResponse {
  status: number;
  statusText: string;
  description: string;
  body?: string;
}

interface EndpointDoc {
  id: string;
  method: "GET" | "POST";
  path: string;
  tag: string;
  title: string;
  description: string;
  contentType: string;
  parameters: Parameter[];
  responses: EndpointResponse[];
  snippets: Record<Language, string>;
}

/* ─── Safe Single-Pass Syntax Highlighter Component ─── */
const HighlightedCode: React.FC<{ code: string; language: string }> = ({
  code,
  language,
}) => {
  if (language === "json") {
    // Single-pass JSON tokenizer
    const jsonHtml = code.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            return `<span class="text-sky-200 font-medium">${match}</span>`;
          }
          return `<span class="text-emerald-300">${match}</span>`;
        }
        if (/true|false/.test(match)) {
          return `<span class="text-rose-400 font-semibold">${match}</span>`;
        }
        if (/null/.test(match)) {
          return `<span class="text-stone-400 italic">${match}</span>`;
        }
        return `<span class="text-amber-300">${match}</span>`;
      },
    );

    return (
      <code
        className="font-mono text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: jsonHtml }}
      />
    );
  }

  if (language === "curl") {
    // Single-pass cURL tokenizer (zero self-matching on generated HTML)
    const curlHtml = code.replace(
      /(".*?"|https?:\/\/[^\s"\\]+|-X|-F|-H|-d|--output|\bcurl\b|\\$)/gm,
      (match) => {
        if (match === "curl") {
          return `<span class="text-indigo-400 font-bold">${match}</span>`;
        }
        if (match.startsWith("-")) {
          return `<span class="text-sky-400 font-semibold">${match}</span>`;
        }
        if (match.startsWith("http")) {
          return `<span class="text-amber-300">${match}</span>`;
        }
        if (match.startsWith('"')) {
          return `<span class="text-emerald-300">${match}</span>`;
        }
        if (match === "\\") {
          return `<span class="text-stone-500">${match}</span>`;
        }
        return match;
      },
    );

    return (
      <code
        className="font-mono text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: curlHtml }}
      />
    );
  }

  if (language === "python") {
    // Single-pass Python tokenizer
    const pyHtml = code.replace(
      /(".*?"|'.*?'|\b(?:import|from|def|return|with|open|as|print)\b|\b(?:requests\.[a-z]+)\b|\b\d+\b)/g,
      (match) => {
        if (match.startsWith('"') || match.startsWith("'")) {
          return `<span class="text-emerald-300">${match}</span>`;
        }
        if (/^(import|from|def|return|with|open|as|print)$/.test(match)) {
          return `<span class="text-indigo-400 font-semibold">${match}</span>`;
        }
        if (/^requests\./.test(match)) {
          return `<span class="text-sky-300 font-medium">${match}</span>`;
        }
        if (/^\d+$/.test(match)) {
          return `<span class="text-amber-300">${match}</span>`;
        }
        return match;
      },
    );

    return (
      <code
        className="font-mono text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: pyHtml }}
      />
    );
  }

  if (language === "javascript") {
    // Single-pass JavaScript tokenizer
    const jsHtml = code.replace(
      /(".*?"|'.*?'|`.*?`|\b(?:const|let|var|await|async|new|function|return)\b|\b(?:fetch|JSON\.stringify|window|document|console\.log)\b|\b\d+\b)/g,
      (match) => {
        if (
          match.startsWith('"') ||
          match.startsWith("'") ||
          match.startsWith("`")
        ) {
          return `<span class="text-emerald-300">${match}</span>`;
        }
        if (/^(const|let|var|await|async|new|function|return)$/.test(match)) {
          return `<span class="text-indigo-400 font-semibold">${match}</span>`;
        }
        if (
          /^(fetch|JSON\.stringify|window|document|console\.log)$/.test(match)
        ) {
          return `<span class="text-sky-300 font-medium">${match}</span>`;
        }
        if (/^\d+$/.test(match)) {
          return `<span class="text-amber-300">${match}</span>`;
        }
        return match;
      },
    );

    return (
      <code
        className="font-mono text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: jsHtml }}
      />
    );
  }

  return (
    <code className="font-mono text-xs leading-relaxed text-stone-200">
      {code}
    </code>
  );
};

/* ─── Endpoint Documentation Data ─── */
const ENDPOINTS: EndpointDoc[] = [
  {
    id: "analyze",
    method: "POST",
    path: "/api/analyze",
    tag: "Analysis",
    title: "Analyze Resume Document",
    description:
      "Ingests a resume file (PDF, DOCX, TXT, or RTF), validates binary magic bytes, parses section structure, and calculates multi-dimensional ATS scoring, section diagnostics, and keyword alignment. Zero server persistence.",
    contentType: "multipart/form-data",
    parameters: [
      {
        name: "file",
        type: "UploadFile",
        required: true,
        description:
          "Binary resume document file (.pdf, .docx, .txt, .rtf). Inspected and verified via binary magic-bytes.",
        example: "resume.pdf",
      },
      {
        name: "job_description",
        type: "string",
        required: false,
        description:
          "Optional target job description text to benchmark keywords, skills, and qualifications against.",
        example: "Senior Software Engineer with Python and cloud expertise...",
      },
    ],
    responses: [
      {
        status: 200,
        statusText: "OK",
        description:
          "Comprehensive evaluation result including composite score, category breakdown, section diagnostics, and keyword matches.",
        body: JSON.stringify(
          {
            id: 1,
            filename: "resume_john_doe.pdf",
            analysis: {
              overall_score: 82,
              category_scores: [
                {
                  category: "ATS Compatibility",
                  score: 88,
                  weight: 0.25,
                  feedback: "Standard section headings and high parseability.",
                  suggestions: [
                    "Ensure contact details are in body instead of header table",
                  ],
                },
                {
                  category: "Impact & Metrics",
                  score: 75,
                  weight: 0.35,
                  feedback:
                    "Strong quantifiable achievements in recent experience.",
                  suggestions: ["Add more metrics in older career positions"],
                },
              ],
              sections: [
                {
                  section_name: "Work Experience",
                  present: true,
                  quality_score: 85,
                  feedback:
                    "Strong quantifiable accomplishments included with clear bullet points.",
                  suggested_content: null,
                },
              ],
              keyword_matches: [
                {
                  keyword: "Python",
                  found: true,
                  context: "Engineered backend microservices in Python",
                },
                {
                  keyword: "FastAPI",
                  found: true,
                  context: "Developed high-throughput APIs using FastAPI",
                },
              ],
              strengths: ["Consistent date formats", "Strong action verbs"],
              critical_improvements: [
                "Expand technical summary",
                "Quantify team scale",
              ],
              summary:
                "Strong engineering profile with high ATS compatibility. Minor metric enhancements recommended.",
            },
          },
          null,
          2,
        ),
      },
      {
        status: 400,
        statusText: "Bad Request",
        description:
          "Invalid file format, corrupted binary document, or file failed security validation.",
        body: JSON.stringify(
          {
            detail:
              "Unsupported file format. Please upload a valid .pdf, .docx, .txt, or .rtf document.",
          },
          null,
          2,
        ),
      },
      {
        status: 422,
        statusText: "Unprocessable Entity",
        description:
          "Validation error in multipart form-data payload (e.g. missing resume file).",
        body: JSON.stringify(
          {
            detail: [
              {
                loc: ["body", "file"],
                msg: "Field required",
                type: "value_error.missing",
              },
            ],
          },
          null,
          2,
        ),
      },
    ],
    snippets: {
      curl: `curl -X POST "http://localhost:8000/api/analyze" \\
  -F "file=@resume.pdf" \\
  -F "job_description=Senior Software Engineer"`,
      python: `import requests

url = "http://localhost:8000/api/analyze"
files = {"file": open("resume.pdf", "rb")}
data = {"job_description": "Senior Software Engineer"}

response = requests.post(url, files=files, data=data)
print(response.json())`,
      javascript: `const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("job_description", "Senior Software Engineer");

const res = await fetch("http://localhost:8000/api/analyze", {
  method: "POST",
  body: formData,
});
const result = await res.json();
console.log(result);`,
    },
  },
  {
    id: "export",
    method: "POST",
    path: "/api/export",
    tag: "Export",
    title: "Export Analysis Report to PDF",
    description:
      "Compiles client-side evaluation data into a downloadable, publication-ready PDF executive report with score dials and section breakdowns. Returns a direct binary stream.",
    contentType: "application/json",
    parameters: [
      {
        name: "filename",
        type: "string",
        required: true,
        description: "Base name for the generated analysis PDF report.",
        example: "resume_analysis.pdf",
      },
      {
        name: "analysis",
        type: "AnalysisResult",
        required: true,
        description:
          "Complete AnalysisResult payload generated from evaluation to compile into the PDF report.",
      },
    ],
    responses: [
      {
        status: 200,
        statusText: "OK",
        description:
          "Binary PDF file stream with Content-Disposition attachment header.",
        body: "<< Binary application/pdf stream >>",
      },
      {
        status: 422,
        statusText: "Unprocessable Entity",
        description:
          "Invalid analysis payload schema provided in request body.",
        body: JSON.stringify(
          {
            detail: [
              {
                loc: ["body", "analysis"],
                msg: "Field required",
                type: "value_error.missing",
              },
            ],
          },
          null,
          2,
        ),
      },
    ],
    snippets: {
      curl: `curl -X POST "http://localhost:8000/api/export" \\
  -H "Content-Type: application/json" \\
  -d '{
    "filename": "resume_report.pdf",
    "analysis": {
      "overall_score": 82,
      "category_scores": [],
      "sections": [],
      "keyword_matches": [],
      "strengths": ["Quantified impact"],
      "critical_improvements": ["Add summary"],
      "summary": "Strong engineering profile."
    }
  }' \\
  --output analysis_report.pdf`,
      python: `import requests

url = "http://localhost:8000/api/export"
payload = {
    "filename": "resume_report.pdf",
    "analysis": analysis_data
}

response = requests.post(url, json=payload)
with open("report.pdf", "wb") as f:
    f.write(response.content)`,
      javascript: `const res = await fetch("http://localhost:8000/api/export", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    filename: "resume_report.pdf",
    analysis: analysisData,
  }),
});

const blob = await res.blob();
const downloadUrl = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = downloadUrl;
a.download = "resume_report.pdf";
a.click();`,
    },
  },
  {
    id: "health",
    method: "GET",
    path: "/api/health",
    tag: "System",
    title: "Get API Health and Status",
    description:
      "Performs a lightweight operational check confirming that the Resumlyse API backend service is online and healthy.",
    contentType: "application/json",
    parameters: [],
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Service operational status and metadata.",
        body: JSON.stringify(
          {
            status: "healthy",
            service: "Resumlyse API",
            version: "1.0.0",
          },
          null,
          2,
        ),
      },
    ],
    snippets: {
      curl: `curl -X GET "http://localhost:8000/api/health"`,
      python: `import requests

response = requests.get("http://localhost:8000/api/health")
print(response.json())`,
      javascript: `const res = await fetch("http://localhost:8000/api/health");
const data = await res.json();
console.log(data);`,
    },
  },
];

/* ─── Schema Models Data ─── */
interface SchemaProperty {
  name: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: string;
  example?: string;
}

interface SchemaModel {
  name: string;
  description: string;
  properties: SchemaProperty[];
}

const SCHEMAS: SchemaModel[] = [
  {
    name: "AnalysisResult",
    description:
      "Comprehensive evaluation object returned upon successful resume analysis.",
    properties: [
      {
        name: "overall_score",
        type: "integer",
        required: true,
        constraints: "0 ≤ score ≤ 100",
        description:
          "Comprehensive weighted composite score across all evaluated dimensions.",
        example: "82",
      },
      {
        name: "category_scores",
        type: "CategoryScore[]",
        required: true,
        description:
          "Detailed score breakdown across individual evaluation dimensions.",
      },
      {
        name: "sections",
        type: "SectionPresence[]",
        required: true,
        description:
          "Structural audit of standard resume sections and their quality scores.",
      },
      {
        name: "keyword_matches",
        type: "KeywordMatch[]",
        required: false,
        description:
          "Detected skill keywords and alignment against target job benchmark.",
      },
      {
        name: "strengths",
        type: "string[]",
        required: true,
        description: "Key standout advantages detected in the document.",
      },
      {
        name: "critical_improvements",
        type: "string[]",
        required: true,
        description:
          "Highest priority recommendations for boosting recruiter callback rates.",
      },
      {
        name: "summary",
        type: "string",
        required: true,
        description: "Executive diagnostic summary of the evaluation.",
      },
    ],
  },
  {
    name: "CategoryScore",
    description:
      "Calculated score and diagnostic feedback for a specific evaluation category.",
    properties: [
      {
        name: "category",
        type: "string",
        required: true,
        description:
          "Dimension: ATS Compatibility, Impact & Metrics, Brevity, or Skills Alignment.",
        example: '"ATS Compatibility"',
      },
      {
        name: "score",
        type: "integer",
        required: true,
        constraints: "0 ≤ score ≤ 100",
        description: "Calculated score from 0 to 100.",
        example: "88",
      },
      {
        name: "weight",
        type: "float",
        required: true,
        constraints: "0.0 ≤ weight ≤ 1.0",
        description:
          "Relative weight in calculating the overall composite score.",
        example: "0.25",
      },
      {
        name: "feedback",
        type: "string",
        required: true,
        description:
          "Summary feedback assessing strengths and weaknesses in this dimension.",
      },
      {
        name: "suggestions",
        type: "string[]",
        required: false,
        description:
          "Actionable bulleted suggestions for boosting performance in this category.",
      },
    ],
  },
  {
    name: "SectionPresence",
    description: "Diagnostic audit of a standard resume section.",
    properties: [
      {
        name: "section_name",
        type: "string",
        required: true,
        description:
          "Standard section title (Work Experience, Education, Skills, Projects, etc.).",
        example: '"Work Experience"',
      },
      {
        name: "present",
        type: "boolean",
        required: true,
        description:
          "Whether this section was detected and parsed in the resume.",
        example: "true",
      },
      {
        name: "quality_score",
        type: "integer",
        required: false,
        constraints: "0 ≤ score ≤ 100",
        description:
          "Section quality rating assessing structure, depth, and clarity.",
        example: "85",
      },
      {
        name: "feedback",
        type: "string",
        required: true,
        description: "Actionable diagnostic recommendations for this section.",
      },
      {
        name: "suggested_content",
        type: "string | null",
        required: false,
        description:
          "Tailored example wording or improvements for this section.",
      },
    ],
  },
  {
    name: "KeywordMatch",
    description: "Keyword extraction and verification record.",
    properties: [
      {
        name: "keyword",
        type: "string",
        required: true,
        description: "Target skill keyword evaluated against the resume.",
        example: '"Python"',
      },
      {
        name: "found",
        type: "boolean",
        required: true,
        description:
          "Indicates whether the keyword was detected within the resume body.",
        example: "true",
      },
      {
        name: "context",
        type: "string | null",
        required: false,
        description:
          "Excerpt from the resume where the keyword match was found.",
        example: '"Engineered backend services in Python"',
      },
    ],
  },
  {
    name: "AnalyzeResponse",
    description: "Top-level wrapper returned by POST /api/analyze.",
    properties: [
      {
        name: "id",
        type: "integer",
        required: false,
        description: "Unique evaluation identifier for client-side tracking.",
        example: "1",
      },
      {
        name: "filename",
        type: "string",
        required: true,
        description: "Original filename of the analyzed resume.",
        example: '"resume.pdf"',
      },
      {
        name: "analysis",
        type: "AnalysisResult",
        required: true,
        description: "Comprehensive evaluation object.",
      },
    ],
  },
  {
    name: "ExportPdfRequest",
    description: "Request payload for POST /api/export.",
    properties: [
      {
        name: "filename",
        type: "string",
        required: true,
        description: "Base name for the generated analysis PDF report.",
        example: '"resume_analysis.pdf"',
      },
      {
        name: "analysis",
        type: "AnalysisResult",
        required: true,
        description: "AnalysisResult payload to compile into PDF format.",
      },
    ],
  },
];

export const DocsView: React.FC = () => {
  const [activeLang, setActiveLang] = useState<Record<string, Language>>({
    analyze: "curl",
    export: "curl",
    health: "curl",
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Accordion state for Data Schemas
  const [expandedSchemas, setExpandedSchemas] = useState<
    Record<string, boolean>
  >({
    AnalysisResult: true,
  });

  const toggleSchema = (name: string) => {
    setExpandedSchemas((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#121212] text-stone-900 dark:text-stone-100 font-sans selection:bg-stone-200 dark:selection:bg-stone-800">
      {/* ── Main Layout Container ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ── Embedded Page Hero / Header ── */}
        <div className="pb-8 mb-8 sm:mb-10 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Left: Breadcrumb / Title / Description */}
            <div className="space-y-3 max-w-2xl">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to Home</span>
              </Link>

              <div className="flex items-center space-x-3">
                <h1 className="font-serif font-medium text-2xl sm:text-3xl lg:text-4xl text-stone-900 dark:text-stone-100 tracking-tight">
                  API Reference
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 rounded-md">
                  v1.0.0
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                Complete REST API specification and data schemas for the
                Resumlyse backend engine. Integrate resume parsing, scoring, and
                PDF export directly into your applications.
              </p>
            </div>

            {/* Right: Embedded Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Native Swagger UI fallback link */}
              <a
                href="/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors text-xs shadow-2xs"
                title="Open native Swagger UI"
              >
                <span className="font-mono text-[11px]">Swagger Docs</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-8 lg:gap-10 items-start">
          <main className="flex-1 min-w-0 space-y-14">
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                  Endpoints
                </h2>
              </div>

              {ENDPOINTS.map((endpoint) => {
                const currentLang = activeLang[endpoint.id] || "curl";
                const successResponse =
                  endpoint.responses.find((r) => r.status === 200) ||
                  endpoint.responses[0];
                const errorResponses = endpoint.responses.filter(
                  (r) => r.status !== 200,
                );

                return (
                  <article
                    key={endpoint.id}
                    id={endpoint.id}
                    className="space-y-6 pt-6 border-stone-200/80 dark:border-stone-800"
                  >
                    {/* 1. Header: Method + Path + Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-stone-200 dark:border-stone-800">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            endpoint.method === "POST"
                              ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                              : "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <h3 className="font-mono text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
                          {endpoint.path}
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              endpoint.path,
                              `path-${endpoint.id}`,
                            )
                          }
                          className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors p-1 cursor-pointer"
                          title="Copy endpoint path"
                        >
                          {copiedKey === `path-${endpoint.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="text-xs font-sans text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                        {endpoint.tag}
                      </span>
                    </div>

                    {/* 2. Title & Narrative Description */}
                    <div className="space-y-1.5">
                      <h4 className="text-lg sm:text-xl font-serif font-medium text-stone-900 dark:text-stone-100">
                        {endpoint.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed max-w-3xl">
                        {endpoint.description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs pt-0.5">
                        <span className="text-stone-400 font-sans">
                          Content-Type:
                        </span>
                        <code className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 font-mono text-stone-700 dark:text-stone-300 text-[11px]">
                          {endpoint.contentType}
                        </code>
                      </div>
                    </div>

                    {/* 3. Request Parameters (Full Width Vertical Flow) */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400">
                        Request Parameters
                      </p>

                      {endpoint.parameters.length > 0 ? (
                        <div className="divide-y divide-stone-100 dark:divide-stone-800 border-y border-stone-100 dark:border-stone-800">
                          {endpoint.parameters.map((param) => (
                            <div
                              key={param.name}
                              className="py-2.5 sm:py-3 space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                                  {param.name}
                                </span>
                                <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                                  {param.type}
                                </span>
                                {param.required ? (
                                  <span className="text-[10px] font-sans font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                                    required
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-sans text-stone-400 dark:text-stone-500">
                                    optional
                                  </span>
                                )}
                              </div>

                              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                                {param.description}
                              </p>

                              {param.example && (
                                <p className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                                  Example:{" "}
                                  <span className="text-stone-600 dark:text-stone-300">
                                    {param.example}
                                  </span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 dark:text-stone-500 italic py-1.5">
                          No request body or parameters required.
                        </p>
                      )}
                    </div>

                    {/* 4. Request Example Code Snippet (Syntax-Highlighted) */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                          Request Example
                        </p>
                        {/* Language Switcher */}
                        <div className="flex items-center space-x-1">
                          {(["curl", "python", "javascript"] as const).map(
                            (lang) => (
                              <button
                                key={lang}
                                onClick={() =>
                                  setActiveLang((prev) => ({
                                    ...prev,
                                    [endpoint.id]: lang,
                                  }))
                                }
                                className={`px-2 py-0.5 rounded text-xs font-mono capitalize transition-colors cursor-pointer ${
                                  currentLang === lang
                                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium"
                                    : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                                }`}
                              >
                                {lang === "javascript"
                                  ? "JavaScript"
                                  : lang === "python"
                                    ? "Python"
                                    : "cURL"}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-stone-900 text-stone-200 overflow-hidden shadow-sm relative">
                        <div className="flex items-center justify-between px-3.5 py-2 border-b border-stone-800 text-xs">
                          <div className="flex items-center space-x-2">
                            <Code2 className="w-3.5 h-3.5 text-stone-400" />
                            <span className="font-mono text-stone-400 text-[11px] uppercase">
                              {currentLang}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                endpoint.snippets[currentLang],
                                `snippet-${endpoint.id}-${currentLang}`,
                              )
                            }
                            className="p-1 rounded text-stone-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy code snippet"
                          >
                            {copiedKey ===
                            `snippet-${endpoint.id}-${currentLang}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 sm:p-4 font-mono text-xs leading-relaxed overflow-x-auto max-h-72 custom-scrollbar">
                          <HighlightedCode
                            code={endpoint.snippets[currentLang]}
                            language={currentLang}
                          />
                        </pre>
                      </div>
                    </div>

                    {/* 5. Non-Tabbed Responses Section (Option 2: 200 Showcase + Error Codes List) */}
                    <div className="space-y-4">
                      <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                        Responses
                      </p>

                      {/* Primary Success Response (200 OK) */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-mono font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>
                              {successResponse.status}{" "}
                              {successResponse.statusText}
                            </span>
                          </span>
                          <span className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                            {successResponse.description}
                          </span>
                        </div>

                        <div className="rounded-2xl bg-stone-900 text-stone-200 overflow-hidden shadow-sm relative">
                          <div className="flex items-center justify-between px-3.5 py-2 border-b border-stone-800 text-xs">
                            <span className="font-mono text-stone-400 text-[11px]">
                              Response Body (application/json)
                            </span>
                            {successResponse.body && (
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    successResponse.body || "",
                                    `resp-success-${endpoint.id}`,
                                  )
                                }
                                className="p-1 rounded text-stone-400 hover:text-white transition-colors cursor-pointer"
                                title="Copy 200 response body"
                              >
                                {copiedKey === `resp-success-${endpoint.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>

                          {successResponse.body ? (
                            <pre className="p-3.5 sm:p-4 font-mono text-xs leading-relaxed overflow-x-auto max-h-72 custom-scrollbar">
                              <HighlightedCode
                                code={successResponse.body}
                                language="json"
                              />
                            </pre>
                          ) : (
                            <div className="p-3.5 text-xs text-stone-400 italic">
                              No response body.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Error Status Codes List (400, 422, etc.) */}
                      {errorResponses.length > 0 && (
                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center space-x-1.5 text-xs text-stone-500 dark:text-stone-400">
                            <AlertCircle className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                            <span className="font-medium font-sans">
                              Error Status Codes
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {errorResponses.map((errResp) => (
                              <div
                                key={errResp.status}
                                className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                                      {errResp.status} {errResp.statusText}
                                    </span>
                                    <span className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                                      {errResp.description}
                                    </span>
                                  </div>

                                  {errResp.body && (
                                    <button
                                      onClick={() =>
                                        copyToClipboard(
                                          errResp.body || "",
                                          `err-body-${endpoint.id}-${errResp.status}`,
                                        )
                                      }
                                      className="p-1 rounded text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
                                      title="Copy error body"
                                    >
                                      {copiedKey ===
                                      `err-body-${endpoint.id}-${errResp.status}` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  )}
                                </div>

                                {errResp.body && (
                                  <pre className="p-2.5 rounded-lg bg-stone-900 text-stone-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-40 custom-scrollbar">
                                    <HighlightedCode
                                      code={errResp.body}
                                      language="json"
                                    />
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ── Data Schemas Section: Interactive Accordion ── */}
            <section
              id="data-schemas"
              className="space-y-8 pt-8 border-t border-stone-200/80 dark:border-stone-800 scroll-mt-36"
            >
              <div>
                <h2 className="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                  Data Schemas
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans mt-1">
                  Type models, data constraints, and fields defined in the
                  Resumlyse backend API contract. Click any schema to expand its
                  specifications.
                </p>
              </div>

              {/* Accordion Container */}
              <div className="space-y-3">
                {SCHEMAS.map((schema) => {
                  const isExpanded = !!expandedSchemas[schema.name];

                  return (
                    <div
                      key={schema.name}
                      id={`schema-${schema.name}`}
                      className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-2xs transition-colors scroll-mt-36"
                    >
                      {/* Accordion Header Toggle */}
                      <button
                        onClick={() => toggleSchema(schema.name)}
                        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 dark:hover:bg-stone-800/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Layers className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                          <h3 className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {schema.name}
                          </h3>
                          <span className="text-[10px] font-sans text-stone-400 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                            object
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-stone-400 dark:text-stone-500">
                          <span className="text-xs font-sans text-stone-500 dark:text-stone-400 hidden sm:inline">
                            {schema.description}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="border-t border-stone-100 dark:border-stone-800 px-4 sm:px-5 py-4 space-y-5 bg-stone-50/40 dark:bg-stone-950/40">
                          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                            {schema.description}
                          </p>

                          <div className="divide-y last:border-b-0 divide-stone-200/70 dark:divide-stone-800 border-y border-stone-200/70 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-xl px-4 py-1">
                            {schema.properties.map((prop) => (
                              <div
                                key={prop.name}
                                className="py-2.5 sm:py-3 space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                                    {prop.name}
                                  </span>
                                  <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                                    {prop.type}
                                  </span>
                                  {prop.required ? (
                                    <span className="text-[10px] font-sans font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                                      required
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-sans text-stone-400 dark:text-stone-500">
                                      optional
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                                  {prop.description}
                                </p>

                                {prop.constraints && (
                                  <p className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                                    Constraints: {prop.constraints}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
