# GC Intelligence — API

## Multi-tenant (GC-5)

### Critério de aceite

**Um hospital não enxerga dado do outro.**

### Camadas de isolamento

1. O tenant da requisição vem do usuário autenticado (JWT), nunca do body.
2. Os repositories filtram consultas por hospital_id.
3. Em PostgreSQL, Row-Level Security (RLS) aplica o isolamento diretamente no banco nas tabelas patients, professionals e laudo_files.
4. O backend define app.current_hospital_id a partir do usuário autenticado. A configuração é limpa antes de devolver a conexão ao pool.
5. Sem contexto de tenant, as políticas não retornam registros e não permitem inserir/alterar linhas tenant-scoped.
6. X-Hospital-Id não troca o tenant; se divergir do JWT, a API responde 403 FORBIDDEN.

### Tabelas

| Tabela | Isolamento |
|--------|------------|
| hospitals | cadastro central de tenants; sem política RLS |
| patients | filtro da aplicação + RLS no PostgreSQL |
| professionals | filtro da aplicação + RLS no PostgreSQL |
| laudo_files | filtro da aplicação + RLS no PostgreSQL |
| users, refresh_tokens, password_reset_tokens | fluxo de identidade/autenticação; não cobertos por esta migration RLS |

> **Produção:** use um usuário PostgreSQL exclusivo para a aplicação, sem privilégios de superuser e sem atributo BYPASSRLS. A migration deve ser executada por um usuário com privilégios de DDL. FORCE ROW LEVEL SECURITY sujeita também o proprietário da tabela às políticas, mas superusers e roles com BYPASSRLS continuam podendo ignorá-las.

### Migration RLS

A migration 0004_postgres_rls.py habilita RLS e cria políticas USING + WITH CHECK nas três tabelas clínicas. Ela não executa comandos RLS em SQLite, que continua sendo usado no desenvolvimento local.

```bash
alembic upgrade head
```

O backend define o contexto por conexão usando set_config('app.current_hospital_id', ..., false). O contexto persiste durante os commits internos da requisição e é removido no encerramento da sessão para evitar vazamento entre conexões do pool.

### Testes

Testes da camada de aplicação:

```bash
python -m pytest tests/test_multitenant.py -v
```

Teste de integração PostgreSQL (usa uma tabela de teste em um banco descartável):

```bash
export GC_RLS_TEST_DATABASE_URL='postgresql+psycopg://user:password@localhost:5432/gc_test'
python -m pytest tests/test_rls_postgres.py -v
```

O teste de integração verifica isolamento de leitura entre tenants, rejeição de escrita cruzada e ausência de contexto. SQLite não implementa RLS e, por isso, não valida essa camada.

### Rodar a API

```bash
git checkout feat/multi-tenant
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn src.server:app --reload
```
