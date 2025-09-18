
# Django

## Creating models

### Extending User model

https://docs.djangoproject.com/en/dev/topics/auth/customizing/#extending-the-existing-user-model

projectname/appname/models.py <- Create models

for example:

```
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime
from django.core.exceptions import ValidationError

class Model(models.Model):
    person_id = models.CharField(max_length=10, unique=True, null=False, blank=False)
    name = models.CharField(max_length=20, null=False, blank=False)
    gender = models.ForeignKey(GenderModel, on_delete=models.PROTECT, null=False, blank=False) #Gender is another class
    age = models.IntegerField(validators=[MinValueValidator((datetime.now().year)-18), MaxValueValidator(datetime.now().year)], null=False, blank=False)
    note = models.TextField(null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_human = models.BooleanField(default=True)
    days = [
        ('0', 'Monday'),
        ('1', 'Tuesday'),
        ('2', 'Wednesday'),
        ('3', 'Thursday'),
        ('4', 'Friday'),
        ('5', 'Saturday'),
        ('6', 'Sunday'),
    ]
    favorite_day = models.CharField(max_length=20, choices=days, null=False, blank=False) # https://docs.djangoproject.com/en/4.1/ref/models/fields/#choices
    many_to_many_field = models.ManyToManyField(OtherModel)

    class Meta:
        ordering = ['-created', '-updated']

    def __str__(self) -> str:
        return f'Recreation({self.name}, {self.gender}, {self.favorite_day}, {self.note[0:20]})'
```

-   Primary key:
    -   By default Django uses an integer primary key column named id. If you don’t specify any field
    -   With primary_key=True then Django will automatically add this field called id. You can override this by specifying a different field name using auto_created attribute on the AutoField or specifying a custom primary key field.
    -   You can use _composite primary key_ - combination of two unique columns.

### Adding 'through' on Many-to-many relation sheep

https://www.youtube.com/watch?v=-HuTlmEVOgU

#### Defining models:

```
class Actor(models.Model):
   actorName = models.CharField(max_length=50, unique=False, null=True, blank=True)

class Movie(models.Model):
   title = models.CharField(max_length=50, unique=False, null=True, blank=True)
   actor = models.ManyToManyField(Actor, through='Connection')

class Connection(models.Model):
   movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
   actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
   bool = models.BooleanField()
   char = models.CharField(max_length=50, unique=False, null=True, blank=True)

   def __str__(self) -> str:
       return f'{self.movie}, {self.actor}, {self.bool}, {self.char}'
```

If you want to use DB user:
https://www.geeksforgeeks.org/how-to-use-user-model-in-django/

#### Using models:

```
mvi1 = Movie.objects.create(title="film_1")
act1 = Actor.objects.create(actorName="igralec_1")

  mvi1.actor.add(act1, through_defaults={'bool': True})
  con = Connection.objects.get(movie=mvi1, actor=act1)
    con.char = "Hi there!"
    con.save()
  # or:
    CustomThroughModel.objects.update_or_create(mvi2=mvi2, actor=act1, defaults={'some_text': "Hi there!"})

# or:

  con = Connection(
      movie = mvi1,
      actor = act1,
      bool = True,
  )
  con.save()
  con.char = "Hi there!"
  con.save()

con.delete() # or: Connection.objects.first().delete()
```

### Update a model field when another models field is updated

#### Using signals

[Dennis Ivy - YouTube](https://www.youtube.com/watch?v=Kc1Q_ayAeQk)
[Signals - Django official](https://docs.djangoproject.com/en/5.0/ref/signals/)

-   Create `signals.py` in your app directory and add:

    ```
    from django.db.models.signals import post_save
    from django.dispatch import receiver

    from .models import YourModel, OtherModel

    @receiver(post_save, sender=YourModel)
    def update_field_when_YourModel_is_updated(sender, instance, created, **kwargs):
       if created:
        print("YourModel was created!")
        OtherModel.objects.create(related_model=instance)
        print("OtherModel was created!")
      else:
        print("YourModel was updated.")
        instance.related_other_model.save()
    ```

-   configure signals in `apps.py` file:

    ```
    from django.apps import AppConfig

    class CoreConfig(AppConfig):
        default_auto_field = 'django.db.models.BigAutoField'
        name = 'core'

        def ready(self) -> None:
          import core.signals
    ```

-   `settings.py`:
    ```
    INSTALLED_APPS = [
        ...
        'app.apps.AppConfig'
    ]
    ```

#### Override save method of model

You can override save method of A model to update B model:
https://stackoverflow.com/questions/71477386/update-a-model-field-when-another-modal-field-is-updated

```
def save(self, *args, **kwargs):
    super().save(args, kwargs)
    B.objects.filter(<relation_field>).update(quantity=self.quantity)
```

## Working with DB

### Create object

```
b = Blog(name="Beatles Blog", tagline="All the latest Beatles news.")
b.save()
```

```
b = Blog.objects.create(name="Beatles Blog", tagline="All the latest Beatles news.")
# or
b = Blog.objects.get(id=1)
e = b.entry_set.create(
  headline="Hello", body_text="Hi", pub_date=datetime.date(2005, 1, 1)
)
# No need to call .save() at this point -- it's already been saved.
```

### Register your models

`appname/admin.py`

```
from django.contrib import admin
from .models import *

admin.site.register(ModelOne)
admin.site.register(ModelTwo)
admin.site.register(ModelThree)
```

### Seed testing data to DB

In the root directory `projectname` create file (next to `manage.py`) `seed.py` and enter data:

```
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectname.settings')
django.setup()

from appname.models import ModelOne, ModelTwo
from django.core.exceptions import ObjectDoesNotExist

data = ModelOne(
  field_name = 'value',
  field_number = 12,
)
data.save()

for value in ["Value1", "Value2", "Value3"]:
  try:
    data = ModelTwo.objects.get(field_name=value)
  except ObjectDoesNotExist:
    data = ObjectTwo(
      field_name=value,
    )
    data.save()
```

Creating users, if `AbstractUser` is extended with `User` in your app (e.g. `Core`):

```
from core.models import User

user=User.objects.create_user(username='username', email='user@email.com', password='bar')
# optional:
user.is_superuser=True
user.is_staff=True
user.save()
# The following is wrong (password is not encrypted, and authentication doesn't work):
# user = User.objects.create(username='username', email='user@email.com', password='bar')
```

Creating random objects:

```
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectname.settings')
django.setup()

from appname.models import ModelOne, ModelTwo
from django.core.exceptions import ObjectDoesNotExist
import random

for i in range(10):
  data = ModelOne(
    field_string = random.choice(["value_1", "value_2", "value_3", "value_4"]),
    field_int = random.randint(1000, 9000),
    # ... other fields
  )
  data.save()

for i in range(10):
  data = ModelTwo(
    field_with_model_one = ModelOne.objects.all()[random.randint(0, ModelOne.objects.count()-1)],
    # ... other fields
  )
  data.save()
```

If object contain related object, you can get those object this way:

```
for checkIndex in range(number_of_entries):
  relatedObjects = MyObject.objects.all()
  my_object_random = random.choice(manufacturers)
```

Then simply run:

```
python seed.py
```

### Get data (objects) from DB

-   Returns dictionaries:
    `YourModel.objects.values()`
-   Returns objects:
    `YourModel.object.get()`
-   Return objects from one user:
    `user.note_set.all()`
-   Return objects and related objects:
    `Ticket.objects.select_related('user', 'event').all()`
    https://www.youtube.com/shorts/y5sbDlZRj_Q
-   Return first object:
    `YourModel.objects.all().first()`
-   retrieve only one field of a model, you can use the `values()` or `values_list()` method:
    Retrieve only the 'field_name' field from the model
    `field_values` is a QuerySet of dictionaries, each containing 'field_name' key
    `field_values = MyModel.objects.values('field_name')`
    or
    Retrieve only the 'field_name' field from the model as a list
    `field_values` is a QuerySet of values from the 'field_name' field
    field_values = MyModel.objects.values_list('field_name', flat=True)

## Edit routing URLs

Create `appname/urls.py` inside app folder with content:

```
from django.urls import path
from django.http import JsonResponse

urlpatterns = [
    path('project/', lambda request: JsonResponse({'message': 'Hello, world!'})),
]
```

In `projectname/urls.py` add new path:

```
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('appname/', include('appname.urls')),
]
```

Try to test:
http://127.0.0.1:8000/project/appname/

### If you want to nest URL-s

```
from django.urls import path, include
# from . import views
from django.http import HttpResponse

urlpatterns = [
    path('views/', include([
        path('', lambda request: HttpResponse("Hi, views")),
        path('history/', lambda request: HttpResponse("Hi, history")),
        path('edit/', lambda request: HttpResponse("Hi, edit")),
        path('discuss/', lambda request: HttpResponse("Hi, discuss")),
        path('permissions/', lambda request: HttpResponse("Hi, permissions")),
    ])),
```

## Create 'View':

In `appname/views.py` add new function:

```
from django.shortcuts import render
from django.http import JsonResponse

def function_name(request):
    return(JsonResponse({'message': 'Hello, world url!'}))
```

In `appname/urls.py` change content:

```
from django.urls import path
from . import views

urlpatterns = [
    path('test-url/', views.function_name),
]
```

Try to test:
http://127.0.0.1:8000/appname/test-url

## Creating `ViewSets`

1. Documentation:
   https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset

1. YouTube video:
   https://www.youtube.com/watch?v=t-uAgI-AUxc

1. Check in power shell which methods are allowed:

```
https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset
```

## Accessing DB

Write out DB raw query:

```
checks_count = Check.objects.values('fire_extinguisher__owner__name', 'maintenance_date').annotate(num_checks=Count('id'))
print(str(checks_count.query))
```

Or with extension (try it):
 `./manage.py shell_plus --print-sql`

## Django rest framework

### Installing

https://www.django-rest-framework.org/

`pip install djangorestframework`
Add `rest_framework` to INSTALLED_APPS. The settings module will be in `tutorial/settings.py`

```
INSTALLED_APPS = [
    ...
    'rest_framework',
]
```

### Status Codes

https://www.django-rest-framework.org/api-guide/status-codes/

### [DEPRECATED] API description

Create URL path to `appname/views.py > getRouteOptions` and write something like this documentation inside function:

```
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def getRoutesOptions(request):
    routes = [
        {
            'Endpoint': '/notes/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of notes'
        },
        {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/notes/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/update/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Creates an existing note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes and exiting note'
        },
    ]

    return Response(routes)
```

And than route URL to this function inside `urls.py`:˙

```
from django.urls import path
from django.http import HttpResponse

urlpatterns = [
    path('get-routes-options', views.getRoutesOptions),
]
```

### JSON response structure

-   Basic:
    -   Successful request:
        ```
        {
          "success": true,
          "payload": [
            {
              "id": 1,
              "title": "Post 1",
              "content": "Lorem ipsum dolor sit amet.",
              "category": "Technology"
            },
            {
              "id": 2,
              "title": "Post 2",
              "content": "Praesent fermentum orci in ipsum.",
              "category": "Sports"
            },
            {
              "id": 3,
              "title": "Post 3",
              "content": "Vestibulum ante ipsum primis in faucibus.",
              "category": "Fashion"
            }
          ],
          "message": null /* Or optional success message */
        }
        ```
    -   Failed request:
        ```
        {
          "success": false,
          "payload": [
            {
              "id": 1,
              "title": "Post 1",
              "content": "Lorem ipsum dolor sit amet.",
              "category": "Technology"
            },
            {
              "id": 2,
              "title": "Post 2",
              "content": "Praesent fermentum orci in ipsum.",
              "category": "Sports"
            },
            {
              "id": 3,
              "title": "Post 3",
              "content": "Vestibulum ante ipsum primis in faucibus.",
              "category": "Fashion"
            }
          ],
          "message": "Error xyz has occurred"
        }
        ```
-   Pagination:
    -   Successful request:
        ```
        {
          "success": true,
          "payload": {
            /* Application-specific data would go here. */
          },
          "message": null /* Or optional success message */
          "pagination": {
            "prev_page": "/api/posts?offset=0&limit=10", /* or "prev_page": 1 */
            "next_page": "/api/posts?offset=30&limit=10", /* or "next_page": 3 */
            "current_page": 2,
            "page_size": 10,
            "total_records": 100,
            "total_pages": 10,
          }
        }
        ```

### Prepare data for React

Create serializers for YourModel:
In API app folder add file `serializers.py` and enter inside:

```
from rest_framework.serializers import ModelSerializer
from .models import YourModel

class YourModelSerializer(ModelSerializer):
    class Meta:
        model = YourModel
        # fields = ['YourMOdelField1', 'YourMOdelField2', 'YourMOdelField3']
        fields = '__all__'

```

Inside API app `views.py`
`@api_view(['GET'])` - get object/s
`@api_view(['PUT'])` - update objects
`@api_view(['GET'])` - create objects

```
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import YourModel
from .serializers import YourModelSerializer

@api_view(['GET'])
def getYourModels(request):
    models = YourModel.objects.all()
    serializer = YourModelSerializer(models, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getYourModel(request, pk):
    model = YourModel.objects.get(id=pk)
    serializer = YourModelSerializer(model, many=False)
    return Response(serializer.data)
```

Inside API app `urls.py`:

```
from django.urls import path
from . import views

urlpatterns = [
    path('models/', views.getYourModels),
    path('models/<str:pk>', views.getYourModel),
]
```

Test with visiting:
http://127.0.0.1:8000/appname/models
http://127.0.0.1:8000/appname/models/1
API is done for React

## pip install requirements

-   Saving installed apps:

    -   requirements.txt (deprecated):
        `pip freeze > requirements.txt`
        Save `requirements.txt`to utf-8
        If you want to manually add package to requirements.txt, you can check version by e. g.:
        `pip show package-name`
        and then add specific version into requirements.txt e. g.: `package-name==4.8.0`
        -   Installing required apps:
            `pip install -r requirements.txt`
    -   Pipenv:
        Converted requirements.txt to pipenv to make it easier to test.
        You need to have pip installer:
        `curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py`
        `python get-pip.py`
        Create virtual environment and install:
        `pip install pipenv`
        Usage:
        Create venv and install dependencies from `Pipfile.lock`:

        ```
        pipenv install -d
        ```

        Activate the venv:

        ```
        pipenv shell
        ```

        Adding packages to `Pipfile` when installing:
        [packages] - `pipenv install <package-name>`
        [dev-packages] - `pipenv install <package-name> --dev`

## Serializer

If you want the deep more than `0`, you have to specify depth argument:

```
class YourModelsSerializer(ModelSerializer):
    class Meta:
        model = YourModel
        fields = ["id", "field_1", "related_field_2"]
        read_only_fields = ("related_field_2",)
        depth = 8
```

## Django custom Admin page

Search for: `jazzmin django backend`
https://www.youtube.com/watch?v=K7odN1MwyAA

## MVP examples

-   `pprint` for nicer printout

```
from pprint import pprint

pprint(mydict) # prints dict nicely with indents and newlines
```

## Random notes

[Detailed descriptions, with full methods and attributes, for each of Django's class-based generic views](https://ccbv.co.uk/)

[Detailed descriptions, with full methods and attributes, for each of Django REST Framework's class-based views and serializers](https://www.cdrf.co/)
