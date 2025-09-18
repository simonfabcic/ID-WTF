
# Django REST API

## Creating quick API test call (advanced instructions follow)
[Quickstart](https://www.django-rest-framework.org/tutorial/quickstart/)

1. Next to `urls.py` file create file `serializers.py` and add the following code:
```py
from rest_framework import serializers

class TestSerializer(serializers.Serializer):
    name = serializers.CharField()
    in_storage = serializers.IntegerField()
```

1. Next to `urls.py` file create file `serializers.py` and add the following code:
```py
from rest_framework import viewsets

class TestViewSet(viewsets.ViewSet):
    """
    ViewSet for testing purposes, simulating a list of items in storage.

    This ViewSet does not interact with any model and is used to return a static list of items.
    """
    def list(self, request):
        """Return a static list of items."""
        data_to_serialize = [
            {"name": "Apple", "in_storage": 10},
            {"name": "Banana", "in_storage": 20},
            {"name": "Orange", "in_storage": 15},
            {"name": "Grape", "in_storage": 8},
            {"name": "Mango", "in_storage": 5},
        ]
        serializer = TestSerializer(data_to_serialize, many=True)
        return Response(serializer.data)
```

1. Next to `urls.py` file create file `views.py` and add the following code:
```py
from django.urls import  path
from . import views

urlpatterns = [
    path("api-test/", views.TestViewSet.as_view({"get": "list"}), name="test"),
]
```

1. Try response by visiting:
   http://127.0.0.1:8000/api-test/

## Prepare data for frontend request

Create serializers for YourModel:
In API app folder add file `serializers.py` and enter inside:

```py
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

```py
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

```py
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

## Status Codes
https://www.django-rest-framework.org/api-guide/status-codes/

## JSON response structure

-   Basic:
    -   Successful request:
        ```py
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
        ```py
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
        ```py
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
