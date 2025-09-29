"""Those are routs for the ID-WTF app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

# https://www.django-rest-framework.org/api-guide/routers/#defaultrouter
router = DefaultRouter()
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"facts", views.FactViewSet, basename="fact")

urlpatterns = [
    path("", include(router.urls)),
    # # Custom user actions
    # path("users/<int:pk>/followers/", views.UserFollowersView.as_view(), name="user-followers"),
    # path("users/<int:pk>/following/", views.UserFollowingView.as_view(), name="user-following"),
    # path("users/<int:pk>/follow/", views.FollowUserView.as_view(), name="follow-user"),
    # # Custom fact actions
    # path("facts/<int:pk>/", views.FactsReactionView.as_view(), name="fact-wtf"),
]
