"""Request correlation and structured access logging for GC-6."""
import json
import logging
import re
import time
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, Request

REQUEST_ID_HEADER = "X-Request-ID"
_SAFE_REQUEST_ID = re.compile(r"^[A-Za-z0-9._-]{1,64}$")


class JsonFormatter(logging.Formatter):
    """Emit one JSON object per log record, without request/body/PHI data."""

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.fromtimestamp(record.created, timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        for key in ("request_id", "method", "path", "status_code", "duration_ms"):
            value = getattr(record, key, None)
            if value is not None:
                payload[key] = value
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False, default=str)


def setup_logging(app: FastAPI) -> None:
    root = logging.getLogger()
    if not any(getattr(handler, "_gc_json_handler", False) for handler in root.handlers):
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter())
        handler._gc_json_handler = True
        root.addHandler(handler)
    root.setLevel(logging.INFO)
    logger = logging.getLogger("gc")

    @app.middleware("http")
    async def log_request(request: Request, call_next):
        incoming_id = request.headers.get(REQUEST_ID_HEADER, "")
        request_id = incoming_id if _SAFE_REQUEST_ID.fullmatch(incoming_id) else str(uuid.uuid4())
        request.state.request_id = request_id
        start = time.perf_counter()
        status_code = 500
        try:
            response = await call_next(request)
            status_code = response.status_code
            response.headers[REQUEST_ID_HEADER] = request_id
            return response
        finally:
            elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.info(
                "HTTP request completed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": status_code,
                    "duration_ms": elapsed_ms,
                },
            )
