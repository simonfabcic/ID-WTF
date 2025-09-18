# HTTPIE

We can test our endpoints using [curl](https://curl.se/) or [httpie](https://github.com/httpie/cli#installation).
Httpie is a user friendly http client that's written in Python.

You can install `httpie` in global:

```
pip install httpie
```

## Usage:

1. GET:

    ```shell
    http GET http://127.0.0.1:8000/snippets
    ```

    GET control the format of the response that we get back, using `Accept` header:

    ```shell
    http GET http://127.0.0.1:8000/snippets/ Accept:application/json  # Request JSON
    http GET http://127.0.0.1:8000/snippets/ Accept:text/html         # Request HTML
    ```

    GET data by appending a format suffix:

    ```shell
    http GET http://127.0.0.1:8000/snippets.json  # JSON suffix
    http GET http://127.0.0.1:8000/snippets.api   # Browsable API suffix
    ```

    Protected endpoint:

    ```shell
    http --auth admin:password GET http://127.0.0.1:8000/skies/ Accept:'application/json' indent:=4
    http --auth admin GET http://127.0.0.1:8000/skies/ Accept:'application/json' indent:=4
    ```

1. POST  
   Control the format of the request that we send, using the `Content-Type` header:  
   POST using form data:

    ```shell
    http --form POST http://127.0.0.1:8000/snippets/ data="print(123)"
    ```

    POST using JSON:

    ```shell
    http --json POST http://127.0.0.1:8000/snippets/ data="print(456)"
    ```

1. Adding credentials:

    ```shell
    http -a admin:password123 POST http://127.0.0.1:8000/snippets/ code="print(789)"
    ```

1. Debuging  
   If you add a `--debug` switch to the `http` requests, you will be able to see the request type in request headers.

---

# Testing unprotected endpoint

```shell
http POST http://127.0.0.1:8000/skies/ description="Perfect skies" owner="Person One" price:=255
```

# Testing protected endpoint (session token)

https://afdezl.github.io/post/authentication-react-native-django-1/

1. Getting protected endpoint with username and password

```shell
http --auth admin:asdfggfdsa GET http://127.0.0.1:8000/skies/ Accept:'application/json' indent:=4
```

1. Getting token
   https://chatgpt.com/c/4406d62a-e65e-45e0-a79f-bf0ee4e2449b
    1. Fetch the CSRF Token:
        ```shell
        http GET http://localhost:8000/api-auth/login/
        ```
        This command should return a response with a `Set-Cookie` header containing the `csrftoken`.
        It will look something like this:
        ```shell
        Set-Cookie: csrftoken=wCZStdFMu2mx0T5LVn8UttDluxfKvfij; expires=Fri, 22 Aug 2025 11:15:30 GMT; Max-Age=31449600; Path=/; SameSite=Lax
        ```
        The value after `csrftoken=` is the token you need to include in your subsequent request.
    1. Login with CSRF token included in header:
       If you have troubles with redirect, try use `next=`: `http --form POST http://localhost:8000/api-auth/login/?next=/api`
        ```shell
        http --form POST http://localhost:8000/api-auth/login/?next=/api username=admin password=asdfggfdsa Cookie:csrftoken=wCZStdFMu2mx0T5LVn8UttDluxfKvfij X-CSRFToken:wCZStdFMu2mx0T5LVn8UttDluxfKvfij
        ```
    1. Check the Response for the `Session Token`
       If the login is successful, you should receive a `Set-Cookie` header with the `sessionid`, which you can use for subsequent authenticated requests.
        ```shell
        Set-Cookie: csrftoken=0rRFsDdCDZ4KmowOePosE92Ul9xC1MJ7; expires=Fri, 22 Aug 2025 11:54:36 GMT; Max-Age=31449600; Path=/; SameSite=Lax
        Set-Cookie: sessionid=0zcobv2mz6h7qsp742tjylw48txdwb3v; expires=Fri, 06 Sep 2024 11:54:36 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax
        ```
    1. Sending a Request with Cookies:
        ```shell
        http GET http://localhost:8000/skies/ Cookie:"csrftoken=0rRFsDdCDZ4KmowOePosE92Ul9xC1MJ7; sessionid=0zcobv2mz6h7qsp742tjylw48txdwb3v"
        ```
