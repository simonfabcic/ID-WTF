# Prepare virtual environment

1. Install 'pipenv' in the system environment if not already

    ```shell
    pip install pipenv
    ```

1. Create a virtual environment
   The location of the `venv` defaults to `~/user/.virtualenv/`, to make it live inside the current directory, make an empty folder named `.venv`, `pipenv` automatically detects that folder and creates the virtual environment inside that folder

    ```shell
    mkdir .venv
    # Activate or create your pipenv shell by running:
    pipenv shell
    ```

## Troubleshooting

-   If you get an error:
    `...running scripts is disabled on this system....`
    Run Power Shell as Admin, and run:

    ```shell
    Set-ExecutionPolicy RemoteSigned
    ```

-   Maybe you have to set the correct interpreter. In VScode press
    `Ctrl + Shift + p`
    and search for:
    `Python: Select interpreter`
    and find the location of python file:
    `...\.venv\Scripts\python.exe`
    If you want to check the current interpreter, run:
    ```shell
    pipenv --venv
    ```

# Install Django

1. Installing the latest version of django:

    ```
    pipenv install django
    ```

1. [optional] Show Django commands:

    ```
    django-admin
    ```

## Troubleshooting

-   On MacOS/Linux add executable permission to ./manage.py. This way it's possible to run `./manage.py test`.

# Create project

1. Create project with name `backend`

    - creates project in folder named `backend`:

    ```shell
    django-admin startproject backend
    ```

    - in current folder:

    ```shell
    django-admin startproject backend .
    ```

1. Migrate migrations to DB:

    ```shell
    cd ./backend
    python manage.py migrate
    ```

    After every change of file `Models.py` you must run both commands:

    ```
    python manage.py makemigrations
    python manage.py migrate
    ```

    Into `.gitignore` add:
    ```
    db.sqlite3
    ```

1. Create superuser
   I usually create:
   Username: admin
   Email: admin@email.com
   Password: asdfggfdsa

    -   Option 1 (manually enter data):

    ```
    python manage.py createsuperuser
    ```

    -   Option 2 (auto fill data):

    ```
    echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@email.com', 'asdfggfdsa')" | python manage.py shell
    ```

# Project additional settings
1. Git
    -   Init git in root folder (project folder):
        ```
        git init
        ```
    -   Add to `.gitignore`
        ```
        **/__pycache__/**
        ```

## Linter:
1. Add linter to backend folder:
    [Ruff](https://docs.astral.sh/ruff/)
- Install `Ruff` for dev env:
    ```shell
    pipenv install -d ruff
    ```
- [Optionally] In `pipfile.py` lock the `ruff` version:
    - Check the version with:
        ```shell
        ruff --version
        ```
    - Then add it to `Pipfile` e.g.:
        ```                     shell
        [dev-packages]
        ruff = "=0.5.5"
        ```
    - Add `pyproject.toml` file to the root `backend` folder with content:
        ```toml
        [tool.ruff]
        line-length = 110
        target-version = "py312"


        [tool.ruff.lint]
        select = [
            # pycodestyle
            "E",
            # Pyflakes
            "F",
            # docstring formatting & presence
            "D",
            # pyupgrade
            "UP",
            # flake8-bugbear
            "B",
            # flake8-simplify
            "SIM",
            # isort
            "I",
            # Django-specific best practices
            "DJ",
        ]
        ignore = [
            # Module imported but unused (useful to ignore temporarily during development)
            # "F401",
            # multi-line docstring opening """ should start at the first line
            "D203",
            # multi-line docstring closing and opening """ should be on a line by itself
            "D212",
        ]

        [tool.ruff.format]
        quote-style = "double"
        docstring-code-format = true

        [tool.pytest.ini_options]
        DJANGO_SETTINGS_MODULE = "gars_is.settings"
        python_files = "tests.py test_*.py *_tests.py"
        ```
    -  Run `ruff` to check if everything is ok:
        ```shell
        ruff format .
        ```
    - Add `ruff` to `pre-commit` hooks:
        - Install `pre-commit`:
        ```shell
        pipenv install -d pre-commit
        ```
        - Create file `.pre-commit-config.yaml` next to `.git` folder with content:
        ```yaml
        repos:
        - repo: https://github.com/astral-sh/ruff-pre-commit
            # Ruff version.
            rev: v0.5.5
            hooks:
                # Run the linter.
                - id: ruff
                    args: [--fix]
                # Run the formatter.
                - id: ruff-format
        ```
        - Install `pre-commit` hooks:
        ```shell
        pre-commit install
        ```
        - You can run `pre-commit` manually with:
        ```shell
        pre-commit run --all-files
        ```

## Django configurations:
[django-configurations](https://django-configurations.readthedocs.io/en/stable/) is a Django app that allows you to use class-based settings in your Django project. It provides a way to organize your settings into different classes for different environments (e.g., development, production, testing) and makes it easier to manage environment-specific settings.

1. Install `django-configurations`
    ```
    pipenv install django-configurations
    ```

1. Change the `settings.py` that will look like this:
    ```py
    from pathlib import Path
    from configurations import Configuration


    class Base(Configuration):
        """
        Base settings for backend project.

        This class contains the common settings for all environments.
        It should be inherited by other settings classes for specific environments.
        For example:
        class Development(Base):
            DEBUG = True
            ALLOWED_HOSTS = ["*"]
        """

        # Build paths inside the project like this: BASE_DIR / 'subdir'.
        BASE_DIR = Path(__file__).resolve().parent.parent

        # Quick-start development settings - unsuitable for production
        # See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

        # SECURITY WARNING: keep the secret key used in production secret!
        SECRET_KEY = "django-insecure-tp0#vovvu0wdf_(2t2)sn=!#sw34r_*6z6ro!i#r#wetu!fv=="

        # SECURITY WARNING: don't run with debug turned on in production!
        DEBUG = False # <- CHANGE THIS TO FALSE, DEFAULT IS TRUE

        ALLOWED_HOSTS = []

        ##### And all the other default settings

    class Development(Base):
        """
        Development settings for backend project.

        This class contains the settings for the development environment.
        """

        DEBUG = True
        ALLOWED_HOSTS = ["*"]

        ##### And all the other development settings


    class Production(Base):
        """
        Production settings for backend project.

        This class contains the settings for the production environment.
        """

        DEBUG = False
        ALLOWED_HOSTS = ["your-production-domain.com"]

        ##### And all the other production settings

    class Staging(Base):
        """
        Staging settings for backend project.

        This class contains the settings for the staging environment.
        """

        DEBUG = False
        ALLOWED_HOSTS = ["your-staging-domain.com"]

        ##### And all the other staging settings
    ```

1. Use ENV variable to change environment:
    -   Install `python-dotenv` for manipulating ENV variables:
        ```
        pipenv install python-dotenv
        ```
    -   Create `.env` file in the root of your project with content:
        ```
        DJANGO_CONFIGURATION=Development
        # DJANGO_CONFIGURATION=Production
        # DJANGO_CONFIGURATION=Test
        ```


1. Change `manage.py`, `wsgi.py` and `asgi.py` files to load the environment variables from the `.env` file.
    - `manage.py`:
<!-- ```py
import os
import sys
from dotenv import load_dotenv

if __name__ == "__main__":
    load_dotenv()
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    os.environ.setdefault("DJANGO_CONFIGURATION", "Production")

    from configurations.management import execute_from_command_line

    execute_from_command_line(sys.argv)
``` -->
```py
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys

from dotenv import load_dotenv


def main():
    """Run administrative tasks."""
    load_dotenv()
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    os.environ.setdefault("DJANGO_CONFIGURATION", "Production")
    try:
        # from django.core.management import execute_from_command_line
        from configurations.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
```

If environment variable `DJANGO_CONFIGURATION` is not set, the default value will be `Production`.
    - `wsgi.py`:
```py
"""Django management script for the backend project."""

import os
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ.setdefault('DJANGO_CONFIGURATION', 'Production')

# ruff: noqa: E402
from configurations.wsgi import get_wsgi_application

application = get_wsgi_application()
```

    - `asgi.py`:
        If you are not serving your app via WSGI but ASGI instead, you need to modify your `asgi.py` file too:
```py
import os
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ.setdefault('DJANGO_CONFIGURATION', 'Production')

# ruff: noqa: E402
from configurations.asgi import get_asgi_application

application = get_asgi_application()
```



1. Add environment variable `DJANGO_CONFIGURATION: Development` to GitHub workflows, if you have any:
```yml
name: test_backend
on: [pull_request, push] # activates the workflow when there is a push or pull request in the repo
jobs:
test_project:
    runs-on: ubuntu-latest # operating system your code will run on
    env:
        DJANGO_CONFIGURATION: Test
    steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-python@v2
            with:
                python-version: "3.12"
        - run: pip install pipenv
        - name: Setup and run tests
            run: |
                pipenv install --dev
                pipenv run ruff check --output-format=github .
                pipenv run python manage.py test
```

1. Commit changes:

```
git add .
git commit -m "added `dev` and `production` settings files"
```

## Django admin documentation generator

[The Django admin documentation generator](https://docs.djangoproject.com/en/5.0/ref/contrib/admin/admindocs/)

# Django REST API
https://www.django-rest-framework.org/

## Installation
1. Install Django REST Framework:
```shell
pipenv install djangorestframework
```
2. Add it to `INSTALLED_APPS` in `settings.py`:
```py
INSTALLED_APPS = [
    ...,
    'rest_framework',
]
```


# Solving CORS issue

https://github.com/adamchainz/django-cors-headers/
Install from with `pipenv`:
```shell
pipenv install django-cors-headers
```

and then add it to your installed apps:
```py
INSTALLED_APPS = [
    ...,
    "corsheaders",
    ...,
]
```

You will also need to add a middleware class to listen in on responses:

```py
MIDDLEWARE = [
    ...,
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    ...,
]
```

Configure the middleware's behavior in your Django settings.

For **testing**, you can add inside `settings.py` into `development` class:
```py
CORS_ALLOW_ALL_ORIGINS = True
```

For **production** use:
```py
CORS_ALLOWED_ORIGINS = [
    "https://example.com",
    "https://sub.example.com",
    "http://localhost:8080",
    "http://127.0.0.1:9000",
]
```

All options are:
```py
CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGIN_REGEXES
CORS_ALLOW_ALL_ORIGINS
```
See Configuration section in Git link:
https://github.com/adamchainz/django-cors-headers#configuration
