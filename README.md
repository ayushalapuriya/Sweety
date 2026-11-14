# Sweety

Sweety is a full-stack blood glucose tracker for recording daily readings and reviewing daily and monthly summaries.

## Requirements

- Node.js 18+
- PostgreSQL 14+

## Setup

1. Create a PostgreSQL database named `sweety`.
2. Copy `.env.example` to `server/.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create the database tables:

   ```bash
   npm run db:migrate --workspace server
   ```

5. (Optional) Seed a demo account:

   ```bash
   npm run db:seed --workspace server
   ```

   Demo login: `demo@sweety.app` / `Password123!`

6. Start both applications:

   ```bash
   npm run dev
   ```

   The frontend runs at http://localhost:5173 and the API at http://localhost:4000.

## Tests

```bash
npm test
```

The server test suite covers authentication, password hashing, reading validation, ownership, and report calculations. For a production deployment, set `CLIENT_URL` to the deployed frontend origin and use a managed PostgreSQL database.
