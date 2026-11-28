"""Unit tests for the data access layer (GC-45).

These tests call the repositories directly, without the API.
"""
from datetime import date

from src.infra.sqlalchemy.repositories.hospital import HospitalRepository
from src.infra.sqlalchemy.repositories.patient import PatientRepository
from src.infra.sqlalchemy.repositories.professional import ProfessionalRepository
from src.schema.schemas import Hospital, Patient, Professional


def make_hospitals(db):
    repo = HospitalRepository(db)
    a = repo.create(Hospital(name="Hospital A", cnpj="00.000.000/0001-01"))
    b = repo.create(Hospital(name="Hospital B", cnpj="00.000.000/0001-02"))
    return a, b


def test_hospital_create_get_and_list(db):
    a, b = make_hospitals(db)
    repo = HospitalRepository(db)

    assert a.id is not None and a.created_at is not None
    assert repo.get(a.id).name == "Hospital A"
    assert repo.get(9999) is None
    assert {h.name for h in repo.list_all()} == {"Hospital A", "Hospital B"}


def test_patient_create_sets_the_hospital(db):
    a, b = make_hospitals(db)
    repo = PatientRepository(db, a.id)

    # The hospital_id sent in the data is ignored: the repository decides it.
    patient = repo.create(Patient(name="Maria", cpf="111", birth_date=date(1990, 5, 1), hospital_id=b.id))

    assert patient.id is not None
    assert patient.hospital_id == a.id
    assert patient.active is True
    assert patient.birth_date == date(1990, 5, 1)


def test_patient_list_and_get_only_see_own_hospital(db):
    a, b = make_hospitals(db)
    repo_a = PatientRepository(db, a.id)
    repo_b = PatientRepository(db, b.id)
    maria = repo_a.create(Patient(name="Maria", cpf="111"))
    repo_b.create(Patient(name="João", cpf="222"))

    assert [p.name for p in repo_a.list_all()] == ["Maria"]
    assert [p.name for p in repo_b.list_all()] == ["João"]
    assert repo_a.get(maria.id).name == "Maria"
    assert repo_b.get(maria.id) is None


def test_patient_update(db):
    a, b = make_hospitals(db)
    repo_a = PatientRepository(db, a.id)
    maria = repo_a.create(Patient(name="Maria", cpf="111"))

    updated = repo_a.update(maria.id, Patient(name="Maria Silva", cpf="111", phone="61999990000"))
    assert updated.name == "Maria Silva"
    assert updated.phone == "61999990000"

    # Another hospital cannot update it
    assert PatientRepository(db, b.id).update(maria.id, Patient(name="Hack")) is None
    assert repo_a.get(maria.id).name == "Maria Silva"


def test_patient_deactivate_keeps_the_record(db):
    a, b = make_hospitals(db)
    repo_a = PatientRepository(db, a.id)
    maria = repo_a.create(Patient(name="Maria", cpf="111"))

    assert PatientRepository(db, b.id).deactivate(maria.id) is None
    repo_a.deactivate(maria.id)

    assert repo_a.list_all() == []            # hidden from the list
    assert repo_a.get(maria.id).active is False  # but still stored


def test_professional_crud_follows_the_same_rules(db):
    a, b = make_hospitals(db)
    repo_a = ProfessionalRepository(db, a.id)
    repo_b = ProfessionalRepository(db, b.id)

    doctor = repo_a.create(Professional(name="Dr. João", kind="medico", council="CRM",
                                        registry_number="12345", registry_state="DF"))
    assert doctor.hospital_id == a.id
    assert repo_b.list_all() == []
    assert repo_b.get(doctor.id) is None

    repo_a.update(doctor.id, Professional(name="Dr. João Lima", kind="medico", specialty="Cardiologia"))
    assert repo_a.get(doctor.id).specialty == "Cardiologia"

    repo_a.deactivate(doctor.id)
    assert repo_a.list_all() == []
    assert repo_a.get(doctor.id).active is False
