import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

function tokenFor(user) {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured.');
    error.code = 'CONFIG_MISSING';
    throw error;
  }
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role || 'patient' }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existing.rowCount) return res.status(409).json({ message: 'An account with this email already exists.' });
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role', [name.trim(), normalizedEmail, hash]);
  const user = rows[0];
  res.status(201).json({ token: tokenFor(user), user });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT id, name, email, password, role FROM users WHERE email = $1', [email?.trim().toLowerCase()]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
  const { password: _, ...safeUser } = user;
  res.json({ token: tokenFor(safeUser), user: safeUser });
}
