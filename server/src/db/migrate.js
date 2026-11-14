import { pool } from './pool.js';

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'patient';
  CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
  CREATE TABLE IF NOT EXISTS readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL CHECK (time_slot IN ('morning', 'after_breakfast', 'after_lunch', 'after_dinner')),
    glucose_value INTEGER NOT NULL CHECK (glucose_value BETWEEN 40 AND 600),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, date, time_slot)
  );
  CREATE INDEX IF NOT EXISTS readings_user_date_idx ON readings(user_id, date);
  CREATE TABLE IF NOT EXISTS doctor_patient_assignments (
    doctor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, patient_id),
    CHECK (doctor_id <> patient_id)
  );
`);
await pool.end();
console.log('Database migration complete.');
