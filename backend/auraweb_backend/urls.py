"""
URL configuration for auraweb_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import json

from rest_framework.authtoken import views

# Custom login view that's CSRF-exempt for API usage
@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    
    try:
        data = json.loads(request.body)
        username = data.get('username', '')
        password = data.get('password', '')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return JsonResponse({
            'token': token.key,
            'user_id': user.id,
            'username': user.username
        })
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('submissions.urls')),
    path('api/api-token-auth/', views.obtain_auth_token),
    path('api/auth/login/', api_login, name='api_login'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

