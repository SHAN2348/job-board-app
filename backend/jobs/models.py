from django.db import models

from django.conf import settings

# Create Your Code Here

class Job(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='posted_jobs',
    null=True,
    blank=True
)
    company_logo = models.URLField(blank=True)
    location = models.CharField(max_length=150)

    job_type = models.CharField(max_length=50)
    experience = models.CharField(max_length=100)

    salary_min = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    salary_max = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    salary_currency = models.CharField(
        max_length=10,
        default="INR"
    )

    posted_date = models.DateField()
    category = models.CharField(max_length=100)
    featured = models.BooleanField(default=False)

    description = models.TextField()
    responsibilities = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    benefits = models.JSONField(default=list)
    company_info = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company}"



# USER Choice selection

class UserProfile(models.Model):

    ROLE_CHOICES = [
        ('job_seeker', 'Job Seeker'),
        ('recruiter', 'Recruiter'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='job_seeker'
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# Create the Application

class Application(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    cover_letter = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.username} - {self.job.title}"