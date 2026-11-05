from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Job, UserProfile, Application


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'company',
        'location',
        'job_type',
        'featured',
        'created_by',
    )

    list_filter = ('featured', 'job_type', 'category')
    search_fields = ('title', 'company', 'location')
    list_editable = ('featured',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'job', 'status', 'applied_at')
    list_filter = ('status',)
