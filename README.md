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

[Architecture](#architecture--tech-stack) • [Quick Start](#getting-started) • [API Reference](#api-reference)

</div>

---

## Overview

Modern hiring workflows rely heavily on automated **Applicant Tracking Systems (ATS)** to parse, index, and screen candidate resumes before a recruiter reviews them. Hidden layout errors, multi-column tables, missing section headers, weak action verbs, and absent target keywords frequently cause qualified professionals to be filtered out before an interview is ever scheduled.

**resumlyse** is a privacy-first, full-stack application built to give candidates complete clarity into their resume's automated readability, structural integrity, and competitive positioning. 

It audits resume documents against modern parsing standards, optionally cross-references candidate qualifications against specific job descriptions, scores content across six weighted dimensions, generates copy-ready draft revisions, and exports downloadable PDF audit reports—all in a **100% stateless, zero-retention environment**.

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
   OPENAI_API_KEY=your_api_key_here
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

The backend configuration is managed via `backend/config.py` using `pydantic` / `python-dotenv`:

| Variable | Type | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | String | `""` | API key for OpenAI or any compatible LLM endpoint. |
| `OPENAI_MODEL` | String | `nvidia/nemotron-3-super-120b-a12b` | Model identifier used for evaluations. |
| `OPENAI_API_BASE` | String | `https://integrate.api.nvidia.com/v1` | Base URL for LLM API calls. |
| `TEMP_UPLOAD_DIR` | String | System Temp (`/tmp/resumlyse_uploads`) | Ephemeral directory for saving incoming documents during parsing before immediate unlinking (fully compatible with serverless read-only filesystems). |

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
