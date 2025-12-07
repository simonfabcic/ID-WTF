from django.contrib import admin

from .models import Fact, Language, Profile, Tag

# admin.site.register(Profile)
admin.site.register(Tag)
admin.site.register(Language)


@admin.register(Fact)
class FactAdmin(admin.ModelAdmin):
    readonly_fields = ("created_at",)

    list_display = ("profile", "content", "visibility", "created_at")
    list_filter = ("visibility", "created_at")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    readonly_fields = ("following_list", "followers_count", "following_count")

    def following_list(self, obj):
        """Display the profiles this profile follows."""
        following = obj.following.all()
        if following:
            return ", ".join([profile.username for profile in following])
        return "None"

    def followers_count(self, obj):
        return obj.followers.count()

    def following_count(self, obj):
        return obj.following.count()
