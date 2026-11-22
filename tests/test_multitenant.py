"""GC-5 Multi-tenant acceptance tests.

Criterion: one hospital never sees another hospital's data.
"""
from hashlib import sha256

from fastapi.testclient import TestClient

from src.server import app

client = TestClient(app)


def _hospital(name: str) -> int:
    return client.post("/hospitals", json={"name": name}).json()["id"]


def _user(hospital_id: int, email: str, role: str = "gestor") -> dict:
    r = client.post(
        "/auth/register",
        json={
            "hospital_id": hospital_id,
            "name": role,
            "email": email,
            "password": "senha12345",
            "role": role,
        },
    )
    assert r.status_code == 201, r.text
    body = r.json()
    return {
        "headers": {"Authorization": f"Bearer {body['access_token']}"},
        "user": body["user"],
        "token": body["access_token"],
    }


def test_patient_isolation_between_hospitals():
    a, b = _hospital("Clinic A"), _hospital("Clinic B")
    ua, ub = _user(a, "a@mt.com"), _user(b, "b@mt.com")

    # A creates a patient; tries to force hospital_id=B in the body (must be ignored)
    r = client.post(
        "/patients",
        headers=ua["headers"],
        json={"name": "Só da A", "cpf": "100", "hospital_id": b},
    )
    assert r.status_code == 201, r.text
    patient = r.json()
    assert patient["hospital_id"] == a

    # B sees nothing / cannot touch A's patient
    assert client.get("/patients", headers=ub["headers"]).json() == []
    assert client.get(f"/patients/{patient['id']}", headers=ub["headers"]).status_code == 404
    assert client.put(
        f"/patients/{patient['id']}",
        headers=ub["headers"],
        json={"name": "Hack"},
    ).status_code == 404
    assert client.delete(f"/patients/{patient['id']}", headers=ub["headers"]).status_code == 404

    # A still sees it
    listed = client.get("/patients", headers=ua["headers"]).json()
    assert len(listed) == 1 and listed[0]["id"] == patient["id"]


def test_professional_isolation():
    a, b = _hospital("Clinic PA"), _hospital("Clinic PB")
    ua, ub = _user(a, "pa@mt.com"), _user(b, "pb@mt.com")

    r = client.post(
        "/professionals",
        headers=ua["headers"],
        json={"name": "Dr A", "kind": "medico", "council": "CRM", "registry_number": "1", "registry_state": "SP"},
    )
    assert r.status_code == 201, r.text
    prof_id = r.json()["id"]

    assert client.get("/professionals", headers=ub["headers"]).json() == []
    assert client.get(f"/professionals/{prof_id}", headers=ub["headers"]).status_code == 404


def test_laudo_file_isolation():
    a, b = _hospital("Clinic LA"), _hospital("Clinic LB")
    # tecnico_lab can upload
    ua = _user(a, "lab-a@mt.com", role="tecnico_lab")
    ub = _user(b, "lab-b@mt.com", role="tecnico_lab")

    content = b"laudo confidencial hospital A"
    r = client.post(
        "/laudos/upload",
        headers=ua["headers"],
        files={"file": ("a.txt", content, "text/plain")},
        data={"exam_id": "EX-A"},
    )
    assert r.status_code == 201, r.text
    laudo = r.json()
    assert laudo["hospital_id"] == a
    assert laudo["file_hash"] == sha256(content).hexdigest()

    # B cannot list or open A's laudo
    assert client.get("/laudos/files", headers=ub["headers"]).json() == []
    assert client.get(f"/laudos/files/{laudo['id']}", headers=ub["headers"]).status_code == 404
    assert client.get(f"/laudos/files/{laudo['id']}/verify", headers=ub["headers"]).status_code == 404

    # A can
    assert len(client.get("/laudos/files", headers=ua["headers"]).json()) == 1


def test_forged_x_hospital_id_header_is_rejected():
    a, b = _hospital("Clinic HA"), _hospital("Clinic HB")
    ua = _user(a, "forge@mt.com")

    # User of A tries to pass X-Hospital-Id of B
    headers = {**ua["headers"], "X-Hospital-Id": str(b)}
    r = client.get("/patients", headers=headers)
    assert r.status_code == 403, r.text
    assert r.json()["code"] == "FORBIDDEN"


def test_finance_scoped_to_own_hospital():
    a, b = _hospital("Clinic FA"), _hospital("Clinic FB")
    ua = _user(a, "fin-a@mt.com", role="gestor")
    ub = _user(b, "fin-b@mt.com", role="gestor")

    ra = client.get("/finance/summary", headers=ua["headers"])
    rb = client.get("/finance/summary", headers=ub["headers"])
    assert ra.status_code == 200 and rb.status_code == 200
    assert ra.json()["hospital_id"] == a
    assert rb.json()["hospital_id"] == b
