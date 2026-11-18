from datetime import datetime

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String, UniqueConstraint, func, true

from src.infra.sqlalchemy.config.database import Base


class Hospital(Base):
    """The owner of the data. Each hospital only sees its own records (GC-5)."""

    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    cnpj = Column(String(18), unique=True, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class User(Base):
    """Someone who logs in. Login and passwords belong to GC-3."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    # gestor, medico, enfermeiro, recepcionista, tecnico_lab, admin (GC-4)
    role = Column(String(30), nullable=False)
    active = Column(Boolean, nullable=False, default=True, server_default=true())
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class Professional(Base):
    """Doctors, nurses, lab technicians..."""

    __tablename__ = "professionals"
    __table_args__ = (UniqueConstraint("hospital_id", "council", "registry_number", "registry_state", name="uq_professional_registry"),)

    id = Column(Integer, primary_key=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # set when they also log in
    name = Column(String(150), nullable=False)
    kind = Column(String(30), nullable=False)            # medico, enfermeiro, tecnico_lab...
    council = Column(String(10), nullable=True)          # CRM, COREN, CRBM...
    registry_number = Column(String(20), nullable=True)  # number in the council
    registry_state = Column(String(2), nullable=True)    # state (UF) of the registry
    specialty = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(150), nullable=True)
    active = Column(Boolean, nullable=False, default=True, server_default=true())
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class Patient(Base):
    """A patient. Fields based on the product prototype."""

    __tablename__ = "patients"
    __table_args__ = (UniqueConstraint("hospital_id", "cpf", name="uq_patient_cpf_per_hospital"),)

    id = Column(Integer, primary_key=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    cpf = Column(String(14), nullable=True)
    birth_date = Column(Date, nullable=True)
    sex = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(150), nullable=True)
    address = Column(String(255), nullable=True)
    insurance = Column(String(100), nullable=True)       # health plan (or SUS)
    insurance_card = Column(String(50), nullable=True)   # plan card / SUS card number
    guardian_name = Column(String(150), nullable=True)   # legal guardian
    guardian_phone = Column(String(20), nullable=True)
    active = Column(Boolean, nullable=False, default=True, server_default=true())
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=datetime.now)
