from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from src.infra.sqlalchemy.models.models import LaudoFile


class LaudoFileRepository:
    def __init__(self, db: Session, hospital_id: int):
        self.db = db
        self.hospital_id = hospital_id

    def create(
        self,
        *,
        uploaded_by: int,
        original_filename: str,
        stored_path: str,
        content_type: Optional[str],
        size_bytes: int,
        file_hash: str,
        patient_id: Optional[int] = None,
        exam_id: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> LaudoFile:
        row = LaudoFile(
            hospital_id=self.hospital_id,
            uploaded_by=uploaded_by,
            patient_id=patient_id,
            exam_id=exam_id,
            original_filename=original_filename,
            stored_path=stored_path,
            content_type=content_type,
            size_bytes=size_bytes,
            file_hash=file_hash,
            notes=notes,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def get(self, laudo_id: int) -> Optional[LaudoFile]:
        return (
            self.db.query(LaudoFile)
            .filter(LaudoFile.id == laudo_id, LaudoFile.hospital_id == self.hospital_id)
            .first()
        )

    def list_all(self) -> List[LaudoFile]:
        return (
            self.db.query(LaudoFile)
            .filter(LaudoFile.hospital_id == self.hospital_id)
            .order_by(LaudoFile.id.desc())
            .all()
        )

    def apply_signature(self, row: LaudoFile, signed_by: int, signature: str) -> LaudoFile:
        row.signature = signature
        row.signed_by = signed_by
        row.signed_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(row)
        return row
