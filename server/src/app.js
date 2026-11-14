import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { router } from './routes.js';
import { errorHandler, notFound } from './middleware/errors.js';

export const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', router);
app.use(notFound);
app.use(errorHandler);
