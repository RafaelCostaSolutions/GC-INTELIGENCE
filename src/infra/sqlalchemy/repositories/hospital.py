from sqlalchemy.orm import Session

from src.infra.sqlalchemy.models import models
from src.schema import schemas


class HospitalRepository():

    def __init__(self, db: Session):
        self.db = db

    def create(self, hospital: schemas.Hospital):
        db_hospital = models.Hospital(name=hospital.name, cnpj=hospital.cnpj)
        self.db.add(db_hospital)
        self.db.commit()
        self.db.refresh(db_hospital)
        return db_hospital

    def list_all(self):
        return self.db.query(models.Hospital).all()

    def get(self, id: int):
        return self.db.query(models.Hospital).filter(models.Hospital.id == id).first()
