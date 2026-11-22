from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from src.infra.sqlalchemy.config.settings import settings

# The database address comes from .env: SQLite locally, PostgreSQL on the server
SQLALCHEMY_DATABASE_URL = settings.database_url

connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Tables are not created here: they are created and changed
# by the Alembic migrations (migrations/ folder).


def set_tenant_context(db, hospital_id: int) -> None:
    """Set PostgreSQL's RLS tenant for this request's database connection.

    The setting is session-scoped so it survives repository commits.
    get_db() clears it before returning the connection to the pool.
    """
    if db.bind is not None and db.bind.dialect.name == "postgresql":
        db.execute(
            text("SELECT set_config('app.current_hospital_id', :hospital_id, false)"),
            {"hospital_id": str(hospital_id)},
        )


def get_db():
    """Open one database session per request and always close it.

    PostgreSQL tenant context must never leak through the connection pool.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        if db.bind is not None and db.bind.dialect.name == "postgresql":
            try:
                db.rollback()
                db.execute(
                    text("SELECT set_config('app.current_hospital_id', '', false)")
                )
                db.commit()
            except Exception:
                db.rollback()
        db.close()
