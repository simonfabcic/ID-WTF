[GitHub repo](https://github.com/jazzband/djangorestframework-simplejwt)
[Official documentation](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)
[Simple JWT official page](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html#)
# Installation and setup

1. Install [Django REST framework](https://www.django-rest-framework.org/tutorial/quickstart/) if not already:
```
pipenv install djangorestframework
```
add `rest_framework` to `INSTALLED_APPS` in `settings.py`:
```
INSTALLED_APPS = [
  ...
  'rest_framework',
]
```

2. Install Simple JWT:
```
pipenv install djangorestframework-simplejwt
```

3. Into `settings.py` configure authentication classes, to use library:
```
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```

4. In your root `urls.py` file (or any other URL config), include routes for Simple JWT’s `TokenObtainPairView` and `TokenRefreshView` views:
```
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
```

```
urlpatterns = [
    ...
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ...
]
```

Now you can already do some [[#Testing]]

# Advanced settings:
Into Django project `settings.py` add:
```
from datetime import timedelta
```

```
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=90),
    "ROTATE_REFRESH_TOKENS": True, # If 'True' the rolling window for 'refresh_token' is created. After every refresh, the refresh token extends lifespan
    # "BLACKLIST_AFTER_ROTATION": True, # After the token is used, it is no longer used. Add 'rest_framework_simplejwt.token_blacklist' to INSTALLED_APPS
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    # "SIGNING_KEY": settings.SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}
```

If `"BLACKLIST_AFTER_ROTATION": True`, you must add to `INSTALLED_APPS`:  
```
'rest_framework_simplejwt.token_blacklist',
```

# Testing

## Option 1: httpie
- create POST request with `httpie` ([[x. HTTP request test#HTTPIE]]):
```
http POST http://localhost:8456/auth/token/ username=admin password=asdfggfdsa
```
And you should get response something like this:
```
HTTP/1.1 200 OK
Allow: POST, OPTIONS
Content-Length: 483
Content-Type: application/json
Cross-Origin-Opener-Policy: same-origin
Date: Fri, 26 Jul 2024 08:45:40 GMT
Referrer-Policy: same-origin
Server: WSGIServer/0.2 CPython/3.12.0
Vary: Accept
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

{
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIxOTgzODQwLCJpYXQiOjE3MjE5ODM1NDAsImp0aSI6ImI5OTcxODY1MTQ0MTQzMGE5ZDk1NDYwMzJkZWY1MmNmIiwidXNlcl9pZCI6MX0.lkAGUevUH3R96WfOQ9vIWXMWcnbEfuyLfZ0xUOlTSAU", 
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMjA2OTk0MCwiaWF0IjoxNzIxOTgzNTQwLCJqdGkiOiI4NjA5NmI4MzAyMTY0NTQ2ODQxOTc2YzBjOTQ2MWRhNiIsInVzZXJfaWQiOjF9.iTAv13QJlmzto_AV_ZRiCNm0TzoxY1ElA1dVL9481Bc"}
```

## Option 2: Django test
Create file `tests/test_view.py` (next to `test_vews.py` add file `__init__.py`) and add content:
```
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

class TestAuthAPI(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(
            # email = "email@example.com"
            username="username",
            password="secure_password",
        )
	
    def getting_new_tokens(self):
        data = {
            "username": self.user.username,
            "password": "secure_password",
        }
        
        login_response = self.client.post(reverse("token_obtain_pair"), data=data)
        self.assertEqual(login_response.status_code, 200)
        
        data = login_response.json()
        self.assertIn("access", data)
        self.assertIn("refresh", data)
        
	def test_token_refresh(self):
        # Obtain tokens
        data = {
            "username": self.user.username,
            "password": "secure_password",
        }
        login_response = self.client.post(reverse("token_obtain_pair"), data=data)
        self.assertEqual(login_response.status_code, 200)

        # Extract refresh token from the response
        refresh_token = login_response.json().get("refresh")
        self.assertIsNotNone(refresh_token)

        # Use refresh token to obtain a new access token
        refresh_data = {"refresh": refresh_token}
        refresh_response = self.client.post(reverse("token_refresh"), data=refresh_data)
        self.assertEqual(refresh_response.status_code, 200)

        # Verify new access token is provided
        refresh_response_data = refresh_response.json()
        self.assertIn("access", refresh_response_data)
```
And run:
```
python manage.py test
```

## Option 3: Thunder client
This is a VScode extension: [Thunder client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)

-   `token/` endpoint:
    ```
    url: http://127.0.0.1:8000/auth/token/
    method: POST
    body: JSON: { "username":"admin", "password":"asdfggfdsa" }
    ```
-   `token/refresh/` endpoint:
    ```
    url: http://127.0.0.1:8000/auth/token/refresh
    method: POST
    body: JSON: { "refresh":"your-refresh-token" }
    ```

## Option 4: Postman
1. Create a new POST request.
2. Set the URL to `http://127.0.0.1:8000/auth/token/`.
3. In the body, select `raw` and set the type to `JSON`.
4. Enter the following JSON:
```
{
    "username": "admin",
    "password": "asdfggfdsa"
}
```
5. Send the request and you should receive a response with the access and refresh tokens.

# Login with `email` instead of `username`

## Setup
[GitHub example](https://github.com/desphixs/JWT-Django-Rest-Framework-React/blob/master/backend_api/api/models.py)

1. In `models.py`:
```
from django.db import models
from django.contrib.auth.models import AbstractUser

class MyUser(AbstractUser):
  email = models.EmailField(unique=True)
  
  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username']
  
# This is option...
# If you want connect additional fields, you can create profile model.
# BTW, you can access to user from profile with
# `profile = Profile.objects.get(myuser__id=userId)`
  def profile(self):
	  profile = Profile.objects.get(user=self)
	  return profile

class Profile(models.Model):
	avatar = models.ImageField(upload_to="user_images", default="default.jpg")
```
- `REQUIRED_FIELDS` is a property used in Django's authentication system. It specifies the fields required for creating a user via the `createsuperuser` management command or through the Django authentication forms.
- You should not include the `USERNAME_FIELD` itself in the `REQUIRED_FIELDS` list. This is because `REQUIRED_FIELDS` is meant to list the additional fields that must be filled when creating a user via the `createsuperuser` management command, and `USERNAME_FIELD` is already inherently required by its designation.

2. In `settings.py` add:
```
AUTH_USER_MODEL = "yourapp.MyUser"
```

3. Test endpoint:
```
http POST http://localhost:8456/auth/token/
```
And you should get the response with `email`:
```
{
    "password": [
        "This field is required."
    ],
    "email": [
        "This field is required."
    ]
}
```

## Create `MyUser` API endpoint

1. Create `view` for `MyUser`:
```
from rest_framework import viewsets
from myapp.models import MyUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from auctionbay.serializers import MyUserSerializer

class MyUserViewSet(viewsets.ModelViewSet):
    queryset = MyUser.objects.all()
    serializer_class = AuctionbayUserSerializer
    
	# to alow unauthenticated user create user
    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
```

2. Create `serializer`:
```
from rest_framework.serializers import (
    ModelSerializer,
)
from auctionbay.models import MyUser

class MyUserSerializer(ModelSerializer):
    class Meta:
        model = MyUser
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
        )
```

3. Insert URL data:
```
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter
from backend.views import MyUserViewSet

router = DefaultRouter()
router.register(r"my-user", AuctionbayUserViewSet, basename="my-user")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

urlpatterns += router.urls
```

## Tests

Install `factory-boy` if not already:
```
pipenv install -d factory-boy
```

Create factory for `MyUser` model:
```
import factory
from myapp.models import MyUser
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO

class MyUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MyUser

    email = factory.Faker("email")
    password = factory.django.Password("plaintext_password")
    username = factory.Faker("user_name")
```

Basic test for generating `MyUser`:
```
from django.test import TestCase
from auctionbay.models import MyUser
from backend.factory import MyUserFactory

class MyUserTest(TestCase):
    def test_user_profile_create_success(self):
        no_of_user_profiles_before = MyUser.objects.all().count()
        AuctionbayUserFactory()
        no_of_user_profiles_after = MyUser.objects.all().count()
        self.assertEqual(no_of_user_profiles_before + 1, no_of_user_profiles_after)
```

Test API URL:
```
from rest_framework.test import APIClient, APITestCase
from auctionbay.models import MyUser
from django.urls import reverse
from backend.factory import MyUserFactory


class TestMyUser(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = MyUserFactory()

        self.user_data = {
            "email": "existing@example.com",
            "username": "existing@example.com",
            "password": "secure_password",
        }

    def test_user_profile_success_adding_new_profile(self):
        no_of_shop_profiles_before = MyUser.objects.all().count()
        response = self.client.post(reverse("my-user-list"), data=self.user_data)
        self.assertEqual(response.status_code, 201)
        no_of_shop_profiles_after = MyUser.objects.all().count()
        self.assertEqual(no_of_shop_profiles_before + 1, no_of_shop_profiles_after)

```

# From file `Prog. commands`:


### Customizing token claims

https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html

In `views.py` paste:

```
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
```

Edit `# Add custom claims` section to add fields into dictionary, that will be encrypted and sended to frontend

In `urls.py` change from:  
`path('token/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),`  
to:  
`path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),`

### CORS configuration

-   Add CORS configuration, to allow frontend app to connect to backend  
    [Solving CORS error](#solving-cors-error)

### Protected endpoint

-   `viwes.py`
-   import decorator for authentication
-   decorate API with decorator `@permission_classes([IsAuthenticated])`
    For test:

```
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTest(request):
    testData = [
      {
        "key": "key1",
        "label": "label1"
      },
      {
        "key": "key2",
        "label": "label2"
      },
      {
        "key": "key3",
        "label": "label3"
      },
      {
        "key": "key4",
        "label": "label4"
      }
    ]
    return Response({"data":testData})
```

Example of real use:

```
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)
```

-`urls.py` add url to your `urlpatterns`

```
urlpatterns = [
  path('getTest/', views.getTest),
]
```