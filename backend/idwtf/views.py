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

from .emails import send_email_forgot_password, send_email_verification
from .models import EmailVerificationToken, Fact, Language, Profile, Tag
from .serializers import (
    FactSerializer,
    LanguageSerializer,
    PrivateProfileSerializer,
    ProfileSerializer,
    PublicProfileSerializer,
    TagSerializer,
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    """Viewset automatically provides `list` and `retrieve` actions."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action in ["register", "verify_email"]:
            return User.objects.none()
        return User.objects.filter(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        """Disable list option for the getting the all users."""
        return Response(
            {"detail": "Getting all users not allowed."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        """
        Register a new user and create profile.

        POST /api/users/register/
        """
        email = request.data.get("email")
        password = request.data.get("password")
        repetition = request.data.get("repetition")

        # repetition - ask for email confirmation again
        if repetition:
            if not email:
                return Response({"error": "Field required: email."}, status=status.HTTP_400_BAD_REQUEST)
            if not User.objects.filter(username=email):
                return Response({"error": "User with this email not exist."}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(username=email, is_active=True):
                return Response(
                    {"error": "User with this email already confirmed email."}, status=status.HTTP_400_BAD_REQUEST
                )

            profile = Profile.objects.get(user__username=email)
            email_token = EmailVerificationToken.objects.create(profile=profile)

            send_email_verification(profile.user.email, email_token.token)
            return Response(
                {"message": "Email for confirmation identity sent again."},
                status=status.HTTP_200_OK,
            )

        # validation - for first time
        if not email or not password:
            return Response({"error": "Fields required: email, password."}, status=status.HTTP_400_BAD_REQUEST)

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
                    is_active=False,
                )

                # create profile
                username = email.split("@")[0]
                profile = Profile.objects.create(user=user, username=username)

                email_token = EmailVerificationToken.objects.create(profile=profile)

                send_email_verification(profile.user.email, email_token.token)

        except Exception as e:
            return Response({"error": f"Registration failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"message": "User and profile created successfully! Email confirmation needed."},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"], permission_classes=[AllowAny], url_path="verify-email")
    def verify_email(self, request):
        """
        Activate user and profile.

        POST /api/users/verify-email/
        Token in body: {"token": "...."}
        """
        token = request.data.get("token")

        if not token:
            return Response({"error": "Token required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verification_token = EmailVerificationToken.objects.get(token=token)

            if not verification_token.is_valid():
                return Response({"error": "Verification token has expired"}, status=status.HTTP_400_BAD_REQUEST)

            profile = verification_token.profile
            verification_token.delete()

            profile.email_verified = True
            profile.save()

            profile.user.is_active = True
            profile.user.save()

            # get JWT tokens
            JWTs = RefreshToken.for_user(profile.user)

            return Response(
                {
                    "user": {
                        "user_id": profile.user.id,
                        "username": profile.user.username,
                        "email": profile.user.email,
                        "profile_id": profile.id,
                        "message": "User registered successfully.",
                    },
                    "JWTs": {"access": str(JWTs.access_token), "refresh": str(JWTs)},
                },
                status=status.HTTP_201_CREATED,
            )

        except EmailVerificationToken.DoesNotExist:
            return Response(
                {"error": "Invalid verification token. Token may be already used."}, status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=["post"], permission_classes=[AllowAny], url_path="forgot-password-email")
    def forgot_password_email(self, request):
        email = request.data.get("email")

        try:
            profile = Profile.objects.get(user__email=email)
        except Profile.DoesNotExist:
            return Response({"error": "User with provided email does not exist"}, status=status.HTTP_404_NOT_FOUND)

        email_token = EmailVerificationToken.objects.create(profile=profile)

        send_email_forgot_password(profile.user.email, email_token.token)
        return Response(
            {"message": "Email for reset password sent."},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], permission_classes=[AllowAny], url_path="forgot-password-new-password")
    def forgot_password_new_password(self, request):
        token = request.data.get("token")
        password = request.data.get("password")
        print("token: ", token)
        print("password: ", password)

        if not token and not password:
            return Response({"error": "Token and password required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verification_token = EmailVerificationToken.objects.get(token=token)
            if not verification_token.is_valid():
                return Response({"error": "Verification token has expired"}, status=status.HTTP_400_BAD_REQUEST)

        except EmailVerificationToken.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        profile = verification_token.profile
        verification_token.delete()
        profile.user.set_password(password)
        profile.user.save()

        # get JWT tokens
        JWTs = RefreshToken.for_user(profile.user)
        return Response(
            {
                "user": {
                    "user_id": profile.user.id,
                    "username": profile.user.username,
                    "email": profile.user.email,
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
    serializer_class = ProfileSerializer

    def get_serializer_class(self):
        """Different serializers based on the action and user permissions."""
        if self.action == "retrieve":
            # Check if user is viewing their own profile
            if self.request.user.is_authenticated:
                profile = self.get_object()
                if profile.user == self.request.user:
                    return PrivateProfileSerializer
            return PublicProfileSerializer
        # Default serializer for other actions (create, update, partial_update)
        return ProfileSerializer

    def list(self, request, *args, **kwargs):
        """Disable list option for the getting the all private profiles."""
        return Response(
            {"detail": "Getting all profiles not allowed."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a profile and return either public or private data."""
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="tag-follow")
    def tag_follow(self, request, pk=None):
        """Endpoint for POST /api/profile/5/tag-follow/."""
        profile = self.get_object()
        tag_id = request.data.get("tag_id")

        try:
            tag = Tag.objects.get(id=tag_id)
            profile.follows.add(tag)
            return Response({"status": "tag followed"}, status=status.HTTP_200_OK)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["post"], url_path="tag-unfollow")
    def tag_unfollow(self, request, pk=None):
        """Endpoint for POST /api/profile/5/tag-unfollow/."""
        profile = self.get_object()
        tag_id = request.data.get("tag_id")

        try:
            tag = Tag.objects.get(id=tag_id)
            profile.follows.remove(tag)
            return Response({"status": "tag unfollowed"}, status=status.HTTP_200_OK)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["get"])
    def tags(self, request, pk=None):
        profile = self.get_object()
        tags = profile.tags.all()
        serializer = TagSerializer(tags, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def facts(self, request, pk=None):
        profile = self.get_object()

        if request.user.is_authenticated:
            if request.user.profile == profile:
                # owner see all facts
                facts = profile.facts.all()
            else:
                # logged in user see pubic and follows
                facts = profile.facts.filter(visibility__in=["public", "followers"])
        else:
            # anonymous user can see pubic facts
            facts = profile.facts.filter(visibility__in=["public"])

        serializer = FactSerializer(facts, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="facts-liked")
    def facts_liked(self, request, pk=None):
        profile = self.get_object()
        if request.user.is_authenticated and request.user.profile == profile:
            liked_facts = profile.upvoted.all()
            serializer = FactSerializer(liked_facts, many=True, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "You don't have permission to view this. Only logged in user can see his own liked facts"},
                status=status.HTTP_403_FORBIDDEN,
            )

    @action(detail=True, methods=["get"], url_path="tags-followed")
    def tags_followed(self, request, pk=None):
        """
        Endpoint for POST /api/profile/5/tags-followed/.

        This will return an array of objects, where each object contains:
            profile: Profile data of the tag owner
            followed_tags: Tags from that profile that the current user follows
            other_tags: Tags from that profile that the current user doesn't follow

        response will be ordered as:
            First: All profiles where the user follows at least one tag
            Second: All profiles where the user doesn't follow any tags
        """
        profile = self.get_object()
        if request.user.is_authenticated and request.user.profile == profile:
            # Get all profiles that have tags (excluding the current user's profile)
            profiles_with_tags = Profile.objects.exclude(id=profile.id).filter(tags__isnull=False).distinct()

            profiles_with_followed = []
            profiles_without_followed = []
            for other_profile in profiles_with_tags:
                # Get tags owned by this profile
                owned_tags = other_profile.tags.all()

                # Only include profiles that have at least one tag
                if owned_tags.exists():
                    # Separate into followed and other tags
                    followed_tags = owned_tags.filter(followed_by_profile=profile)
                    other_tags = owned_tags.exclude(followed_by_profile=profile)

                    # prepare data
                    profile_data = {
                        "profile": PublicProfileSerializer(other_profile, context={"request": request}).data,
                        "followed_tags": TagSerializer(followed_tags, many=True).data,
                        "other_tags": TagSerializer(other_tags, many=True).data,
                    }
                if followed_tags.exists():
                    profiles_with_followed.append(profile_data)
                else:
                    profiles_without_followed.append(profile_data)

            result = profiles_with_followed + profiles_without_followed
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "You don't have permission to view this. Only logged in user can see his own followed tags"},
                status=status.HTTP_403_FORBIDDEN,
            )

    @action(detail=True, methods=["get"], url_path="tags-follows")
    def tags_follows(self, request, pk=None):
        # CONTINUE this is not done
        """
        Endpoint for GET /api/profile/5/tags-follows/.

        This will return an array of objects, where each object contains:
            profile: Profile data of the tag owner
            followed_tags: Tags from that profile that the current user follows
            other_tags: Tags from that profile that the current user doesn't follow

        Response will be ordered as:
            First: All profiles where the user follows at least one tag
            Second: All profiles where the user doesn't follow any tags
        """
        profile = self.get_object()
        if request.user.is_authenticated and request.user.profile == profile:
            profiles_tags = profile.tags.all()

            # Get all profiles that follow at least one of the current user's tags
            profiles_who_follow = Profile.objects.filter(follows__in=profiles_tags).exclude(id=profile.id).distinct()

            profiles_with_follow_tags = []
            profiles_without_follow_tags = []
            for other_profile in profiles_who_follow:
                # Get tags owned by this profile
                owned_tags = other_profile.tags.all()

                # Separate into followed and other tags
                followed_tags = owned_tags.filter(followed_by_profile=profile)
                other_tags = owned_tags.exclude(followed_by_profile=profile)

                # prepare data
                profile_data = {
                    "profile": PublicProfileSerializer(other_profile, context={"request": request}).data,
                    "followed_tags": TagSerializer(followed_tags, many=True).data,
                    "other_tags": TagSerializer(other_tags, many=True).data,
                }

                if followed_tags:
                    profiles_with_follow_tags.append(profile_data)
                else:
                    profiles_without_follow_tags.append(profile_data)

                result = profiles_with_follow_tags + profiles_without_follow_tags
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "You don't have permission to view this. Only logged in user can see his own followed tags"},
                status=status.HTTP_403_FORBIDDEN,
            )


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
