from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from src.auth.security import hash_password, hash_token, refresh_expires_at, reset_expires_at
from src.infra.sqlalchemy.models.models import PasswordResetToken, RefreshToken, User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email.lower().strip()).first()

    def create(self, *, hospital_id: int, name: str, email: str, password: str, role: str) -> User:
        user = User(
            hospital_id=hospital_id,
            name=name.strip(),
            email=email.lower().strip(),
            password_hash=hash_password(password),
            role=role,
            active=True,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def set_password(self, user: User, new_password: str) -> None:
        user.password_hash = hash_password(new_password)
        self.db.commit()

    # ---------- refresh tokens ----------

    def store_refresh_token(self, user_id: int, raw_token: str) -> RefreshToken:
        row = RefreshToken(
            user_id=user_id,
            token_hash=hash_token(raw_token),
            expires_at=refresh_expires_at(),
            revoked=False,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def get_valid_refresh(self, raw_token: str) -> Optional[RefreshToken]:
        now = datetime.now(timezone.utc)
        row = (
            self.db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == hash_token(raw_token),
                RefreshToken.revoked.is_(False),
            )
            .first()
        )
        if row is None:
            return None
        # SQLite may return naive datetime
        exp = row.expires_at if row.expires_at.tzinfo else row.expires_at.replace(tzinfo=timezone.utc)
        if exp < now:
            return None
        return row

    def revoke_refresh(self, row: RefreshToken) -> None:
        row.revoked = True
        self.db.commit()

    def revoke_all_refresh_for_user(self, user_id: int) -> None:
        (
            self.db.query(RefreshToken)
            .filter(RefreshToken.user_id == user_id, RefreshToken.revoked.is_(False))
            .update({"revoked": True})
        )
        self.db.commit()

    # ---------- password reset tokens ----------

    def store_reset_token(self, user_id: int, raw_token: str) -> PasswordResetToken:
        # Invalidate previous unused tokens for this user
        (
            self.db.query(PasswordResetToken)
            .filter(PasswordResetToken.user_id == user_id, PasswordResetToken.used.is_(False))
            .update({"used": True})
        )
        row = PasswordResetToken(
            user_id=user_id,
            token_hash=hash_token(raw_token),
            expires_at=reset_expires_at(),
            used=False,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def get_valid_reset(self, raw_token: str) -> Optional[PasswordResetToken]:
        now = datetime.now(timezone.utc)
        row = (
            self.db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.token_hash == hash_token(raw_token),
                PasswordResetToken.used.is_(False),
            )
            .first()
        )
        if row is None:
            return None
        exp = row.expires_at if row.expires_at.tzinfo else row.expires_at.replace(tzinfo=timezone.utc)
        if exp < now:
            return None
        return row

    def mark_reset_used(self, row: PasswordResetToken) -> None:
        row.used = True
        self.db.commit()
