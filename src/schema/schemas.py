from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class Hospital(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    name: str
    cnpj: Optional[str] = None


class Patient(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    hospital_id: Optional[int] = None  # always set by the API, never by the client
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
    hospital_id: Optional[int] = None  # always set by the API, never by the client
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
