import { hashPassword } from '../../lib/server/auth.js';
import { ensureDatabaseSchema, pool } from '../../lib/server/database.js';
import { errorResponse, json, methodNotAllowed, parseJsonBody } from '../../lib/server/http.js';

export async function POST(request) {
  try {
    await ensureDatabaseSchema();

    const {
      fullName,
      businessName,
      email,
      password,
      accountType,
      businessType,
      city,
      phone,
    } = await parseJsonBody(request);

    const normalizedAccountType = accountType === 'business' ? 'business' : 'client';
    const resolvedFullName = normalizedAccountType === 'client' ? fullName?.trim() : null;
    const resolvedBusinessName = normalizedAccountType === 'business' ? businessName?.trim() : null;

    if ((!resolvedFullName && !resolvedBusinessName) || !email || !password) {
      return errorResponse(400, 'Name, email, and password are required.');
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [normalizedEmail]);

    if (existingUser.rowCount > 0) {
      return errorResponse(409, 'An account with this email already exists.');
    }

    const result = await pool.query(
      `
        INSERT INTO users (
          full_name,
          business_name,
          email,
          password_hash,
          account_type,
          business_type,
          city,
          phone
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING user_id, full_name, business_name, email, account_type, business_type, city, phone
      `,
      [
        resolvedFullName,
        resolvedBusinessName,
        normalizedEmail,
        hashPassword(password),
        normalizedAccountType,
        normalizedAccountType === 'business' ? businessType || null : null,
        normalizedAccountType === 'client' ? city || null : null,
        normalizedAccountType === 'client' ? phone || null : null,
      ],
    );

    return json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Signup function error:', error);
    return errorResponse(
      500,
      'Signup failed. Check that your table columns match the server.',
      process.env.NODE_ENV === 'production' ? undefined : error.message,
    );
  }
}

export function GET() {
  return methodNotAllowed(['POST']);
}
