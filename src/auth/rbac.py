"""GC-4: Role-Based Access Control.

Roles: admin, gestor, medico, enfermeiro, recepcionista, tecnico_lab

Acceptance:
- medico  → no finance:*
- recepcionista → no laudo:sign
"""
from enum import Enum
from typing import Callable, Set

from fastapi import Depends

from src.auth.deps import get_current_user
from src.errors import ApiError
from src.infra.sqlalchemy.models.models import User


class Role(str, Enum):
    ADMIN = "admin"
    GESTOR = "gestor"
    MEDICO = "medico"
    ENFERMEIRO = "enfermeiro"
    RECEPCIONISTA = "recepcionista"
    TECNICO_LAB = "tecnico_lab"


ALL_ROLES: Set[str] = {r.value for r in Role}


class Permission(str, Enum):
    FINANCE_READ = "finance:read"
    FINANCE_WRITE = "finance:write"
    LAUDO_READ = "laudo:read"
    LAUDO_SIGN = "laudo:sign"
    LAB_READ = "lab:read"
    LAB_WRITE = "lab:write"
    PATIENTS_READ = "patients:read"
    PATIENTS_WRITE = "patients:write"
    PROFESSIONALS_READ = "professionals:read"
    PROFESSIONALS_WRITE = "professionals:write"
    USERS_MANAGE = "users:manage"
    REPORTS_READ = "reports:read"


ROLE_PERMISSIONS: dict[str, Set[str]] = {
    Role.ADMIN: {p.value for p in Permission},

    Role.GESTOR: {
        Permission.FINANCE_READ.value,
        Permission.FINANCE_WRITE.value,
        Permission.LAUDO_READ.value,
        Permission.LAB_READ.value,
        Permission.LAB_WRITE.value,  # can upload files
        Permission.PATIENTS_READ.value,
        Permission.PATIENTS_WRITE.value,
        Permission.PROFESSIONALS_READ.value,
        Permission.PROFESSIONALS_WRITE.value,
        Permission.USERS_MANAGE.value,
        Permission.REPORTS_READ.value,
    },

    Role.MEDICO: {
        Permission.LAUDO_READ.value,
        Permission.LAUDO_SIGN.value,
        Permission.LAB_READ.value,
        Permission.LAB_WRITE.value,  # can upload laudos
        Permission.PATIENTS_READ.value,
        Permission.PATIENTS_WRITE.value,
        Permission.PROFESSIONALS_READ.value,
        Permission.REPORTS_READ.value,
    },

    Role.ENFERMEIRO: {
        Permission.LAUDO_READ.value,
        Permission.LAB_READ.value,
        Permission.PATIENTS_READ.value,
        Permission.PATIENTS_WRITE.value,
        Permission.PROFESSIONALS_READ.value,
        Permission.REPORTS_READ.value,
    },

    Role.RECEPCIONISTA: {
        Permission.LAUDO_READ.value,
        Permission.PATIENTS_READ.value,
        Permission.PATIENTS_WRITE.value,
        Permission.PROFESSIONALS_READ.value,
        Permission.REPORTS_READ.value,
    },

    Role.TECNICO_LAB: {
        Permission.LAUDO_READ.value,
        Permission.LAB_READ.value,
        Permission.LAB_WRITE.value,
        Permission.PATIENTS_READ.value,
        Permission.PROFESSIONALS_READ.value,
    },
}


def permissions_for(role: str) -> Set[str]:
    return ROLE_PERMISSIONS.get(role, set())


def has_permission(role: str, permission: str) -> bool:
    return permission in permissions_for(role)


def is_valid_role(role: str) -> bool:
    return role in ALL_ROLES


def require_permission(*needed: str) -> Callable:
    def _checker(user: User = Depends(get_current_user)) -> User:
        allowed = permissions_for(user.role)
        missing = [p for p in needed if p not in allowed]
        if missing:
            raise ApiError(
                403,
                "FORBIDDEN",
                f"Seu perfil ({user.role}) não tem permissão para esta ação",
            )
        return user

    return _checker


def require_roles(*roles: str) -> Callable:
    allowed = set(roles)

    def _checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed:
            raise ApiError(
                403,
                "FORBIDDEN",
                f"Seu perfil ({user.role}) não tem permissão para esta ação",
            )
        return user

    return _checker
