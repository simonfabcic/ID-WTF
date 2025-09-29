# from django.contrib.auth.models import User
# from rest_framework import viewsets

# from .models import Fact
# from .serializers import FactSerializer, UserSerializer


# class UserViewSet(viewsets.ReadOnlyModelViewSet):
#     """Basic User API (list + detail)."""

#     queryset = User.objects.all()
#     serializer_class = UserSerializer


# class FactViewSet(viewsets.ModelViewSet):
#     """CRUD for Facts."""

#     queryset = Fact.objects.all()
#     serializer_class = FactSerializer

from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import permissions, viewsets

from idwtf.permissions import IsOwnerOrReadOnly

from .models import Fact, Language, Profile, Tag
from .serializers import FactSerializer, LanguageSerializer, ProfileSerializer, TagSerializer, UserSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """Viewset automatically provides `list` and `retrieve` actions."""

    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    """CRUD for Profiles."""

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class TagViewSet(viewsets.ModelViewSet):
    """CRUD for Tags."""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class LanguageViewSet(viewsets.ModelViewSet):
    """CRUD for Languages."""

    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class FactViewSet(viewsets.ModelViewSet):
    """CRUD for Facts."""

    queryset = Fact.objects.all()
    serializer_class = FactSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        """Return only Facts, that the user owns or which user follows by tag."""
        user = self.request.user

        # creator = Profile.objects.filter(user=user)
        # # followed_profiles = user.profile.tags.all()
        # followed_profiles = Profile.objects.filter(follows__profile=creator)

        users_profile = Profile.objects.get(user=user)
        followed_tags = users_profile.follows.all()

        # Facts by the user or by followed users
        facts = Fact.objects.filter(Q(profile__user=user) | Q(tags__in=followed_tags))

        return facts

    def perform_create(self, serializer):
        # TODO check if this is necessary
        # TODO check if access to the profile is correct
        serializer.save(profile=self.request.user.profile)
