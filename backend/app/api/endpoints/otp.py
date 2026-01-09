from datetime import datetime, timedelta, timezone
from typing import Any
import secrets
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.db import models
from app.core import email_utils
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class OTPRequest(BaseModel):
    email: EmailStr


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str


class OTPResponse(BaseModel):
    message: str


def send_smtp_email(to_email: str, otp_code: str):
    subject = "Your OTP Code"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            * {{ box-sizing: border-box; }}
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; color: #333333; -webkit-text-size-adjust: 100%; }}
            .wrapper {{ width: 100%; table-layout: fixed; background-color: #f6f9fc; padding-bottom: 40px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); margin-top: 40px; }}
            .header {{ text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; margin-bottom: 30px; }}
            .header h1 {{ margin: 0; color: #2c3e50; font-size: 24px; font-weight: 600; }}
            .content {{ text-align: center; }}
            .otp-code {{ font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; background-color: #f0f7ff; padding: 15px 30px; border-radius: 6px; display: inline-block; margin: 20px 0; border: 1px solid #cce5ff; }}
            .text {{ font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 20px; }}
            .footer {{ text-align: center; font-size: 12px; color: #999999; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px; }}
            .footer p {{ margin: 5px 0; }}
            
            @media only screen and (max-width: 600px) {{
                .container {{ width: 100% !important; border-radius: 0 !important; margin-top: 0 !important; padding: 30px 20px !important; box-shadow: none !important; }}
                .wrapper {{ padding-bottom: 0 !important; }}
                .otp-code {{ font-size: 28px !important; padding: 12px 20px !important; letter-spacing: 2px !important; width: 100% !important; }}
            }}
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <h1>OTP Verification</h1>
                </div>
                <div class="content">
                    <p class="text">Hello,</p>
                    <p class="text">Please use the verification code below to complete your secure login request.</p>
                    
                    <div class="otp-code">{otp_code}</div>
                    
                    <p class="text">This code is valid for <strong>5 minutes</strong>. <br>If you did not request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; {datetime.now().year} OTPify Service. All rights reserved.</p>
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


@router.post("/send", response_model=OTPResponse)
def send_otp(
    otp_in: OTPRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_api_key_user),
) -> Any:
    """
    Send OTP to email. Requires API Key.
    """
    # 1. Generate 6 digit OTP
    otp_code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
    otp_hash = pwd_context.hash(otp_code)

    # 2. Expiry 5 mins
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    # 3. Store in DB
    otp_obj = models.OTP(
        email=otp_in.email,
        otp_hash=otp_hash,
        expires_at=expires_at,
        is_verified=False,
        attempts=0,
    )
    db.add(otp_obj)

    # 4. Log usage
    log_obj = models.UsageLog(
        user_id=current_user.id, endpoint="/api/otp/send", status="success"
    )
    db.add(log_obj)
    db.commit()

    # 5. Send Email (Background task)
    background_tasks.add_task(send_smtp_email, otp_in.email, otp_code)

    return {"message": "OTP sent successfully"}


@router.post("/verify", response_model=OTPResponse)
def verify_otp(
    otp_in: OTPVerify,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_api_key_user),
) -> Any:
    """
    Verify OTP. Requires API Key.
    """
    # 1. Find latest unverified OTP for email
    otp_obj = (
        db.query(models.OTP)
        .filter(models.OTP.email == otp_in.email, models.OTP.is_verified.is_(False))
        .order_by(models.OTP.created_at.desc())
        .first()
    )

    if not otp_obj:
        raise HTTPException(
            status_code=400, detail="No active OTP found for this email"
        )

    # 2. Check attempts
    if otp_obj.attempts >= 5:
        raise HTTPException(
            status_code=400, detail="Too many attempts. Request a new OTP."
        )

    # 3. Check expiry
    if datetime.now(timezone.utc) > otp_obj.expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    # 4. Verify hash
    if not pwd_context.verify(otp_in.otp, otp_obj.otp_hash):
        otp_obj.attempts += 1

        log_obj = models.UsageLog(
            user_id=current_user.id, endpoint="/api/otp/verify", status="failed"
        )
        db.add(log_obj)
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # 5. Success
    otp_obj.is_verified = True

    log_obj = models.UsageLog(
        user_id=current_user.id, endpoint="/api/otp/verify", status="success"
    )
    db.add(log_obj)
    db.commit()

    return {"message": "OTP verified successfully"}
