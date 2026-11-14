import { pool } from '../db/pool.js';
import { TIME_SLOTS } from '../constants.js';
import { validateReading } from '../validation/readings.js';

const select = `SELECT id, date::text, time_slot AS "timeSlot", glucose_value AS "glucoseValue", created_at AS "createdAt", updated_at AS "updatedAt" FROM readings`;

export async function listReadings(req, res) {
  const params = [req.user.id];
  let query = `${select} WHERE user_id = $1`;
  if (req.query.date) {
    params.push(req.query.date);
    query += ` AND date = $${params.length}`;
  }
  query += ' ORDER BY date DESC, created_at ASC';
  const { rows } = await pool.query(query, params);
  res.json({ readings: rows });
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
  res.json({ reading: rows[0] });
}

export async function deleteReading(req, res) {
  const result = await pool.query('DELETE FROM readings WHERE user_id = $1 AND id = $2', [req.user.id, req.params.id]);
  if (!result.rowCount) return res.status(404).json({ message: 'Reading not found.' });
  res.status(204).end();
}
