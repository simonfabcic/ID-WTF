# Run this in Django shell: python manage.py shell

# Check if migrations created tables
from django.db import connection

# Test if models can be imported and created
print("Models imported successfully!")


tables = connection.introspection.table_names()
print("Available tables:", [t for t in tables if "idwtf" in t])
