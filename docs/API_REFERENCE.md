# API Reference

Production API origin: `https://job-board-backend-thf9.onrender.com`

The routes below were confirmed during development. Consult the current Django URL configuration, serializers, views, and permissions for exact request/response schemas.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/jobs/` | Retrieve job listings |
| POST | `/api/register/` | Register job-seeker |
| POST | `/api/token/` | Obtain JWT tokens |
| POST | `/api/token/refresh/` | Refresh access token |
| GET | `/api/me/` | Get authenticated user |
| Configured methods | `/api/applications/` | Job application resource |

## Registration

`POST /api/register/`

The frontend sends username, email, and password. Public registration is restricted to the `job_seeker` role. The serializer enforces password validation (minimum eight characters in the implementation described during development).

Illustrative request body:

```json
{
  "username": "candidate_example",
  "email": "candidate@example.com",
  "password": "Use-a-strong-password"
}
```

Use a test password only. Confirm exact accepted fields in the serializer.

## Authentication

- `POST /api/token/` obtains tokens.
- `POST /api/token/refresh/` refreshes an access token.
- `GET /api/me/` returns authenticated user information.

Use the authorization header format configured by the backend. Never publish access or refresh tokens.

## HTTP status codes

| Status | Meaning |
|---|---|
| 200 | Request succeeded |
| 201 | Resource created |
| 400 | Request validation failed |
| 401 | Authentication missing or invalid |
| 403 | Authenticated user lacks permission |
| 404 | Resource not found |
| 500 | Unexpected server error |

For the applications endpoint, verify supported methods, payload fields, and object-level permissions from the current backend implementation.
