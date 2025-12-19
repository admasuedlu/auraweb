import os
import django
import sys

# Add backend to path so we can import modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auraweb_backend.settings")
django.setup()

from submissions.models import Submission

try:
    latest = Submission.objects.order_by('-submitted_at').first()
    if latest:
        print(f"Latest Submission ID: {latest.id}")
        print(f"Image URLs type: {type(latest.image_urls)}")
        print(f"Image URLs value: {latest.image_urls}")
    else:
        print("No submissions found.")
except Exception as e:
    print(f"Error: {e}")
