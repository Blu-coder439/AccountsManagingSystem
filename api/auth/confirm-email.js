import {
  errorResponse,
  json,
  methodNotAllowed,
  parseJsonBody,
  safeErrorDetails,
} from '../../lib/server/http.js';
import { confirmSupabaseUserEmail } from '../../lib/server/supabase.js';

export async function POST(request) {
  try {
    const { email } = await parseJsonBody(request);
    const user = await confirmSupabaseUserEmail(email);

    if (!user) {
      return errorResponse(404, 'No Supabase Auth user was found for this email.');
    }

    return json({
      message: 'Supabase Auth email is confirmed.',
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: Boolean(user.email_confirmed_at),
      },
    });
  } catch (error) {
    console.error('Confirm email function error:', error);
    return errorResponse(
      error.status || 500,
      'Could not confirm Supabase Auth email.',
      safeErrorDetails(error),
    );
  }
}

export function GET() {
  return methodNotAllowed(['POST']);
}
