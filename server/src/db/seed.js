import bcrypt from 'bcrypt';
import { pool } from './pool.js';

const password = await bcrypt.hash('Password123!', 12);
const { rows } = await pool.query(
  `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
   ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
  ['Demo Patient', 'demo@sweety.app', password]
);
const userId = rows[0].id;
await pool.query('DELETE FROM readings WHERE user_id = $1', [userId]);
await pool.query(
  `INSERT INTO readings (user_id, date, time_slot, glucose_value)
   VALUES ($1, CURRENT_DATE, 'morning', 105), ($1, CURRENT_DATE, 'after_breakfast', 132),
          ($1, CURRENT_DATE, 'after_lunch', 148)`,
  [userId]
);
await pool.end();
console.log('Seed complete: demo@sweety.app / Password123!');
