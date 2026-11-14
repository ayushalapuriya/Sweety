import { Router } from 'express';
import { register, login } from './controllers/auth.js';
import { requireAuth } from './middleware/auth.js';
import { createReading, deleteReading, getReading, listReadings, updateReading } from './controllers/readings.js';
import { dailyReport, monthToDateReport, monthlyReport } from './controllers/reports.js';

export const router = Router();
router.post('/auth/register', register);
router.post('/auth/login', login);
router.use(requireAuth);
router.get('/readings', listReadings);
router.get('/readings/:id', getReading);
router.post('/readings', createReading);
router.put('/readings/:id', updateReading);
router.delete('/readings/:id', deleteReading);
router.get('/reports/daily', dailyReport);
router.get('/reports/month-to-date', monthToDateReport);
router.get('/reports/monthly', monthlyReport);
