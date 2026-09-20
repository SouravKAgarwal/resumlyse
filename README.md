# resumlyse — AI Resume ATS Compatibility & Quality Benchmark

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Precision resume auditing, simulated ATS compatibility benchmarking, and actionable section revisions.**

[Key Features](#key-features) • [Architecture](#architecture--tech-stack) • [Quick Start](#getting-started) • [API Reference](#api-reference) • [Privacy & Disclaimers](#privacy-security--legal-disclaimers)

</div>

---

## Overview

Modern hiring workflows rely heavily on automated **Applicant Tracking Systems (ATS)** to parse, index, and screen candidate resumes before a recruiter reviews them. Hidden layout errors, multi-column tables, missing section headers, weak action verbs, and absent target keywords frequently cause qualified professionals to be filtered out before an interview is ever scheduled.

**resumlyse** is a privacy-first, full-stack application built to give candidates complete clarity into their resume's automated readability, structural integrity, and competitive positioning. 

It audits resume documents against modern parsing standards, optionally cross-references candidate qualifications against specific job descriptions, scores content across six weighted dimensions, generates copy-ready draft revisions, and exports downloadable PDF audit reports—all in a **100% stateless, zero-retention environment**.

---

## Key Features

### 📄 Multi-Format & Secure Parsing
- Supports **PDF**, **DOCX**, **RTF**, and **TXT** files up to **10MB**.
- **Deep PDF Extraction**: Powered by `PyMuPDF` to parse text streams, extract hyperlinks with bounding boxes and visible link text, and evaluate font metadata.
- **Magic Byte Validation**: Verifies file signatures (`%PDF`, `PK\x03\x04`, `{\rtf1`) and detects corrupt binary/null-byte content to safeguard against spoofed uploads.

### 🎯 6-Dimension Weighted Quality Framework
Evaluates candidate resumes using a structured heuristic model:
1. **ATS Compatibility (25%)**: Header recognizability, layout parseability, contact info completeness, and machine readability.
2. **Grammar & Spelling (15%)**: Typo detection, tense consistency across prior and current roles, and punctuation precision.
3. **Structure & Sections (20%)**: Section ordering, reverse chronological sequencing, and essential heading presence.
4. **Formatting (15%)**: Consistency in bullet styling, date formats, spacing, and page length (1–2 page standard).
5. **Content Quality (15%)**: Action verbs, quantifiable metrics/KPIs, and results-driven accomplishment statements.
6. **Professional Tone (10%)**: Absence of first-person pronouns, industry terminology, and formal presentation.

### 📊 Transparent Scoring Tiers
Calculates an aggregate **0–100 score** mapped to actionable candidate benchmark tiers:
- **ATS Optimized (75–100)**: Clean parsing hierarchy meeting high readability standards.
- **Competitive (60–74)**: Strong core foundation with targeted tweaks recommended.
- **Needs Polish (45–59)**: Detectable formatting inconsistencies or omitted section metadata.
- **Critical Gaps (0–44)**: Substantial structural deficits requiring fundamental revision.

### 🔍 Target Role Keyword Matrix (Optional)
- Paste any job posting or job description to benchmark alignment.
- Automatically extracts 10–20 core technical competencies, hard skills, and domain qualifications.
- Interactive keyword table with **Found / Missing** status indicators, detected in-context excerpts, real-time search filtering, and match percentage calculations.

### ✍️ Section-by-Section Audit & One-Click Drafts
- Audits critical sections: **Contact Information**, **Professional Summary**, **Work Experience**, **Education**, **Skills**, **Certifications**, and **Projects**.
- Identifies missing or underperforming sections and provides AI-drafted sample revisions directly in the interface with one-click clipboard copying.

### 📑 Instant PDF Benchmark Export
- Generates high-resolution, professionally formatted PDF audit summaries via `ReportLab`.
- Includes executive verdicts, category score breakdowns, section status tables, keyword match results, key strengths, critical fixes, and category-level recommendations.
- Generated on the fly directly from client state—no database retrieval required.

### 🔒 100% Stateless & Privacy-by-Design
- **No Database & No Persistence**: Resumes and analyses are never stored in SQLite, PostgreSQL, or browser local storage.
- **Ephemeral Processing**: Uploaded documents are parsed in temporary memory, analyzed, and immediately deleted from the filesystem (`os.remove`) within a guaranteed `finally` block.
- **Zero Commercial Monetization**: No tracking cookies, no candidate profiles, and zero sharing with recruiters, headhunters, or third-party ad networks.

---

## Architecture & Tech Stack

```
                                  ┌───────────────────────────────┐
                                  │      React 18 + Vite 5        │
                                  │  Tailwind CSS v4 + TypeScript │
                                  └───────────────┬───────────────┘
                                                  │
                                   HTTP / Axios   │  JSON & Multipart
                                   Proxy (/api)   ▼
                                  ┌───────────────────────────────┐
                                  │       FastAPI Backend         │
                                  │        (Python 3.10+)         │
                                  └───────┬───────────────┬───────┘
                                          │               │
                     File Upload (Ephemeral)              │ JSON Payload
                                          ▼               ▼
                 ┌───────────────────────────┐  ┌───────────────────┐
                 │    Document Parsers       │  │   ReportLab PDF   │
                 │  • PyMuPDF (PDF + Fonts)  │  │     Generator     │
                 │  • python-docx (DOCX)     │  └─────────┬─────────┘
                 │  • striprtf (RTF)         │            │
                 │  • Native Text (TXT)      │            │ Streams PDF
                 └─────────────┬─────────────┘            ▼
                               │ Extracted Raw Text   (Client Download)
                               ▼
                 ┌───────────────────────────┐
                 │    OpenAI / LLM Engine    │
                 │  Structured JSON Response │
                 │ (GPT-4o, Nemotron, etc.)  │
                 └─────────────┬─────────────┘
                               │
                               ▼
                   Ephemeral Result returned
                     to client application
```

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Document Extractors**: `PyMuPDF` (fitz), `python-docx`, `striprtf`
- **AI Analysis**: [OpenAI Python SDK](https://github.com/openai/openai-python) (compatible with OpenAI, NVIDIA NIM, Groq, Ollama, vLLM, etc.)
- **Report Generation**: [ReportLab](https://www.reportlab.com/)
- **Security**: Magic byte file signature validation & immediate file cleanup

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/) with automated API proxy
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Navigation**: [React Router v7](https://reactrouter.com/)
- **Visuals**: `react-circular-progressbar`, `recharts`
- **Typography**: Editorial layout using serif headings (`Lora`) and clean body sans (`DM Sans`)

---

## Project Structure

```text
ai-resume/
├── backend/
│   ├── analyzers/
│   │   ├── openai_analyzer.py      # LLM client & structured JSON parser
│   │   ├── prompts.py              # System criteria, weights & evaluation prompts
│   │   └── score_calculator.py     # Weighted score computation utility
│   ├── parsers/
│   │   ├── base.py                 # Abstract parser base class
│   │   ├── docx_parser.py          # Word document extraction
│   │   ├── pdf_parser.py           # PyMuPDF extractor (text, links, font metadata)
│   │   ├── router.py               # Document type routing
│   │   ├── rtf_parser.py           # Rich Text Format extractor
│   │   └── txt_parser.py           # Plain text parser
│   ├── routers/
│   │   ├── analyze.py              # POST /api/analyze endpoint
│   │   └── export.py               # POST /api/export PDF generator endpoint
│   ├── schemas/
│   │   ├── analysis.py             # Pydantic schemas (scores, sections, matches)
│   │   ├── requests.py             # Request & response wrappers
│   │   └── resume.py               # Parsed resume & hyperlink schemas
│   ├── services/
│   │   ├── analysis_service.py     # Upload handling, extraction & orchestration
│   │   └── export_service.py       # ReportLab PDF design and table building
│   ├── utils/
│   │   └── security.py             # Magic byte & file integrity validation
│   ├── config.py                   # Pydantic Settings & environment variables
│   ├── main.py                     # FastAPI application entry point & CORS
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── public/
│   │   └── favicon.svg             # Application brand icon
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts           # Axios client for analyze & export endpoints
│   │   ├── components/
│   │   │   ├── ExportButton.tsx    # PDF generation trigger with download spinner
│   │   │   ├── FileUpload.tsx      # Drag-and-drop file upload with format check
│   │   │   ├── Footer.tsx          # Editorial footer with navigation & copyright
│   │   │   ├── JobDescription.tsx  # Optional job description input toggle
│   │   │   ├── KeywordMatch.tsx    # Keyword search, filters, and match density
│   │   │   ├── LegalModal.tsx      # Interactive Terms, ATS & Privacy dialog
│   │   │   ├── LoadingSpinner.tsx  # 3-stage animated analysis indicator
│   │   │   ├── Logo.tsx            # Custom brand SVG mark
│   │   │   ├── Navbar.tsx          # Minimal header with logo and branding
│   │   │   ├── ScoreBreakdown.tsx  # Accordion view of the 6 score dimensions
│   │   │   ├── ScoreCard.tsx       # Circular SVG score gauge and tier badge
│   │   │   ├── SectionAnalysis.tsx # Section status audit & one-click draft copy
│   │   │   └── SuggestionList.tsx  # Categorized recommendations component
│   │   ├── context/
│   │   │   └── DialogContext.tsx   # Global alert, confirm & prompt modal manager
│   │   ├── pages/
│   │   │   ├── AnalysisPage.tsx    # Full analysis results dashboard
│   │   │   ├── HomePage.tsx        # Landing page with value pillars
│   │   │   └── UploadPage.tsx      # Upload interface with optional JD input
│   │   ├── types/
│   │   │   └── index.ts            # Frontend TypeScript definitions
│   │   ├── App.tsx                 # App layout, routing & context wrappers
│   │   ├── index.css               # Tailwind v4 import & custom styles
│   │   └── main.tsx                # React root entry
│   ├── index.html                  # HTML entry with Lora & DM Sans Google fonts
│   ├── package.json                # Frontend dependencies and scripts
│   ├── tsconfig.json               # TypeScript compiler options
│   └── vite.config.ts              # Vite configuration with /api backend proxy
├── .gitignore                      # Git ignore rules
└── README.md                       # Documentation
```

---

## Getting Started

### Prerequisites

- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.0` or higher (with `npm` 9+)
- **LLM API Key**: An API key from **OpenAI** (e.g., `gpt-4o-mini`, `gpt-4o`) or any OpenAI-compatible provider (e.g., NVIDIA NIM, Groq, Ollama)

---

### 1. Backend Setup

1. Open a terminal and navigate to the project root:
   ```bash
   cd ai-resume
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Windows (Command Prompt)
   .\.venv\Scripts\activate.bat

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Create an environment configuration file at `backend/.env`:
   ```env
   # OpenAI or OpenAI-Compatible Configuration
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4o-mini

   # Optional: Custom OpenAI-compatible base URL (leave blank for official OpenAI)
   # OPENAI_API_BASE=https://integrate.api.nvidia.com/v1
   ```

5. Start the FastAPI development server:
   ```bash
   python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```

   - API root: `http://localhost:8000`
   - Interactive Swagger docs: `http://localhost:8000/docs`
   - Redoc alternative docs: `http://localhost:8000/redoc`

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd ai-resume/frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   *(Vite automatically proxies all `/api` requests to the FastAPI backend at `http://localhost:8000`.)*

5. (Optional) Create a production build:
   ```bash
   npm run build
   ```

---

## Configuration Reference

The backend configuration is managed via `backend/config.py` using `pydantic-settings` / `python-dotenv`:

| Variable | Type | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | String | `""` | API key for OpenAI or any compatible LLM endpoint. |
| `OPENAI_MODEL` | String | `nvidia/nemotron-3-super-120b-a12b` | Model identifier to pass to the completions endpoint (e.g. `gpt-4o-mini`, `gpt-4o`). |
| `OPENAI_API_BASE` | String | `https://integrate.api.nvidia.com/v1` | Optional API base URL for custom providers. Set to empty string `""` to use official OpenAI. |
| `TEMP_UPLOAD_DIR` | String | `backend/temp_uploads` | Ephemeral directory for saving incoming documents during parsing before immediate unlinking. |

---

## API Reference

### 1. Analyze Resume
- **Endpoint**: `POST /api/analyze`
- **Content-Type**: `multipart/form-data`
- **Description**: Accepts a resume document (`.pdf`, `.docx`, `.rtf`, `.txt`) and an optional `job_description` string. Extracts content, validates file signatures, performs LLM analysis, and returns structured evaluation metrics.

**Request Form Data**:
- `file`: Resume file binary (`.pdf`, `.docx`, `.rtf`, `.txt`) *(Required)*
- `job_description`: Target job description plain text *(Optional)*

**Example Response**:
```json
{
  "id": 0,
  "filename": "Jane_Doe_Resume.pdf",
  "analysis": {
    "overall_score": 82,
    "category_scores": [
      {
        "category": "ATS Compatibility",
        "score": 85,
        "weight": 0.25,
        "feedback": "Standard headings and clean parseable layout detected.",
        "suggestions": [
          "Ensure contact links use standard protocols (mailto:, tel:)."
        ]
      },
      {
        "category": "Grammar & Spelling",
        "score": 90,
        "weight": 0.15,
        "feedback": "Flawless grammar and consistent past tense usage.",
        "suggestions": []
      },
      {
        "category": "Structure & Sections",
        "score": 80,
        "weight": 0.20,
        "feedback": "All core sections present; consider expanding project details.",
        "suggestions": []
      },
      {
        "category": "Formatting",
        "score": 85,
        "weight": 0.15,
        "feedback": "Uniform margins and consistent bullet spacing.",
        "suggestions": []
      },
      {
        "category": "Content Quality",
        "score": 75,
        "weight": 0.15,
        "feedback": "Strong action verbs, though more quantifiable metrics would elevate impact.",
        "suggestions": [
          "Add percentage increases or revenue figures to the lead engineer role."
        ]
      },
      {
        "category": "Professional Tone",
        "score": 90,
        "weight": 0.10,
        "feedback": "Formal, objective, and devoid of first-person pronouns.",
        "suggestions": []
      }
    ],
    "sections": [
      {
        "section_name": "Contact Information",
        "present": true,
        "quality_score": 95,
        "feedback": "Phone, email, and LinkedIn profile detected.",
        "suggested_content": null
      },
      {
        "section_name": "Professional Summary",
        "present": false,
        "quality_score": 0,
        "feedback": "Summary section is missing.",
        "suggested_content": "Results-driven Software Engineer with 5+ years of experience building scalable distributed systems..."
      }
    ],
    "keyword_matches": [
      {
        "keyword": "Kubernetes",
        "found": true,
        "context": "Deployed microservices to production using Docker and Kubernetes clusters."
      },
      {
        "keyword": "GraphQL",
        "found": false,
        "context": null
      }
    ],
    "strengths": [
      "Well-structured reverse chronological experience section",
      "Consistent, clean technical skill taxonomy"
    ],
    "critical_improvements": [
      "Incorporate an introductory Professional Summary",
      "Include quantifiable performance metrics in senior roles"
    ],
    "summary": "Jane's resume demonstrates strong technical depth and clean structure. Incorporating metric-backed outcomes and a dedicated summary will optimize ATS alignment."
  }
}
```

---

### 2. Export Direct PDF Report
- **Endpoint**: `POST /api/export`
- **Content-Type**: `application/json`
- **Response**: `application/pdf` (Binary Stream)
- **Description**: Generates and streams a downloadable PDF report directly from the client's current evaluation state. Operates in a stateless manner with zero database lookup.

**Request Payload**:
```json
{
  "filename": "Jane_Doe_Resume.pdf",
  "analysis": { ... }
}
```

---

### 3. Service Health Check
- **Endpoint**: `GET /`
- **Description**: Returns a basic service confirmation message.

**Response**:
```json
{
  "message": "Welcome to Resume Analyzer API"
}
```

---

## Privacy, Security & Legal Disclaimers

> [!NOTE]
> **Privacy by Design**: resumlyse is engineered strictly for candidate self-empowerment. We believe personal career documents belong exclusively to the candidate.

### 1. Data Retention & Stateless Architecture
- **Zero Server-Side Storage**: resumlyse does **not** persist resume documents, candidate personal contact information (email, phone, address), or analysis outputs in any permanent database or cloud storage.
- **Immediate File Unlinking**: Any document uploaded to the server is placed in an isolated temporary directory solely for text parsing and is deleted immediately upon completion (`finally: os.remove(file_path)`).
- **Session-Only Client State**: Analysis results reside only within your current browser tab state. Refreshing the browser or navigating away permanently purges the data.
- **Zero Third-Party Data Monetization**: We do not sell, rent, index, or distribute candidate resumes or contact records to commercial data brokers, recruitment agencies, or advertising platforms.

### 2. Heuristic ATS Scoring Notice
- **Simulated Benchmarks**: All scores (0–100) and evaluation tiers are estimated through structural heuristics and language model analysis designed to reflect standard parsing conventions.
- **No Pass/Fail Determinations**: A high compatibility score does not guarantee an interview invitation, job offer, or human screening pass. Each employer independently configures applicant tracking filters, knockout questions, and ranking algorithms.
- **Independent & Non-Affiliated**: resumlyse is an independent project. It is **not affiliated with, authorized, sponsored, endorsed by, or connected with** proprietary ATS providers, including:
  - **Workday**, Inc.
  - **Oracle Taleo**
  - **Greenhouse Software**, Inc.
  - **Lever** (Employ Inc.)
  - **iCIMS**, Inc.
  - **BambooHR** LLC
  - **SmartRecruiters**
  - **SAP SuccessFactors**

### 3. AI Drafting & Candidate Verification Obligation
- **Advisory Revisions**: All suggested bullet rewrites, professional summaries, and section additions are automated advisory drafts generated by artificial intelligence.
- **Truthfulness Obligation**: Candidates bear the sole legal and professional responsibility for ensuring that all employers, job titles, dates of employment, degrees, certifications, and metric claims submitted on their resumes are **100% truthful, verifiable, and accurate**.

---

## Contributing

Contributions, bug reports, and feature suggestions are welcome!

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).
