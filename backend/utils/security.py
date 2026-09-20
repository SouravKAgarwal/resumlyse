import logging

from fastapi import HTTPException, UploadFile

logger = logging.getLogger(__name__)

# Magic byte signatures
MAGIC_BYTES = {
    b"%PDF": "pdf",
    b"PK\x03\x04": "docx",  # ZIP format for docx
    b"{\\rtf1": "rtf",
}


async def validate_file_security(file: UploadFile) -> str:
    """
    Validates the file type based on its extension and magic bytes (where applicable).
    Raises HTTPException if the file is invalid.
    Returns the determined file extension.
    """
    filename = file.filename.lower()

    if not filename.endswith((".pdf", ".docx", ".txt", ".rtf")):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Read the first few bytes for magic byte validation
    header = await file.read(10)
    await file.seek(0)  # Reset file pointer for subsequent reads

    ext = filename.split(".")[-1]

    if ext == "pdf":
        if not header.startswith(b"%PDF"):
            logger.warning(f"File {filename} has invalid magic bytes for PDF")
            raise HTTPException(
                status_code=400,
                detail="Invalid file signature. File does not appear to be a valid PDF.",
            )
    elif ext == "docx":
        if not header.startswith(b"PK\x03\x04"):
            logger.warning(f"File {filename} has invalid magic bytes for DOCX")
            raise HTTPException(
                status_code=400,
                detail="Invalid file signature. File does not appear to be a valid DOCX.",
            )
    elif ext == "rtf":
        if not header.startswith(b"{\\rtf1"):
            logger.warning(f"File {filename} has invalid magic bytes for RTF")
            raise HTTPException(
                status_code=400,
                detail="Invalid file signature. File does not appear to be a valid RTF.",
            )
    elif ext == "txt":
        if b"\x00" in header:
            logger.warning(
                f"File {filename} contains null bytes, treating as invalid TXT"
            )
            raise HTTPException(
                status_code=400,
                detail="Invalid file signature. TXT file contains binary data.",
            )

    return ext
