from collections import Counter

from django.contrib.auth.models import User
from rest_framework.serializers import (
    CharField,
    HyperlinkedModelSerializer,
    ModelSerializer,
    PrimaryKeyRelatedField,
    SerializerMethodField,
    ValidationError,
)

from idwtf.models import Fact, Language, Profile, Tag


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "date_joined"]


class PublicProfileSerializer(HyperlinkedModelSerializer):
    # facts = HyperlinkedRelatedField(many=True, view_name="fact-detail", read_only=True)
    class Meta:
        model = Profile
        fields = ["id"]


class PrivateProfileSerializer(HyperlinkedModelSerializer):
    # facts = HyperlinkedRelatedField(many=True, view_name="fact-detail", read_only=True)
    # username = CharField(source="user.profile.username", read_only=True)
    email = CharField(source="user.email", read_only=True)
    tag_most_posted = SerializerMethodField()
    fact_most_likes = SerializerMethodField()
    fact_total_likes = SerializerMethodField()
    follows = PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),  # validates that te `Tag` exist in the DB
        many=True,
        required=False,
    )

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "username",
            "email",
            "follows",
            "description",
            "created_at",
            "updated_at",
            "tag_most_posted",
            "fact_most_likes",
            "fact_total_likes",
        ]

    def get_tag_most_posted(self, obj):
        """Return the most used tag."""
        facts = obj.facts.all()
        if not facts:
            return "No facts"
        # Flatten tags and count occurrences
        tag_count = Counter()
        for fact in facts:
            for tag in fact.tags.all():
                tag_count[tag.tag_name] += 1
        if not tag_count:
            return "No tags"
        # Return the tag with max count
        return max(tag_count, key=tag_count.get)

    def get_fact_most_likes(self, obj):
        """Return the fact with the most upvotes."""
        facts = obj.facts.all()
        if not facts:
            return 0
        return max(fact.upvotes.count() for fact in facts)

    def get_fact_total_likes(self, obj):
        """Return sum of all user's received likes."""
        return sum(fact.upvotes.count() for fact in obj.facts.all())


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
    username = CharField(source="profile.username", read_only=True)
    profile = PublicProfileSerializer(read_only=True)
    upvotes = SerializerMethodField(read_only=True)
    is_upvoted = SerializerMethodField(read_only=True)

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
            "username",  # For reading
            "profile",  # For reading
            "content",
            "source",
            "tags",  # For reading
            "tag_ids",  # For writing
            "created_at",
            "visibility",
            "upvotes",
            "language",
            "is_upvoted",
        ]

    def get_upvotes(self, obj):
        return obj.upvotes.count()

    def get_is_upvoted(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.upvotes.filter(id=request.user.profile.id).exists()
        return False

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
                        f"Only tags owned by '{profile.username}' can be used."
                    }
                )

        return data
