# GC Intelligence · GottCured

Dashboard inteligente de gestão clínica e laboratorial com:

- Previsão de demanda e absenteísmo
- Alertas preditivos de equipamentos e processos
- Visão por setores (Clínica e Laboratório)
- Simulações e insights operacionais

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (ícones)
- Recharts (gráficos)
- Vercel (deploy)

## Setup rápido (importante)

O arquivo principal `App.tsx` (~1.1 MB) e as imagens ainda estão no arquivo `Gottcured+Home+Limpa.tar.gz` (mantido temporariamente).

Extraia-os assim:

```bash
# Na raiz do repositório
tar -xzf Gottcured+Home+Limpa.tar.gz

# Mova para a estrutura correta
mkdir -p src/assets
mv App.tsx src/
mv assets/* src/assets/

# Corrija o import do logo (se ainda tiver o caminho antigo)
# Abra src/App.tsx e troque a linha do logoUrl para:
# import logoUrl from "./assets/55d9576ebcfb89df-gottcured_logo_transparente.png";
```

Depois:

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

## Scripts

| Comando            | Descrição                    |
|--------------------|------------------------------|
| `npm run dev`      | Servidor de desenvolvimento  |
| `npm run build`    | Typecheck + build de produção|
| `npm run preview`  | Preview do build             |
| `npm run typecheck`| Apenas verificação de tipos  |

## CI/CD

### GitHub Actions (Build)

- `.github/workflows/ci.yml` → typecheck + build em todo push/PR para `main`
- Acompanhe: https://github.com/RafaelCostaSolutions/GC-INTELIGENCE/actions

### Vercel (Deploy)

Já está preparado para Vercel:

1. **`vercel.json`** — configuração SPA (Vite + rewrites)
2. **`.github/workflows/deploy.yml`** — deploy automático via Actions (opcional)

#### Forma recomendada (mais simples)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New Project** → importe este repositório
3. Framework Preset: **Vite** (ou deixe o `vercel.json` detectar)
4. Root Directory: `./`
5. Clique em **Deploy**

A partir daí todo push na `main` gera um deploy automático no Vercel.

#### Forma avançada (via GitHub Actions)

Se preferir controlar o deploy pelo Actions:

1. No Vercel → Project Settings → General → copie:
   - **Project ID**
   - **Org / Team ID**
2. Crie um token em [vercel.com/account/tokens](https://vercel.com/account/tokens)
3. No GitHub do repositório → **Settings → Secrets and variables → Actions** adicione:

| Secret             | Valor              |
|--------------------|--------------------|
| `VERCEL_TOKEN`     | Token gerado       |
| `VERCEL_ORG_ID`    | ID da organização  |
| `VERCEL_PROJECT_ID`| ID do projeto     |

Depois disso o workflow `Deploy to Vercel` passa a publicar automaticamente.

## Estrutura

```
.
├── .github/workflows/
│   ├── ci.yml          # Build + typecheck
│   └── deploy.yml      # Deploy Vercel (opcional)
├── vercel.json         # Configuração Vercel
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── assets/
```

---

## Back-end — API (Python)

REST API for GC, built in Python with FastAPI, SQLAlchemy and Alembic.

### Stack

- Python
- FastAPI (routes)
- SQLAlchemy (database access)
- Alembic (migrations)
- Pydantic (data validation)
- PostgreSQL on the server, SQLite for local development
- Uvicorn (runs the API)

### Structure

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

### Tables (GC-2)

| Table | What it stores |
|---|---|
| `hospitals` | Hospitals and clinics using the system |
| `users` | People who log in (name, email, hashed password, role) |
| `professionals` | Doctors, nurses, technicians (council, registry number, state) |
| `patients` | Patients (personal data, health plan, guardian) |

### One hospital never sees another's data (GC-5)

Every table has a `hospital_id`, and every repository filters by it.
A `hospital_id` sent in the request body is ignored.

For now, the hospital comes from the `X-Hospital-Id` header, and the API checks that it exists.
After login (GC-3), it will come from the user's token.

### Errors and logs (GC-6)

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

### Routes

- `POST /hospitals`, `GET /hospitals`
- `GET /patients`, `GET /patients/{id}`, `POST /patients`, `PUT /patients/{id}`, `DELETE /patients/{id}`
- `GET /professionals`, `GET /professionals/{id}`, `POST /professionals`, `PUT /professionals/{id}`, `DELETE /professionals/{id}`

`DELETE` does not erase the record: it marks it as inactive, because health data must not disappear.

### Running

    python -m venv .venv
    .venv\Scripts\Activate.ps1          # Windows (Linux/Mac: source .venv/bin/activate)
    pip install -r requirements.txt
    copy .env.example .env               # Linux/Mac: cp .env.example .env
    alembic upgrade head                 # creates the tables
    uvicorn src.server:app --reload

Open http://127.0.0.1:8000/docs to try it.

### Migrations

- Apply all pending changes: `alembic upgrade head`
- Undo the last change: `alembic downgrade -1`
- After changing `models.py`, generate a new migration: `alembic revision --autogenerate -m "description"`

### Tests

    python -m pytest                     # all tests
    python -m pytest tests/unit          # isolated tests (repositories, tables, migrations)
    python -m pytest tests/integration   # API tests

Each test runs on its own temporary database, so `gc_dev.db` is never changed.

### Database model

See [docs/database.md](docs/database.md).
