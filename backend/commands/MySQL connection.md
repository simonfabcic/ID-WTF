
# Connect to PostgreSQL

## Setting up the base

### Option 1: Starts a PostgreSQL container:

```
docker run --name my_project_db -e POSTGRES_USER=myusername -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

### Option 2: Creating Docker container with PostgresDB

Use this, if you have multiple containers

-   create file `docker-compose.yml` and add this content:

```
version: '3' # version
services:
  db: # server name
    image: postgres
    restart: always
    volumes:
      - ./data/db:/var/lib/postgresql/data
      # ./data/db - location on physical machine
      # /var/lib/postgresql/data <- location in PostgreSQL container
    ports:
      - 5432:5432 # port forwarding

    environment:
      - POSTGRES_DB=testDB # database
      - POSTGRES_USER=postgres # username
      - POSTGRES_PASSWORD=postgres # password

  # adminer is graphical interface for managing databases
  # if you want to create this service, uncomment next lines (when container running, adminer is accessable at `localhost:8080`):
  # adminer:
  #  image: adminer
  #  restart: always
  #  ports:
  #    - 8080:8080
```

-   Run `docker compose up -d`
    `-d` tells Docker Compose to start the services defined in your `docker-compose.yml` file in the background, detached from the terminal. This means that you can continue to use your terminal for other tasks while your services are running in the background.

## Connect to DB from Django app

**This is not checked**

1. Install psycopg2 if it isn't

```
pipenv install psycopg2
```

2. Into your project folder find the file `settings.py`.
   In the class `Development`
   Find section `DATABASES` and change to following code:

```
##### Other clases

class Development(Base):
    DEBUG = True

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "postgres",
            "USER": "myusername",
            "PASSWORD": "mysecretpassword",
            "HOST": "localhost",
            "PORT": "5432",
        }
    }

	##### And all the other development settings
```

3. Apply database migrations:

```
python manage.py migrate
```

4. Every time you change the model field/s, you have to run:

-   creates migration files based on changes to models:

```
python manage.py makemigrations
```

-   applies the migration files to the database, updating the schema

```
python manage.py migrate
```

## Add Postgres to GitHub Actions

1. In `settings.py` edit Test settings class for testing:

```
class Test(Base):
    DEBUG = True

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "test",
            "USER": "myusername",
            "PASSWORD": "mysecretpassword",
            "HOST": "localhost",
            "PORT": "5432",
        }
    }

	##### And all the other test settings
```

2. To `test.yml` add commands for testing with Postgres DB:
   [Source](https://www.hacksoft.io/blog/github-actions-in-action-setting-up-django-and-postgres#adding-postgres)
   `\.github\workflows\test.yml`:

```yml
name: test_backend
on: [pull_request, push] # activates the workflow when there is a push or pull request in the repo
jobs:
    test_project:
        runs-on: ubuntu-latest # operating system your code will run on
        env:
            DJANGO_CONFIGURATION: Test
        services:
            postgres:
                image: postgres:latest
                env:
                    POSTGRES_DB: postgres
                    POSTGRES_USER: myusername
                    POSTGRES_PASSWORD: mysecretpassword
                ports:
                    - 5432:5432
                # needed because the postgres container does not provide a healthcheck
                options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
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
                  pipenv run python manage.py migrate
                  pipenv run python manage.py test

```
