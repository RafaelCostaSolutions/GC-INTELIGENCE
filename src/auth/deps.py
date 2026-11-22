"""FastAPI dependencies for authentication and multi-tenant scope (GC-5)."""
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


def _user_from_credentials(
    credentials: Optional[HTTPAuthorizationCredentials],
    db: Session,
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


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    return _user_from_credentials(credentials, db)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or not credentials.credentials:
        raise ApiError(401, "UNAUTHORIZED", "Token de acesso ausente")
    user = _user_from_credentials(credentials, db)
    if user is None:
        raise ApiError(401, "UNAUTHORIZED", "Token de acesso inválido ou expirado")
    return user


def current_hospital(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    # Kept only to detect and reject client attempts to forge tenant
    x_hospital_id: Optional[int] = Header(
        None,
        alias="X-Hospital-Id",
        description="Ignored. Tenant always comes from the JWT.",
    ),
) -> int:
    """Tenant of the request (GC-5).

    Always taken from the authenticated user's hospital_id.
    A forged X-Hospital-Id header is ignored (and must not change the scope).
    """
    hospital_id = user.hospital_id

    if x_hospital_id is not None and x_hospital_id != hospital_id:
        # Do not leak whether the other hospital exists — just enforce tenant.
        raise ApiError(
            403,
            "FORBIDDEN",
            "Não é permitido acessar dados de outro hospital",
        )

    if HospitalRepository(db).get(hospital_id) is None:
        raise not_found("Hospital")

    return hospital_id
