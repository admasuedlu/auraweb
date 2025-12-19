from django.db import models
from django.utils import timezone
import json

class Submission(models.Model):
    id = models.CharField(max_length=50, primary_key=True)  # Using client-generated ID or fallback to UUID
    submitted_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50, default='Submitted')
    package_id = models.CharField(max_length=50)
    business_name = models.CharField(max_length=255)
    business_type = models.CharField(max_length=100)
    phone = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    address = models.CharField(max_length=255)
    google_maps_link = models.URLField(blank=True, null=True)
    
    about_us = models.TextField(blank=True)
    services = models.JSONField(default=list)  # Stores array of strings
    working_hours = models.CharField(max_length=255, blank=True)
    social_links = models.JSONField(default=dict)
    
    language = models.CharField(max_length=50)
    primary_color = models.CharField(max_length=50)
    theme_style = models.CharField(max_length=50)
    special_notes = models.TextField(blank=True, null=True)
    
    logo_url = models.URLField(blank=True, null=True)
    image_urls = models.JSONField(default=list)  # Stores array of URLs

    def __str__(self):
        return f"{self.business_name} ({self.status})"

class PortfolioItem(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    url = models.URLField()
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title
