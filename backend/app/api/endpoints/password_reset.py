from datetime import datetime, timedelta, timezone
from typing import Any
import secrets
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.core import email_utils, security
from app.core.config import settings
from pydantic import BaseModel, EmailStr

router = APIRouter()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class MessageResponse(BaseModel):
    message: str


def send_reset_email(to_email: str, reset_token: str, user_name: str):
    """Send password reset email with token"""
    # Use frontend URL from settings
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

    subject = "Reset Your OTPify Password"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            * {{ box-sizing: border-box; }}
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 0; color: #e2e8f0; }}
            .wrapper {{ width: 100%; table-layout: fixed; background-color: #0f172a; padding: 40px 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); }}
            .header {{ text-align: center; padding-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 30px; }}
            .logo {{ font-size: 32px; font-weight: 900; margin-bottom: 10px; }}
            .logo-gradient {{ background: linear-gradient(to right, #818cf8, #a78bfa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
            .content {{ text-align: center; }}
            .greeting {{ font-size: 18px; color: #e2e8f0; margin-bottom: 20px; }}
            .message {{ font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 30px; }}
            .reset-button {{ display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }}
            .reset-button:hover {{ opacity: 0.9; }}
            .token-box {{ background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); padding: 15px; border-radius: 6px; margin: 20px 0; }}
            .token {{ font-family: 'Courier New', monospace; font-size: 14px; color: #818cf8; word-break: break-all; }}
            .footer {{ text-align: center; font-size: 12px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); }}
            .warning {{ background-color: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; padding: 12px; margin: 20px 0; border-radius: 4px; }}
            .warning-text {{ color: #fbbf24; font-size: 14px; margin: 0; }}
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <div class="logo">
                        <span class="logo-gradient">OTP</span><span style="color: white;">ify</span>
                    </div>
                    <p style="color: #94a3b8; margin: 0;">Password Reset Request</p>
                </div>
                <div class="content">
                    <p class="greeting">Hello {user_name},</p>
                    <p class="message">
                        We received a request to reset your password for your OTPify account. 
                        Click the button below to create a new password.
                    </p>
                    
                    <a href="{reset_link}" class="reset-button">Reset Password</a>
                    
                    <p class="message" style="font-size: 14px;">
                        Or copy and paste this link into your browser:
                    </p>
                    <div class="token-box">
                        <p class="token">{reset_link}</p>
                    </div>
                    
                    <div class="warning">
                        <p class="warning-text">
                            ⚠️ This link will expire in <strong>1 hour</strong>. 
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; {datetime.now().year} OTPify. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    email_utils.send_email(
        recipient=to_email, subject=subject, html_content=html_content
    )


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Request password reset. Sends email with reset token.
    """
    # Find user by email
    user = db.query(models.User).filter(models.User.email == request.email).first()

    # Always return success message (security best practice - don't reveal if email exists)
    if not user:
        return {
            "message": "If an account exists with that email, a password reset link has been sent."
        }

    # Generate secure reset token
    reset_token = secrets.token_urlsafe(32)

    # Set token expiry (1 hour from now)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)

    # Update user with reset token
    user.reset_token = reset_token
    user.reset_token_expires = expires_at
    db.commit()

    # Send reset email in background
    background_tasks.add_task(
        send_reset_email, request.email, reset_token, user.name or "User"
    )

    return {
        "message": "If an account exists with that email, a password reset link has been sent."
    }


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Reset password using token from email.
    """
    # Find user by reset token
    user = (
        db.query(models.User).filter(models.User.reset_token == request.token).first()
    )

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    # Check if token is expired
    if (
        not user.reset_token_expires
        or datetime.now(timezone.utc) > user.reset_token_expires
    ):
        # Clear expired token
        user.reset_token = None
        user.reset_token_expires = None
        db.commit()
        raise HTTPException(
            status_code=400, detail="Reset token has expired. Please request a new one."
        )

    # Validate new password
    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=400, detail="Password must be at least 8 characters long"
        )

    # Hash new password
    user.hashed_password = security.get_password_hash(request.new_password)

    # Clear reset token
    user.reset_token = None
    user.reset_token_expires = None

    db.commit()

    return {
        "message": "Password has been reset successfully. You can now login with your new password."
    }
