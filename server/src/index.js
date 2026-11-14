import 'dotenv/config';
import { app } from './app.js';

const port = process.env.PORT || 4000;
if (!process.env.JWT_SECRET) console.warn('JWT_SECRET is not configured. Add it to server/.env before using authentication.');
if (!process.env.DATABASE_URL) console.warn('DATABASE_URL is not configured. Add it to server/.env before using the API.');
const server = app.listen(port, () => console.log(`Sweety API listening on http://localhost:${port}`));

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing Sweety API process or set a different PORT in server/.env.`);
    process.exitCode = 1;
    return;
  }
  console.error('Unable to start the Sweety API:', error);
  process.exitCode = 1;
});
