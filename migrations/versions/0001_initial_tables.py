"""GC-2: initial tables (hospitals, users, professionals, patients)

Every table has a hospital_id, which keeps each hospital's data
separate from the others (GC-5).

Revision ID: 0001
Revises:
Create Date: 2026-11-17
"""
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """What this migration DOES to the database."""

    op.create_table(
        "hospitals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("cnpj", sa.String(18), nullable=True, unique=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("hospital_id", sa.Integer(), sa.ForeignKey("hospitals.id"), nullable=False),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("email", sa.String(150), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", sa.String(30), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_users_hospital_id", "users", ["hospital_id"])

    op.create_table(
        "professionals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("hospital_id", sa.Integer(), sa.ForeignKey("hospitals.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("kind", sa.String(30), nullable=False),
        sa.Column("council", sa.String(10), nullable=True),
        sa.Column("registry_number", sa.String(20), nullable=True),
        sa.Column("registry_state", sa.String(2), nullable=True),
        sa.Column("specialty", sa.String(100), nullable=True),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("email", sa.String(150), nullable=True),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("hospital_id", "council", "registry_number", "registry_state", name="uq_professional_registry"),
    )
    op.create_index("ix_professionals_hospital_id", "professionals", ["hospital_id"])

    op.create_table(
        "patients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("hospital_id", sa.Integer(), sa.ForeignKey("hospitals.id"), nullable=False),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("cpf", sa.String(14), nullable=True),
        sa.Column("birth_date", sa.Date(), nullable=True),
        sa.Column("sex", sa.String(20), nullable=True),
        sa.Column("phone", sa.String(20), nullable=True),
        sa.Column("email", sa.String(150), nullable=True),
        sa.Column("address", sa.String(255), nullable=True),
        sa.Column("insurance", sa.String(100), nullable=True),
        sa.Column("insurance_card", sa.String(50), nullable=True),
        sa.Column("guardian_name", sa.String(150), nullable=True),
        sa.Column("guardian_phone", sa.String(20), nullable=True),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("hospital_id", "cpf", name="uq_patient_cpf_per_hospital"),
    )
    op.create_index("ix_patients_hospital_id", "patients", ["hospital_id"])


def downgrade():
    """How to UNDO this migration (in reverse order)."""
    op.drop_index("ix_patients_hospital_id", table_name="patients")
    op.drop_table("patients")
    op.drop_index("ix_professionals_hospital_id", table_name="professionals")
    op.drop_table("professionals")
    op.drop_index("ix_users_hospital_id", table_name="users")
    op.drop_table("users")
    op.drop_table("hospitals")
