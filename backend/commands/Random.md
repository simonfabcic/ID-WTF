- Testing commands in Django environment:
	```
	python manage.py shell
	```

- Testing code from file:
```
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projectname.settings')
django.setup()

from appname.models import ModelOne, ModelTwo
from django.core.exceptions import ObjectDoesNotExist

# provide the code you want to test:
data = ModelOne(
  field_name = 'value',
  field_number = 12,
)
data.save()

for value in ["Value1", "Value2", "Value3"]:
  try:
	data = ModelTwo.objects.get(field_name=value)
  except ObjectDoesNotExist:
	data = ObjectTwo(
	  field_name=value,
	)
	data.save()
```

Then run
```
python filename.py
```