from sqlalchemy.orm import Session

from src.infra.sqlalchemy.models import models
from src.schema import schemas

FIELDS = ["name", "cpf", "birth_date", "sex", "phone", "email", "address",
          "insurance", "insurance_card", "guardian_name", "guardian_phone"]


class PatientRepository():
    """CRUD for patients. EVERY query filters by hospital_id,
    so a hospital never sees another hospital's patients (GC-5)."""

    def __init__(self, db: Session, hospital_id: int):
        self.db = db
        self.hospital_id = hospital_id

    def create(self, patient: schemas.Patient):
        db_patient = models.Patient(hospital_id=self.hospital_id)
        for field in FIELDS:
            setattr(db_patient, field, getattr(patient, field))
        self.db.add(db_patient)
        self.db.commit()
        self.db.refresh(db_patient)
        return db_patient

    def list_all(self):
        return (self.db.query(models.Patient)
                .filter(models.Patient.hospital_id == self.hospital_id, models.Patient.active.is_(True))
                .all())

    def get(self, id: int):
        return (self.db.query(models.Patient)
                .filter(models.Patient.id == id, models.Patient.hospital_id == self.hospital_id)
                .first())

    def update(self, id: int, patient: schemas.Patient):
        db_patient = self.get(id)
        if db_patient:
            for field in FIELDS:
                setattr(db_patient, field, getattr(patient, field))
            self.db.commit()
            self.db.refresh(db_patient)
        return db_patient

    def deactivate(self, id: int):
        # Health records are never really deleted: they are only marked inactive.
        db_patient = self.get(id)
        if db_patient:
            db_patient.active = False
            self.db.commit()
        return db_patient
