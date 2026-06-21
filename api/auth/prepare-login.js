import {
  errorResponse,
  json,
  methodNotAllowed,
  parseJsonBody,
  safeErrorDetails,
} from '../../lib/server/http.js';
import { ensureSupabaseUserCanPasswordLogin } from '../../lib/server/supabase.js';

export async function POST(request) {
  try {
    const { email } = await parseJsonBody(request);
    const user = await ensureSupabaseUserCanPasswordLogin(email);

    if (!user) {
      return errorResponse(404, 'No Supabase Auth user was found for this email.');
    }

    return json({
      message: 'Supabase Auth user is ready for password login.',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Prepare login function error:', error);
    return errorResponse(
      error.status || 500,
      'Could not prepare Supabase Auth user for password login.',
      safeErrorDetails(error),
    );
  }
}

export function GET() {
  return methodNotAllowed(['POST']);
}
