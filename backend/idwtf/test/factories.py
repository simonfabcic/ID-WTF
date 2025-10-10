"""
Factory definitions for creating test data using factory-boy.

These factories help create realistic test objects with proper relationships.
"""

import factory
from django.contrib.auth.models import User

from idwtf.models import Fact, Language, Profile, Tag


class UserFactory(factory.django.DjangoModelFactory):
    """Factory for Django's built-in User model."""

    class Meta:
        model = User

    # Use Sequence to ensure unique usernames across test runs
    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_active = True


class ProfileFactory(factory.django.DjangoModelFactory):
    """Factory for Profile model with automatic User creation."""

    class Meta:
        model = Profile

    # SubFactory automatically creates a related User instance
    user = factory.SubFactory(UserFactory)


class LanguageFactory(factory.django.DjangoModelFactory):
    """Factory for Language model."""

    class Meta:
        model = Language

    code = factory.Iterator(["en", "es", "fr", "de", "it", "pt", "sl"])
    name = factory.LazyAttribute(
        lambda obj: {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "it": "Italian",
            "pt": "Portuguese",
            "sl": "Slovene",
        }.get(obj.code, "Unknown")
    )
    flag = factory.LazyAttribute(
        lambda obj: {
            "en": "🇺🇸",
            "es": "🇪🇸",
            "fr": "🇫🇷",
            "de": "🇩🇪",
            "it": "🇮🇹",
            "pt": "🇵🇹",
            "sl": "🇸🇮",
        }.get(obj.code, "🏳️")
    )

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        """Get or create instead of always creating, to avoid UNIQUE constraint errors."""
        obj, created = model_class.objects.get_or_create(
            code=kwargs.get("code"),  # unique field
            defaults=kwargs,  # other fields to set if created
        )
        return obj


class TagFactory(factory.django.DjangoModelFactory):
    """Factory for Tag model."""

    class Meta:
        model = Tag

    profile = factory.SubFactory(ProfileFactory)
    tag_name = factory.Faker("word")


class FactFactory(factory.django.DjangoModelFactory):
    """Factory for Fact model with realistic content and relationships."""

    class Meta:
        model = Fact

    profile = factory.SubFactory(ProfileFactory)
    content = factory.Faker("paragraph", nb_sentences=3)
    source = factory.Faker("url")
    visibility = factory.Iterator(["public", "private", "followers"])
    language = factory.SubFactory(LanguageFactory)
