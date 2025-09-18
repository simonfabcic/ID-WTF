
Use Factory-boy for generating fake, but realistic data:
https://pypi.org/project/factory-boy/
https://faker.readthedocs.io/en/latest/
[Standard Providers](https://faker.readthedocs.io/en/master/providers.html)



```
pipenv install -d factory-boy
```

Try in terminal:
faker name
faker address
faker image_url

Run only one test:

```
python manage.py test appname.folder_with_test.file_with_tests.class.name_of_test
```


# If you want to check state of variable during running, use `breakpoint()`:
```
variable_name = YourModel.objects.get(id=model_id)
breakpoint()
```
To continue without interaction press `c` (as continue) and `enter`.