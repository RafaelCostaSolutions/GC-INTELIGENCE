"""Base helpers for multi-tenant repositories (GC-5).

Every tenant-scoped repository receives hospital_id in the constructor and
MUST filter every query by it. hospital_id from the request body is never trusted.
"""
from typing import Generic, Type, TypeVar

from sqlalchemy.orm import Session

ModelT = TypeVar("ModelT")


class TenantRepository(Generic[ModelT]):
    """Minimal base: holds db + hospital_id and a scoped query helper."""

    model: Type[ModelT]

    def __init__(self, db: Session, hospital_id: int):
        self.db = db
        self.hospital_id = hospital_id

    def scoped(self):
        """Query already filtered by this hospital."""
        return self.db.query(self.model).filter(self.model.hospital_id == self.hospital_id)  # type: ignore[attr-defined]
