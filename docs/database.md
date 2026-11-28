# Database model (GC-22)

Every record belongs to one hospital (`hospital_id`). A hospital never sees another hospital's data.

## Entity-relationship diagram

```mermaid
erDiagram
    hospitals ||--o{ users : "has"
    hospitals ||--o{ professionals : "has"
    hospitals ||--o{ patients : "has"
    users |o--o| professionals : "may log in as"

    hospitals {
        int id PK
        string name
        string cnpj UK
        datetime created_at
    }
    users {
        int id PK
        int hospital_id FK
        string name
        string email UK
        string password_hash
        string role
        bool active
        datetime created_at
    }
    professionals {
        int id PK
        int hospital_id FK
        int user_id FK "optional"
        string name
        string kind
        string council
        string registry_number
        string registry_state
        string specialty
        string phone
        string email
        bool active
        datetime created_at
    }
    patients {
        int id PK
        int hospital_id FK
        string name
        string cpf
        date birth_date
        string sex
        string phone
        string email
        string address
        string insurance
        string insurance_card
        string guardian_name
        string guardian_phone
        bool active
        datetime created_at
        datetime updated_at
    }
```

## Rules

| Rule | Where |
|---|---|
| Same CPF only once per hospital | `uq_patient_cpf_per_hospital` |
| Same professional registry (council + number + state) only once per hospital | `uq_professional_registry` |
| CNPJ and user email are unique in the whole system | `unique=True` |
| Records are never deleted, only deactivated (`active = false`) | repositories |

## Tests

| Folder | What it tests | Command |
|---|---|---|
| `tests/unit` | Repositories, table rules and migrations, without the API | `python -m pytest tests/unit` |
| `tests/integration` | The API end to end (routes, hospital isolation, errors) | `python -m pytest tests/integration` |

Each test runs on its own temporary SQLite database, so the tests never change `gc_dev.db`.
