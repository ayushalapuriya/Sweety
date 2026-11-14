import { pool } from '../db/pool.js';
import { getMonthRange } from '../utils/date.js';

export async function listPatients(req, res) {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required.' });
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email FROM users u
     JOIN doctor_patient_assignments a ON a.patient_id = u.id
     WHERE a.doctor_id = $1 ORDER BY u.name`,
    [req.user.id]
  );
  res.json({ patients: rows });
}

export async function patientReport(req, res) {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required.' });
  const patient = await pool.query(
    `SELECT u.id, u.name, u.email FROM users u
     JOIN doctor_patient_assignments a ON a.patient_id = u.id
     WHERE a.doctor_id = $1 AND a.patient_id = $2`,
    [req.user.id, req.params.patientId]
  );
  if (!patient.rowCount) return res.status(404).json({ message: 'Assigned patient not found.' });
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const { start } = getMonthRange(date);
  const result = await pool.query(
    `SELECT date::text, time_slot AS "timeSlot", glucose_value AS "glucoseValue"
     FROM readings WHERE user_id = $1 AND date >= $2 AND date <= $3 ORDER BY date, created_at`,
    [req.params.patientId, start, date]
  );
  res.json({ patient: patient.rows[0], readings: result.rows });
}
