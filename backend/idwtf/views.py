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
        """Override to handle list vs detail views differently."""
        user = self.request.user

        if not user.is_authenticated:
            # for detail view (retrieve), return ALL accessible facts
            if self.action == "retrieve":
                return Fact.objects.filter(visibility="public")
            else:
                return Fact.objects.filter(visibility="public")[:10]

        users_profile = Profile.objects.get(user=user)

        # For modifying actions - ONLY owner's facts
        if self.action in ["update", "partial_update", "destroy"]:
            return Fact.objects.filter(profile=users_profile)

        # for detail view (retrieve), return ALL accessible facts
        if self.action == "retrieve":
            return Fact.objects.filter(
                Q(profile=users_profile) | Q(tags__in=users_profile.follows.all()) | Q(visibility="public")
            ).distinct()

        # For list view, return limited set with logic
        followed_tags = users_profile.follows.all()
        # Get user's facts and followed facts `query condition object` - no database query happens
        # The `facts` is `Q` object (a Django query expression)
        user_facts_q = Q(profile=users_profile) | Q(tags__in=followed_tags)

        # If too little facts from user, add random facts
        if Fact.objects.filter(user_facts_q).count() > 10:
            # Enough facts, just return user's facts
            return Fact.objects.filter(user_facts_q)
        else:
            # Need more facts - add random public ones
            user_fact_ids = Fact.objects.filter(user_facts_q).values_list("id", flat=True)

            additional_q = Q(visibility="public") & ~Q(id__in=user_fact_ids)

            # Combine both queries with OR
            combined_q = user_facts_q | additional_q
        return Fact.objects.filter(combined_q).distinct()[:10]

    # TODO thing about use the pagination instead
    # https://claude.ai/chat/64ff1cfa-dc1e-4014-b10d-64b20dd9c250
    # search for "Can I use instead of [:10] pagination option?"

    def get_queryset_unused(self):
        """Return only Facts, that the user owns or which user follows by tag."""
        user = self.request.user

        if user.is_authenticated:
            users_profile = Profile.objects.get(user=user)
            followed_tags = users_profile.follows.all()

            facts = Q(profile=users_profile) | Q(tags__in=followed_tags)

            # If too little facts from user, add random facts
            if Fact.objects.filter(facts).count() > 10:
                # Enough facts, just return user's facts
                return Fact.objects.filter(facts)
            else:
                # Need more facts - add random public ones
                user_fact_ids = Fact.objects.filter(facts).values_list("id", flat=True)

                additional_q = Q(visibility="public") & ~Q(id__in=user_fact_ids)

                # Combine both queries with OR
                combined_q = facts | additional_q

                return Fact.objects.filter(combined_q).distinct()
        else:
            # Anonymous users see random public facts
            return Fact.objects.filter(visibility="public").order_by("?")[:10]

    def perform_create(self, serializer):
        # TODO check if this is necessary
        # TODO check if access to the profile is correct
        serializer.save(profile=self.request.user.profile)
