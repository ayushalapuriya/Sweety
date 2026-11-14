import { pool } from '../db/pool.js';
import { TIME_SLOTS } from '../constants.js';
import { validateReading } from '../validation/readings.js';
import { clearReportCache } from '../cache.js';

const select = `SELECT id, date::text, time_slot AS "timeSlot", glucose_value AS "glucoseValue", created_at AS "createdAt", updated_at AS "updatedAt" FROM readings`;

export async function listReadings(req, res) {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
  const params = [req.user.id];
  let query = `${select} WHERE user_id = $1`;
  if (req.query.date) {
    params.push(req.query.date);
    query += ` AND date = $${params.length}`;
  }
  const countQuery = query.replace(select, 'SELECT COUNT(*)::int AS count FROM readings');
  const count = await pool.query(countQuery, params);
  params.push(limit, (page - 1) * limit);
  query += ` ORDER BY date DESC, created_at ASC LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const { rows } = await pool.query(query, params);
  res.json({ readings: rows, pagination: { page, limit, total: count.rows[0].count, pages: Math.ceil(count.rows[0].count / limit) } });
}

export async function getReading(req, res) {
  const { rows } = await pool.query(`${select} WHERE user_id = $1 AND id = $2`, [req.user.id, req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Reading not found.' });
  res.json({ reading: rows[0] });
}

export async function createReading(req, res) {
  const errors = validateReading(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0] });
  const count = await pool.query('SELECT COUNT(*)::int AS count FROM readings WHERE user_id = $1 AND date = $2', [req.user.id, req.body.date]);
  if (count.rows[0].count >= 4) return res.status(400).json({ message: 'You can add only 4 readings per day.' });
  const duplicate = await pool.query('SELECT id FROM readings WHERE user_id = $1 AND date = $2 AND time_slot = $3', [req.user.id, req.body.date, req.body.timeSlot]);
  if (duplicate.rowCount) return res.status(400).json({ message: `You already have a ${TIME_SLOTS[req.body.timeSlot]} reading for this date.` });
  const { rows } = await pool.query(
    `INSERT INTO readings (user_id, date, time_slot, glucose_value) VALUES ($1, $2, $3, $4) RETURNING id, date::text, time_slot AS "timeSlot", glucose_value AS "glucoseValue"`,
    [req.user.id, req.body.date, req.body.timeSlot, Number(req.body.glucoseValue)]
  );
  await clearReportCache(req.user.id);
  res.status(201).json({ reading: rows[0] });
}

export async function updateReading(req, res) {
  const errors = validateReading(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0] });
  const existing = await pool.query('SELECT id FROM readings WHERE user_id = $1 AND id = $2', [req.user.id, req.params.id]);
  if (!existing.rowCount) return res.status(404).json({ message: 'Reading not found.' });
  const targetCount = await pool.query('SELECT COUNT(*)::int AS count FROM readings WHERE user_id = $1 AND date = $2 AND id <> $3', [req.user.id, req.body.date, req.params.id]);
  if (targetCount.rows[0].count >= 4) return res.status(400).json({ message: 'You can add only 4 readings per day.' });
  const duplicate = await pool.query('SELECT id FROM readings WHERE user_id = $1 AND date = $2 AND time_slot = $3 AND id <> $4', [req.user.id, req.body.date, req.body.timeSlot, req.params.id]);
  if (duplicate.rowCount) return res.status(400).json({ message: `You already have a ${TIME_SLOTS[req.body.timeSlot]} reading for this date.` });
  const { rows } = await pool.query(
    `UPDATE readings SET date = $1, time_slot = $2, glucose_value = $3, updated_at = NOW() WHERE user_id = $4 AND id = $5
     RETURNING id, date::text, time_slot AS "timeSlot", glucose_value AS "glucoseValue"`,
    [req.body.date, req.body.timeSlot, Number(req.body.glucoseValue), req.user.id, req.params.id]
  );
  await clearReportCache(req.user.id);
  res.json({ reading: rows[0] });
}

export async function deleteReading(req, res) {
  const result = await pool.query('DELETE FROM readings WHERE user_id = $1 AND id = $2', [req.user.id, req.params.id]);
  if (!result.rowCount) return res.status(404).json({ message: 'Reading not found.' });
  await clearReportCache(req.user.id);
  res.status(204).end();
}
