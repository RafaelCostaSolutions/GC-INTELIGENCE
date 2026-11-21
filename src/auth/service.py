"""Auth business logic: login, refresh, logout, forgot/reset password."""
from sqlalchemy.orm import Session

from src.auth.security import (
    create_access_token,
    new_opaque_token,
    verify_password,
)
from src.errors import ApiError
from src.infra.sqlalchemy.config.settings import settings
from src.infra.sqlalchemy.models.models import User
from src.infra.sqlalchemy.repositories.hospital import HospitalRepository
from src.infra.sqlalchemy.repositories.user import UserRepository
from src.schema.schemas import TokenResponse, UserOut


def _issue_tokens(db: Session, user: User) -> TokenResponse:
    access = create_access_token(user.id, user.hospital_id, user.role, user.email)
    refresh = new_opaque_token()
    UserRepository(db).store_refresh_token(user.id, refresh)
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
        user=UserOut.model_validate(user),
    )


def register_user(
    db: Session,
    *,
    hospital_id: int,
    name: str,
    email: str,
    password: str,
    role: str,
) -> TokenResponse:
    if HospitalRepository(db).get(hospital_id) is None:
        raise ApiError(404, "NOT_FOUND", "Hospital não encontrado")

    repo = UserRepository(db)
    if repo.get_by_email(email) is not None:
        raise ApiError(409, "CONFLICT", "Já existe um usuário com este e-mail")

    user = repo.create(
        hospital_id=hospital_id,
        name=name,
        email=email,
        password=password,
        role=role,
    )
    return _issue_tokens(db, user)


def login(db: Session, email: str, password: str) -> TokenResponse:
    user = UserRepository(db).get_by_email(email)
    if user is None or not verify_password(password, user.password_hash):
        raise ApiError(401, "UNAUTHORIZED", "E-mail ou senha inválidos")
    if not user.active:
        raise ApiError(401, "UNAUTHORIZED", "Usuário inativo")
    return _issue_tokens(db, user)


def refresh(db: Session, raw_refresh: str) -> TokenResponse:
    repo = UserRepository(db)
    row = repo.get_valid_refresh(raw_refresh)
    if row is None:
        raise ApiError(401, "UNAUTHORIZED", "Refresh token inválido ou expirado")

    # Rotate: revoke old, issue new pair
    repo.revoke_refresh(row)
    user = repo.get_by_id(row.user_id)
    if user is None or not user.active:
        raise ApiError(401, "UNAUTHORIZED", "Usuário inativo ou não encontrado")

    return _issue_tokens(db, user)


def logout(db: Session, raw_refresh: str) -> None:
    repo = UserRepository(db)
    row = repo.get_valid_refresh(raw_refresh)
    if row is not None:
        repo.revoke_refresh(row)


def forgot_password(db: Session, email: str) -> dict:
    """Always returns the same message (no user enumeration).
    In AUTH_DEBUG mode, also returns the reset token for local testing."""
    repo = UserRepository(db)
    user = repo.get_by_email(email)
    message = "Se o e-mail existir, enviaremos instruções de recuperação"

    if user is None or not user.active:
        return {"message": message, "reset_token": None}

    raw = new_opaque_token()
    repo.store_reset_token(user.id, raw)

    # Production: send e-mail with link containing `raw`.
    # Dev: optionally expose the token so tests and local clients can use it.
    return {
        "message": message,
        "reset_token": raw if settings.auth_debug else None,
    }


def reset_password(db: Session, raw_token: str, new_password: str) -> None:
    repo = UserRepository(db)
    row = repo.get_valid_reset(raw_token)
    if row is None:
        raise ApiError(400, "BAD_REQUEST", "Token de recuperação inválido ou expirado")

    user = repo.get_by_id(row.user_id)
    if user is None:
        raise ApiError(400, "BAD_REQUEST", "Token de recuperação inválido ou expirado")

    repo.set_password(user, new_password)
    repo.mark_reset_used(row)
    # Force re-login everywhere
    repo.revoke_all_refresh_for_user(user.id)
