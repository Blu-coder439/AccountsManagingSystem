import {
  errorResponse,
  json,
  methodNotAllowed,
  parseJsonBody,
  safeErrorDetails,
} from '../../lib/server/http.js';
import { getOrSyncAppUserFromRequest } from '../../lib/server/app-user.js';
import { UnauthorizedError } from '../../lib/server/supabase.js';

export async function POST(request) {
  try {
    const profileOverrides = await parseJsonBody(request);
    const user = await getOrSyncAppUserFromRequest(request, profileOverrides, {
      createIfMissing: true,
      touchLastLogin: false,
    });

    return json(user, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return errorResponse(error.status, error.message);
    }

    console.error('Signup function error:', error);
    return errorResponse(
      500,
      'Signup sync failed.',
      safeErrorDetails(error),
    );
  }
}

export function GET() {
  return methodNotAllowed(['POST']);
}
