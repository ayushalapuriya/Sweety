# Sweety

Sweety is a full-stack blood glucose tracker for recording daily readings and reviewing daily and monthly summaries.

See [CHECKLIST.md](./CHECKLIST.md) for the assignment requirement, bonus-task, and submission status checklist.

## Requirements

- Node.js 18+
- PostgreSQL 14+

## Setup

1. Install PostgreSQL for Windows from https://www.postgresql.org/download/windows/.

   During installation, remember the password you set for the `postgres` user. Keep the default port `5432`.

2. Open **SQL Shell (psql)** from the Start menu and enter:

   ```sql
   CREATE DATABASE sweety;
   \q
   ```

   Alternatively, from PowerShell, if `psql` is available on your PATH:

   ```powershell
   psql -U postgres -h localhost -p 5432
   ```

   Then run `CREATE DATABASE sweety;` and exit with `\q`.

3. Copy the server environment file:

   ```powershell
   Copy-Item server\.env.example server\.env
   ```

   Open `server\.env` and set the PostgreSQL password in `DATABASE_URL`:

   ```env
   DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/sweety
   JWT_SECRET=replace-with-a-long-random-secret
   PORT=4000
   CLIENT_URL=http://localhost:5173
   ```

   `JWT_SECRET` is required for signup and login. Use any long random string for local development, then restart the API after changing `.env`.

4. Install dependencies:

   ```bash
   npm install
   ```

5. Create the database tables:

   ```bash
   npm run db:migrate --workspace server
   ```

6. (Optional) Seed a demo account:

   ```bash
   npm run db:seed --workspace server
   ```

   Demo login: `demo@sweety.app` / `Password123!`

   Demo doctor login: `doctor@sweety.app` / `Doctor123!` (assigned to the demo patient).

7. Start both applications:

   ```bash
   npm run dev
   ```

   The frontend runs at http://localhost:5173 and the API at http://localhost:4000.

## Docker

The public [Dockerfile](./Dockerfile) and [docker-compose.yml](./docker-compose.yml) contain no real secrets. Before starting Docker, create a local root `.env` file:

```env
POSTGRES_DB=sweety
POSTGRES_USER=postgres
POSTGRES_PASSWORD=choose-a-local-password
JWT_SECRET=choose-a-long-local-secret
```

Then run:

```powershell
docker compose up --build
```

The root `.env` is ignored by Git and must never be committed. `.env.example` is safe to commit.

## PostgreSQL troubleshooting

- **`psql is not recognized`**: add PostgreSQL's `bin` folder to PATH, usually `C:\Program Files\PostgreSQL\<version>\bin`, then reopen PowerShell.
- **`ECONNREFUSED localhost:5432`**: open Windows Services, find `postgresql-x64-*`, and start the PostgreSQL service.
- **`EADDRINUSE :::4000`**: another API process is already running. Find it with `Get-NetTCPConnection -LocalPort 4000 -State Listen`, stop that specific process with `Stop-Process -Id <PID>`, then run the server again. You can also set `PORT=4001` in `server\.env`.
- **`password authentication failed`**: update the password in `server\.env` to match the password created during PostgreSQL installation.
- **Check the API connection**: open http://localhost:4000/api/health. It should return `{"ok":true}`. The migration command confirms the database credentials and database name.

## Tests

```bash
npm test
```

The server test suite covers password hashing, reading validation, and report calculations. For a production deployment, set `CLIENT_URL` to the deployed frontend origin and use a managed PostgreSQL database.

## Notes

- The application enforces one reading per user, date, and time slot through both API validation and a PostgreSQL unique constraint.
- Dates are stored as PostgreSQL `DATE` values, so reports use calendar dates rather than browser timezone timestamps.
- Bonus features are implemented as optional extensions: pagination, a trend chart, Docker Compose, Redis report caching, a BullMQ reminder scheduler, and doctor/patient report access. Redis-backed features remain disabled unless `REDIS_URL` is configured.
- Screenshots can be captured from the running frontend after seeding the demo account. This workspace is not connected to a public GitHub repository, so the repository link and regular commit history must be created during submission.
