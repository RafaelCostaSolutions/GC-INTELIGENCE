from sqlalchemy.orm import Session

from src.infra.sqlalchemy.models import models
from src.schema import schemas

FIELDS = ["user_id", "name", "kind", "council", "registry_number", "registry_state",
          "specialty", "phone", "email"]


class ProfessionalRepository():
    """Same pattern as PatientRepository: always filters by hospital_id."""

    def __init__(self, db: Session, hospital_id: int):
        self.db = db
        self.hospital_id = hospital_id

    def create(self, professional: schemas.Professional):
        db_professional = models.Professional(hospital_id=self.hospital_id)
        for field in FIELDS:
            setattr(db_professional, field, getattr(professional, field))
        self.db.add(db_professional)
        self.db.commit()
        self.db.refresh(db_professional)
        return db_professional

    def list_all(self):
        return (self.db.query(models.Professional)
                .filter(models.Professional.hospital_id == self.hospital_id, models.Professional.active.is_(True))
                .all())

    def get(self, id: int):
        return (self.db.query(models.Professional)
                .filter(models.Professional.id == id, models.Professional.hospital_id == self.hospital_id)
                .first())

    def update(self, id: int, professional: schemas.Professional):
        db_professional = self.get(id)
        if db_professional:
            for field in FIELDS:
                setattr(db_professional, field, getattr(professional, field))
            self.db.commit()
            self.db.refresh(db_professional)
        return db_professional

    def deactivate(self, id: int):
        db_professional = self.get(id)
        if db_professional:
            db_professional.active = False
            self.db.commit()
        return db_professional
