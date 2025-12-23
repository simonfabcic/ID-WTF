from django.conf import settings
from django.core.mail import send_mail


def send_email_verification(email, token):
    verification_url = f"{settings.FRONTEND_URL}/login?token={token}&reason=verify-email"
    print("verification_url: ", verification_url)  # DPL remove this line
    subject = "Verify your email address"
    message = f"Click the link to verify your email: {verification_url}"

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )


def send_email_forgot_password(email, token):
    verification_url = f"{settings.FRONTEND_URL}/login?token={token}&reason=forgot-password"
    subject = "Reset password"
    message = f"Click the link to reset the password: {verification_url}"

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
