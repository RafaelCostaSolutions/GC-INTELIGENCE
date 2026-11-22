# GC Intelligence — API

## Multi-tenant (GC-5)

### Critério de aceite

**Um hospital não enxerga dado do outro.**

### Como funciona

1. **Todas as tabelas de negócio** têm `hospital_id`:
   - `users`, `patients`, `professionals`, `laudo_files`
2. O **tenant vem só do JWT** (`user.hospital_id` após o login).
3. `hospital_id` no **body da request é ignorado** (repositories sempre usam o do construtor).
4. Header `X-Hospital-Id` **não troca o tenant**; se for diferente do JWT → `403 FORBIDDEN`.
5. Repositories (`PatientRepository`, `ProfessionalRepository`, `LaudoFileRepository`) **filtram todas as queries** por `hospital_id`.

### Tabelas

| Tabela | `hospital_id` |
|--------|---------------|
| `hospitals` | — (é o próprio tenant) |
| `users` | sim |
| `patients` | sim |
| `professionals` | sim |
| `laudo_files` | sim |
| `refresh_tokens` / `password_reset_tokens` | via `user_id` → user.hospital_id |

### Testes de isolamento

```bash
python -m pytest tests/test_multitenant.py -v
```

Cobertura:
- Pacientes isolados entre hospitais A e B
- Profissionais isolados
- Laudos/arquivos isolados
- Header `X-Hospital-Id` forjado rejeitado
- Financeiro retorna só o `hospital_id` do token

### Rodar

```bash
git checkout feat/multi-tenant
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn src.server:app --reload
```
