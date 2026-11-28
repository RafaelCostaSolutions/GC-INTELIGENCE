"""Shared test fixtures.

Every test gets its own empty SQLite database in a temporary folder,
so tests never touch the development database (gc_dev.db) and never
depend on each other.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.infra.sqlalchemy.config.database import Base, get_db
from src.infra.sqlalchemy.models import models  # noqa: F401  (loads the tables)
from src.server import app


@pytest.fixture
def engine(tmp_path):
    test_engine = create_engine(
        f"sqlite:///{tmp_path / 'test.db'}",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(test_engine)
    yield test_engine
    test_engine.dispose()


@pytest.fixture
def session_factory(engine):
    return sessionmaker(bind=engine, autocommit=False, autoflush=False)


@pytest.fixture
def db(session_factory):
    """A database session for tests that call the repositories directly."""
    session = session_factory()
    yield session
    session.close()


@pytest.fixture
def client(session_factory):
    """An API client whose requests use the test database."""

    def get_test_db():
        session = session_factory()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = get_test_db
    yield TestClient(app)
    app.dependency_overrides.clear()
