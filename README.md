# GC Intelligence — API

REST API for GC, built in Python with FastAPI, SQLAlchemy and Alembic.

## Stack

- Python
- FastAPI (routes)
- SQLAlchemy (database access)
- Alembic (migrations)
- Pydantic (data validation)
- PostgreSQL on the server, SQLite for local development
- Uvicorn (runs the API)

## Structure

- `src/server.py`: API routes
- `src/errors.py`: errors as `{code, message}`
- `src/logs.py`: one log line per request
- `src/schema/schemas.py`: validation of the data that comes in and goes out
- `src/infra/sqlalchemy/config/settings.py`: reads `.env` (database address)
- `src/infra/sqlalchemy/config/database.py`: database connection
- `src/infra/sqlalchemy/models/models.py`: database tables
- `src/infra/sqlalchemy/repositories/`: database access (CRUD), one file per table
- `migrations/versions/`: database change history (Alembic)
- `tests/`: automated tests

## Tables (GC-2)

| Table | What it stores |
|---|---|
| `hospitals` | Hospitals and clinics using the system |
| `users` | People who log in (name, email, hashed password, role) |
| `professionals` | Doctors, nurses, technicians (council, registry number, state) |
| `patients` | Patients (personal data, health plan, guardian) |

## One hospital never sees another's data (GC-5)

Every table has a `hospital_id`, and every repository filters by it.
A `hospital_id` sent in the request body is ignored.

For now, the hospital comes from the `X-Hospital-Id` header, and the API checks that it exists.
After login (GC-3), it will come from the user's token.

## Errors and logs (GC-6)

Every error has the same shape:

    {"code": "NOT_FOUND", "message": "Paciente não encontrado"}

| code | When |
|---|---|
| `VALIDATION_ERROR` (422) | Missing field, wrong type, missing `X-Hospital-Id` |
| `NOT_FOUND` (404) | Record, hospital or route that does not exist |
| `CONFLICT` (409) | Duplicated data (e.g. same CPF in the same hospital) |
| `INTERNAL_ERROR` (500) | Unexpected failure: details go to the log, never to the user |

`message` is in Portuguese because it is shown to the system's users.

Each request writes one log line: `GET /patients -> 200 (8 ms)`.

## Routes

- `POST /hospitals`, `GET /hospitals`
- `GET /patients`, `GET /patients/{id}`, `POST /patients`, `PUT /patients/{id}`, `DELETE /patients/{id}`
- `GET /professionals`, `GET /professionals/{id}`, `POST /professionals`, `PUT /professionals/{id}`, `DELETE /professionals/{id}`

`DELETE` does not erase the record: it marks it as inactive, because health data must not disappear.

## Running

    python -m venv .venv
    .venv\Scripts\Activate.ps1          # Windows (Linux/Mac: source .venv/bin/activate)
    pip install -r requirements.txt
    copy .env.example .env               # Linux/Mac: cp .env.example .env
    alembic upgrade head                 # creates the tables
    uvicorn src.server:app --reload

Open http://127.0.0.1:8000/docs to try it.

## Migrations

- Apply all pending changes: `alembic upgrade head`
- Undo the last change: `alembic downgrade -1`
- After changing `models.py`, generate a new migration: `alembic revision --autogenerate -m "description"`

## Tests

    python -m pytest
