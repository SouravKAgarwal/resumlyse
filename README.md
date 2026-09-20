# resumlyse — Resume ATS Compatibility & Quality Benchmark

> Precision evaluation, ATS compatibility auditing, and actionable section revisions for modern professional resumes.

resumlyse is a full-stack web application designed to benchmark resumes against modern Applicant Tracking System (ATS) readability standards, evaluate section completeness, and match candidate qualifications against target job descriptions.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Disclaimer & Privacy Policy](#disclaimer--privacy-policy)
- [License](#license)

---

## Overview

Modern hiring workflows rely heavily on automated Applicant Tracking Systems to screen resumes before a recruiter ever reads them. Formatting anomalies, missing metadata, obscure headings, and omitted technical competencies can cause qualified candidates to be filtered out prematurely.

**resumlyse** provides:
1. **Structural Audit**: Detects whether critical sections (Contact, Summary, Experience, Education, Skills, Projects, Certifications) exist and follow parseable hierarchy.
2. **Keyword & Competency Matrix**: Compares resumes against job postings to highlight matched and missing skills with detected context sentences.
3. **Category-Level Quality Scores**: Evaluates impact metrics, active phrasing, layout parseability, and density.
4. **Copy-Ready Suggestions**: Generates tailored drafts for underperforming sections.
5. **PDF Export**: Produces high-resolution, downloadable evaluation reports.

---

## Key Features

- **Multi-Format Parsing**: Supports `.pdf`, `.docx`, `.txt`, and `.rtf` resumes up to 10MB.
- **ATS Compatibility Gauge**: Calculates a holistic 0–100 score categorized into actionable tiers (*ATS Optimized*, *Competitive*, *Needs Polish*, *Critical Gaps*).
- **Target Role Benchmark (Optional)**: Paste any job description to extract relevant keywords and measure keyword match density.
- **Section Audit & One-Click Copy**: Review section quality ratings and copy improved draft revisions directly to your clipboard.
- **Local Analysis History**: Browse past analyses in a slide-over drawer, search previous documents, and delete records anytime.
- **Exportable PDF Reports**: Download professional PDF reports summarizing all findings, charts, and recommendations.
- **Responsive Editorial Interface**: Crafted with DM Sans and Lora serif typography, fully responsive across mobile phones (320px+), tablets, and desktops.
- **Transparent Legal & Privacy Disclaimers**: Built-in disclaimers outlining heuristic estimation boundaries and data security.

---

## Architecture & Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Database**: [SQLite](https://www.sqlite.org/) via [SQLAlchemy](https://www.sqlalchemy.org/)
- **Document Parsers**: `pdfplumber`, `pypdf`, `python-docx`, `striprtf`
- **Analysis Engine**: OpenAI API (`gpt-4o-mini` / `gpt-4o` or compatible LLM) with structured JSON output
- **PDF Generation**: [ReportLab](https://www.reportlab.com/)

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)

---

## Project Structure

```text
ai-resume/
├── backend/
│   ├── analyzers/            # Score computation and LLM prompts
│   │   ├── openai_analyzer.py
│   │   ├── prompts.py
│   │   └── score_calculator.py
│   ├── database/             # SQLAlchemy database models & session
│   │   ├── models.py
│   │   └── session.py
│   ├── parsers/              # PDF, DOCX, TXT, and RTF text extractors
│   │   ├── docx_parser.py
│   │   ├── pdf_parser.py
│   │   ├── rtf_parser.py
│   │   └── txt_parser.py
│   ├── routers/              # API endpoints (analyze, history, export)
│   │   ├── analyze.py
│   │   ├── export.py
│   │   └── history.py
│   ├── schemas/              # Pydantic request/response schemas
│   ├── services/             # Core business logic services
│   ├── config.py             # Environment configurations
│   ├── main.py               # FastAPI entry point
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client communicating with FastAPI
│   │   ├── components/       # Reusable UI components
│   │   │   ├── FileUpload.tsx
│   │   │   ├── Footer.tsx         # Platform footer with legal disclaimer
│   │   │   ├── HistoryDrawer.tsx  # Slide-over past evaluations
│   │   │   ├── HistoryList.tsx
│   │   │   ├── JobDescription.tsx # Role benchmark toggle
│   │   │   ├── KeywordMatch.tsx   # Matrix of matching/missing skills
│   │   │   ├── LoadingSpinner.tsx # 3-stage animated analysis indicator
│   │   │   ├── Navbar.tsx         # Responsive navigation header
│   │   │   ├── ScoreBreakdown.tsx # Dimension performance accordion
│   │   │   ├── ScoreCard.tsx      # Circular SVG score gauge
│   │   │   └── SectionAnalysis.tsx# Section audits & copyable drafts
│   │   ├── context/          # Dialog & History context providers
│   │   ├── pages/            # HomePage, UploadPage, AnalysisPage
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Main application routing & shell
│   │   └── index.css         # Tailwind v4 theme & typography
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python**: Version 3.10 or higher
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher
- **OpenAI API Key** (or compatible endpoint)

---

### Backend Setup

1. Open a terminal and navigate to the project directory:
   ```bash
   cd D:\python\ai-resume
   ```

2. Activate the Python virtual environment:
   ```bash
   # Windows (PowerShell)
   .\.venv\Scripts\Activate.ps1

   # Windows (Command Prompt)
   .\.venv\Scripts\activate.bat

   # Linux / macOS
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Configure your `.env` file inside `backend/.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   DATABASE_URL=sqlite:///./resume_analyzer.db
   ```

5. Launch the FastAPI server:
   ```bash
   python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```
   The API will be accessible at `http://localhost:8000`. Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

---

### Frontend Setup

1. In a separate terminal, navigate to the `frontend` folder:
   ```bash
   cd D:\python\ai-resume\frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. (Optional) Build for production:
   ```bash
   npm run build
   ```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Uploads a resume (`multipart/form-data`) with optional `job_description` string |
| `GET` | `/api/history` | Returns a list of past resume analysis summaries |
| `GET` | `/api/history/{id}` | Retrieves the complete evaluation result for a specific analysis record |
| `DELETE` | `/api/history/{id}` | Permanently removes an analysis record from the database |
| `POST` | `/api/export` | Generates and streams a downloadable PDF benchmark report |

---

## Disclaimer & Privacy Policy

> [!WARNING]
> **Important Notice for Job Applicants**: **resumlyse** provides simulated Applicant Tracking System (ATS) compatibility benchmarks and AI-assisted drafting suggestions for **educational, developmental, and editorial self-improvement purposes only**.

---

### 1. ATS Scoring & Compatibility Disclaimer

resumlyse evaluates resumes using structured heuristics and language model parsing. While designed to reflect modern applicant tracking standards, please review the following boundaries:

| Dimension | What resumlyse Provides | What resumlyse Does NOT Provide |
|---|---|---|
| **Scores & Ratings** | Heuristic estimates (0–100) based on industry layout and keyword conventions | Official pass/fail determinations from employer ATS software |
| **Hiring Outcomes** | Actionable suggestions to improve human and automated readability | Any guarantee of interviews, callbacks, or employment offers |
| **Vendor Compatibility** | General alignment guidelines for standardized text extraction | Direct integration or endorsement from proprietary ATS vendors |

#### ATS Vendor Non-Affiliation Notice
resumlyse is completely independent. It is **not affiliated, associated, authorized, endorsed by, or in any way officially connected** with any applicant tracking system vendors, including:
- **Workday**, Inc.
- **Oracle Taleo**
- **Greenhouse Software**, Inc.
- **Lever** (Employ Inc.)
- **iCIMS**, Inc.
- **BambooHR** LLC
- **SmartRecruiters**
- **SAP SuccessFactors**

All company, product, and service names used in this project are for identification and compatibility reference only. Each employer configures internal ATS parsing filters, scoring weights, and knock-out questions independently.

---

### 2. AI-Assisted Advisory Suggestions & Candidate Responsibility

> [!IMPORTANT]
> **Candidate Verification & Truthfulness Obligation**:
> - All rewritten bullet points, section revisions, and summaries generated by resumlyse are automated advisory drafts.
> - Candidates are strictly and solely responsible for verifying that all accomplishments, metrics, employers, job titles, certifications, and dates on their resume are 100% factual, truthful, and substantiated.
> - resumlyse disclaims all liability for inaccuracies, misrepresentations, or omissions resulting from user adoption of AI-generated content.

---

### 3. Privacy, Data Retention & Document Security

> [!NOTE]
> **Privacy by Design**: resumlyse does not collect personal identifiers for monetization, commercial advertising, or recruitment reselling.

- **Document Processing**: Uploaded resumes (`.pdf`, `.docx`, `.txt`, `.rtf`) are parsed in ephemeral memory solely to extract text and compute evaluation metrics. Uploaded documents are not retained to train public machine learning models.
- **Local Data Sovereignty**: All analysis records, parsed summaries, and category scores are persisted strictly in your local SQLite database instance (`resume_analyzer.db`).
- **Complete Deletion Rights**: Users have the right and technical capability to permanently remove any individual analysis record or clear their entire history at any time using the in-app **History** drawer.
- **Zero Third-Party Sharing**: We do not sell, rent, license, or share candidate resumes, names, emails, telephone numbers, or employment history with recruiters, staffing agencies, advertisers, or commercial data brokers.

---

## License

This project is licensed under the [MIT License](LICENSE).
