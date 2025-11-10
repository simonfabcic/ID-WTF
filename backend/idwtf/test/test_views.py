from unittest import skip

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from idwtf.models import Fact, Language, Profile, Tag  # Adjust imports

# ruff: noqa: F401 - ignore unused imports
from idwtf.test.factories import (
    FactFactory,
    LanguageFactory,
    ProfileFactory,
    TagFactory,
    UserFactory,
)


class FactEndpointTestCase(APITestCase):
    """Test Fact ViewSet endpoints using DRF's APITestCase."""

    def setUp(self):
        """Set up test data."""
        # Create profiles
        self.profile1 = ProfileFactory()
        self.profile2 = ProfileFactory()

        # Create language
        self.language = LanguageFactory()

        # Create tag
        self.tag_for_profile2 = TagFactory()

        # Create test facts
        self.public_fact = FactFactory(
            profile=self.profile1,
            content="Public fact content",
            visibility="public",
        )

        self.private_fact = FactFactory(
            profile=self.profile2,
            content="Private fact content",
            visibility="private",
        )

        self.tag_for_profile1 = TagFactory(profile=self.profile1)

    def test_list_facts_endpoint(self):
        """Test GET /facts/ endpoint."""
        self.client.force_authenticate(user=self.profile1.user)

        url = reverse("fact-list")  # DRF router creates 'fact-list' name
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.json(), list)  # Should return list of facts

    def test_create_fact_endpoint(self):
        """Test POST /facts/ endpoint."""
        # Authenticate as user1
        self.client.force_authenticate(user=self.profile1.user)

        url = reverse("fact-list")
        data = {
            "profile_id": self.profile1.id,
            "content": "New fact content",
            "source": "New source",
            "language": self.language.id,
            "visibility": "public",
            "tag_ids": [self.tag_for_profile1.id],
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fact.objects.count(), 3)  # 2 from setUp + 1 new

        # Check the created fact
        new_fact = Fact.objects.get(content="New fact content")
        self.assertEqual(new_fact.profile, self.profile1)
        self.assertEqual(new_fact.visibility, "public")

    def test_retrieve_fact_endpoint(self):
        """Test GET /facts/{id}/ endpoint."""
        self.client.force_authenticate(user=self.profile1.user)
        url = reverse("fact-detail", args=[self.public_fact.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["content"], "Public fact content")

    def test_update_fact_endpoint(self):
        """Test PUT/PATCH /facts/{id}/ endpoint."""
        # Authenticate as the fact owner
        self.client.force_authenticate(user=self.profile1.user)

        url = reverse("fact-detail", args=[self.public_fact.id])
        data = {"content": "Updated fact content", "visibility": "private"}

        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check the fact was updated
        self.public_fact.refresh_from_db()
        self.assertEqual(self.public_fact.content, "Updated fact content")
        self.assertEqual(self.public_fact.visibility, "private")

    def test_delete_fact_endpoint(self):
        """Test DELETE /facts/{id}/ endpoint (should soft delete)."""
        # Authenticate as the fact owner
        self.client.force_authenticate(user=self.profile1.user)

        url = reverse("fact-detail", args=[self.public_fact.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Check the fact was soft deleted (not hard deleted)
        self.public_fact.refresh_from_db()
        self.assertTrue(self.public_fact.is_deleted)
        self.assertIsNotNone(self.public_fact.deleted_at)

        # Should not appear in active_objects
        self.assertEqual(Fact.objects.count(), 1)  # Only private_fact remains

    def test_create_fact_with_invalid_tags(self):
        """Test that creating a fact with tags from another profile fails."""
        self.client.force_authenticate(user=self.profile1.user)

        # Try to create a fact with profile1 but use profile2's tags
        url = reverse("fact-list")
        data = {
            "profile_id": self.profile1.id,  # Changed from "profile"
            "content": "Test fact",
            "source": "Test source",
            "language": self.language.id,
            "tag_ids": [self.tag_for_profile2.id],  # Changed from "tags"
            "visibility": "public",
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertIn("Cannot add tags from other profiles:", str(response.data["tags"]))

    def test_unauthorized_access(self):
        """Test that unauthorized users can't create/update/delete facts."""
        # Try to create fact without authentication
        self.client.logout()
        super().tearDown()
        url = reverse("fact-list")
        data = {
            "content": "Unauthorized fact",
        }
        response = self.client.post(url, data, format="json")
        # response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_permission_denied(self):
        """Test that users can't modify other users' facts."""
        # Authenticate as user2, try to modify user1's fact
        self.client.force_authenticate(user=self.profile2.user)

        url = reverse("fact-detail", args=[self.public_fact.id])
        data = {"content": "Hacked content"}
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserEndpointTestCase(APITestCase):
    """Test User ViewSet endpoints."""

    def setUp(self):
        self.user = UserFactory(username="testuser")

    def test_list_users_endpoint(self):
        """Test GET /users/ endpoint."""
        url = reverse("user-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user_endpoint(self):
        """Test GET /users/{id}/ endpoint."""
        url = reverse("user-detail", args=[self.user.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["username"], "testuser")


class LanguageEndpointTestCase(APITestCase):
    def test_language_endpoint(self):
        """Test GET /language/ endpoint."""
        LanguageFactory()
        url = reverse("language-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TagEndpointTestCase(APITestCase):
    """Test Tag ViewSet endpoints."""

    def setUp(self):
        self.profile1 = ProfileFactory()
        self.profile2 = ProfileFactory()

        self.tag_profile1 = TagFactory(tag_name="profile1_tag1", profile=self.profile1)
        self.tag_profile2 = TagFactory(tag_name="profile2_tag1", profile=self.profile2)

    def test_create_tag_endpoint(self):
        """Test POST /tag/ endpoint."""
        self.client.force_authenticate(user=self.profile1.user)

        language = LanguageFactory()

        url = reverse("tag-list")
        data = {"tag_name": "tag from user 1", "language": language.id}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_tags_list_endpoint(self):
        """
        Test GET /tag/ endpoint.

        It must return only tags from the logged in user
        """
        self.tmp_profile = ProfileFactory()
        self.client.force_authenticate(user=self.tmp_profile.user)
        self.tag = TagFactory(tag_name="tmp_tag", profile=self.tmp_profile)

        url = reverse("tag-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        # returned tags
        returned_tag_names = [t["tag_name"] for t in response.data]
        self.assertIn("tmp_tag", returned_tag_names)
        self.assertNotIn("profile1_tag1", returned_tag_names)
        self.assertNotIn("profile2_tag1", returned_tag_names)

    def test_update_tag_entirely_endpoint(self):
        """Test PUT /tag/{id}/ endpoint."""
        self.client.force_authenticate(user=self.profile1.user)

        language = LanguageFactory()

        # user update his own tag
        url = reverse("tag-detail", args=[self.tag_profile1.id])
        data = {"tag_name": "updated_tag_my", "language": language.id}
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        tag_in_db = Tag.objects.get(id=self.tag_profile1.id)
        self.assertEqual("updated_tag_my", tag_in_db.tag_name)

        # user can not update some ones else tag
        url = reverse("tag-detail", args=[self.tag_profile2.id])
        data = {"tag_name": "updated_tag_foreign"}
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        tag_in_db = Tag.objects.get(id=self.tag_profile1.id)
        self.assertNotEqual("updated_tag_foreign", tag_in_db.tag_name)

    def test_update_tag_partial_endpoint(self):
        """Test PATCH /tag/{id}/ endpoint."""
        self.client.force_authenticate(user=self.profile1.user)

        tag_before_update = self.tag_profile1

        url = reverse("tag-detail", args=[self.tag_profile1.id])
        data = {"tag_name": "updated_tag_my"}
        self.client.patch(url, data, format="json")

        tag_in_db = Tag.objects.get(id=self.tag_profile1.id)
        self.assertEqual("updated_tag_my", tag_in_db.tag_name)
        self.assertEqual(tag_before_update.language, tag_in_db.language)

    def test_delete_tag_endpoint(self):
        self.client.force_authenticate(user=self.profile1.user)

        url = reverse("tag-detail", args=[self.tag_profile1.id])

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        with self.assertRaises(Tag.DoesNotExist):
            Tag.objects.get(id=self.tag_profile1.id)


# Testing with Authentication Tokens
# INSTALLED_APPS = [
#     # ... your other apps ...
#     'rest_framework',
#     'rest_framework.authtoken',  # ← Add this line
#     # ... other apps ...
# ]
# from rest_framework.authtoken.models import Token
# class TokenAuthTestCase(APITestCase):
#     """Test endpoints with token authentication."""

#     def setUp(self):
#         self.user = User.objects.create_user(username="tokenuser", password="pass123")
#         self.token = Token.objects.create(user=self.user)

#     def test_with_token_auth(self):
#         """Test endpoint access with token authentication."""
#         # Set token in header
#         self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

#         response = self.client.get(reverse("fact-list"))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
