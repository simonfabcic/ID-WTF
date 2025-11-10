from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class OnlyActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class Profile(models.Model):
    """User can follow many other users and vice versa."""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    follows = models.ManyToManyField(
        "Tag",
        related_name="followed_by_profile",
        blank=True,
        help_text="Tags this profile follows (tags are owned by other profiles)",
    )
    # `profile1.follows.add(tag1) - `profile1` follows `tag1`
    # `profile1.follows.all()` - gets `Tag_s` this profile follows
    # `tag1.followed_by_profiles.all()` gets `Profile_s` who follows this tag
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # TODO profile_image = ...
    # languages = models.ManyToManyField("Language", related_name="profiles")  # TODO auto add "en"

    def __str__(self):
        return f"User: {self.user.username}"


class Language(models.Model):
    # for adding the flag emoji, visit:
    # https://apps.timwhitlock.info/emoji/tables/iso3166
    code = models.CharField(max_length=5, unique=True)  # 'en', 'es', 'fr'
    name = models.CharField(max_length=50)  # 'English', 'Spanish', 'French'
    flag = models.CharField(max_length=4, blank=True)  # e.g. "\U0001F1FA\U0001F1F8" for "US"

    def __str__(self):
        return self.name

    # Usage:
    # Language.objects.create(code="en", name="English", flag="🇬🇧")


class Tag(models.Model):
    """
    Specifications for `tag`.

    Profile creates the tags in user interface.
    Each `profile` can have multiple tags.
    Each `fact` can have multiple tags, but just those defined by profile.
    """

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="tags")
    tag_name = models.CharField(max_length=50)
    # language = models.ForeignKey(Language, on_delete=models.PROTECT)
    # CONTINUE

    class Meta:
        unique_together = ["profile", "tag_name"]

    def __str__(self):
        return self.tag_name


class Fact(models.Model):
    VISIBILITY_CHOICES = [
        ("public", "Public"),
        ("private", "Private"),
        ("followers", "Followers"),
    ]

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="facts")
    content = models.TextField()
    source = models.TextField()
    tags = models.ManyToManyField(Tag, related_name="facts")
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default="private", blank=False)
    upvotes = models.IntegerField(default=0)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # if no `objects` is specified, Django adds one manager named `objects` - it is reserved parameter
    # attaching the class attribute, which holds an instance of `OnlyActiveManager`
    objects = OnlyActiveManager()
    # for all objects (then call `Fact.all_objects.all()`):
    # all_objects = models.Manager() # !!! return soft deleted as well

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            # Fact.objects.filter(visibility='public').order_by('-created_at')
            models.Index(fields=["profile", "visibility"]),
            models.Index(fields=["created_at", "visibility"]),
        ]

    def __str__(self):
        return f"Fact by {self.profile.user.username}: {self.content[:30]}"

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self, *args, **kwargs):
        # not call the `delete()`, this would call the soft delete
        super().delete(*args, **kwargs)
