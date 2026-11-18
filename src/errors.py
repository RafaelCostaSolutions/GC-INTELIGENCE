"""GC-6: every API error has the same shape: {"code": "...", "message": "..."}.

- code: a fixed UPPER_CASE name the front-end can check (e.g. NOT_FOUND).
- message: a sentence in Portuguese to show to the user.
"""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from starlette.exceptions import HTTPException

logger = logging.getLogger("gc")


class ApiError(Exception):
    """An expected error that we raise ourselves, e.g. patient not found."""

    def __init__(self, status: int, code: str, message: str):
        self.status = status
        self.code = code
        self.message = message


def not_found(label: str) -> ApiError:
    """label is the user-facing name of the thing, e.g. 'Paciente'."""
    return ApiError(404, "NOT_FOUND", f"{label} não encontrado")


# Codes used when FastAPI itself raises the error (e.g. an unknown route)
CODE_BY_STATUS = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    409: "CONFLICT",
}


def error_response(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status, content={"code": code, "message": message})


def register_error_handlers(app: FastAPI):
    """Plugs the error handlers into the app. Called once, in server.py."""

    @app.exception_handler(ApiError)
    async def handle_api_error(request: Request, error: ApiError):
        return error_response(error.status, error.code, error.message)

    @app.exception_handler(HTTPException)
    async def handle_http_error(request: Request, error: HTTPException):
        code = CODE_BY_STATUS.get(error.status_code, "HTTP_ERROR")
        message = error.detail if isinstance(error.detail, str) else "Erro na requisição"
        if error.status_code == 404 and message == "Not Found":
            message = "Rota não encontrada"
        return error_response(error.status_code, code, message)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, error: RequestValidationError):
        # Joins every problem into one sentence, e.g. "Campo inválido: body.name (Field required)"
        problems = [".".join(str(p) for p in e["loc"]) + f" ({e['msg']})" for e in error.errors()]
        return error_response(422, "VALIDATION_ERROR", "Campo inválido: " + "; ".join(problems))

    @app.exception_handler(IntegrityError)
    async def handle_integrity_error(request: Request, error: IntegrityError):
        # e.g. two patients with the same CPF in the same hospital
        logger.warning("Database conflict on %s %s: %s", request.method, request.url.path, error.orig)
        return error_response(409, "CONFLICT", "Já existe um registro com esses dados")

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, error: Exception):
        # A bug or unexpected failure: log everything, but never show details to the user
        logger.exception("Unexpected error on %s %s", request.method, request.url.path)
        return error_response(500, "INTERNAL_ERROR", "Erro interno. Tente novamente mais tarde.")
