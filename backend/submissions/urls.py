from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubmissionViewSet, PortfolioItemViewSet

router = DefaultRouter()
router.register(r'submissions', SubmissionViewSet)
router.register(r'portfolio', PortfolioItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload/', SubmissionViewSet.as_view({'post': 'upload'}), name='upload'),
]
