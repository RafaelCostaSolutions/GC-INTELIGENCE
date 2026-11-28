"""GC-6: one log line per request (method, path, status and duration)."""
import logging
import time

from fastapi import FastAPI, Request

LOG_FORMAT = "%(asctime)s %(levelname)s [%(name)s] %(message)s"


def setup_logging(app: FastAPI):
    logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
    logger = logging.getLogger("gc")

    @app.middleware("http")
    async def log_request(request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info("%s %s -> %s (%.0f ms)", request.method, request.url.path, response.status_code, elapsed_ms)
        return response
