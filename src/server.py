from typing import List

from fastapi import Depends, FastAPI, Header
from sqlalchemy.orm import Session

from src.errors import not_found, register_error_handlers
from src.infra.sqlalchemy.config.database import get_db
from src.infra.sqlalchemy.repositories.hospital import HospitalRepository
from src.infra.sqlalchemy.repositories.patient import PatientRepository
from src.infra.sqlalchemy.repositories.professional import ProfessionalRepository
from src.logs import setup_logging
from src.schema.schemas import Hospital, Patient, Professional

app = FastAPI(title="GC Intelligence API")
setup_logging(app)            # GC-6: one log line per request
register_error_handlers(app)  # GC-6: errors as {code, message}


def current_hospital(x_hospital_id: int = Header(..., description="Hospital making the request"),
                     db: Session = Depends(get_db)) -> int:
    """Which hospital the request belongs to (GC-5).
    For now it comes from the X-Hospital-Id header. After login (GC-3), it will come from the token."""
    if HospitalRepository(db).get(x_hospital_id) is None:
        raise not_found('Hospital')
    return x_hospital_id


# ---------- HOSPITALS ----------

@app.post('/hospitals', status_code=201, response_model=Hospital)
def create_hospital(hospital: Hospital, db: Session = Depends(get_db)):
    return HospitalRepository(db).create(hospital)


@app.get('/hospitals', response_model=List[Hospital])
def list_hospitals(db: Session = Depends(get_db)):
    return HospitalRepository(db).list_all()


# ---------- PATIENTS ----------

@app.get('/patients', response_model=List[Patient])
def list_patients(hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    return PatientRepository(db, hospital_id).list_all()


@app.get('/patients/{id}', response_model=Patient)
def get_patient(id: int, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    patient = PatientRepository(db, hospital_id).get(id)
    if patient is None:
        raise not_found('Paciente')
    return patient


@app.post('/patients', status_code=201, response_model=Patient)
def create_patient(patient: Patient, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    return PatientRepository(db, hospital_id).create(patient)


@app.put('/patients/{id}', response_model=Patient)
def update_patient(id: int, patient: Patient, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    updated = PatientRepository(db, hospital_id).update(id, patient)
    if updated is None:
        raise not_found('Paciente')
    return updated


@app.delete('/patients/{id}')
def delete_patient(id: int, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    if PatientRepository(db, hospital_id).deactivate(id) is None:
        raise not_found('Paciente')
    return {'message': 'Paciente desativado'}


# ---------- PROFESSIONALS ----------

@app.get('/professionals', response_model=List[Professional])
def list_professionals(hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    return ProfessionalRepository(db, hospital_id).list_all()


@app.get('/professionals/{id}', response_model=Professional)
def get_professional(id: int, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    professional = ProfessionalRepository(db, hospital_id).get(id)
    if professional is None:
        raise not_found('Profissional')
    return professional


@app.post('/professionals', status_code=201, response_model=Professional)
def create_professional(professional: Professional, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    return ProfessionalRepository(db, hospital_id).create(professional)


@app.put('/professionals/{id}', response_model=Professional)
def update_professional(id: int, professional: Professional, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    updated = ProfessionalRepository(db, hospital_id).update(id, professional)
    if updated is None:
        raise not_found('Profissional')
    return updated


@app.delete('/professionals/{id}')
def delete_professional(id: int, hospital_id: int = Depends(current_hospital), db: Session = Depends(get_db)):
    if ProfessionalRepository(db, hospital_id).deactivate(id) is None:
        raise not_found('Profissional')
    return {'message': 'Profissional desativado'}
