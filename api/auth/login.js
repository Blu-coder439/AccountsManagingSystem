import { ensureDatabaseSchema, pool } from '../../lib/server/database.js';
import { verifyPassword } from '../../lib/server/auth.js';
import { errorResponse, json, methodNotAllowed, parseJsonBody } from '../../lib/server/http.js';

export async function POST(request) {
  try {
    await ensureDatabaseSchema();

    const { email, password } = await parseJsonBody(request);

    if (!email || !password) {
      return errorResponse(400, 'Email and password are required.');
    }

    const result = await pool.query(
      `
        SELECT
          user_id,
          full_name,
          business_name,
          email,
          password_hash,
          account_type,
          business_type,
          city,
          phone
        FROM users
        WHERE email = $1
      `,
      [email.toLowerCase()],
    );

    if (result.rowCount === 0) {
      return errorResponse(401, 'Invalid email or password.');
    }

    const user = result.rows[0];

    if (!verifyPassword(password, user.password_hash)) {
      return errorResponse(401, 'Invalid email or password.');
    }

    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1', [user.user_id]);

    return json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        business_name: user.business_name,
        account_type: user.account_type,
        business_type: user.business_type,
        city: user.city,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login function error:', error);
    return errorResponse(
      500,
      'Login failed',
      process.env.NODE_ENV === 'production' ? undefined : error.message,
    );
  }
}

export function GET() {
  return methodNotAllowed(['POST']);
}
