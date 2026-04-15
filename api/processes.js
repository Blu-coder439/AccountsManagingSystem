import { ensureDatabaseSchema, pool } from '../lib/server/database.js';
import { VALID_PROCESS_STATUSES } from '../lib/server/constants.js';
import { errorResponse, json, methodNotAllowed, parseJsonBody } from '../lib/server/http.js';

export async function GET(request) {
  try {
    await ensureDatabaseSchema();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse(400, 'userId is required.');
    }

    const result = await pool.query(
      `
        SELECT
          process_id,
          user_id,
          title,
          description,
          status,
          created_at
        FROM processes
        WHERE user_id = $1
        ORDER BY created_at DESC, process_id DESC
      `,
      [userId],
    );

    return json(result.rows);
  } catch (error) {
    console.error('Processes GET error:', error);
    return errorResponse(
      500,
      'Could not load processes.',
      process.env.NODE_ENV === 'production' ? undefined : error.message,
    );
  }
}

export async function POST(request) {
  try {
    await ensureDatabaseSchema();

    const { userId, title, description, status } = await parseJsonBody(request);
    const normalizedTitle = title?.trim();
    const normalizedStatus = VALID_PROCESS_STATUSES.has(status) ? status : 'pending';

    if (!userId || !normalizedTitle) {
      return errorResponse(400, 'userId and title are required.');
    }

    const userExists = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [userId]);

    if (userExists.rowCount === 0) {
      return errorResponse(404, 'User not found.');
    }

    const result = await pool.query(
      `
        INSERT INTO processes (
          user_id,
          title,
          description,
          status
        )
        VALUES ($1, $2, $3, $4)
        RETURNING process_id, user_id, title, description, status, created_at
      `,
      [userId, normalizedTitle, description?.trim() || null, normalizedStatus],
    );

    return json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Processes POST error:', error);
    return errorResponse(
      500,
      'Could not create process.',
      process.env.NODE_ENV === 'production' ? undefined : error.message,
    );
  }
}

export function PUT() {
  return methodNotAllowed(['GET', 'POST']);
}
