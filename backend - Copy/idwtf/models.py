from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    """User can follow many other users and vice versa."""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField("self", symmetrical=False, related_name="following", blank=True)
    # `user.followers.all()` gets people who follow this user
    # `user.following.all()` gets people this user follows
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User: {self.user.username}"


class Tag(models.Model):
    """
    Specifications for `tag`.

    User creates the tags in user interface.
    Each `user` can have multiple tags.
    Each `fact` can have multiple tags, but just those defined by user.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tags")
    tag_name = models.CharField(max_length=50)

    class Meta:
        unique_together = ["user", "tag_name"]

    def __str__(self):
        return self.tag_name


class Language(models.Model):
    code = models.CharField(max_length=5, unique=True)  # 'en', 'es', 'fr'
    name = models.CharField(max_length=50)  # 'English', 'Spanish', 'French'

    def __str__(self):
        return self.name


class Fact(models.Model):
    VISIBILITY_CHOICES = [
        ("public", "Public"),
        ("private", "Private"),
        ("followers", "Followers"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="facts")
    content = models.TextField()
    source = models.TextField()
    tags = models.ManyToManyField(Tag, related_name="facts")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default="private", blank=False)
    upvotes = models.IntegerField(default=0)
    language = models.ForeignKey(Language, on_delete=models.PROTECT)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            # Fact.objects.filter(visibility='public').order_by('-created_at')
            models.Index(fields=["user", "visibility"]),
            models.Index(fields=["created_at", "visibility"]),
        ]

    def __str__(self):
        return f"Fact by {self.user.username}: {self.content[:30]}"
