import os
import json
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from jobs.models import Job

# Read JSON data
with open("jobs/initial_jobs.json", "r", encoding="utf-8") as file:
    jobs_data = json.load(file)

# Import jobs into MySQL
for item in jobs_data:
    Job.objects.update_or_create(
        id=item["id"],
        defaults={
            "title": item["title"],
            "company": item["company"],
            "company_logo": item["companyLogo"],
            "location": item["location"],
            "job_type": item["type"],
            "experience": item["experience"],
            "salary_min": item["salary"]["min"],
            "salary_max": item["salary"]["max"],
            "salary_currency": item["salary"]["currency"],
            "posted_date": item["postedDate"],
            "category": item["category"],
            "featured": item["featured"],
            "description": item["description"],
            "responsibilities": item["responsibilities"],
            "skills": item["skills"],
            "benefits": item["benefits"],
            "company_info": item["companyInfo"],
        },
    )

print(f"Successfully imported {len(jobs_data)} jobs!")