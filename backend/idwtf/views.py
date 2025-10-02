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
from rest_framework import viewsets

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

    serializer_class = FactSerializer
    # queryset = Fact.objects.all()
    # permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        """Return only Facts, that the user owns or which user follows by tag."""
        user = self.request.user

        if user.is_authenticated:
            users_profile = Profile.objects.get(user=user)
            followed_tags = users_profile.follows.all()
            facts = Fact.objects.filter(Q(profile=users_profile) | Q(tags__in=followed_tags))
            # If too little facts from user, add random facts
            if facts.count() > 10:
                return facts
            additional_facts = (
                Fact.objects.filter(visibility="public")
                .exclude(id__in=facts.values_list("id", flat=True))
                .order_by("?")[: 10 - facts.count()]
            )
            return list(facts) + list(additional_facts)

        else:
            facts = Fact.objects.filter(visibility="public").order_by("?")[:2]  # random 2

        return facts

    def perform_create(self, serializer):
        # TODO check if this is necessary
        # TODO check if access to the profile is correct
        serializer.save(profile=self.request.user.profile)
