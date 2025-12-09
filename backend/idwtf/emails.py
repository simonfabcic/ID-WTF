from django.conf import settings
from django.core.mail import send_mail


def send_verification_email(profile, token):
    verification_url = f"{settings.FRONTEND_URL}/login?token={token}"
    subject = "Verify your email address"
    message = f"Click the link to verify your email: {verification_url}"

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [profile.user.email],
        fail_silently=False,
    )
