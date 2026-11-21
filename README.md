# GC Intelligence — API

## Upload de laudo + assinatura digital (base)

### Critério de aceite

- **Upload de laudo funciona**
- **Hash SHA-256 é salvo** no banco (`file_hash`)

### Endpoints

| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| `POST` | `/laudos/upload` | `lab:write` | Multipart upload; grava arquivo + hash |
| `GET` | `/laudos/files` | `laudo:read` | Lista laudos do hospital |
| `GET` | `/laudos/files/{id}` | `laudo:read` | Detalhe (inclui `file_hash`) |
| `POST` | `/laudos/files/{id}/sign` | `laudo:sign` | Assinatura HMAC do hash |
| `GET` | `/laudos/files/{id}/verify` | `laudo:read` | Confere hash no disco + assinatura |

### O que é salvo

```json
{
  "id": 1,
  "original_filename": "hemograma.pdf",
  "size_bytes": 20480,
  "file_hash": "a3f2...sha256...",
  "signature": null,
  "signed_by": null
}
```

- Arquivo físico em `UPLOAD_DIR` (padrão `./uploads`)
- `file_hash` = SHA-256 dos bytes do arquivo
- Assinatura base = HMAC-SHA256(`file_hash:user_id`, `SIGNING_KEY`)

### Exemplo

```bash
# 1. Login / register e pegue o access_token

# 2. Upload
curl -X POST http://127.0.0.1:8000/laudos/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./laudo.pdf" \
  -F "exam_id=EX-001"

# 3. Verificar integridade
curl http://127.0.0.1:8000/laudos/files/1/verify \
  -H "Authorization: Bearer $TOKEN"
```

### Rodar

```bash
git checkout feat/upload-laudo
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn src.server:app --reload
python -m pytest tests/test_upload_laudo.py -v
```

Docs: http://127.0.0.1:8000/docs
