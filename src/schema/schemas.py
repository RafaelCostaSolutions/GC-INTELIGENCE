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
    expires_in: int
    user: UserOut


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    reset_token: Optional[str] = None


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


# ---------- Finance & Laudo text sign (GC-4) ----------

class FinanceSummary(BaseModel):
    hospital_id: int
    receita_mes: float
    despesa_mes: float
    margem: float


class LaudoSignRequest(BaseModel):
    exam_id: str = Field(min_length=1, max_length=50)
    conclusion: str = Field(min_length=1, max_length=2000)


class LaudoSignResponse(BaseModel):
    exam_id: str
    signed_by: str
    role: str
    conclusion: str
    message: str


# ---------- Upload + digital signature (base) ----------

class LaudoFileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    hospital_id: int
    uploaded_by: int
    patient_id: Optional[int] = None
    exam_id: Optional[str] = None
    original_filename: str
    content_type: Optional[str] = None
    size_bytes: int
    file_hash: str
    signature: Optional[str] = None
    signed_by: Optional[int] = None
    signed_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None


class LaudoVerifyResponse(BaseModel):
    id: int
    file_hash: str
    hash_matches_file: bool
    is_signed: bool
    signature_valid: Optional[bool] = None
    message: str
