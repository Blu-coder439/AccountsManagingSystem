import { ensureDatabaseSchema, pool } from '../lib/server/database.js';
import {
  VALID_TRANSACTION_STATUSES,
  VALID_TRANSACTION_TYPES,
} from '../lib/server/constants.js';
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
          transaction_id,
          user_id,
          party_name,
          category,
          entry_type,
          amount,
          payment_method,
          transaction_date,
          due_date,
          status,
          notes,
          created_at
        FROM bookkeeping_transactions
        WHERE user_id = $1
        ORDER BY transaction_date DESC, transaction_id DESC
      `,
      [userId],
    );

    return json(result.rows);
  } catch (error) {
    console.error('Transactions GET error:', error);
    return errorResponse(
      500,
      'Could not load transactions.',
      process.env.NODE_ENV === 'production' ? undefined : error.message,
    );
  }
}

export async function POST(request) {
  try {
    await ensureDatabaseSchema();

    const {
      userId,
      partyName,
      category,
      entryType,
      amount,
      paymentMethod,
      transactionDate,
      dueDate,
      status,
      notes,
    } = await parseJsonBody(request);

    const normalizedPartyName = partyName?.trim();
    const normalizedCategory = category?.trim();
    const normalizedEntryType = VALID_TRANSACTION_TYPES.has(entryType) ? entryType : null;
    const normalizedStatus = VALID_TRANSACTION_STATUSES.has(status) ? status : 'Pending';
    const parsedAmount = Number(amount);

    if (
      !userId ||
      !normalizedPartyName ||
      !normalizedCategory ||
      !normalizedEntryType ||
      Number.isNaN(parsedAmount) ||
      parsedAmount < 0
    ) {
      return errorResponse(
        400,
        'userId, partyName, category, entryType, and a valid amount are required.',
      );
    }

    const userExists = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [userId]);

    if (userExists.rowCount === 0) {
      return errorResponse(404, 'User not found.');
    }

    const result = await pool.query(
      `
        INSERT INTO bookkeeping_transactions (
          user_id,
          party_name,
          category,
          entry_type,
          amount,
          payment_method,
          transaction_date,
          due_date,
          status,
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, CURRENT_DATE), $8, $9, $10)
        RETURNING
          transaction_id,
          user_id,
          party_name,
          category,
          entry_type,
          amount,
          payment_method,
          transaction_date,
          due_date,
          status,
          notes,
          created_at
      `,
      [
        userId,
        normalizedPartyName,
        normalizedCategory,
        normalizedEntryType,
        parsedAmount,
        paymentMethod?.trim() || null,
        transactionDate || null,
        dueDate || null,
        normalizedStatus,
        notes?.trim() || null,
      ],
    );

    return json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Transactions POST error:', error);
    return errorResponse(
      500,
      'Could not create transaction.',
      process.env.NODE_ENV === 'production' ? undefined : error.message,
    );
  }
}

export function PUT() {
  return methodNotAllowed(['GET', 'POST']);
}
