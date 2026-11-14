import { pool } from '../db/pool.js';
import { getMonthRange } from '../utils/date.js';

function summarize(rows) {
  if (!rows.length) return { highest: null, lowest: null, average: null, total: 0 };
  const values = rows.map((row) => row.glucoseValue);
  return {
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10,
    total: values.length
  };
}

async function readingsBetween(userId, start, end) {
  const { rows } = await pool.query(
    `SELECT date::text, time_slot AS "timeSlot", glucose_value AS "glucoseValue" FROM readings
     WHERE user_id = $1 AND date >= $2 AND date < $3 ORDER BY date ASC, created_at ASC`,
    [userId, start, end]
  );
  return rows;
}

export async function dailyReport(req, res) {
  const date = req.query.date;
  const end = new Date(`${date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const readings = await readingsBetween(req.user.id, date, end.toISOString().slice(0, 10));
  res.json({ report: { type: 'daily', date, readings, ...summarize(readings) } });
}

export async function monthToDateReport(req, res) {
  const date = req.query.date;
  const { start } = getMonthRange(date);
  const end = new Date(`${date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const readings = await readingsBetween(req.user.id, start, end.toISOString().slice(0, 10));
  res.json({ report: { type: 'month-to-date', start, end: date, ...summarize(readings) } });
}

export async function monthlyReport(req, res) {
  const { start } = getMonthRange(`${req.query.year}-${String(req.query.month).padStart(2, '0')}-01`);
  const previous = new Date(`${start}T00:00:00Z`);
  previous.setUTCMonth(previous.getUTCMonth() - 1);
  const previousStart = previous.toISOString().slice(0, 8) + '01';
  const readings = await readingsBetween(req.user.id, previousStart, start);
  res.json({ report: { type: 'monthly', start: previousStart, end: start, ...summarize(readings) } });
}
