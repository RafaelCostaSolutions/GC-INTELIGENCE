"""FastAPI dependencies for authentication."""
from typing import Optional

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.auth.security import decode_access_token
from src.errors import ApiError
from src.infra.sqlalchemy.config.database import get_db
from src.infra.sqlalchemy.models.models import User
from src.infra.sqlalchemy.repositories.user import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or not credentials.credentials:
        raise ApiError(401, "UNAUTHORIZED", "Token de acesso ausente")

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise ApiError(401, "UNAUTHORIZED", "Token de acesso inválido ou expirado")

    try:
        user_id = int(payload["sub"])
    except (KeyError, ValueError, TypeError):
        raise ApiError(401, "UNAUTHORIZED", "Token de acesso inválido ou expirado")

    user = UserRepository(db).get_by_id(user_id)
    if user is None or not user.active:
        raise ApiError(401, "UNAUTHORIZED", "Usuário inativo ou não encontrado")

    return user
