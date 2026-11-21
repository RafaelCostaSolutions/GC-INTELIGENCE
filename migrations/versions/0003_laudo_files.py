"""Upload de laudos: laudo_files with SHA-256 hash and signature fields

Revision ID: 0003
Revises: 0002
Create Date: 2026-11-21
"""
from alembic import op
import sqlalchemy as sa

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "laudo_files",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("hospital_id", sa.Integer(), sa.ForeignKey("hospitals.id"), nullable=False),
        sa.Column("uploaded_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("patient_id", sa.Integer(), sa.ForeignKey("patients.id"), nullable=True),
        sa.Column("exam_id", sa.String(50), nullable=True),
        sa.Column("original_filename", sa.String(255), nullable=False),
        sa.Column("stored_path", sa.String(500), nullable=False),
        sa.Column("content_type", sa.String(100), nullable=True),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("file_hash", sa.String(64), nullable=False),
        sa.Column("signature", sa.String(128), nullable=True),
        sa.Column("signed_by", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("signed_at", sa.DateTime(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_laudo_files_hospital_id", "laudo_files", ["hospital_id"])
    op.create_index("ix_laudo_files_file_hash", "laudo_files", ["file_hash"])


def downgrade():
    op.drop_index("ix_laudo_files_file_hash", table_name="laudo_files")
    op.drop_index("ix_laudo_files_hospital_id", table_name="laudo_files")
    op.drop_table("laudo_files")
