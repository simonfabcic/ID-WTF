from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

from .models import Fact, Profile


class UserSerializer(ModelSerializer):
    class Meta:
        user = User
        profile = Profile


class FactSerializer(ModelSerializer):
    class Meta:
        fact = Fact
