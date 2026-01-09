import httpx
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def send_email(
    recipient: str,
    subject: str,
    html_content: str,
) -> None:
    """
    Send an email using Brevo API (or SMTP as fallback if configured).
    """
    if settings.BREVO_API_KEY:
        try:
            url = "https://api.brevo.com/v3/smtp/email"
            headers = {
                "accept": "application/json",
                "api-key": settings.BREVO_API_KEY,
                "content-type": "application/json",
            }
            payload = {
                "sender": {
                    "name": settings.EMAILS_FROM_NAME,
                    "email": settings.EMAILS_FROM_EMAIL,
                },
                "to": [{"email": recipient, "name": recipient.split("@")[0]}],
                "subject": subject,
                "htmlContent": html_content,
            }

            with httpx.Client() as client:
                response = client.post(url, headers=headers, json=payload, timeout=10.0)

            if response.status_code in [201, 200, 202]:
                logger.info(f"Email sent successfully via Brevo to {recipient}")
            else:
                logger.error(
                    f"Failed to send email via Brevo: {response.text} Code: {response.status_code}"
                )

        except Exception as e:
            logger.error(f"Exception sending email via Brevo: {str(e)}", exc_info=True)

    elif settings.SMTP_USER and settings.SMTP_PASSWORD:
        # Fallback to old SMTP logic if Brevo key not present
        import emails

        try:
            message = emails.Message(
                subject=subject,
                html=html_content,
                mail_from=(
                    settings.EMAILS_FROM_NAME,
                    settings.EMAILS_FROM_EMAIL or settings.SMTP_USER,
                ),
            )
            response = message.send(
                to=recipient,
                smtp={
                    "host": settings.SMTP_HOST,
                    "port": settings.SMTP_PORT,
                    "tls": settings.SMTP_TLS,
                    "user": settings.SMTP_USER,
                    "password": settings.SMTP_PASSWORD,
                    "timeout": 10,
                },
            )
            if response.status_code not in [250, 200]:
                logger.error(
                    f"Failed to send email: {response} Code: {response.status_code} Error: {response.error}"
                )
            else:
                logger.info(f"Email sent successfully to {recipient}")
        except Exception as e:
            logger.error(f"Exception sending email: {str(e)}", exc_info=True)

    else:
        logger.warning(
            "No email credentials configured (Brevo or SMTP). Email will not be sent."
        )


def render_email_template(template_name: str, **kwargs) -> str:
    # Simulating template rendering if we had files, for now just strings
    # In a full app, you'd load .html files from a directory
    pass
