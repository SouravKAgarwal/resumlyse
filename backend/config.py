import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env from the backend directory
_backend_dir = Path(__file__).parent
load_dotenv(_backend_dir / ".env")


class Settings(BaseModel):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "nvidia/nemotron-3-super-120b-a12b")
    OPENAI_API_BASE: str = os.getenv(
        "OPENAI_API_BASE", "https://integrate.api.nvidia.com/v1"
    )
    TEMP_UPLOAD_DIR: str = str(_backend_dir / "temp_uploads")


settings = Settings()

# Ensure temp directory exists
os.makedirs(settings.TEMP_UPLOAD_DIR, exist_ok=True)
