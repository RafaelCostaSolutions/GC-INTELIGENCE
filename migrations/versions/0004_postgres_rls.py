"""GC-5: enforce tenant isolation with PostgreSQL Row-Level Security.

Revision ID: 0004
Revises: 0003
"""
from alembic import op
import sqlalchemy as sa

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None

TENANT_TABLES = ("patients", "professionals", "laudo_files")


def upgrade():
    # SQLite is used for local development and has no native PostgreSQL RLS.
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    for table in TENANT_TABLES:
        # FORCE also subjects the table owner to RLS. Superusers and roles
        # with BYPASSRLS still bypass policies and must not be used by the app.
        op.execute(sa.text(f'ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY'))
        op.execute(sa.text(f'ALTER TABLE "{table}" FORCE ROW LEVEL SECURITY'))
        op.execute(sa.text(
            f"""
            CREATE POLICY tenant_isolation ON "{table}"
            USING (
                hospital_id = NULLIF(
                    current_setting('app.current_hospital_id', true), ''
                )::integer
            )
            WITH CHECK (
                hospital_id = NULLIF(
                    current_setting('app.current_hospital_id', true), ''
                )::integer
            )
            """
        ))


def downgrade():
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    for table in reversed(TENANT_TABLES):
        op.execute(sa.text(f'DROP POLICY IF EXISTS tenant_isolation ON "{table}"'))
        op.execute(sa.text(f'ALTER TABLE "{table}" NO FORCE ROW LEVEL SECURITY'))
        op.execute(sa.text(f'ALTER TABLE "{table}" DISABLE ROW LEVEL SECURITY'))
