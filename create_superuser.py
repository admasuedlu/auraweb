import os
import django
import sys

sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auraweb_backend.settings")
django.setup()

from django.contrib.auth.models import User

username = 'admin'
password = 'password123'
email = 'admin@example.com'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created with password '{password}'")
else:
    print(f"Superuser '{username}' already exists")
