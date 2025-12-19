from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Submission, PortfolioItem
from .serializers import SubmissionSerializer, PortfolioItemSerializer
import json
import os
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().order_by('-submitted_at')
    serializer_class = SubmissionSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'upload']:
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

class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all().order_by('-created_at')
    serializer_class = PortfolioItemSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
