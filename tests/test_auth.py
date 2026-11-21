"""GC-3 Auth acceptance tests.

Criteria:
- Login works
- Access token expires and can be renewed via refresh token
- Password recovery flow works
"""
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from jose import jwt

from src.infra.sqlalchemy.config.settings import settings
from src.server import app

client = TestClient(app)


def _create_hospital(name: str = "Hospital Auth") -> int:
    return client.post("/hospitals", json={"name": name}).json()["id"]


def _register(hospital_id: int, email: str = "gestor@teste.com", password: str = "senha12345") -> dict:
    r = client.post(
        "/auth/register",
        json={
            "hospital_id": hospital_id,
            "name": "Gestor Teste",
            "email": email,
            "password": password,
            "role": "gestor",
        },
    )
    assert r.status_code == 201, r.text
    return r.json()


def test_login_works():
    h = _create_hospital("H Login")
    _register(h, email="login@teste.com", password="senha12345")

    r = client.post("/auth/login", json={"email": "login@teste.com", "password": "senha12345"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["expires_in"] == settings.access_token_expire_minutes * 60
    assert body["user"]["email"] == "login@teste.com"
    assert body["user"]["hospital_id"] == h

    # /auth/me with Bearer token
    me = client.get("/auth/me", headers={"Authorization": f"Bearer {body['access_token']}"})
    assert me.status_code == 200
    assert me.json()["email"] == "login@teste.com"


def test_login_rejects_wrong_password():
    h = _create_hospital("H Wrong")
    _register(h, email="wrong@teste.com", password="senha12345")
    r = client.post("/auth/login", json={"email": "wrong@teste.com", "password": "outra"})
    assert r.status_code == 401
    assert r.json()["code"] == "UNAUTHORIZED"


def test_access_token_expires_and_refresh_renews():
    h = _create_hospital("H Refresh")
    tokens = _register(h, email="refresh@teste.com", password="senha12345")

    # Forge an already-expired access token with the same secret
    expired = jwt.encode(
        {
            "sub": str(tokens["user"]["id"]),
            "hospital_id": h,
            "role": "gestor",
            "email": "refresh@teste.com",
            "type": "access",
            "exp": datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    me = client.get("/auth/me", headers={"Authorization": f"Bearer {expired}"})
    assert me.status_code == 401
    assert me.json()["code"] == "UNAUTHORIZED"

    # Refresh issues a new valid pair
    r = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 200, r.text
    new_tokens = r.json()
    assert new_tokens["access_token"] != tokens["access_token"]
    assert new_tokens["refresh_token"] != tokens["refresh_token"]  # rotated

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {new_tokens['access_token']}"})
    assert me.status_code == 200

    # Old refresh token must be rejected (rotation)
    r = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 401


def test_logout_revokes_refresh():
    h = _create_hospital("H Logout")
    tokens = _register(h, email="logout@teste.com", password="senha12345")

    r = client.post("/auth/logout", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 200

    r = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 401


def test_forgot_and_reset_password():
    h = _create_hospital("H Reset")
    _register(h, email="reset@teste.com", password="senha12345")

    r = client.post("/auth/forgot-password", json={"email": "reset@teste.com"})
    assert r.status_code == 200
    body = r.json()
    assert "message" in body
    # AUTH_DEBUG=true exposes the token for local testing
    assert body.get("reset_token"), "reset_token should be present when AUTH_DEBUG=true"

    r = client.post(
        "/auth/reset-password",
        json={"token": body["reset_token"], "new_password": "novaSenha99"},
    )
    assert r.status_code == 200, r.text

    # Old password fails, new works
    assert client.post("/auth/login", json={"email": "reset@teste.com", "password": "senha12345"}).status_code == 401
    r = client.post("/auth/login", json={"email": "reset@teste.com", "password": "novaSenha99"})
    assert r.status_code == 200


def test_jwt_scopes_hospital_on_patients():
    """After login, patients are scoped by hospital_id inside the JWT (no X-Hospital-Id)."""
    h = _create_hospital("H Scope")
    tokens = _register(h, email="scope@teste.com", password="senha12345")
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = client.post("/patients", headers=headers, json={"name": "Paciente JWT", "cpf": "999"})
    assert r.status_code == 201, r.text
    assert r.json()["hospital_id"] == h

    listed = client.get("/patients", headers=headers)
    assert listed.status_code == 200
    assert len(listed.json()) == 1
