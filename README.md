# GC Intelligence — API

REST API for GC, built in Python with FastAPI, SQLAlchemy and Alembic.

## Stack

- Python + FastAPI + SQLAlchemy + Alembic
- JWT (access) + opaque refresh tokens
- bcrypt password hashing
- PostgreSQL on the server, SQLite for local development

## Auth (GC-3)

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Cria usuário e já devolve tokens |
| `/auth/login` | POST | Login com e-mail e senha |
| `/auth/refresh` | POST | Renova access token (rota o refresh) |
| `/auth/logout` | POST | Revoga o refresh token |
| `/auth/forgot-password` | POST | Gera token de recuperação |
| `/auth/reset-password` | POST | Define nova senha com o token |
| `/auth/me` | GET | Dados do usuário autenticado |

**Fluxo de tokens**

1. Login devolve `access_token` (JWT, expira em 15 min) + `refresh_token` (7 dias).
2. Quando o access expira, o client chama `/auth/refresh` com o refresh token.
3. O refresh antigo é **revogado** e um novo par é emitido (rotação).
4. Logout revoga o refresh atual.

**Recuperação de senha**

1. `POST /auth/forgot-password` com `{ "email": "..." }`.
2. Em dev (`AUTH_DEBUG=true`) a resposta inclui `reset_token`.
3. Em produção o token seria enviado por e-mail (não expor no JSON).
4. `POST /auth/reset-password` com `{ "token", "new_password" }`.

**Hospital no token**

Depois do login, o `hospital_id` vem do JWT. O header `X-Hospital-Id` continua aceito por compatibilidade.

## Structure

- `src/server.py` — routes
- `src/auth/` — security, deps, service (GC-3)
- `src/errors.py` — `{code, message}`
- `src/schema/schemas.py` — Pydantic models
- `src/infra/sqlalchemy/` — DB config, models, repositories
- `migrations/versions/` — Alembic
- `tests/` — pytest

## Tables

| Table | Purpose |
|---|---|
| `hospitals` | Clínicas/hospitais |
| `users` | Login (e-mail, password_hash, role) |
| `refresh_tokens` | Refresh tokens (hash, expiração, revoked) |
| `password_reset_tokens` | Tokens de recuperação |
| `professionals` | Médicos, enfermeiros... |
| `patients` | Pacientes |

## Running

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
alembic upgrade head
uvicorn src.server:app --reload
```

Open http://127.0.0.1:8000/docs

## Tests

```bash
python -m pytest
```

Acceptance (GC-3):

- `test_login_works`
- `test_access_token_expires_and_refresh_renews`
- `test_forgot_and_reset_password`
