# resumlyse — AI-Powered ATS Resume Compatibility & Quality Benchmark

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Precision resume auditing, simulated ATS compatibility benchmarking, keyword gap analysis, and actionable section revisions.**

[Overview](#overview) • [Key Features](#key-features) • [Architecture](#architecture--tech-stack) • [Getting Started](#getting-started)

</div>

---

## Overview

Modern hiring workflows rely heavily on automated **Applicant Tracking Systems (ATS)** to parse, index, and screen candidate resumes before a recruiter ever reviews them. Hidden layout errors, multi-column tables, missing standard section headers, weak action verbs, and absent target keywords frequently cause qualified professionals to be filtered out before an interview is scheduled.

**resumlyse** is a privacy-first, full-stack application built to give candidates complete clarity into their resume's automated readability, structural integrity, and competitive positioning.

It audits resume documents across 6 weighted dimensions against modern ATS parsing standards, cross-references qualifications against target job descriptions, identifies missing keywords, drafts copy-ready section revisions, and exports downloadable audit reports—all in a **100% stateless, zero-retention environment**.

---

## Key Features

- **Multi-Format Document Parsing**: High-fidelity text, structure, hyperlink, and font extraction for `.pdf` (via `PyMuPDF`), `.docx` (via `python-docx`), `.rtf` (via `striprtf`), and `.txt` files.
- **Strict Security Verification**: Uploaded files undergo instant magic byte verification before processing, guarding against extension spoofing and malicious payloads.
- **Weighted 6-Dimensional ATS Scoring**:
  - **ATS Compatibility (25%)**: Standard headers, parseable contact metadata, column/table layout safety.
  - **Structure & Sections (20%)**: Core section presence, logical sequencing, chronological consistency.
  - **Grammar & Spelling (15%)**: Punctuation, capitalization, past/present tense consistency.
  - **Formatting (15%)**: Margins, bullet structure, font hierarchy consistency.
  - **Content Quality (15%)**: Action verbs, measurable impact, quantifiable achievements.
  - **Professional Tone (10%)**: Objective voice, absence of first-person pronouns, executive clarity.
- **Job Description Keyword Gap Analysis**: Highlights matched vs. missing skills and technical keywords with surrounding resume context.
- **Actionable AI Section Drafting**: Generates copy-ready suggested rewrites for missing or weak resume sections directly within the audit view.
- **Stateless Privacy-First Architecture**: Zero database, zero persistent storage of candidate resumes. Uploads are processed ephemerally in system temporary storage and immediately unlinked.
- **Instant Client-Side PDF Export**: Generates professional, multi-page PDF audit reports on demand using ReportLab directly from client-side state.
- **Vercel-Ready Monorepo**: Preconfigured with `vercel.json` services to deploy both Vite frontend and FastAPI backend under a single origin with zero CORS overhead.

---

## Architecture & Tech Stack

```
                                 ┌─────────────────────────────────┐
                                 │       React 18 + Vite 5 SPA     │
                                 │   Tailwind CSS v4 + TypeScript  │
                                 └────────────────┬────────────────┘
                                                  │
                                   HTTP / Axios   │  JSON & Multipart
                                   Proxy (/api)   ▼
                                 ┌─────────────────────────────────┐
                                 │        FastAPI Backend          │
                                 │         (Python 3.10+)          │
                                 └────────┬───────────────┬────────┘
                                          │               │
                     File Upload (Ephemeral)              │ JSON Payload
                                          ▼               ▼
                 ┌───────────────────────────┐  ┌───────────────────┐
                 │     Document Parsers      │  │   ReportLab PDF   │
                 │  • PyMuPDF (PDF + Fonts)  │  │     Generator     │
                 │  • python-docx (DOCX)     │  └─────────┬─────────┘
                 │  • striprtf (RTF)         │            │
                 │  • Native Text (TXT)      │            │ Streams PDF
                 └─────────────┬─────────────┘            ▼
                               │ Extracted Raw Text   (Client Download)
                               ▼
                 ┌───────────────────────────┐
                 │    OpenAI / LLM Engine    │
                 │ (NVIDIA NIM / OpenAI /...)│
                 └─────────────┬─────────────┘
                               │
                               ▼
                   Structured Analysis Result
                     returned to client SPA
```

### Backend

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Document Extractors**: `PyMuPDF` (fitz), `python-docx`, `striprtf`
- **AI Analysis**: [OpenAI Python SDK](https://github.com/openai/openai-python) (compatible with NVIDIA NIM, OpenAI, Groq, Ollama, vLLM, etc.)
- **Report Generation**: [ReportLab](https://www.reportlab.com/)
- **Security**: Magic byte file signature validation & immediate file cleanup

### Frontend

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/) with automated `/api` proxy
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Visuals**: `react-circular-progressbar`, `recharts`
- **Typography**: Editorial layout using serif headings (`Lora`) and clean body sans (`DM Sans`)

---

## Getting Started

### Prerequisites

- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.0` or higher (with `npm` 9+)
- **LLM API Key**: An API key from **OpenAI**

---

### Option A: Monorepo Development (Recommended)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/SouravKAgarwal/resumlyse.git
   cd resumlyse
   ```

2. **Set up the Python backend**:

   ```bash
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate

   pip install -r backend/requirements.txt
   ```

3. **Configure environment variables**:
   Create a file named `backend/.env`:

   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Start development**:

   ```bash
   # Terminal 1: Frontend (Vite)
   npm run dev:frontend

   # Terminal 2: Backend (FastAPI)
   npm run dev:backend
   ```

6. Open your browser at `http://localhost:5173` (or `http://localhost:3000` when using `vercel dev`).

---

### Option B: Standalone Setup

#### 1. Backend Setup

```bash
cd backend
python -m venv .venv
# Activate virtual environment
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- API root: `http://localhost:8000`
- Interactive Swagger docs: `http://localhost:8000/docs`
- Redoc alternative docs: `http://localhost:8000/redoc`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Frontend UI: `http://localhost:5173`
- Vite automatically proxies `/api` calls to `http://localhost:8000`.

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
