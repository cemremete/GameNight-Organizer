import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import { generateToken } from '../utils/jwt';
import { sanitizeUser } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  async register(
    email: string,
    username: string,
    password: string,
    timezone: string = 'UTC'
  ) {
    // check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('Email or username already taken', 400);
    }

    // hash password - 10 rounds is fine for most cases
    const passwordHash = await bcrypt.hash(password, 10);

    // insert user
    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash, timezone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, timezone, avatar_url, created_at`,
      [email, username, passwordHash, timezone]
    );

    const user = result.rows[0];
    const token = generateToken({ userId: user.id, email: user.email });

    return { user: sanitizeUser(user), token };
  }

  async login(email: string, password: string) {
    // find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    // verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return { user: sanitizeUser(user), token };
  }

  async getUserById(userId: string) {
    const result = await pool.query(
      'SELECT id, email, username, timezone, avatar_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }

  async updateUser(
    userId: string,
    updates: { username?: string; timezone?: string; avatarUrl?: string }
  ) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.username) {
      fields.push(`username = $${paramCount++}`);
      values.push(updates.username);
    }
    if (updates.timezone) {
      fields.push(`timezone = $${paramCount++}`);
      values.push(updates.timezone);
    }
    if (updates.avatarUrl) {
      fields.push(`avatar_url = $${paramCount++}`);
      values.push(updates.avatarUrl);
    }

    if (fields.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, username, timezone, avatar_url, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }
}
