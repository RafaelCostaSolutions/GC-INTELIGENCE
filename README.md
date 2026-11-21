# GC Intelligence — API

REST API for GC, built in Python with FastAPI, SQLAlchemy and Alembic.

## Stack

- Python + FastAPI + SQLAlchemy + Alembic
- JWT (access) + opaque refresh tokens
- RBAC (roles + permissions)
- bcrypt password hashing

## Auth (GC-3)

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Cria usuário e devolve tokens |
| `/auth/login` | POST | Login |
| `/auth/refresh` | POST | Renova access (rota o refresh) |
| `/auth/logout` | POST | Revoga refresh |
| `/auth/forgot-password` | POST | Token de recuperação |
| `/auth/reset-password` | POST | Nova senha |
| `/auth/me` | GET | Usuário autenticado |

## RBAC (GC-4)

### Papéis

`admin` · `gestor` · `medico` · `enfermeiro` · `recepcionista` · `tecnico_lab`

### Critérios de aceite

| Regra | Resultado |
|---|---|
| Médico acessa `/finance/summary` | **403 FORBIDDEN** |
| Recepcionista assina `/laudos/sign` | **403 FORBIDDEN** |
| Gestor acessa financeiro | **200** |
| Médico assina laudo | **200** |

### Matriz resumida

| Permissão | admin | gestor | medico | enfermeiro | recepcionista | tecnico_lab |
|---|---|---|---|---|---|---|
| finance:read/write | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| laudo:sign | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| laudo:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| patients:read/write | ✓ | ✓ | ✓ | ✓ | ✓ | read |
| professionals:write | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| users:manage | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |

Definição completa em `src/auth/rbac.py`.

### Rotas protegidas de exemplo

- `GET /finance/summary` → exige `finance:read`
- `POST /laudos/sign` → exige `laudo:sign`
- CRUD de pacientes/profissionais → `patients:*` / `professionals:*`

Uso em novas rotas:

```python
from src.auth.rbac import Permission, require_permission

@app.get("/finance/summary")
def summary(user=Depends(require_permission(Permission.FINANCE_READ.value))):
    ...
```

## Running

```bash
git checkout feat/rbac
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn src.server:app --reload
```

http://127.0.0.1:8000/docs

## Tests

```bash
python -m pytest tests/test_rbac.py tests/test_auth.py -v
```
