from rest_framework.filters import SearchFilter

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from rest_framework import generics , filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Job
from .serializers import JobSerializer

from .user_serializers import UserRegistrationSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated



from .permissions import IsRecruiterOrAdmin

from .models import Application
from .serializers import ApplicationSerializer

from .permissions import IsApplicationOwnerOrAdmin

from .serializers import ApplicationStatusUpdateSerializer

# To Create Jobs

class JobListCreateAPIView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by("-created_at")
    serializer_class = JobSerializer

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        'title',
        'company',
        'location',
        'category',
        'skills',
    ]

    filterset_fields = [
        'location',
        'category',
        'job_type',
        'experience',
        'featured',
    ]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsRecruiterOrAdmin()]

        return []

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# To Retrive,Update,Delete Jobs

class JobDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    # Authenticate 
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsRecruiterOrAdmin()]
        return []

class UserRegistrationAPIView(APIView):

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "User registered successfully!",
                    "user": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

# Application 

class ApplicationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    # Search applicants by username or email.
    filter_backends = [SearchFilter]
    search_fields = [
        'user__username',
        'user__email',
    ]

    def get_queryset(self):
        user = self.request.user

        queryset = Application.objects.select_related(
            'user',
            'job',
            'job__created_by'
        ).order_by('-applied_at')

        if user.is_superuser:
            return queryset

        if not hasattr(user, 'profile'):
            return queryset.none()

        if user.profile.role == 'job_seeker':
            queryset = queryset.filter(user=user)

        elif user.profile.role == 'recruiter':
            queryset = queryset.filter(job__created_by=user)

        else:
            return queryset.none()

        status = self.request.query_params.get('status')

        if status:
            queryset = queryset.filter(status=status)

        job_id = self.request.query_params.get('job')

        if job_id:
            queryset = queryset.filter(job_id=job_id)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user

        if not hasattr(user, 'profile'):
            raise ValidationError("User profile not found.")

        if user.profile.role != 'job_seeker':
            raise ValidationError(
                "Only job seekers can apply for jobs."
            )

        job = serializer.validated_data['job']

        if Application.objects.filter(user=user, job=job).exists():
            raise ValidationError(
                "You have already applied for this job."
            )

        serializer.save(user=user)

# Application status-update view

class ApplicationStatusUpdateAPIView(generics.UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [IsApplicationOwnerOrAdmin]
    http_method_names = ['patch', 'options', 'head']

# Create the /api/me/ endpoint
class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_superuser:
            role = 'admin'
        elif hasattr(user, 'profile'):
            role = user.profile.role
        else:
            role = 'unknown'

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': role,
            'is_superuser': user.is_superuser,
        })