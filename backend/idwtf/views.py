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
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Fact, Language, Profile, Tag
from .serializers import (
    FactSerializer,
    LanguageSerializer,
    PrivateProfileSerializer,
    PublicProfileSerializer,
    TagSerializer,
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    """Viewset automatically provides `list` and `retrieve` actions."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        """
        Register a new user and create profile.

        POST /api/users/register/
        """
        email = request.data.get("email")
        password = request.data.get("password")

        # validation
        if not email or not password:
            return Response({"error": "Files required: username, email, password."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exist."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # ensures both User and Profile are created together, if profile fails, user creation is rolled back
            with transaction.atomic():
                # create user
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                )

                # create profile
                username = email.split("@")[0]
                profile = Profile.objects.create(user=user, username=username)

                # get JWT tokens
                JWTs = RefreshToken.for_user(user)

        except Exception as e:
            return Response({"error": f"Registration failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {
                "user": {
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "profile_id": profile.id,
                    "message": "User registered successfully.",
                },
                "JWTs": {"access": str(JWTs.access_token), "refresh": str(JWTs)},
            },
            status=status.HTTP_201_CREATED,
        )


class IsProfileOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners of a profile to edit it.."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user == request.user


class ProfileViewSet(viewsets.ModelViewSet):
    """CRUD for Profiles."""

    queryset = Profile.objects.all()
    permission_classes = [IsProfileOwnerOrReadOnly]
    serializer_class = PrivateProfileSerializer

    def list(self, request, *args, **kwargs):
        """Disable list option for the getting the all private profiles."""
        return Response(
            {"detail": "Getting all profiles not allowed."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a profile and return either public or private data.

        If the requested profile belongs to the authenticated user, return the
        private version of the profile. Otherwise, return the public version.
        """
        instance = self.get_object()

        if request.user.is_authenticated and instance.user.id == request.user.id:
            serializer = PrivateProfileSerializer(instance, context={"request": request})
        else:
            serializer = PublicProfileSerializer(instance, context={"request": request})

        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def tag_follow(self, request, pk=None):
        """Endpoint for POST /api/profile/5/follow_tag/."""
        profile = self.get_object()
        tag_id = request.data.get("tag_id")

        try:
            tag = Tag.objects.get(id=tag_id)
            profile.follows.add(tag)
            return Response({"status": "tag followed"}, status=status.HTTP_200_OK)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["post"])
    def tag_unfollow(self, request, pk=None):
        profile = self.get_object()
        tag_id = request.data.get("tag_id")

        try:
            tag = Tag.objects.get(id=tag_id)
            profile.follows.remove(tag)
            return Response({"status": "tag unfollowed"}, status=status.HTTP_200_OK)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)


class TagViewSet(viewsets.ModelViewSet):
    """CRUD for Tags."""

    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(profile=self.request.user.profile)

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)


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
        """

        Override to handle list vs detail views differently.

        `get_queryset` is called from `list()`, `retrieve()`, `create()` and so on.
        `get_queryset` is like gatekeeper - it defines which objects the user is Allowed to see

        """
        user = self.request.user

        if not user.is_authenticated:
            # for detail view (retrieve), return ALL accessible facts
            if self.action == "retrieve":
                return Fact.objects.filter(visibility="public")
            else:
                return Fact.objects.filter(visibility="public")[:10]

        users_profile = Profile.objects.get(user=user)

        # for upvote, user needs to see all facts
        if self.action in ["upvote"]:
            return Fact.objects.all()

        # For unvote, user needs to see his upvoted facts
        if self.action in ["unvote"]:
            return Fact.objects.filter(upvotes=users_profile)

        # For modifying actions - ONLY owner's facts
        if self.action in ["update", "partial_update", "destroy"]:
            return Fact.objects.filter(profile=users_profile)

        # for detail view (retrieve), return ALL accessible facts
        if self.action == "retrieve":
            return (
                Fact.objects.filter(
                    Q(profile=users_profile) | Q(tags__in=users_profile.follows.all()) | Q(visibility="public")
                )
                .distinct()
                .prefetch_related("upvotes")
            )

        # For list view, return limited set with logic
        followed_tags = users_profile.follows.all()
        # Get user's facts and followed facts `query condition object` - no database query happens
        # The `facts` is `Q` object (a Django query expression)
        user_facts_q = Q(profile=users_profile) | Q(tags__in=followed_tags)

        # If too little facts from user, add random facts
        if Fact.objects.filter(user_facts_q).count() > 10:
            # Enough facts, just return user's facts
            return Fact.objects.filter(user_facts_q).prefetch_related("upvotes")
        else:
            # Need more facts - add random public ones
            user_fact_ids = Fact.objects.filter(user_facts_q).values_list("id", flat=True)

            additional_q = Q(visibility="public") & ~Q(id__in=user_fact_ids)

            # Combine both queries with OR
            combined_q = user_facts_q | additional_q

        return Fact.objects.filter(combined_q).distinct()[:10].prefetch_related("upvotes")

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
        try:
            serializer.save(profile_id=self.request.user.id)
        except DjangoValidationError as err:
            raise DRFValidationError({"tags": err.message}) from err

    @action(detail=True, methods=["post"])
    @permission_classes([IsAuthenticated])
    def upvote(self, request, pk=None):
        profile = request.user.profile
        fact = self.get_object()

        fact.upvotes.add(profile)
        return Response({"status": "fact upvoted"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    @permission_classes([IsAuthenticated])
    def unvote(self, request, pk=None):
        profile = request.user.profile
        fact = self.get_object()

        fact.upvotes.remove(profile)
        return Response({"status": "fact unvoted"}, status=status.HTTP_200_OK)
