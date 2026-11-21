"""GC-4 RBAC acceptance tests.

- Médico does not access finance
- Recepcionista does not sign laudos
"""
from fastapi.testclient import TestClient

from src.server import app

client = TestClient(app)


def _hospital(name: str) -> int:
    return client.post("/hospitals", json={"name": name}).json()["id"]


def _register(hospital_id: int, email: str, role: str, password: str = "senha12345") -> dict:
    r = client.post(
        "/auth/register",
        json={
            "hospital_id": hospital_id,
            "name": role.title(),
            "email": email,
            "password": password,
            "role": role,
        },
    )
    assert r.status_code == 201, r.text
    return r.json()


def _auth(tokens: dict) -> dict:
    return {"Authorization": f"Bearer {tokens['access_token']}"}


def test_medico_cannot_access_finance():
    h = _hospital("H Medico Finance")
    medico = _register(h, "medico@teste.com", "medico")
    gestor = _register(h, "gestor-fin@teste.com", "gestor")

    # Médico is blocked
    r = client.get("/finance/summary", headers=_auth(medico))
    assert r.status_code == 403, r.text
    assert r.json()["code"] == "FORBIDDEN"
    assert "medico" in r.json()["message"]

    # Gestor is allowed
    r = client.get("/finance/summary", headers=_auth(gestor))
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["hospital_id"] == h
    assert "receita_mes" in body


def test_recepcionista_cannot_sign_laudo():
    h = _hospital("H Recep Laudo")
    recep = _register(h, "recep@teste.com", "recepcionista")
    medico = _register(h, "medico-laudo@teste.com", "medico")

    payload = {"exam_id": "EX-001", "conclusion": "Sem alterações"}

    # Recepcionista is blocked
    r = client.post("/laudos/sign", headers=_auth(recep), json=payload)
    assert r.status_code == 403, r.text
    assert r.json()["code"] == "FORBIDDEN"
    assert "recepcionista" in r.json()["message"]

    # Médico can sign
    r = client.post("/laudos/sign", headers=_auth(medico), json=payload)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["exam_id"] == "EX-001"
    assert body["role"] == "medico"
    assert body["message"] == "Laudo assinado com sucesso"


def test_invalid_role_on_register():
    h = _hospital("H Role")
    r = client.post(
        "/auth/register",
        json={
            "hospital_id": h,
            "name": "X",
            "email": "x@teste.com",
            "password": "senha12345",
            "role": "superuser",
        },
    )
    assert r.status_code == 422
    assert r.json()["code"] == "VALIDATION_ERROR"


def test_admin_has_all_critical_permissions():
    h = _hospital("H Admin")
    admin = _register(h, "admin@teste.com", "admin")

    assert client.get("/finance/summary", headers=_auth(admin)).status_code == 200
    r = client.post(
        "/laudos/sign",
        headers=_auth(admin),
        json={"exam_id": "EX-ADM", "conclusion": "OK"},
    )
    assert r.status_code == 200
