from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn


class Settings(BaseSettings):
    PROJECT_NAME: str = "Email OTP Service"
    API_V1_STR: str = "/api"

    # DATABASE
    # Ensure you create this DB in postgres: createdb email_otp
    DATABASE_URL: PostgresDsn = (
        "postgresql://postgres:postgres@127.0.0.1:5435/email_otp"
    )

    # SECURITY
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_SECRET_KEY_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # BREVO / SMTP
    BREVO_API_KEY: str = ""

    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "otpify@example.com"
    EMAILS_FROM_NAME: str = "OTP Service"

    # FRONTEND URL (for password reset emails)
    FRONTEND_URL: str = "http://localhost:3000"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
    ]

    model_config = SettingsConfigDict(
        case_sensitive=True, env_file=".env", extra="ignore"
    )


settings = Settings()
