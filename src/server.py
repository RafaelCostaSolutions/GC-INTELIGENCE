from typing import List, Optional

from fastapi import Depends, FastAPI, File, Form, UploadFile
from sqlalchemy.orm import Session

from src.auth import service as auth_service
from src.auth.deps import current_hospital, get_current_user
from src.auth.rbac import Permission, require_permission
from src.errors import ApiError, not_found, register_error_handlers
from src.infra.sqlalchemy.config.database import get_db
from src.infra.sqlalchemy.models.models import User
from src.infra.sqlalchemy.repositories.hospital import HospitalRepository
from src.infra.sqlalchemy.repositories.laudo import LaudoFileRepository
from src.infra.sqlalchemy.repositories.patient import PatientRepository
from src.infra.sqlalchemy.repositories.professional import ProfessionalRepository
from src.logs import setup_logging
from src.schema.schemas import (
    FinanceSummary,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    Hospital,
    LaudoFileOut,
    LaudoSignRequest,
    LaudoSignResponse,
    LaudoVerifyResponse,
    LoginRequest,
    Patient,
    Professional,
    RefreshRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserOut,
)
from src.services import storage

app = FastAPI(title="GC Intelligence API")
setup_logging(app)
register_error_handlers(app)


# ---------- AUTH (GC-3) ----------

@app.post("/auth/register", status_code=201, response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register_user(
        db,
        hospital_id=body.hospital_id,
        name=body.name,
        email=body.email,
        password=body.password,
        role=body.role,
    )


@app.post("/auth/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(db, body.email, body.password)


@app.post("/auth/refresh", response_model=TokenResponse)
def refresh_token(body: RefreshRequest, db: Session = Depends(get_db)):
    return auth_service.refresh(db, body.refresh_token)


@app.post("/auth/logout")
def logout(body: RefreshRequest, db: Session = Depends(get_db)):
    auth_service.logout(db, body.refresh_token)
    return {"message": "Sessão encerrada"}


@app.post("/auth/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.forgot_password(db, body.email)


@app.post("/auth/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    auth_service.reset_password(db, body.token, body.new_password)
    return {"message": "Senha alterada com sucesso"}


@app.get("/auth/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


# ---------- FINANCE (GC-4) ----------

@app.get("/finance/summary", response_model=FinanceSummary)
def finance_summary(
    hospital_id: int = Depends(current_hospital),
    user: User = Depends(require_permission(Permission.FINANCE_READ.value)),
):
    return FinanceSummary(
        hospital_id=hospital_id,
        receita_mes=185_420.50,
        despesa_mes=112_300.00,
        margem=round(185_420.50 - 112_300.00, 2),
    )


# ---------- LAUDOS: text sign (GC-4) ----------

@app.post("/laudos/sign", response_model=LaudoSignResponse)
def sign_laudo(
    body: LaudoSignRequest,
    user: User = Depends(require_permission(Permission.LAUDO_SIGN.value)),
):
    return LaudoSignResponse(
        exam_id=body.exam_id,
        signed_by=user.name,
        role=user.role,
        conclusion=body.conclusion,
        message="Laudo assinado com sucesso",
    )


# ---------- LAUDOS: upload + hash + digital signature (base) ----------

@app.post("/laudos/upload", status_code=201, response_model=LaudoFileOut)
async def upload_laudo(
    file: UploadFile = File(...),
    exam_id: Optional[str] = Form(None),
    patient_id: Optional[int] = Form(None),
    notes: Optional[str] = Form(None),
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.LAB_WRITE.value)),
):
    data = await file.read()
    try:
        stored_path, file_hash, size_bytes = storage.save_upload(
            data, file.filename or "laudo.bin", hospital_id
        )
    except ValueError as exc:
        code = str(exc)
        if code == "empty":
            raise ApiError(400, "BAD_REQUEST", "Arquivo vazio")
        if code == "too_large":
            raise ApiError(400, "BAD_REQUEST", "Arquivo excede o tamanho máximo permitido")
        raise ApiError(400, "BAD_REQUEST", "Falha ao salvar o arquivo")

    row = LaudoFileRepository(db, hospital_id).create(
        uploaded_by=user.id,
        original_filename=file.filename or "laudo.bin",
        stored_path=stored_path,
        content_type=file.content_type,
        size_bytes=size_bytes,
        file_hash=file_hash,
        patient_id=patient_id,
        exam_id=exam_id,
        notes=notes,
    )
    return row


@app.get("/laudos/files", response_model=List[LaudoFileOut])
def list_laudo_files(
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.LAUDO_READ.value)),
):
    return LaudoFileRepository(db, hospital_id).list_all()


@app.get("/laudos/files/{laudo_id}", response_model=LaudoFileOut)
def get_laudo_file(
    laudo_id: int,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.LAUDO_READ.value)),
):
    row = LaudoFileRepository(db, hospital_id).get(laudo_id)
    if row is None:
        raise not_found("Laudo")
    return row


@app.post("/laudos/files/{laudo_id}/sign", response_model=LaudoFileOut)
def sign_laudo_file(
    laudo_id: int,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.LAUDO_SIGN.value)),
):
    repo = LaudoFileRepository(db, hospital_id)
    row = repo.get(laudo_id)
    if row is None:
        raise not_found("Laudo")
    if row.signature:
        raise ApiError(409, "CONFLICT", "Este laudo já foi assinado")

    signature = storage.sign_hash(row.file_hash, user.id)
    return repo.apply_signature(row, user.id, signature)


@app.get("/laudos/files/{laudo_id}/verify", response_model=LaudoVerifyResponse)
def verify_laudo_file(
    laudo_id: int,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.LAUDO_READ.value)),
):
    row = LaudoFileRepository(db, hospital_id).get(laudo_id)
    if row is None:
        raise not_found("Laudo")

    try:
        current_hash = storage.read_and_hash(row.stored_path)
    except FileNotFoundError:
        return LaudoVerifyResponse(
            id=row.id,
            file_hash=row.file_hash,
            hash_matches_file=False,
            is_signed=bool(row.signature),
            signature_valid=None,
            message="Arquivo não encontrado no disco",
        )

    hash_ok = current_hash == row.file_hash
    sig_ok = None
    if row.signature and row.signed_by:
        sig_ok = storage.verify_signature(row.file_hash, row.signed_by, row.signature)

    if hash_ok and (sig_ok is True or sig_ok is None):
        message = "Integridade OK" + (" e assinatura válida" if sig_ok else "")
    elif not hash_ok:
        message = "Hash não confere — arquivo pode ter sido alterado"
    else:
        message = "Assinatura inválida"

    return LaudoVerifyResponse(
        id=row.id,
        file_hash=row.file_hash,
        hash_matches_file=hash_ok,
        is_signed=bool(row.signature),
        signature_valid=sig_ok,
        message=message,
    )


# ---------- HOSPITALS ----------

@app.post("/hospitals", status_code=201, response_model=Hospital)
def create_hospital(hospital: Hospital, db: Session = Depends(get_db)):
    return HospitalRepository(db).create(hospital)


@app.get("/hospitals", response_model=List[Hospital])
def list_hospitals(db: Session = Depends(get_db)):
    return HospitalRepository(db).list_all()


# ---------- PATIENTS ----------

@app.get("/patients", response_model=List[Patient])
def list_patients(
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PATIENTS_READ.value)),
):
    return PatientRepository(db, hospital_id).list_all()


@app.get("/patients/{id}", response_model=Patient)
def get_patient(
    id: int,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PATIENTS_READ.value)),
):
    patient = PatientRepository(db, hospital_id).get(id)
    if patient is None:
        raise not_found("Paciente")
    return patient


@app.post("/patients", status_code=201, response_model=Patient)
def create_patient(
    patient: Patient,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PATIENTS_WRITE.value)),
):
    return PatientRepository(db, hospital_id).create(patient)


@app.put("/patients/{id}", response_model=Patient)
def update_patient(
    id: int,
    patient: Patient,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PATIENTS_WRITE.value)),
):
    updated = PatientRepository(db, hospital_id).update(id, patient)
    if updated is None:
        raise not_found("Paciente")
    return updated


@app.delete("/patients/{id}")
def delete_patient(
    id: int,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PATIENTS_WRITE.value)),
):
    if PatientRepository(db, hospital_id).deactivate(id) is None:
        raise not_found("Paciente")
    return {"message": "Paciente desativado"}


# ---------- PROFESSIONALS ----------

@app.get("/professionals", response_model=List[Professional])
def list_professionals(
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PROFESSIONALS_READ.value)),
):
    return ProfessionalRepository(db, hospital_id).list_all()


@app.get("/professionals/{id}", response_model=Professional)
def get_professional(
    id: int,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PROFESSIONALS_READ.value)),
):
    professional = ProfessionalRepository(db, hospital_id).get(id)
    if professional is None:
        raise not_found("Profissional")
    return professional


@app.post("/professionals", status_code=201, response_model=Professional)
def create_professional(
    professional: Professional,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PROFESSIONALS_WRITE.value)),
):
    return ProfessionalRepository(db, hospital_id).create(professional)


@app.put("/professionals/{id}", response_model=Professional)
def update_professional(
    id: int,
    professional: Professional,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PROFESSIONALS_WRITE.value)),
):
    updated = ProfessionalRepository(db, hospital_id).update(id, professional)
    if updated is None:
        raise not_found("Profissional")
    return updated


@app.delete("/professionals/{id}")
def delete_professional(
    id: int,
    hospital_id: int = Depends(current_hospital),
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(Permission.PROFESSIONALS_WRITE.value)),
):
    if ProfessionalRepository(db, hospital_id).deactivate(id) is None:
        raise not_found("Profissional")
    return {"message": "Profissional desativado"}
