# idwtf/management/commands/seed.py
from django.core.management.base import BaseCommand
from django.db import IntegrityError

from idwtf.test.factories import FactFactory


class Command(BaseCommand):
    help = "Seed the database with dummy facts using factory-boy."

    def handle(self, *args, **kwargs):
        created = 0
        skipped = 0

        for _ in range(50):
            try:
                FactFactory()
                created += 1
            except IntegrityError:
                skipped += 1
                self.stdout.write(self.style.WARNING("⚠️ Skipped due to UNIQUE constraint"))

        self.stdout.write(self.style.SUCCESS(f"✅ Done! Created {created}, skipped {skipped}."))
