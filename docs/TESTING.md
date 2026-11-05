# Testing Guide

## Backend automated tests

From `backend/`:

```bash
python manage.py test jobs
```

Recorded development result: **41 tests passed (`OK`)**. Re-run after code changes.

## Django checks

```bash
python manage.py check
```

## Frontend lint and build

From repository root:

```bash
npm run lint
npm run build
```

A successful build verifies compilation; it does not replace browser-level testing.

## Manual workflow

The local registration, login, home page, and existing application flow were tested during development.

Recommended production smoke test:

1. Register a disposable job-seeker account.
2. Log in.
3. Browse and search jobs.
4. Submit an application to a test listing.
5. Inspect data in Django Admin.
6. Refresh and confirm persistence.

## CI workflow

The repository includes `.github/workflows/ci.yml`. Inspect the current workflow to confirm its exact triggers, jobs, lint/build commands, deployment steps, and whether backend tests are included. The earlier frontend pipeline was configured for lint/build and Vercel deployment.

## Suggested future tests

- React component tests.
- End-to-end tests for registration/login/application.
- Invalid input and missing-token API tests.
- Permission tests ensuring users cannot access other users' private records.
- Post-deployment smoke tests.
- Dependency/security scanning.
