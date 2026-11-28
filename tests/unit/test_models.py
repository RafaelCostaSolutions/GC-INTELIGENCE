"""Tests for the table rules (GC-43): required fields, unique values and defaults."""
import pytest
from sqlalchemy.exc import IntegrityError

from src.infra.sqlalchemy.models.models import Hospital, Patient, Professional, User


def add(db, obj):
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def hospitals(db):
    return add(db, Hospital(name="Hospital A")), add(db, Hospital(name="Hospital B"))


def test_defaults_are_filled_by_the_database(db):
    a, _ = hospitals(db)
    patient = add(db, Patient(hospital_id=a.id, name="Maria"))

    assert patient.active is True
    assert patient.created_at is not None
    assert patient.updated_at is not None


def test_same_cpf_is_not_allowed_in_the_same_hospital(db):
    a, _ = hospitals(db)
    add(db, Patient(hospital_id=a.id, name="Maria", cpf="111"))

    with pytest.raises(IntegrityError):
        add(db, Patient(hospital_id=a.id, name="Maria 2", cpf="111"))


def test_same_cpf_is_allowed_in_different_hospitals(db):
    a, b = hospitals(db)
    add(db, Patient(hospital_id=a.id, name="Maria", cpf="111"))

    assert add(db, Patient(hospital_id=b.id, name="Maria", cpf="111")).id is not None


def test_same_professional_registry_is_not_allowed_in_the_same_hospital(db):
    a, b = hospitals(db)
    registry = dict(kind="medico", council="CRM", registry_number="12345", registry_state="DF")
    add(db, Professional(hospital_id=a.id, name="Dr. João", **registry))
    add(db, Professional(hospital_id=b.id, name="Dr. João", **registry))  # other hospital: allowed

    with pytest.raises(IntegrityError):
        add(db, Professional(hospital_id=a.id, name="Dr. João 2", **registry))


def test_cnpj_and_user_email_are_unique(db):
    add(db, Hospital(name="Hospital A", cnpj="00.000.000/0001-01"))
    with pytest.raises(IntegrityError):
        add(db, Hospital(name="Hospital B", cnpj="00.000.000/0001-01"))
    db.rollback()

    a = add(db, Hospital(name="Hospital C"))
    user = dict(hospital_id=a.id, name="Ana", password_hash="x", role="gestor")
    add(db, User(email="ana@gc.com", **user))
    with pytest.raises(IntegrityError):
        add(db, User(email="ana@gc.com", **user))


def test_required_fields(db):
    with pytest.raises(IntegrityError):
        add(db, Hospital(name=None))
    db.rollback()

    with pytest.raises(IntegrityError):
        add(db, Patient(name="No hospital"))  # hospital_id is required
