"""Standardized API errors for GC-6.

All handled errors use the public contract: {"code": "...", "message": "..."}.
Internal exception details are logged server-side and never returned to clients.
"""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from starlette.exceptions import HTTPException

logger = logging.getLogger("gc")


class ApiError(Exception):
    """An expected, safe-to-display API error."""

    def __init__(self, status: int, code: str, message: str):
        self.status = status
        self.code = code
        self.message = message


def not_found(label: str) -> ApiError:
    return ApiError(404, "NOT_FOUND", f"{label} não encontrado")


CODE_BY_STATUS = {
    400: ("BAD_REQUEST", "Requisição inválida"),
    401: ("UNAUTHORIZED", "Autenticação necessária ou inválida"),
    403: ("FORBIDDEN", "Acesso não permitido"),
    404: ("NOT_FOUND", "Recurso não encontrado"),
    405: ("METHOD_NOT_ALLOWED", "Método não permitido"),
    409: ("CONFLICT", "Conflito ao processar a requisição"),
    422: ("VALIDATION_ERROR", "Dados da requisição inválidos"),
    429: ("RATE_LIMITED", "Muitas requisições. Tente novamente."),
}


def error_response(status: int, code: str, message: str, request: Request) -> JSONResponse:
    headers = {}
    request_id = getattr(request.state, "request_id", None)
    if request_id:
        headers["X-Request-ID"] = request_id
    return JSONResponse(
        status_code=status,
        content={"code": code, "message": message},
        headers=headers,
    )


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def handle_api_error(request: Request, error: ApiError):
        return error_response(error.status, error.code, error.message, request)

    @app.exception_handler(HTTPException)
    async def handle_http_error(request: Request, error: HTTPException):
        code, safe_message = CODE_BY_STATUS.get(
            error.status_code, ("HTTP_ERROR", "Não foi possível processar a requisição")
        )
        # Do not echo arbitrary HTTPException.detail: it may contain internal data.
        if error.status_code == 404 and error.detail == "Not Found":
            safe_message = "Rota não encontrada"
        return error_response(error.status_code, code, safe_message, request)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, error: RequestValidationError):
        # Field locations are useful; validator messages can expose implementation details.
        fields = sorted({
            ".".join(str(part) for part in item.get("loc", ()) if part != "body")
            for item in error.errors()
        })
        message = "Dados inválidos"
        if fields:
            message += ": " + ", ".join(fields)
        return error_response(422, "VALIDATION_ERROR", message, request)

    @app.exception_handler(IntegrityError)
    async def handle_integrity_error(request: Request, error: IntegrityError):
        logger.warning(
            "Database integrity conflict",
            extra={
                "request_id": getattr(request.state, "request_id", None),
                "method": request.method,
                "path": request.url.path,
            },
        )
        return error_response(409, "CONFLICT", "Já existe um registro com esses dados", request)

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, error: Exception):
        logger.exception(
            "Unhandled application exception",
            extra={
                "request_id": getattr(request.state, "request_id", None),
                "method": request.method,
                "path": request.url.path,
            },
        )
        return error_response(
            500,
            "INTERNAL_ERROR",
            "Erro interno. Tente novamente mais tarde.",
            request,
        )
