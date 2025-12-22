from django.db import models
from django.utils import timezone
import json

class Submission(models.Model):
    STATUS_CHOICES = [
        ('Submitted', 'Submitted'),
        ('Reviewed', 'Reviewed'),
        ('Payment Pending', 'Payment Pending'),
        ('Payment Received', 'Payment Received'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)  # Using client-generated ID or fallback to UUID
    submitted_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Submitted')
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
    
    # Payment tracking
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_tx_ref = models.CharField(max_length=100, blank=True, null=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    # Admin tracking
    admin_notes = models.TextField(blank=True, null=True)
    assigned_to = models.CharField(max_length=100, blank=True, null=True)
    estimated_delivery = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.business_name} ({self.status})"
    
    @property
    def deposit_amount(self):
        """Calculate 50% deposit based on package"""
        prices = {'starter': 7000, 'business': 10000, 'dynamic': 14999}
        return prices.get(self.package_id, 10000) // 2

class PortfolioItem(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    url = models.URLField()
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title
