from sqlalchemy import create_engine
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


def get_db():
    """Opens one database session per request and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
