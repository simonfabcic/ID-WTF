# This is a Django boilerplate project

## How to use
1. Clone the repository
```shell
git clone https://github.com/simonfabcic/django-boilerplate
# remove tracking information
cd django-boilerplate
ri -r -fo .git
# init the main folder for git tracking
cd ..
git init
git add .
git commit -m "Initial commit"
```

1. Install the requirements using pipenv
- Make sure you have pipenv installed. If not, you can install it using:
    ```bash
    pip install pipenv
    ```
- Create a virtual environment and install the dependencies:  
    If you want to have the venv into the system directory, delete `.venv` folder in the root of the project:
    ```bash
    pipenv install --dev
    # activate the virtual environment
    pipenv shell
    ```

1. Create database tables:
    You can run this later, if you want to connect to other database (e.g., SQLite, PostgreSQL, etc.) and configured connection in `settings.py`.
```shell
python manage.py migrate
```

1. Create superuser
   I usually create:
   Username: admin
   Email: admin@email.com
   Password: asdfggfdsa

- Option 1 (manually enter data):
```shell
python manage.py createsuperuser
```

- Option 2 (auto fill data):  
User: admin  
Email: admin@email.com  
Password: asdfggfdsa  
```shell
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@email.com', 'asdfggfdsa')" | python manage.py shell
```

# Start app inside project

1. `cd` to project root directory (where is also 'manage.py' file) and run:
    ```shell
    python manage.py startapp appname
    ```

1. Add app to `INSTALLED_APPS` inside `projectname/settings.py`:
    ```
    INSTALLED_APPS = [
        ... ,
        'appname',
    ]
    ```

    In some cases (I don't know when), you have to add:

    ```
    INSTALLED_APPS = [
        ... ,
        'appname.apps.AppnameConfig',
    ]
    ```

1. Try the app:
    1. In appname/views.py:
        ```py
        from django.http import HttpResponse

        def index(request):
            return HttpResponse("Hello, world. You're at the appname index.")
        ```
    1. In appname/urls.py:
        ```py
        from django.urls import path
        from . import views
        urlpatterns = [
            path("", views.index, name="index"),
        ]
        ```
    1. In backend/urls.py:
        ```py
        # add include to the appname urls:
        urlpatterns = [
            # ... existing paths
            path("appname/", include("appname.urls")),
        ]
        ```
    1. Run the server:
        ```shell
        python manage.py runserver
        ```
    1. Open your web browser and go to `http://127.0.0.1:8000/appname/`.

1. Commit base state to Git:
    ```
    git add .
    git commit -m "django app init state"
    ```

# To run GitHub Actions tests
1. Rename `.github/workflows/test.yml.sample` file in your project to `test.yml`.