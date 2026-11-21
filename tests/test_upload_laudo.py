"""Acceptance: upload de laudo funciona, hash salvo."""
from hashlib import sha256

from fastapi.testclient import TestClient

from src.server import app

client = TestClient(app)


def _setup(role: str = "tecnico_lab", email: str = "lab@teste.com"):
    h = client.post("/hospitals", json={"name": "H Upload"}).json()["id"]
    r = client.post(
        "/auth/register",
        json={
            "hospital_id": h,
            "name": role,
            "email": email,
            "password": "senha12345",
            "role": role,
        },
    )
    assert r.status_code == 201, r.text
    tokens = r.json()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    return h, headers, tokens


def test_upload_laudo_saves_hash():
    h, headers, _ = _setup("tecnico_lab", "upload@teste.com")
    content = b"Laudo de exemplo - hemograma completo"
    expected_hash = sha256(content).hexdigest()

    r = client.post(
        "/laudos/upload",
        headers=headers,
        files={"file": ("hemograma.txt", content, "text/plain")},
        data={"exam_id": "EX-42", "notes": "primeira versao"},
    )
    assert r.status_code == 201, r.text
    body = r.json()

    assert body["hospital_id"] == h
    assert body["original_filename"] == "hemograma.txt"
    assert body["size_bytes"] == len(content)
    assert body["file_hash"] == expected_hash
    assert body["exam_id"] == "EX-42"
    assert body["signature"] is None

    # Persistido e recuperável
    got = client.get(f"/laudos/files/{body['id']}", headers=headers)
    assert got.status_code == 200
    assert got.json()["file_hash"] == expected_hash

    # Verify integrity
    ver = client.get(f"/laudos/files/{body['id']}/verify", headers=headers)
    assert ver.status_code == 200
    assert ver.json()["hash_matches_file"] is True
    assert ver.json()["file_hash"] == expected_hash


def test_sign_uploaded_laudo():
    _, lab_headers, _ = _setup("tecnico_lab", "lab2@teste.com")
    content = b"PDF fake content for signature test"

    up = client.post(
        "/laudos/upload",
        headers=lab_headers,
        files={"file": ("laudo.pdf", content, "application/pdf")},
    )
    assert up.status_code == 201, up.text
    laudo_id = up.json()["id"]
    file_hash = up.json()["file_hash"]

    # Médico assina
    h = up.json()["hospital_id"]
    med = client.post(
        "/auth/register",
        json={
            "hospital_id": h,
            "name": "Dr Sign",
            "email": "medico-sign@teste.com",
            "password": "senha12345",
            "role": "medico",
        },
    ).json()
    med_headers = {"Authorization": f"Bearer {med['access_token']}"}

    signed = client.post(f"/laudos/files/{laudo_id}/sign", headers=med_headers)
    assert signed.status_code == 200, signed.text
    assert signed.json()["signature"]
    assert signed.json()["signed_by"] == med["user"]["id"]
    assert signed.json()["file_hash"] == file_hash

    ver = client.get(f"/laudos/files/{laudo_id}/verify", headers=med_headers)
    assert ver.json()["hash_matches_file"] is True
    assert ver.json()["is_signed"] is True
    assert ver.json()["signature_valid"] is True


def test_recepcionista_cannot_upload():
    _, headers, _ = _setup("recepcionista", "recep-up@teste.com")
    r = client.post(
        "/laudos/upload",
        headers=headers,
        files={"file": ("x.txt", b"abc", "text/plain")},
    )
    assert r.status_code == 403
    assert r.json()["code"] == "FORBIDDEN"
