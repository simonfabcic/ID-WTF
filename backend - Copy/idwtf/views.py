from rest_framework import viewsets

from .models import Fact, User
from .serializers import FactSerializer, UserSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """Basic User API (list + detail)."""

    queryset = User.objects.all()
    serializer_class = UserSerializer


class FactViewSet(viewsets.ModelViewSet):
    """CRUD for Facts."""

    queryset = Fact.objects.all()
    serializer_class = FactSerializer
