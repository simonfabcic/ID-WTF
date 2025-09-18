# Model field arguments
[Official documentation](https://docs.djangoproject.com/en/5.0/ref/models/fields/)

`null`
    Allow null in DB?
    Default `False`.
    Don't use in `CharField` or `TextField`. For empty values use `""`.

`blank`
	Allow empty value in validation?
	Default is `False`.
	If used with `null=False, implement `clean()` on the model to supply any missing values. See how is implemented e.g. in class `AbstractUser`.



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
