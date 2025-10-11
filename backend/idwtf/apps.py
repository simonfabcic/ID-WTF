from django.apps import AppConfig


class IdwtfConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "idwtf"

    def ready(self):
        """Import signals when Django starts."""
        import idwtf.signals  # noqa: F401
