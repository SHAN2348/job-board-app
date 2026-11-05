from django.urls import path
from .views import (
    JobListCreateAPIView,
    JobDetailAPIView,
    UserRegistrationAPIView,
    ApplicationListCreateAPIView,
    ApplicationStatusUpdateAPIView,
    CurrentUserAPIView,
    )


urlpatterns = [
    path('jobs/', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', JobDetailAPIView.as_view(), name='job-detail'),
    path('register/', UserRegistrationAPIView.as_view(), name='user-register'),
    path(
    'applications/',
    ApplicationListCreateAPIView.as_view(),
    name='application-list-create'),
    path(
    'applications/<int:pk>/status/',
    ApplicationStatusUpdateAPIView.as_view(),
    name='application-status-update'),
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),
]