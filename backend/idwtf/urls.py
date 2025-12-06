"""Those are routs for the ID-WTF app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

# https://www.django-rest-framework.org/api-guide/routers/#defaultrouter
router = DefaultRouter()
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"facts", views.FactViewSet, basename="fact")
router.register(r"language", views.LanguageViewSet, basename="language")
router.register(r"tag", views.TagViewSet, basename="tag")
router.register(r"profile", views.ProfileViewSet, basename="profile")

# TODO change `user` to `profile`
urlpatterns = [
    path("", include(router.urls)),
]

# TODO check if this is needed
urlpatterns += [
    path("api-auth/", include("rest_framework.urls")),
    # this added two endpoints (`api-auth/` is random url):
    # /api-auth/login/
    # /api-auth/logout/
]
