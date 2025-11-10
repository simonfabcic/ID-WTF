from django.contrib.auth.models import User
from rest_framework.serializers import (
    CharField,
    HyperlinkedModelSerializer,
    ModelSerializer,
    PrimaryKeyRelatedField,
    ValidationError,
)

from idwtf.models import Fact, Language, Profile, Tag


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "date_joined"]


class ProfileSerializer(HyperlinkedModelSerializer):
    # facts = HyperlinkedRelatedField(many=True, view_name="fact-detail", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user"]


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "tag_name", "language"]
        read_only_fields = ["id"]


class LanguageSerializer(ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "code", "name", "flag"]


class FactSerializer(ModelSerializer):
    username = CharField(source="profile.user.username", read_only=True)
    profile = ProfileSerializer(read_only=True)

    # tags: for reading whole object / for writing: just tag IDs
    tags = TagSerializer(read_only=True, many=True)
    tag_ids = PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),  # Validates that the ID exists in the database
        write_only=True,
        source="tags",
        many=True,
    )

    class Meta:
        model = Fact
        fields = [
            "id",
            "username",
            "profile",  # For reading
            "content",
            "source",
            "tags",  # For reading
            "tag_ids",  # For writing
            "created_at",
            "visibility",
            "upvotes",
            "language",
        ]

    def validate(self, data):
        """
        Validate that all tags belong to the fact's profile owner.

        Args:
            data: Dictionary of validated field data

        Returns:
            dict: The validated data

        Raises:
            ValidationError: If tags don't belong to the profile

        """
        # Get profile from data (POST/PUT) or from existing instance (PATCH)
        profile = data.get("profile") or (self.instance.profile if self.instance else None)
        tags = data.get("tags", [])  # Now this will have the actual tag objects!

        # If both profile and tags are provided, validate ownership
        if profile and tags:
            invalid_tags = [tag for tag in tags if tag.profile != profile]

            if invalid_tags:
                invalid_names = ", ".join(tag.tag_name for tag in invalid_tags)
                raise ValidationError(
                    {
                        "tags": f"These tags don't belong to the selected profile: {invalid_names}. "
                        f"Only tags owned by '{profile.user.username}' can be used."
                    }
                )

        return data
