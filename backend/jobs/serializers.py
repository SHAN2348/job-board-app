from rest_framework import serializers
from .models import Job
from .models import Application


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['created_by']


class ApplicationSerializer(serializers.ModelSerializer):
    applicant_username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    applicant_email = serializers.EmailField(
        source='user.email',
        read_only=True
    )

    job_title = serializers.CharField(
        source='job.title',
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            'id',
            'user',
            'applicant_username',
            'applicant_email',
            'job',
            'job_title',
            'cover_letter',
            'status',
            'applied_at',
        ]

        read_only_fields = [
            'id',
            'user',
            'status',
            'applied_at',
        ]

# separate serializer for status update
class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']