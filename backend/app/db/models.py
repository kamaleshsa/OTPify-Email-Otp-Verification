from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    api_key = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    reset_token = Column(String, nullable=True, index=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    usage_logs = relationship("UsageLog", back_populates="user")


class OTP(Base):
    __tablename__ = "otps"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    email = Column(String, index=True, nullable=False)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_verified = Column(Boolean, default=False)


class SMTPConfig(Base):
    __tablename__ = "smtp_configs"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    smtp_email = Column(String, nullable=False)
    smtp_host = Column(String, default="smtp.gmail.com")
    smtp_port = Column(Integer, default=587)
    smtp_password = Column(String, nullable=False)
    daily_limit = Column(Integer, default=100)
    used_today = Column(Integer, default=0)
    last_reset = Column(DateTime(timezone=True), server_default=func.now())


class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    endpoint = Column(String, nullable=False)
    status = Column(String, nullable=False)  # success, failed
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="usage_logs")
