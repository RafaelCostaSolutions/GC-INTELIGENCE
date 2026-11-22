from fastapi.testclient import TestClient

from src.server import app

client = TestClient(app)


def _hospital(name: str) -> int:
    return client.post("/hospitals", json={"name": name}).json()["id"]


def _gestor_headers(hospital_id: int, email: str) -> dict:
    r = client.post(
        "/auth/register",
        json={
            "hospital_id": hospital_id,
            "name": "Gestor",
            "email": email,
            "password": "senha12345",
            "role": "gestor",
        },
    )
    assert r.status_code == 201, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_tables_and_hospital_isolation():
    a = _hospital("Hospital A")
    b = _hospital("Hospital B")
    HA = _gestor_headers(a, "gestor-a@teste.com")
    HB = _gestor_headers(b, "gestor-b@teste.com")

    r = client.post(
        "/patients",
        headers=HA,
        json={"name": "Maria", "cpf": "111", "birth_date": "1990-05-01", "hospital_id": b},
    )
    assert r.status_code == 201, r.text
    p = r.json()
    assert p["hospital_id"] == a

    assert client.get("/patients", headers=HB).json() == []
    assert client.get(f"/patients/{p['id']}", headers=HB).status_code == 404
    assert client.put(f"/patients/{p['id']}", headers=HB, json={"name": "Hack"}).status_code == 404
    assert client.delete(f"/patients/{p['id']}", headers=HB).status_code == 404

    assert len(client.get("/patients", headers=HA).json()) == 1
    r = client.put(f"/patients/{p['id']}", headers=HA, json={"name": "Maria Silva", "cpf": "111"})
    assert r.json()["name"] == "Maria Silva"
    assert client.delete(f"/patients/{p['id']}", headers=HA).json() == {"message": "Paciente desativado"}
    assert client.get("/patients", headers=HA).json() == []

    r = client.post(
        "/professionals",
        headers=HA,
        json={
            "name": "Dr. João",
            "kind": "medico",
            "council": "CRM",
            "registry_number": "12345",
            "registry_state": "DF",
        },
    )
    assert r.status_code == 201, r.text
    assert client.get("/professionals", headers=HB).json() == []
    assert len(client.get("/professionals", headers=HA).json()) == 1


def test_requires_auth_for_tenant_routes():
    # Sem JWT não há tenant
    r = client.get("/patients", headers={"X-Hospital-Id": "1"})
    assert r.status_code == 401
    assert r.json()["code"] == "UNAUTHORIZED"


def test_errors_use_standard_format():
    h = _hospital("Hospital C")
    H = _gestor_headers(h, "gestor-c@teste.com")

    r = client.get("/patients")  # no auth
    assert r.status_code == 401 and set(r.json()) == {"code", "message"}

    r = client.post("/patients", headers=H, json={})  # missing name
    assert r.status_code == 422 and r.json()["code"] == "VALIDATION_ERROR" and "name" in r.json()["message"]

    r = client.get("/patients/12345", headers=H)
    assert r.status_code == 404 and r.json() == {"code": "NOT_FOUND", "message": "Paciente não encontrado"}

    client.post("/patients", headers=H, json={"name": "Ana", "cpf": "222"})
    r = client.post("/patients", headers=H, json={"name": "Ana again", "cpf": "222"})
    assert r.status_code == 409 and r.json() == {
        "code": "CONFLICT",
        "message": "Já existe um registro com esses dados",
    }

    r = client.get("/route-that-does-not-exist")
    assert r.status_code == 404 and r.json() == {"code": "NOT_FOUND", "message": "Rota não encontrada"}


def test_unexpected_error_hides_details():
    @app.get("/_test_crash")
    def crash():
        raise RuntimeError("internal secret")

    r = TestClient(app, raise_server_exceptions=False).get("/_test_crash")
    assert r.status_code == 500
    assert r.json() == {"code": "INTERNAL_ERROR", "message": "Erro interno. Tente novamente mais tarde."}
