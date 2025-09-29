from django.contrib.auth.models import User
from rest_framework.serializers import HyperlinkedModelSerializer, HyperlinkedRelatedField, ModelSerializer

from .models import Fact, Language, Profile, Tag


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "date_joined"]


class ProfileSerializer(HyperlinkedModelSerializer):
    facts = HyperlinkedRelatedField(many=True, view_name="fact-detail", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user", "followers", "created_at"]


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "profile", "tag_name"]


class LanguageSerializer(ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "code", "name"]


class FactSerializer(ModelSerializer):
    class Meta:
        model = Fact
        fields = [
            "id",
            "profile",
            "content",
            "source",
            "tags",
            "created_at",
            "visibility",
            "upvotes",
            "language",
            "is_deleted",
            "deleted_at",
        ]
