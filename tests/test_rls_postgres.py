"""PostgreSQL integration test for the tenant RLS policy pattern.

Set GC_RLS_TEST_DATABASE_URL to a disposable PostgreSQL database to run it.
The regular SQLite test suite skips this test because SQLite has no RLS.
"""
import os
import uuid

import pytest
from sqlalchemy import create_engine, text


@pytest.mark.skipif(
    not os.getenv("GC_RLS_TEST_DATABASE_URL"),
    reason="requires a disposable PostgreSQL database (GC_RLS_TEST_DATABASE_URL)",
)
def test_postgres_rls_blocks_cross_tenant_reads_and_writes():
    url = os.environ["GC_RLS_TEST_DATABASE_URL"]
    engine = create_engine(url)
    table = f"gc_rls_test_{uuid.uuid4().hex}"

    try:
        with engine.connect() as conn:
            conn.execute(text(
                f'CREATE TABLE "{table}" (id integer PRIMARY KEY, hospital_id integer NOT NULL, value text NOT NULL)'
            ))
            conn.execute(text(f'ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY'))
            conn.execute(text(f'ALTER TABLE "{table}" FORCE ROW LEVEL SECURITY'))
            conn.execute(text(
                f"""
                CREATE POLICY tenant_isolation ON "{table}"
                USING (
                    hospital_id = NULLIF(current_setting('app.current_hospital_id', true), '')::integer
                )
                WITH CHECK (
                    hospital_id = NULLIF(current_setting('app.current_hospital_id', true), '')::integer
                )
                """
            ))
            conn.commit()

            conn.execute(
                text("SELECT set_config('app.current_hospital_id', '101', false)")
            )
            conn.execute(
                text(f'INSERT INTO "{table}" (id, hospital_id, value) VALUES (1, 101, \'registro A\')')
            )
            conn.commit()

            conn.execute(
                text("SELECT set_config('app.current_hospital_id', '202', false)")
            )
            conn.execute(
                text(f'INSERT INTO "{table}" (id, hospital_id, value) VALUES (2, 202, \'registro B\')')
            )
            conn.commit()

            conn.execute(
                text("SELECT set_config('app.current_hospital_id', '101', false)")
            )
            visible = conn.execute(
                text(f'SELECT hospital_id, value FROM "{table}"')
            ).all()
            assert visible == [(101, "registro A")]

            conn.execute(
                text("SELECT set_config('app.current_hospital_id', '', false)")
            )
            assert conn.execute(text(f'SELECT id FROM "{table}"')).all() == []
            conn.commit()
    finally:
        with engine.begin() as conn:
            conn.execute(text(f'DROP TABLE IF EXISTS "{table}"'))
        engine.dispose()
