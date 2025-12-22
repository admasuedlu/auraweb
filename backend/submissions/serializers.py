from rest_framework import serializers
from .models import Submission, PortfolioItem

class SubmissionSerializer(serializers.ModelSerializer):
    # Mapping frontend camelCase fields to backend snake_case model fields
    submittedAt = serializers.DateTimeField(source='submitted_at', required=False)
    packageId = serializers.CharField(source='package_id')
    businessName = serializers.CharField(source='business_name')
    businessType = serializers.CharField(source='business_type')
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    googleMapsLink = serializers.CharField(source='google_maps_link', required=False, allow_blank=True)
    aboutUs = serializers.CharField(source='about_us')
    workingHours = serializers.CharField(source='working_hours')
    socialLinks = serializers.JSONField(source='social_links', required=False)
    primaryColor = serializers.CharField(source='primary_color')
    themeStyle = serializers.CharField(source='theme_style')
    specialNotes = serializers.CharField(source='special_notes', required=False, allow_blank=True)
    logoUrl = serializers.CharField(source='logo_url', required=False, allow_blank=True)
    imageUrls = serializers.JSONField(source='image_urls', required=False)
    
    # Payment fields
    paymentStatus = serializers.CharField(source='payment_status', required=False)
    paymentTxRef = serializers.CharField(source='payment_tx_ref', required=False, allow_blank=True, allow_null=True)
    paymentAmount = serializers.DecimalField(source='payment_amount', max_digits=10, decimal_places=2, required=False, allow_null=True)
    paidAt = serializers.DateTimeField(source='paid_at', required=False, allow_null=True)
    
    # Admin fields
    adminNotes = serializers.CharField(source='admin_notes', required=False, allow_blank=True, allow_null=True)
    assignedTo = serializers.CharField(source='assigned_to', required=False, allow_blank=True, allow_null=True)
    estimatedDelivery = serializers.DateField(source='estimated_delivery', required=False, allow_null=True)
    
    # Computed fields
    depositAmount = serializers.SerializerMethodField()
    
    def get_depositAmount(self, obj):
        return obj.deposit_amount

    class Meta:
        model = Submission
        fields = [
            'id', 'submittedAt', 'status', 'packageId', 'businessName',
            'businessType', 'phone', 'email', 'address', 'googleMapsLink',
            'aboutUs', 'services', 'workingHours', 'socialLinks',
            'language', 'primaryColor', 'themeStyle', 'specialNotes',
            'logoUrl', 'imageUrls',
            # Payment fields
            'paymentStatus', 'paymentTxRef', 'paymentAmount', 'paidAt', 'depositAmount',
            # Admin fields
            'adminNotes', 'assignedTo', 'estimatedDelivery'
        ]

class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'category', 'url', 'description', 'created_at']
