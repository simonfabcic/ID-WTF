# Model field arguments

[Official documentation](https://docs.djangoproject.com/en/5.0/ref/models/fields/)

`null`
Allow null in DB?
Default `False`.
Don't use in `CharField` or `TextField`. For empty values use `""`.

`blank`
Allow empty value in validation?
Default is `False`.
If used with `null=False, implement `clean()`on the model to supply any missing values. See how is implemented e.g. in class`AbstractUser`.

# Model field types

## `ImageField`

[Tutorial](https://codinggear.org/how-to-upload-images-in-django/)
Add the URL pattern for the images.

`ImageField` requires the `Pillow` library. To install the same run:

```
pipenv install Pillow
```

Use it with model:

```
avatar = models.ImageField(blank=True, default="", upload_to="images/avatars")
```

Into `settings.py` set media variables:

```
import os

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
```

Add URL routing:

```
from django.contrib import admin
from django.urls import path
from django.conf import settings  # new
from django.conf.urls.static import static  # new

urlpatterns = [
    path("admin/", admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) #new
```

## `JSONfield`

[Documentation](https://docs.djangoproject.com/en/5.0/ref/models/fields/#jsonfield)
If you want to use JSON inside database field:

```
from django.db import models
class MyModel(models.Model):
    json_data = models.JSONField()
    # Add other fields as needed
```

You can now use the JSONField to store JSON data in your model instances:

```
data = {
    'name': 'John Doe',
    'age': 30,
    'email': 'johndoe@example.com'
}

obj = MyModel.objects.create(json_data=data)
```

You can also retrieve and update the JSON data stored in the JSONField:

```
# Retrieve the JSON data
obj = MyModel.objects.get(pk=1)
json_data = obj.json_data

# Update the JSON data
json_data['age'] = 31
obj.json_data = json_data
obj.save()
```

# Model relationships

[Official documentation](https://docs.djangoproject.com/en/5.0/topics/db/examples/)

## `Many-to-many relationships (ManyToManyField)`

    - an `Article` can be published in multiple `Publication` objects.
    - a`Publication` has multiple `Article` objects.

```
from django.db import models

class Publication(models.Model):
    title = models.CharField(max_length=30)

class Article(models.Model):
    headline = models.CharField(max_length=100)
    publications = models.ManyToManyField(Publication)
```

## `Many-to-one relationships (ForeignKey)`

    - a `Reporter` can be associated with many `Article` objects
    - an `Article` can only have one `Reporter` object

```
from django.db import models

class Reporter(models.Model):
    first_name = models.CharField(max_length=30)

class Article(models.Model):
    headline = models.CharField(max_length=100)
    reporter = models.ForeignKey(Reporter, on_delete=models.CASCADE)
```

## `One-to-one relationships (OneToOneField)`

    - a `Place` optionally can be a `Restaurant`
    - a `Restaurant` must have`Place`

```
from django.db import models

class Place(models.Model):
    address = models.CharField(max_length=80)

class Restaurant(models.Model):
    place = models.OneToOneField(
        Place,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    serves_hot_dogs = models.BooleanField(default=False)

class Waiter(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
```

# Save JSON data into model instance

You can use the JSONField to store JSON data in your model instances:

```
data = {
    'name': 'John Doe',
    'age': 30,
    'email': 'johndoe@example.com'
}

obj = MyModel.objects.create(json_data=data)
```

You can also retrieve and update the JSON data stored in the JSONField:

```
# Retrieve the JSON data
obj = MyModel.objects.get(pk=1)
json_data = obj.json_data

# Update the JSON data
json_data['age'] = 31
obj.json_data = json_data
obj.save()
```

## Creating models

### Extending User model

https://docs.djangoproject.com/en/dev/topics/auth/customizing/#extending-the-existing-user-model

projectname/appname/models.py <- Create models

for example:

```py
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
