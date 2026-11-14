import bcrypt from 'bcrypt';
import { pool } from './pool.js';

const password = await bcrypt.hash('Password123!', 12);
const { rows } = await pool.query(
  `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
   ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
  ['Demo Patient', 'demo@sweety.app', password]
);
const userId = rows[0].id;
const doctorPassword = await bcrypt.hash('Doctor123!', 12);
const doctor = await pool.query(
  `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'doctor')
   ON CONFLICT (email) DO UPDATE SET role = 'doctor' RETURNING id`,
  ['Dr. Demo', 'doctor@sweety.app', doctorPassword]
);
await pool.query(
  `INSERT INTO doctor_patient_assignments (doctor_id, patient_id) VALUES ($1, $2)
   ON CONFLICT DO NOTHING`,
  [doctor.rows[0].id, userId]
);
await pool.query('DELETE FROM readings WHERE user_id = $1', [userId]);
await pool.query(
  `INSERT INTO readings (user_id, date, time_slot, glucose_value)
   VALUES ($1, CURRENT_DATE, 'morning', 105), ($1, CURRENT_DATE, 'after_breakfast', 132),
          ($1, CURRENT_DATE, 'after_lunch', 148)`,
  [userId]
);
await pool.end();
console.log('Seed complete: demo@sweety.app / Password123!');
