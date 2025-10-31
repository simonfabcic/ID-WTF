# ID-WTF

Application for adding notes, which you don't want to forget (I don't want to forget)

## Features

Adding the ID-WTFs, which contains:

-   Title
-   Source
-   Content
-   Timestamp (auto add)

## Implemented later

-   Tags (custom user tags)
-   Likes (`WTF!` Wow, thats fascinating / `Nod` Like, I agree)
-   Comments (maybe)
-   Export
-   Search
-   Share
-   On home page show ID-WTFs from connections (`ID-link` / `WTFans`)

## Development

[Flow chart](https://www.figma.com/board/5RspyDWSauSqpnul3UkK4m/ID-WTF--I-dont---want-to-forget-?node-id=0-1&p=f&t=DIUv2Xb5AGBKWDHR-0)

```shell
git clone https://github.com/simonfabcic/ID-WTF
```

### Backend

```shell
cd ./ID-WTF/backend/
pipenv shell
pipenv install --dev
# prepare data:
py manage.py migrate
py manage.py init_db
py manage.py seed_realistic
# run server:
py manage.py runserver
```

### Frontend

```shell
cd ./ID-WTF/frontend/
npm install
npm run dev
```
