"""
Create or reset admin superuser for AuraWeb
Run from the backend folder: python create_admin.py
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auraweb_backend.settings")
django.setup()

from django.contrib.auth.models import User

USERNAME = 'admin'
PASSWORD = 'auraweb2024'  # Change this to your desired password
EMAIL = 'admin@auraweb.com'

try:
    user = User.objects.filter(username=USERNAME).first()
    if user:
        # Reset password for existing user
        user.set_password(PASSWORD)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print(f"✅ Password reset for '{USERNAME}'")
    else:
        # Create new superuser
        User.objects.create_superuser(USERNAME, EMAIL, PASSWORD)
        print(f"✅ Superuser '{USERNAME}' created")
    
    print(f"\n🔐 Login credentials:")
    print(f"   Username: {USERNAME}")
    print(f"   Password: {PASSWORD}")
    print(f"\n🌐 Login at: https://auraweb-6.onrender.com/admin")
    
except Exception as e:
    print(f"❌ Error: {e}")
