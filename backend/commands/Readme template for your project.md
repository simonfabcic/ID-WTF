
# Backend

## Technologies

-   Backend
    -   Django
    -   Django REST framework

## Installation

1. Clone the repository:
    ```
    git clone ...
    ```

## Prepare working environment

1. Go into root directory
1. Prepare virtual environment (Python 3.12 required):
    - Install `pipenv`:
        ```
        pip install pipenv
        ```
    - Create virtual environment and install dependencies from `Pipfile.lock`:
        ```
        pipenv install -d
        ```
    - To activate this project's virtualenv, run:
        ```
        pipenv shell
        ```
    - [optional]
      rename `.\.env.example` to `.\.env` and set your env variables
1. Prepare the container with postgres DB:
    ```shell
    docker run --name auction-bay-db -e POSTGRES_USER=myusername -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
    ```

1. [Optional]
    - To create super user run command and follow the prompts:
        ```
        python manage.py createsuperuser
        ```

1. Run server in development mode on port 8456
    ```shell
    python manage.py runserver 8456
    ```

## Tests

1. Go into root directory:
1. And run:
    ```
    python manage.py test
    ```



# Frontend