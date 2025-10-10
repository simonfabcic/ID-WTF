from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError

from idwtf.models import Profile


class Command(BaseCommand):
    help = "Initializes the database with default data."

    def handle(self, *args, **options):
        # create the super user
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(username="admin", email="admin@email.com", password="asdfggfdsa")
            self.stdout.write(self.style.SUCCESS("✅  Superuser 'admin' created successfully!"))
        else:
            self.stdout.write(self.style.WARNING("⚠️  Superuser 'admin' already exists."))

        # create profile for superuser
        superuser = User.objects.get(username="admin")
        try:
            Profile.objects.create(user=superuser)
            self.stdout.write(self.style.SUCCESS("✅  Profile 'admin' created successfully!"))
        except IntegrityError:
            self.stdout.write(self.style.WARNING("⚠️  Skipped due to UNIQUE constraint"))
