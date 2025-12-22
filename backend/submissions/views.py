from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from .models import Submission, PortfolioItem
from .serializers import SubmissionSerializer, PortfolioItemSerializer
import json
import os
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
from django.db.models import Count, Sum
from auraweb_backend.email_service import send_customer_confirmation, send_admin_notification, send_payment_request
from auraweb_backend.chapa_payment import ChapaPayment, get_deposit_amount

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().order_by('-submitted_at')
    serializer_class = SubmissionSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'upload', 'payment_callback', 'verify_payment']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        # Handle multipart form data
        if request.content_type.startswith('multipart/form-data'):
            data_str = request.data.get('data')
            if not data_str:
                return Response({'error': 'No data field provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                data = json.loads(data_str)
                print(f"DEBUG: Received data: {data.keys()}")
            except json.JSONDecodeError:
                return Response({'error': 'Invalid JSON in data field'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Handle files
            files = request.FILES.getlist('files')
            print(f"DEBUG: Received {len(files)} files")
            uploaded_urls = []
            
            for f in files:
                print(f"DEBUG: Processing file {f.name}")
                # Save file
                path = default_storage.save(f"uploads/{f.name}", ContentFile(f.read()))
                # Generate full URL
                full_url = request.build_absolute_uri(settings.MEDIA_URL + path)
                print(f"DEBUG: Generated URL {full_url}")
                uploaded_urls.append(full_url)
            
            # Update image_urls in data
            existing_urls = data.get('imageUrls', [])
            data['imageUrls'] = existing_urls + uploaded_urls
            print(f"DEBUG: Final imageUrls: {data['imageUrls']}")
            
            # Pass to serializer
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            # Send email notifications
            submission = serializer.instance
            try:
                send_customer_confirmation(submission)
                send_admin_notification(submission)
                print(f"✅ Emails sent for submission {submission.id}")
            except Exception as e:
                print(f"⚠️ Email sending failed: {e}")
                # Don't fail the request if email fails
            
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
    def upload(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        path = default_storage.save(f"uploads/{file_obj.name}", ContentFile(file_obj.read()))
        full_url = request.build_absolute_uri(settings.MEDIA_URL + path)
        
        return Response({'url': full_url})
    
    @action(detail=True, methods=['post'])
    def create_payment(self, request, pk=None):
        """Generate Chapa payment link for a submission"""
        submission = self.get_object()
        
        if submission.payment_status == 'paid':
            return Response({
                'error': 'Payment already completed',
                'status': 'paid'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        chapa = ChapaPayment()
        deposit = get_deposit_amount(submission.package_id)
        
        result = chapa.initialize_payment(submission, deposit)
        
        if result['success']:
            # Update submission with payment reference
            submission.payment_tx_ref = result['tx_ref']
            submission.payment_amount = deposit
            submission.status = 'Payment Pending'
            submission.save()
            
            # Send payment link email if customer has email
            if submission.email:
                try:
                    send_payment_request(submission, result['checkout_url'])
                except Exception as e:
                    print(f"⚠️ Payment email failed: {e}")
            
            return Response({
                'checkout_url': result['checkout_url'],
                'tx_ref': result['tx_ref'],
                'amount': deposit,
                'currency': 'ETB'
            })
        else:
            return Response({
                'error': result.get('error', 'Payment initialization failed')
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def payment_callback(self, request):
        """Chapa webhook callback for payment verification"""
        tx_ref = request.data.get('tx_ref') or request.query_params.get('tx_ref')
        
        if not tx_ref:
            return Response({'error': 'No transaction reference'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            submission = Submission.objects.get(payment_tx_ref=tx_ref)
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)
        
        chapa = ChapaPayment()
        result = chapa.verify_payment(tx_ref)
        
        if result['success'] and result['verified']:
            submission.payment_status = 'paid'
            submission.status = 'Payment Received'
            submission.paid_at = timezone.now()
            submission.save()
            
            return Response({
                'status': 'verified',
                'message': 'Payment verified successfully'
            })
        else:
            return Response({
                'status': 'failed',
                'error': result.get('error', 'Payment verification failed')
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def verify_payment(self, request):
        """Verify payment status (for customer return URL)"""
        tx_ref = request.query_params.get('tx_ref')
        
        if not tx_ref:
            return Response({'error': 'No transaction reference'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            submission = Submission.objects.get(payment_tx_ref=tx_ref)
            return Response({
                'status': submission.payment_status,
                'business_name': submission.business_name,
                'package': submission.package_id
            })
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics for admin"""
        total = Submission.objects.count()
        today = Submission.objects.filter(submitted_at__date=timezone.now().date()).count()
        pending = Submission.objects.filter(status='Submitted').count()
        in_progress = Submission.objects.filter(status='In Progress').count()
        completed = Submission.objects.filter(status='Completed').count()
        
        # Payment stats
        total_paid = Submission.objects.filter(payment_status='paid').aggregate(
            total=Sum('payment_amount')
        )['total'] or 0
        
        payment_pending = Submission.objects.filter(payment_status='pending', status__in=['Payment Pending', 'Reviewed']).count()
        
        # By package
        by_package = Submission.objects.values('package_id').annotate(count=Count('id'))
        
        return Response({
            'total_submissions': total,
            'today_submissions': today,
            'pending_review': pending,
            'in_progress': in_progress,
            'completed': completed,
            'total_revenue': float(total_paid),
            'pending_payments': payment_pending,
            'by_package': list(by_package),
        })

class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all().order_by('-created_at')
    serializer_class = PortfolioItemSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

