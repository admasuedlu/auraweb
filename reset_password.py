import os
import django
import sys

sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auraweb_backend.settings")
django.setup()

from django.contrib.auth.models import User

try:
    u = User.objects.get(username='admin')
    u.set_password('password123')
    u.is_active = True
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print(f"User found. Password reset to 'password123'. Active: {u.is_active}")
except User.DoesNotExist:
    print("User 'admin' does not exist. Creating...")
    User.objects.create_superuser('admin', 'admin@example.com', 'password123')
    print("User 'admin' created with password 'password123'")
except Exception as e:
    print(f"Error: {e}")
