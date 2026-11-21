"""FastAPI dependencies for authentication."""
from typing import Optional

from fastapi import Depends, Header
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.auth.security import decode_access_token
from src.errors import ApiError, not_found
from src.infra.sqlalchemy.config.database import get_db
from src.infra.sqlalchemy.models.models import User
from src.infra.sqlalchemy.repositories.hospital import HospitalRepository
from src.infra.sqlalchemy.repositories.user import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if credentials is None or not credentials.credentials:
        return None
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        return None
    try:
        user_id = int(payload["sub"])
    except (KeyError, ValueError, TypeError):
        return None
    user = UserRepository(db).get_by_id(user_id)
    if user is None or not user.active:
        return None
    return user


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    user = get_current_user_optional(credentials, db)
    if user is None:
        # Distinguish missing vs invalid for clearer messages
        if credentials is None or not credentials.credentials:
            raise ApiError(401, "UNAUTHORIZED", "Token de acesso ausente")
        raise ApiError(401, "UNAUTHORIZED", "Token de acesso inválido ou expirado")
    return user


def current_hospital(
    x_hospital_id: Optional[int] = Header(None, description="Legacy header; prefer JWT"),
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
) -> int:
    """Hospital of the request (GC-5).

    Prefer hospital_id from the JWT (GC-3). Fall back to X-Hospital-Id while
    the front migrates.
    """
    hospital_id = user.hospital_id if user is not None else x_hospital_id
    if hospital_id is None:
        raise ApiError(401, "UNAUTHORIZED", "Autenticação necessária")
    if HospitalRepository(db).get(hospital_id) is None:
        raise not_found("Hospital")
    return hospital_id
