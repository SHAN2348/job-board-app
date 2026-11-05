from rest_framework.permissions import BasePermission


class IsRecruiterOrAdmin(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_superuser:
            return True

        return (
            hasattr(user, 'profile')
            and user.profile.role == 'recruiter'
        )

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_superuser:
            return True

        return obj.created_by == user


# Create a custom Permission

class IsApplicationOwnerOrAdmin(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        return (
            user
            and user.is_authenticated
            and (
                user.is_superuser
                or (
                    hasattr(user, 'profile')
                    and user.profile.role == 'recruiter'
                )
            )
        )

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_superuser:
            return True

        return obj.job.created_by == user