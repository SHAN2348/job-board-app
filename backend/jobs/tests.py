from jobs.models import Job, UserProfile, Application

from rest_framework.test import APITestCase
from rest_framework import status

from django.contrib.auth import get_user_model


# Create your tests here.

# first automated test
class JobAPITests(APITestCase):

    def test_anyone_can_view_jobs(self):
        response = self.client.get('/api/jobs/')

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )


    # Test recruiter-only job creation
    def setUp(self):
        User = get_user_model()

        self.recruiter = User.objects.create_user(
            username="test_recruiter",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=self.recruiter,
            role="recruiter"
        )


    def test_recruiter_can_create_job(self):
        self.client.force_authenticate(user=self.recruiter)

        job_data = {
            "title": "Junior Python Developer",
            "company": "Test Technologies",
            "location": "Hyderabad",
            "job_type": "Full-time",
            "experience": "Fresher",
            "salary_min": "25000.00",
            "salary_max": "40000.00",
            "salary_currency": "INR",
            "posted_date": "2026-11-02",
            "category": "Engineering",
            "featured": False,
            "description": "Looking for a Python developer.",
            "responsibilities": ["Develop REST APIs"],
            "skills": ["Python", "Django"],
            "benefits": ["Training"],
            "company_info": {
                "about": "A software development company."
            }
        }

        response = self.client.post(
            "/api/jobs/",
            job_data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )


    # Test that job seekers cannot create jobs
    def test_job_seeker_cannot_create_job(self):
        User = get_user_model()

        seeker = User.objects.create_user(
            username="test_seeker",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=seeker,
            role="job_seeker"
        )

        self.client.force_authenticate(user=seeker)

        job_data = {
            "title": "Unauthorized Job",
            "company": "Test Company",
            "location": "Hyderabad",
            "job_type": "Full-time",
            "experience": "Fresher",
            "salary_min": "20000.00",
            "salary_max": "30000.00",
            "salary_currency": "INR",
            "posted_date": "2026-11-02",
            "category": "Engineering",
            "featured": False,
            "description": "Testing job seeker permissions.",
            "responsibilities": [],
            "skills": ["Python"],
            "benefits": [],
            "company_info": {}
        }

        response = self.client.post(
            "/api/jobs/",
            job_data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    # Test job ownership
    def test_recruiter_cannot_update_another_recruiters_job(self):
        User = get_user_model()

        recruiter_b = User.objects.create_user(
            username="recruiter_b",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=recruiter_b,
            role="recruiter"
        )

        # Create a job owned by Recruiter B
        job = Job.objects.create(
            title="Recruiter B Job",
            company="Test Company",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Testing ownership permissions.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=recruiter_b
        )

        # Authenticate as Recruiter A (created in setUp)
        self.client.force_authenticate(user=self.recruiter)

        response = self.client.patch(
            f"/api/jobs/{job.id}/",
            {"title": "Unauthorized Update"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )


    # Test successful job ownership update
    def test_recruiter_can_update_own_job(self):
        job = Job.objects.create(
            title="Original Python Developer",
            company="Test Company",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Original description.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        self.client.force_authenticate(user=self.recruiter)

        response = self.client.patch(
            f"/api/jobs/{job.id}/",
            {"title": "Updated Python Developer"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        job.refresh_from_db()

        self.assertEqual(
            job.title,
            "Updated Python Developer"
        )


    # Test job deletion permissions

    # Test 1 — Cannot delete another recruiter's job

    def test_recruiter_cannot_delete_another_recruiters_job(self):
        User = get_user_model()

        recruiter_b = User.objects.create_user(
            username="recruiter_b_delete",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=recruiter_b,
            role="recruiter"
        )

        job = Job.objects.create(
            title="Recruiter B Job",
            company="Test Company",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Testing delete permissions.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=recruiter_b
        )

        self.client.force_authenticate(user=self.recruiter)

        response = self.client.delete(f"/api/jobs/{job.id}/")

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        self.assertTrue(Job.objects.filter(id=job.id).exists())


        # Test 2 — Can delete own job
    
    def test_recruiter_can_delete_own_job(self):
        job = Job.objects.create(
            title="My Test Job",
            company="Test Company",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Testing delete operation.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        self.client.force_authenticate(user=self.recruiter)

        response = self.client.delete(f"/api/jobs/{job.id}/")

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        self.assertFalse(Job.objects.filter(id=job.id).exists())

        # Test job detail retrieval
    
    def test_anyone_can_view_job_details(self):
        job = Job.objects.create(
            title="Python Backend Developer",
            company="Test Company",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Backend development role.",
            responsibilities=[],
            skills=["Python", "Django"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(f"/api/jobs/{job.id}/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data["title"],
            "Python Backend Developer"
        )

    def test_user_can_search_jobs_by_company(self):
        Job.objects.create(
            title="Backend Developer",
            company="Google Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Backend development role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?search=Google"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            any(
                "Google" in job["company"]
                for job in response.data["results"]
            )
        )

# Test job search

    def test_user_can_search_jobs_by_title(self):
        Job.objects.create(
            title="Python Backend Developer",
            company="Test Company",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Python development role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?search=Python"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            any(
                "Python" in job["title"]
                for job in response.data["results"]
            )
        )

    def test_user_can_search_jobs_by_location(self):
        Job.objects.create(
            title="Django Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Backend development role.",
            responsibilities=[],
            skills=["Django"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?search=Hyderabad"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            any(
                "Hyderabad" in job["location"]
                for job in response.data["results"]
            )
        )

    # Search jobs by category
    def test_user_can_search_jobs_by_category(self):
        Job.objects.create(
            title="Python Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Software engineering role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?search=Engineering"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            any(
                "Engineering" in job["category"]
                for job in response.data["results"]
            )
        )

    # Test filtering jobs by job type

    def test_user_can_filter_jobs_by_job_type(self):
        Job.objects.create(
            title="Python Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Software development role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?job_type=Full-time"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            all(
                job["job_type"] == "Full-time"
                for job in response.data["results"]
            )
        )

    # Filter jobs by experience

    def test_user_can_filter_jobs_by_experience(self):
        Job.objects.create(
            title="Junior Python Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Entry-level Python role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?experience=Fresher"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            all(
                job["experience"] == "Fresher"
                for job in response.data["results"]
            )
        )

    # Filter jobs by category

    def test_user_can_filter_jobs_by_category(self):
        Job.objects.create(
            title="Python Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Software development role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?category=Engineering"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            all(
                job["category"] == "Engineering"
                for job in response.data["results"]
            )
        )

    # Filter featured jobs

    def test_user_can_filter_featured_jobs(self):
        Job.objects.create(
            title="Featured Python Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=True,
            description="Featured software development role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?featured=true"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            all(
                job["featured"] is True
                for job in response.data["results"]
            )
        )

        # Combine job filters

    def test_user_can_combine_job_filters(self):
        Job.objects.create(
            title="Python Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=True,
            description="Python development role.",
            responsibilities=[],
            skills=["Python"],
            benefits=[],
            company_info={},
            created_by=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/?job_type=Full-time&experience=Fresher"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertTrue(
            all(
                job["job_type"] == "Full-time"
                and job["experience"] == "Fresher"
                for job in response.data["results"]
            )
        )

    # Test pagination

    def test_job_list_returns_paginated_response(self):
        for i in range(7):
            Job.objects.create(
                title=f"Python Developer {i}",
                company="Test Technologies",
                location="Hyderabad",
                job_type="Full-time",
                experience="Fresher",
                salary_min=20000,
                salary_max=30000,
                salary_currency="INR",
                posted_date="2026-11-02",
                category="Engineering",
                featured=False,
                description="Python development role.",
                responsibilities=[],
                skills=["Python"],
                benefits=[],
                company_info={},
                created_by=self.recruiter
            )

        response = self.client.get("/api/jobs/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)

        self.assertEqual(len(response.data["results"]), 5)

    # Test the second pagination page
    def test_job_pagination_second_page(self):
        for i in range(7):
            Job.objects.create(
                title=f"Developer {i}",
                company="Test Company",
                location="Hyderabad",
                job_type="Full-time",
                experience="Fresher",
                salary_min=20000,
                salary_max=30000,
                salary_currency="INR",
                posted_date="2026-11-02",
                category="Engineering",
                featured=False,
                description="Testing pagination.",
                responsibilities=[],
                skills=["Python"],
                benefits=[],
                company_info={},
                created_by=self.recruiter
            )

        response = self.client.get("/api/jobs/?page=2")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertIsNotNone(response.data["previous"])

    # Test job application submission.

class ApplicationAPITests(APITestCase):

    def setUp(self):
        User = get_user_model()

        # Create a job seeker
        self.seeker = User.objects.create_user(
            username="application_seeker",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=self.seeker,
            role="job_seeker"
        )

        # Create a recruiter
        self.recruiter = User.objects.create_user(
            username="application_recruiter",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=self.recruiter,
            role="recruiter"
        )

        # Create a job owned by the recruiter
        self.job = Job.objects.create(
            title="Python Backend Developer",
            company="Test Technologies",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Python backend developer position.",
            responsibilities=["Develop APIs"],
            skills=["Python", "Django"],
            benefits=["Training"],
            company_info={},
            created_by=self.recruiter
        )

    def test_job_seeker_can_apply_for_job(self):
        self.client.force_authenticate(user=self.seeker)

        application_data = {
            "job": self.job.id,
            "cover_letter": "I am interested in this Python Developer position."
        }

        response = self.client.post(
            "/api/applications/",
            application_data,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertTrue(
            Application.objects.filter(
                user=self.seeker,
                job=self.job
            ).exists()
        )

    # Test duplicate applications

    def test_job_seeker_cannot_apply_twice(self):
        self.client.force_authenticate(user=self.seeker)

        # First application
        Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        # Second application
        response = self.client.post(
            "/api/applications/",
            {
                "job": self.job.id,
                "cover_letter": "Applying again."
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_recruiter_cannot_apply_for_job(self):
        self.client.force_authenticate(user=self.recruiter)

        response = self.client.post(
            "/api/applications/",
            {
                "job": self.job.id,
                "cover_letter": "I want to apply."
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    # Job seekers cannot view other users' applications

    def test_job_seeker_can_only_view_own_applications(self):
    # Create an application for another job seeker
        another_seeker = get_user_model().objects.create_user(
            username="another_seeker",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=another_seeker,
            role="job_seeker"
        )

        Application.objects.create(
            user=another_seeker,
            job=self.job
        )

        # Authenticate as the first job seeker
        self.client.force_authenticate(user=self.seeker)

        response = self.client.get("/api/applications/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data["results"]),
            0
        )

    # Recruiters can only view applications for their own jobs

    def test_recruiter_can_only_view_own_job_applications(self):
        # Create an application for the recruiter's job
        Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        # Create another recruiter
        another_recruiter = get_user_model().objects.create_user(
            username="another_recruiter",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=another_recruiter,
            role="recruiter"
        )

        # Create a job owned by another recruiter
        another_job = Job.objects.create(
            title="Java Developer",
            company="Another Company",
            location="Hyderabad",
            job_type="Full-time",
            experience="Fresher",
            salary_min=20000,
            salary_max=30000,
            salary_currency="INR",
            posted_date="2026-11-02",
            category="Engineering",
            featured=False,
            description="Java developer position.",
            responsibilities=[],
            skills=["Java"],
            benefits=[],
            company_info={},
            created_by=another_recruiter
        )

        Application.objects.create(
            user=self.seeker,
            job=another_job
        )

        # Authenticate as the first recruiter
        self.client.force_authenticate(user=self.recruiter)

        response = self.client.get("/api/applications/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data["results"]),
            1
        )

        self.assertEqual(
            response.data["results"][0]["job"],
            self.job.id
        )

    # Application status permissions

    def test_job_seeker_cannot_update_application_status(self):
        application = Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        self.client.force_authenticate(user=self.seeker)

        response = self.client.patch(
            f"/api/applications/{application.id}/status/",
            {"status": "shortlisted"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        application.refresh_from_db()

        self.assertEqual(
            application.status,
            "pending"
        )

    # Recruiter can update application status

    def test_recruiter_can_update_application_status(self):
        application = Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        self.client.force_authenticate(user=self.recruiter)

        response = self.client.patch(
            f"/api/applications/{application.id}/status/",
            {"status": "shortlisted"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        application.refresh_from_db()

        self.assertEqual(
            application.status,
            "shortlisted"
        )

    # Another recruiter cannot update the application

    def test_recruiter_cannot_update_another_recruiters_application(self):
        application = Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        another_recruiter = get_user_model().objects.create_user(
            username="unauthorized_recruiter",
            password="TestPassword123"
        )

        UserProfile.objects.create(
            user=another_recruiter,
            role="recruiter"
        )

        self.client.force_authenticate(user=another_recruiter)

        response = self.client.patch(
            f"/api/applications/{application.id}/status/",
            {"status": "shortlisted"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

        application.refresh_from_db()

        self.assertEqual(application.status, "pending")

    # Invalid application status
    def test_recruiter_cannot_set_invalid_application_status(self):
        application = Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        self.client.force_authenticate(user=self.recruiter)

        response = self.client.patch(
            f"/api/applications/{application.id}/status/",
            {"status": "hired"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        application.refresh_from_db()

        self.assertEqual(
            application.status,
            "pending"
        )

    # Admin can update application status

    def test_admin_can_update_application_status(self):
        User = get_user_model()

        admin = User.objects.create_superuser(
            username="test_admin",
            email="admin@example.com",
            password="TestPassword123"
        )

        application = Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        self.client.force_authenticate(user=admin)

        response = self.client.patch(
            f"/api/applications/{application.id}/status/",
            {"status": "reviewed"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        application.refresh_from_db()

        self.assertEqual(application.status, "reviewed")

    # Test unauthenticated access
    def test_unauthenticated_user_cannot_apply_for_job(self):
        response = self.client.post(
            "/api/applications/",
            {
                "job": self.job.id,
                "cover_letter": "I want to apply."
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    # Unauthenticated users cannot view applications

    def test_unauthenticated_user_cannot_view_applications(self):
        response = self.client.get("/api/applications/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    # Test application filtering by status
    def test_job_seeker_can_filter_applications_by_status(self):
        Application.objects.create(
            user=self.seeker,
            job=self.job,
            status="pending"
        )

        self.client.force_authenticate(user=self.seeker)

        response = self.client.get(
            "/api/applications/?status=pending"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data["results"]),
            1
        )

        self.assertEqual(
            response.data["results"][0]["status"],
            "pending"
        )

    # Filter applications by job ID
    def test_job_seeker_can_filter_applications_by_job(self):
        Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        self.client.force_authenticate(user=self.seeker)

        response = self.client.get(
            f"/api/applications/?job={self.job.id}"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data["results"]),
            1
        )

        self.assertEqual(
            response.data["results"][0]["job"],
            self.job.id
        )

    # Combine both filters

    def test_job_seeker_can_combine_application_filters(self):
        Application.objects.create(
            user=self.seeker,
            job=self.job,
            status="pending"
        )

        self.client.force_authenticate(user=self.seeker)

        response = self.client.get(
            f"/api/applications/?status=pending&job={self.job.id}"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data["results"]),
            1
        )

        self.assertEqual(
            response.data["results"][0]["status"],
            "pending"
        )

        self.assertEqual(
            response.data["results"][0]["job"],
            self.job.id
        )

    

    # Search jobs by company name

    search_fields = [
    'title',
    'company',
    'location',
    'category',
    'skills'
]

    # Test Application API pagination

    def test_application_pagination_second_page(self):
        User = get_user_model()

        for i in range(7):
            seeker = User.objects.create_user(
                username=f"pagination_seeker_{i}",
                password="testpass123"
            )

            UserProfile.objects.create(
                user=seeker,
                role="job_seeker"
            )

            Application.objects.create(
                user=seeker,
                job=self.job
            )

        self.client.force_authenticate(user=self.recruiter)

        response = self.client.get("/api/applications/?page=2")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 7)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertIsNotNone(response.data["previous"])

            # Application API search
    def test_recruiter_can_search_applications_by_username(self):
        Application.objects.create(
            user=self.seeker,
            job=self.job
        )
        self.client.force_authenticate(user=self.recruiter)

        response = self.client.get(
            "/api/applications/?search=" + self.seeker.username
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(
            response.data["results"][0]["applicant_username"],
            self.seeker.username
        )

    # Search applications by email
    def test_recruiter_can_search_applications_by_email(self):
        Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        self.client.force_authenticate(user=self.recruiter)

        response = self.client.get(
            "/api/applications/?search=" + self.seeker.email
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(
            response.data["results"][0]["applicant_email"],
            self.seeker.email
        )

            # Test unauthenticated application search
    def test_unauthenticated_user_cannot_search_applications(self):
        response = self.client.get(
            "/api/applications/?search=test"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )
            # Test invalid application status filtering
    def test_job_seeker_filter_by_invalid_application_status(self):
        Application.objects.create(
            user=self.seeker,
            job=self.job
        )

        self.client.force_authenticate(user=self.seeker)

        response = self.client.get(
            "/api/applications/?status=invalid"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

# Registration API security tests

class RegistrationAPITests(APITestCase):

    def test_public_registration_creates_job_seeker(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "new_job_seeker",
                "email": "seeker@example.com",
                "password": "SecurePass123"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        user = get_user_model().objects.get(
            username="new_job_seeker"
        )

        self.assertEqual(
            user.profile.role,
            "job_seeker"
        )

    def test_public_registration_rejects_recruiter_role(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "new_recruiter",
                "email": "recruiter@example.com",
                "password": "SecurePass123",
                "role": "recruiter"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        self.assertFalse(
            get_user_model().objects.filter(
                username="new_recruiter"
            ).exists()
        )