"""Password hashing, JWT access tokens and opaque refresh/reset tokens."""
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from secrets import token_urlsafe
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from src.infra.sqlalchemy.config.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: int, hospital_id: int, role: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": str(user_id),
        "hospital_id": hospital_id,
        "role": role,
        "email": email,
        "type": "access",
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


def new_opaque_token() -> str:
    """Random URL-safe token (returned to the client)."""
    return token_urlsafe(32)


def hash_token(raw: str) -> str:
    """SHA-256 hex digest — we store only the hash in the database."""
    return sha256(raw.encode("utf-8")).hexdigest()


def refresh_expires_at() -> datetime:
    return datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)


def reset_expires_at() -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=settings.password_reset_expire_minutes)
