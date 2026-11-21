from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class Hospital(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    name: str
    cnpj: Optional[str] = None


class Patient(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    hospital_id: Optional[int] = None
    name: str
    cpf: Optional[str] = None
    birth_date: Optional[date] = None
    sex: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    insurance: Optional[str] = None
    insurance_card: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    active: bool = True
    created_at: Optional[datetime] = None


class Professional(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    hospital_id: Optional[int] = None
    user_id: Optional[int] = None
    name: str
    kind: str
    council: Optional[str] = None
    registry_number: Optional[str] = None
    registry_state: Optional[str] = None
    specialty: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    active: bool = True
    created_at: Optional[datetime] = None


# ---------- Auth (GC-3) ----------

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    hospital_id: int
    name: str
    email: str
    role: str
    active: bool


class RegisterRequest(BaseModel):
    hospital_id: int
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = Field(default="gestor", max_length=30)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # access token lifetime in seconds
    user: UserOut


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    # Only present when AUTH_DEBUG=true (local development)
    reset_token: Optional[str] = None


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)
