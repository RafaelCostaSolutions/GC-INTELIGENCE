from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings read from the .env file (or from environment variables)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./gc_dev.db"

    # GC-3 Auth
    jwt_secret: str = "change-me-in-production-use-a-long-random-string"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    password_reset_expire_minutes: int = 60
    auth_debug: bool = True

    # Upload / digital signature (base)
    upload_dir: str = "./uploads"
    max_upload_bytes: int = 10 * 1024 * 1024  # 10 MB
    # Used for HMAC signature of file hashes; falls back to jwt_secret if empty
    signing_key: str = ""


settings = Settings()
