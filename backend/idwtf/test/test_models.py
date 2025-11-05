# from django import TestCase
# import factory
# from idwtf.models import Profile, Language

# class MyProfileFactory(factory.django.DjangoModelFactory):
#     class Meta:
#         model = Language

#     code = factory.faker("")
#     name =
"""
Comprehensive tests for the social media models using factory-boy.

Tests cover model creation, relationships, constraints, and business logic.
"""

from unittest import skip

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from django.utils import timezone

from idwtf.models import Fact, Profile, Tag
from idwtf.test.factories import (
    FactFactory,
    LanguageFactory,
    ProfileFactory,
    TagFactory,
    UserFactory,
)


class TestProfile(TestCase):
    """Test cases for the Profile model and its relationships."""

    def test_profile_creation(self):
        """Test basic profile creation with factory."""
        profile = ProfileFactory()

        # Verify the profile was created with a user
        self.assertIsInstance(profile.user, User)
        self.assertTrue(profile.user.username.startswith("user"))
        self.assertIsNotNone(profile.created_at)

    def test_profile_string_representation(self):
        """Test the __str__ method of Profile model."""
        user = UserFactory(username="testuser")
        profile = ProfileFactory(user=user)

        self.assertEqual(str(profile), "User: testuser")

    def test_follow_relationship(self):
        """Test the many-to-many follow relationship between profiles."""
        # Create two profiles
        creator = ProfileFactory()
        follower = ProfileFactory()
        creator_tag = TagFactory(profile=creator)

        # profile1 follows profile2
        follower.follows.add(creator_tag)

        # Test the relationship from both sides
        self.assertIn(creator_tag, follower.follows.all())
        self.assertIn(follower, Profile.objects.filter(follows__profile=creator))
        self.assertNotIn(creator, Profile.objects.filter(follows__profile=creator))

    def test_multiple_followers(self):
        """Test a profile having multiple followers."""
        popular_profile = ProfileFactory()
        popular_profile_tag = TagFactory(profile=popular_profile)
        followers = ProfileFactory.create_batch(3)

        # Each follower follows the popular profile
        for follower in followers:
            follower.follows.add(popular_profile_tag)

        # Verify all relationships
        self.assertEqual(Profile.objects.filter(follows__profile=popular_profile).count(), 3)
        for follower in followers:
            self.assertIn(follower, Profile.objects.filter(follows__profile=popular_profile))


class TestTag(TestCase):
    """Test cases for the Tag model."""

    def test_tag_creation(self):
        """Test basic tag creation."""
        profile = ProfileFactory()
        tag = TagFactory(profile=profile, tag_name="technology")

        self.assertEqual(tag.profile, profile)
        self.assertEqual(tag.tag_name, "technology")
        self.assertEqual(str(tag), "technology")

    def test_unique_tag_per_profile(self):
        """Test that tag names must be unique per profile."""
        profile = ProfileFactory()

        # Create first tag
        TagFactory(profile=profile, tag_name="science")

        # Attempting to create another tag with same name should raise error
        with self.assertRaises(IntegrityError):
            TagFactory(profile=profile, tag_name="science")

    def test_same_tag_different_profiles(self):
        """Test that different profiles can have tags with the same name."""
        profile1 = ProfileFactory()
        profile2 = ProfileFactory()

        # Both profiles can have a "science" tag
        tag1 = TagFactory(profile=profile1, tag_name="science")
        tag2 = TagFactory(profile=profile2, tag_name="science")

        self.assertEqual(tag1.tag_name, tag2.tag_name)
        self.assertNotEqual(tag1.profile, tag2.profile)

    def test_one_user_multiple_tags(self):
        """Test that one profile can have multiple tags."""
        profile1 = ProfileFactory()
        TagFactory(profile=profile1)
        TagFactory(profile=profile1)

        self.assertEqual(profile1.tags.count(), 2)


class TestLanguage(TestCase):
    """Test cases for the Language model."""

    def test_language_creation(self):
        """Test language creation with factory."""
        language = LanguageFactory(code="en", name="English")

        self.assertEqual(language.code, "en")
        self.assertEqual(language.name, "English")
        self.assertEqual(str(language), "English")

    def test_unique_language_codes(self):
        """Test that language codes must be unique."""
        LanguageFactory(code="en")

        # Attempting to create another language with same code should raise error
        with self.assertRaises(IntegrityError):
            LanguageFactory(code="en")


class TestFact(TestCase):
    """Test cases for the Fact model and its complex relationships."""

    def test_fact_creation(self):
        """Test basic fact creation with all required fields."""
        fact = FactFactory()

        self.assertIsNotNone(fact.profile)
        self.assertIsNotNone(fact.content)
        self.assertIsNotNone(fact.source)
        self.assertIsNotNone(fact.language)
        self.assertIn(fact.visibility, ["public", "private", "followers"])
        self.assertFalse(fact.is_deleted)
        self.assertIsNone(fact.deleted_at)

    @skip
    def test_fact_ordering(self):
        """Test that facts are ordered by creation date (newest first)."""
        profile = ProfileFactory()

        # Create facts with slight time differences
        fact1 = FactFactory(profile=profile)
        fact2 = FactFactory(profile=profile)
        fact3 = FactFactory(profile=profile)

        # Get all facts - should be ordered by newest first
        facts = list(Fact.objects.all())

        # Since fact3 was created last, it should be first
        self.assertEqual(facts[0], fact3)
        self.assertEqual(facts[1], fact2)
        self.assertEqual(facts[2], fact1)

    def test_fact_with_tags(self):
        """Test fact creation with associated tags."""
        profile = ProfileFactory()

        # Create some tags for the profile
        tag1 = TagFactory(profile=profile, tag_name="science")
        tag2 = TagFactory(profile=profile, tag_name="physics")

        # Create fact with these specific tags
        # fact = FactFactory(profile=profile, tags=[tag1, tag2])
        fact = FactFactory(profile=profile)
        fact.tags.add(tag1)
        fact.tags.add(tag2)

        # Verify the tags are associated
        self.assertEqual(fact.tags.count(), 2)
        self.assertIn(tag1, fact.tags.all())
        self.assertIn(tag2, fact.tags.all())

    def test_fact_tag_validation(self):
        """Test that facts can only use tags belonging to the same profile."""
        profile1 = ProfileFactory()
        profile2 = ProfileFactory()

        # Create tags for different profiles
        tag1 = TagFactory(profile=profile1, tag_name="profile1_tag")
        tag2 = TagFactory(profile=profile2, tag_name="profile2_tag")

        # Create a fact for profile1
        fact = FactFactory(profile=profile1)

        # Adding profile1's tag should work
        fact.tags.add(tag1)
        fact.clean()  # Should not raise any error

        # Adding profile2's tag should fail validation
        with self.assertRaises(ValidationError) as context:
            fact.tags.add(tag2)
        self.assertIn("Cannot add tags from other profiles:", str(context.exception))

    def test_soft_delete_functionality(self):
        """Test the soft delete fields work as expected."""
        # deleted_fact = DeletedFactFactory()
        fact = FactFactory()
        fact.is_deleted = True
        fact.deleted_at = timezone.now()

        self.assertTrue(fact.is_deleted)
        self.assertIsNotNone(fact.deleted_at)

    @skip
    def test_upvotes_default_value(self):
        """Test that upvotes default to 0."""
        fact = FactFactory()
        self.assertEqual(fact.upvotes, 0)

        # Test with custom upvotes
        popular_fact = FactFactory(upvotes=50)
        self.assertEqual(popular_fact.upvotes, 50)

    def test_bulk_fact_creation(self):
        """Test creating multiple facts efficiently."""
        profile = ProfileFactory()
        language = LanguageFactory()

        # Create multiple facts for testing query performance
        facts = FactFactory.create_batch(10, profile=profile, language=language, visibility="public")

        self.assertEqual(len(facts), 10)

        # Test filtering by visibility (should use index)
        public_facts = Fact.objects.filter(visibility="public")
        self.assertEqual(public_facts.count(), 10)

    # TODO test to check if `profile1` can see the `private` fact from `profile2`?


class TestFactQueryOptimization(TestCase):
    # TODO check, what this test does
    """Test cases for database query optimization and indexes."""

    def test_fact_indexes_exist(self):
        """Test that the expected database indexes are configured."""
        # This test verifies the Meta.indexes configuration
        fact_meta = Fact._meta
        index_fields = [idx.fields for idx in fact_meta.indexes]

        # Check that our expected indexes are configured
        self.assertIn(["profile", "visibility"], index_fields)
        self.assertIn(["created_at", "visibility"], index_fields)


class TestModelIntegration(TestCase):
    """Integration tests that verify all models work together correctly."""

    def test_complete_user_workflow(self):
        """Test a complete workflow: user creates profile, tags, and facts."""
        # Create a user and profile
        profile = ProfileFactory()

        # User creates some tags
        science_tag = TagFactory(profile=profile, tag_name="science")
        tech_tag = TagFactory(profile=profile, tag_name="technology")

        # User creates facts with those tags
        fact1 = FactFactory(
            profile=profile,
            content="Quantum computing is revolutionary",
            visibility="public",
            # tags=[science_tag, tech_tag],
        )
        fact1.tags.add(science_tag)
        fact1.tags.add(tech_tag)

        fact2 = FactFactory(profile=profile, content="AI is transforming industries", visibility="followers")
        fact2.tags.add(tech_tag)

        # Verify everything is connected properly
        self.assertEqual(profile.facts.count(), 2)
        self.assertEqual(profile.tags.count(), 2)

        # Verify tag relationships
        self.assertEqual(tech_tag.facts.count(), 2)
        self.assertEqual(science_tag.facts.count(), 1)

    def test_follow_and_content_visibility(self):
        """Test the interaction between follows and content visibility."""
        creator = ProfileFactory()
        follower1 = ProfileFactory()
        follower2 = ProfileFactory()
        visitor = ProfileFactory()

        creators_tag1 = TagFactory(profile=creator)
        creators_tag2 = TagFactory(profile=creator)

        # Set up follow relationship
        follower1.follows.add(creators_tag1)
        follower2.follows.add(creators_tag2)

        # Creator makes facts with different visibility levels
        FactFactory(
            profile=creator,
            visibility="public",
        )
        FactFactory(profile=creator, visibility="followers")
        FactFactory(profile=creator, visibility="private")

        # Test what each user should be able to see
        # (Note: This is testing the data setup, actual visibility logic
        # would be implemented in views/serializers)

        all_creator_facts = creator.facts.all()
        self.assertEqual(all_creator_facts.count(), 3)

        creator_no_of_followers_on_tag1 = creators_tag1.followed_by_profile.all()
        self.assertEqual(creator_no_of_followers_on_tag1.count(), 1)

        creators_tags = Tag.objects.filter(profile=creator)
        self.assertEqual(creators_tags.count(), 2)

        no_of_followers = Profile.objects.filter(follows__profile=creator).count()
        self.assertEqual(no_of_followers, 2)

        follower_followed_tags = follower1.follows.all()
        self.assertEqual(follower_followed_tags.count(), 1)

        visitor_follow_tags = visitor.follows.all()
        self.assertEqual(visitor_follow_tags.count(), 0)

        # Verify facts exist with expected visibility
        self.assertTrue(all_creator_facts.filter(visibility="public").exists())
        self.assertTrue(all_creator_facts.filter(visibility="followers").exists())
        self.assertTrue(all_creator_facts.filter(visibility="private").exists())
