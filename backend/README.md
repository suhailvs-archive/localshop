## Django Backend

```
$ cp .env.example .env
$ pip install -r requirements.txt
$ ./manage.py migrate
$ ./manage.py loaddata datas.json
```

to dump data: `./manage.py dumpdata api.Product --indent=4 > datas.json` and copy the offering folder