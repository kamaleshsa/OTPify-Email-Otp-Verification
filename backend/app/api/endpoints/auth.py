from datetime import timedelta
from typing import Any
import secrets
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.db import models
from pydantic import BaseModel, EmailStr

router = APIRouter()


class UserCreate(BaseModel):
    name: str = None
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str = None
    email: EmailStr
    api_key: str
    is_active: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


@router.post("/register", response_model=UserResponse)
def register(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Create new user.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )

    # Generate unique API Key
    while True:
        api_key = f"otp_{secrets.token_urlsafe(32)}"
        if not db.query(models.User).filter(models.User.api_key == api_key).first():
            break

    user = models.User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=security.get_password_hash(user_in.password),
        api_key=api_key,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/regenerate-api-key", response_model=UserResponse)
def regenerate_api_key(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Regenerate API Key for current user.
    """
    # Generate new unique API Key
    while True:
        new_api_key = f"otp_{secrets.token_urlsafe(32)}"
        if not db.query(models.User).filter(models.User.api_key == new_api_key).first():
            break

    current_user.api_key = new_api_key
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
