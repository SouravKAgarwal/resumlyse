import logging
import sys
from pathlib import Path

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import JSONResponse
from routers import analyze, export

tags_metadata = [
    {
        "name": "Analysis",
        "description": "Resume parsing, security validation, multi-dimensional ATS scoring, section audit, and keyword match verification.",
    },
    {
        "name": "Export",
        "description": "Compilation of client-side analysis data into downloadable, formatted PDF executive reports.",
    },
    {
        "name": "System",
        "description": "Service health checks and operational status endpoints.",
    },
]

app = FastAPI(
    title="Resumlyse API",
    version="1.0.0",
    description="""
Enterprise-grade, stateless API for resume parsing, multi-dimensional ATS scoring, section diagnostics, and PDF report compilation.

### Architecture Highlights
- **Stateless Privacy**: Zero persistence of uploaded documents or analysis results. Data is processed in-memory and discarded.
- **Multi-Format Ingestion**: Native parsing support for PDF, DOCX, TXT, and RTF documents.
- **Weighted Evaluation**: Composite scoring covering ATS Compatibility, Impact & Metrics, Brevity, and Skills Alignment.
- **Stream Generation**: On-the-fly binary PDF compilation for instant client-side download.
""",
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(export.router)


@app.get("/api/openapi.json", include_in_schema=False)
@app.head("/api/openapi.json", include_in_schema=False)
def get_api_openapi():
    return JSONResponse(app.openapi())


@app.get("/api/docs", include_in_schema=False)
async def get_api_docs():
    return get_swagger_ui_html(
        openapi_url="/api/openapi.json",
        title=f"{app.title} - Swagger UI",
    )


@app.get(
    "/api",
    tags=["System"],
    summary="Get API Health and Status",
    operation_id="getApiHealth",
    responses={
        200: {
            "description": "API service is fully operational and healthy.",
            "content": {
                "application/json": {
                    "example": {
                        "status": "healthy",
                        "service": "Resumlyse API",
                        "version": "1.0.0",
                    }
                }
            },
        }
    },
)
@app.head("/api", include_in_schema=False)
@app.get("/api/", include_in_schema=False)
@app.head("/api/", include_in_schema=False)
@app.get("/", include_in_schema=False)
@app.head("/", include_in_schema=False)
def root():
    """
    Perform a lightweight health check to confirm that the Resumlyse API backend service is operational and responding.
    """
    logger.info("Root health check endpoint accessed")
    return {
        "status": "healthy",
        "service": "Resumlyse API",
        "version": "1.0.0",
    }
