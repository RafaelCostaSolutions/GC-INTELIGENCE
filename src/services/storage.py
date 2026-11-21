"""File storage, SHA-256 hashing and basic HMAC digital signature."""
from hashlib import sha256
from hmac import compare_digest, new as hmac_new
from pathlib import Path
from uuid import uuid4

from src.infra.sqlalchemy.config.settings import settings

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "text/plain",
    "application/octet-stream",
}


def _signing_secret() -> bytes:
    key = settings.signing_key or settings.jwt_secret
    return key.encode("utf-8")


def ensure_upload_dir() -> Path:
    path = Path(settings.upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def sha256_bytes(data: bytes) -> str:
    return sha256(data).hexdigest()


def sign_hash(file_hash: str, user_id: int) -> str:
    """Basic digital signature: HMAC-SHA256 over "{file_hash}:{user_id}".

    Enough to prove who signed which file hash with the server key.
    Replace later with X.509 / ICP-Brasil if required.
    """
    message = f"{file_hash}:{user_id}".encode("utf-8")
    return hmac_new(_signing_secret(), message, sha256).hexdigest()


def verify_signature(file_hash: str, user_id: int, signature: str) -> bool:
    expected = sign_hash(file_hash, user_id)
    return compare_digest(expected, signature)


def save_upload(data: bytes, original_filename: str, hospital_id: int) -> tuple[str, str, int]:
    """Persist bytes to disk.

    Returns (stored_path, file_hash, size_bytes).
    """
    if len(data) == 0:
        raise ValueError("empty")
    if len(data) > settings.max_upload_bytes:
        raise ValueError("too_large")

    file_hash = sha256_bytes(data)
    ext = Path(original_filename).suffix.lower()[:20]
    safe_name = f"{hospital_id}_{uuid4().hex}{ext}"
    dest = ensure_upload_dir() / safe_name
    dest.write_bytes(data)
    return str(dest), file_hash, len(data)


def read_and_hash(stored_path: str) -> str:
    data = Path(stored_path).read_bytes()
    return sha256_bytes(data)
