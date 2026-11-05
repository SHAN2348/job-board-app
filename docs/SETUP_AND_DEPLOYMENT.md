# Setup and Deployment

## Local development

### Prerequisites

Git, Node.js/npm, Python, and a local MySQL instance or a separate development database.

### Clone

```bash
git clone https://github.com/SHAN2348/job-board-app.git
cd job-board-app
```

### Backend

```bash
cd backend
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install and configure:

```bash
pip install -r requirements.txt
```

Create a private `.env` file with the variable names required by `config/settings.py`. Use a development database.

```bash
python manage.py check
python manage.py migrate
python manage.py runserver
```

### Frontend

From repository root in another terminal:

```bash
npm install
```

Create `.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Then:

```bash
npm run dev
npm run lint
npm run build
```

## Production deployment

| Service | Provider | URL |
|---|---|---|
| Frontend | Vercel | https://job-board-app-lake-seven.vercel.app/ |
| Backend | Render | https://job-board-backend-thf9.onrender.com/ |
| Database | Aiven | MySQL managed service |

### Vercel

Set `VITE_API_BASE_URL` to:

```text
https://job-board-backend-thf9.onrender.com
```

Confirm build settings and verify the deployed frontend after each release.

### Render

Configure the backend root directory, Python dependencies, build command, WSGI start command, and private environment variables. Configure allowed hosts, CORS, and database SSL. Review Render logs after deployment.

### Aiven

Use the connection values from the Aiven console as private backend environment variables. Ensure SSL is configured as required by the service. Apply Django migrations to the intended database.

## Production superuser

The production superuser was created from the local backend environment after a successful database connection test to Aiven. The command used was:

```bash
python manage.py createsuperuser
```

Only run this command after verifying the configured database host and database name. Otherwise, the account may be created in the wrong database.

## Post-deployment smoke test

- Open the production frontend.
- Register a disposable test account.
- Log in.
- Load jobs.
- Submit a test application.
- Inspect records in Django Admin.
- Refresh and confirm data persists.
- Review browser network requests and Render logs.
