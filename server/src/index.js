import 'dotenv/config';
import { app } from './app.js';

const port = process.env.PORT || 4000;
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
