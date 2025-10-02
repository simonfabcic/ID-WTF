from django.contrib.auth.models import User
from rest_framework.serializers import CharField, HyperlinkedModelSerializer, ModelSerializer

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
        fields = ["id", "profile", "tag_name"]


class LanguageSerializer(ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "code", "name", "flag"]


class FactSerializer(ModelSerializer):
    username = CharField(source="profile.user.username", read_only=True)
    profile = ProfileSerializer(read_only=True)
    tags = TagSerializer(read_only=True, many=True)
    language = LanguageSerializer(read_only=True)

    class Meta:
        model = Fact
        fields = [
            "id",
            "username",
            "profile",
            "content",
            "source",
            "tags",
            "created_at",
            "visibility",
            "upvotes",
            "language",
        ]
