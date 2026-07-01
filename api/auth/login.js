import { getOrSyncAppUserFromRequest } from '../../lib/server/app-user.js';
import {
  errorResponse,
  json,
  methodNotAllowed,
  parseJsonBody,
  safeErrorDetails,
} from '../../lib/server/http.js';
import { UnauthorizedError } from '../../lib/server/supabase.js';

export async function POST(request) {
  try {
    // safely parse body with fallback to {}
    const profileOverrides = await parseJsonBody(request).catch(() => ({}));

    const user = await getOrSyncAppUserFromRequest(request, profileOverrides, {
      createIfMissing: true,
      touchLastLogin: true,
    });

    return json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return errorResponse(error.status, error.message);
    }

    console.error('Login function error:', error);
    return errorResponse(
      500,
      'Login sync failed',
      safeErrorDetails(error),
    );
  }
}

export function GET() {
  return methodNotAllowed(['POST']);
}
