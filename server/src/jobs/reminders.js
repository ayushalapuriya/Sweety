import 'dotenv/config';
import { Queue } from 'bullmq';

if (!process.env.REDIS_URL) {
  console.log('REDIS_URL is not configured; reminder queue is disabled.');
} else {
  const queue = new Queue('sweety-reminders', { connection: { url: process.env.REDIS_URL } });
  await queue.add('daily-reading-reminder', { message: 'Check patients with fewer than four readings.' }, { repeat: { pattern: '0 20 * * *' } });
  await queue.close();
  console.log('Daily reminder job scheduled.');
}
