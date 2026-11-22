import json
import logging

from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from src.errors import register_error_handlers
from src.logs import JsonFormatter, setup_logging


def build_test_app():
    app = FastAPI()
    setup_logging(app)
    register_error_handlers(app)

    @app.get("/ok")
    def ok():
        return {"ok": True}

    @app.get("/http-error")
    def http_error():
        raise HTTPException(status_code=403, detail="sensitive internal detail")

    @app.get("/unexpected")
    def unexpected():
        raise RuntimeError("database password must not reach the client")

    @app.get("/items/{item_id}")
    def item(item_id: int):
        return {"item_id": item_id}

    return app


def test_success_response_has_request_id_header():
    client = TestClient(build_test_app())
    response = client.get("/ok", headers={"X-Request-ID": "trace-123"})
    assert response.status_code == 200
    assert response.headers["X-Request-ID"] == "trace-123"


def test_invalid_request_returns_standard_error_shape():
    client = TestClient(build_test_app())
    response = client.get("/items/not-an-integer")
    assert response.status_code == 422
    assert set(response.json()) == {"code", "message"}
    assert response.json()["code"] == "VALIDATION_ERROR"
    assert "not-an-integer" not in response.text


def test_http_exception_does_not_echo_internal_detail():
    client = TestClient(build_test_app())
    response = client.get("/http-error")
    assert response.status_code == 403
    assert response.json() == {
        "code": "FORBIDDEN",
        "message": "Acesso não permitido",
    }
    assert "sensitive internal detail" not in response.text


def test_unexpected_exception_returns_safe_500_and_request_id():
    client = TestClient(build_test_app(), raise_server_exceptions=False)
    response = client.get("/unexpected")
    assert response.status_code == 500
    assert set(response.json()) == {"code", "message"}
    assert response.json()["code"] == "INTERNAL_ERROR"
    assert "database password" not in response.text
    assert response.headers.get("X-Request-ID")


def test_invalid_incoming_request_id_is_replaced():
    client = TestClient(build_test_app())
    response = client.get("/ok", headers={"X-Request-ID": "bad request\r\n"})
    assert response.status_code == 200
    assert response.headers["X-Request-ID"] != "bad request\r\n"


def test_json_formatter_emits_structured_request_metadata():
    record = logging.LogRecord("gc", logging.INFO, __file__, 1, "HTTP request completed", (), None)
    record.request_id = "trace-456"
    record.method = "GET"
    record.path = "/patients"
    record.status_code = 200
    record.duration_ms = 12.5

    payload = json.loads(JsonFormatter().format(record))
    assert payload["request_id"] == "trace-456"
    assert payload["method"] == "GET"
    assert payload["status_code"] == 200
    assert payload["duration_ms"] == 12.5
    assert "headers" not in payload
    assert "body" not in payload
