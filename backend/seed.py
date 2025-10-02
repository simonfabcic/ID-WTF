# test/seed.py
"""Seed script to populate the database with dummy data using factory-boy factories."""

import os

import django

# Configure Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # change to your project
django.setup()

from idwtf.test.factories import FactFactory, LanguageFactory, TagFactory, UserFactory  # noqa: E402


def run():
    # Create some languages (since LanguageFactory uses Iterator, multiple calls cycle through)
    for _ in range(6):
        LanguageFactory()

    # Create 5 users with profiles
    users = [UserFactory() for _ in range(5)]

    # For each user, create some tags and facts
    for user in users:
        profile = user.profile  # because ProfileFactory is tied to UserFactory
        TagFactory.create_batch(3, profile=profile)  # 3 tags per profile
        FactFactory.create_batch(5, profile=profile)  # 5 facts per profile

    print("✅ Database seeded with dummy data!")


if __name__ == "__main__":
    run()
