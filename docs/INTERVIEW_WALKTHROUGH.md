# Interview Walkthrough

## 60-second introduction

"I built a full-stack Job Board application using React 19 and Vite for the frontend, and Python with Django REST Framework for the backend. Users can browse jobs, register as job seekers, log in using token-based authentication, and submit applications through REST APIs. I use MySQL for persistent storage. The frontend is deployed on Vercel, the backend on Render, and the production database on Aiven. I also wrote backend tests and maintain a GitHub Actions workflow for automated checks and deployment."

## Why Django?

"I chose Django because it provides a structured framework with URL routing, an ORM, migrations, authentication support, and an admin interface. Django REST Framework adds serializers, validation, and API tools, which fit a data-driven job board."

## Explain the architecture

"React sends HTTP requests to the Django REST API. Django routes each request to a view. Serializers validate incoming data, and the view uses the Django ORM to read or write MySQL records. Django returns a response, and React updates the interface."

## How does registration work?

"The user enters a username, email, and password. React sends a POST request to the registration endpoint. The backend serializer validates the values and creates the account using Django's user-creation method, which hashes the password. The frontend then directs the user to login."

## How does authentication work?

"The backend exposes token endpoints. The frontend obtains tokens using the configured authentication flow and sends the access token when calling protected endpoints. Django validates the token and applies the configured permissions."

Be ready to explain the exact token storage and refresh implementation from the current source code.

## How did you test it?

"I ran the Django jobs test suite with `python manage.py test jobs`; the recorded run passed all 41 tests. I also ran the frontend production build and manually tested registration, login, and the job application flow locally."

## How did you deploy it?

"I pushed the code to GitHub. Vercel hosts the React frontend, Render runs the Django API, and Aiven hosts the production MySQL database. I configured the frontend API base URL and backend environment variables separately for production."

## What deployment issue did you solve?

"The Render Free plan did not provide an interactive Shell or One-Off Jobs. I verified the Aiven database connection from my local Django environment and then ran Django's `createsuperuser` management command against the production database to create the admin account."

Never disclose passwords, tokens, database URLs, or secret values.

## What would you improve?

"I would expand end-to-end testing, add stronger monitoring and structured logging, review object-level permissions, and add recruiter-side workflows and application status tracking."

## Questions to prepare

- What is Django REST Framework?
- What is a serializer?
- What is the difference between authentication and authorization?
- What is JWT?
- What is Django ORM?
- What are migrations?
- Why use MySQL?
- What is CORS?
- Explain GET, POST, PUT, PATCH, and DELETE.
- Explain HTTP 401 versus 403.
- How does React communicate with Django?
- How do local and production environment variables differ?
- How does Django hash passwords?
- How would you debug an HTTP 500 error?
- How do you ensure a user can only access their own applications?

## Interview honesty

Be ready to show the actual models, serializers, views, permission classes, test cases, GitHub Actions workflow, and deployment configuration. Describe only behavior that exists in the current code.
