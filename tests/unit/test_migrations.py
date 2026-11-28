"""Tests for the Alembic migrations (GC-42).

They run the real migrations on an empty temporary database.
"""
from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.migration import MigrationContext
from sqlalchemy import create_engine, inspect

from src.infra.sqlalchemy.config.database import Base
from src.infra.sqlalchemy.models import models  # noqa: F401  (loads the tables)

TABLES = {"hospitals", "users", "professionals", "patients"}


def alembic_config(url):
    config = Config("alembic.ini")
    config.attributes["database_url"] = url
    return config


def test_upgrade_creates_all_tables(tmp_path):
    url = f"sqlite:///{tmp_path / 'migrations.db'}"
    command.upgrade(alembic_config(url), "head")

    engine = create_engine(url)
    tables = set(inspect(engine).get_table_names())
    assert TABLES <= tables
    for table in TABLES - {"hospitals"}:
        columns = {c["name"] for c in inspect(engine).get_columns(table)}
        assert "hospital_id" in columns, f"{table} has no hospital_id"
    engine.dispose()


def test_migrations_match_the_models(tmp_path):
    """Same check as `alembic check`: the migrations and the models must agree."""
    url = f"sqlite:///{tmp_path / 'migrations.db'}"
    command.upgrade(alembic_config(url), "head")

    engine = create_engine(url)
    with engine.connect() as connection:
        diff = compare_metadata(MigrationContext.configure(connection), Base.metadata)
    engine.dispose()
    assert diff == []


def test_downgrade_removes_all_tables(tmp_path):
    url = f"sqlite:///{tmp_path / 'migrations.db'}"
    config = alembic_config(url)
    command.upgrade(config, "head")
    command.downgrade(config, "base")

    engine = create_engine(url)
    assert TABLES.isdisjoint(inspect(engine).get_table_names())
    engine.dispose()
