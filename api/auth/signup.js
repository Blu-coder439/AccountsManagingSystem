import {
  errorResponse,
  json,
  methodNotAllowed,
  parseJsonBody,
  safeErrorDetails,
} from '../../lib/server/http.js';
import { getOrSyncAppUserFromRequest } from '../../lib/server/app-user.js';
import {
  createAutoConfirmedSupabaseUser,
  getBearerToken,
  UnauthorizedError,
} from '../../lib/server/supabase.js';

const buildUserMetadata = (profileOverrides) => ({
  accountType: profileOverrides.accountType || null,
  fullName: profileOverrides.fullName || null,
  businessName: profileOverrides.businessName || null,
  businessType: profileOverrides.businessType || null,
  city: profileOverrides.city || null,
  phone: profileOverrides.phone || null,
});

export async function POST(request) {
  try {
    const profileOverrides = await parseJsonBody(request);

    if (!getBearerToken(request) && profileOverrides.password) {
      const authUser = await createAutoConfirmedSupabaseUser({
        email: profileOverrides.email,
        password: profileOverrides.password,
        userMetadata: buildUserMetadata(profileOverrides),
      });

      return json(
        {
          message: 'Supabase Auth user is ready for password login.',
          user: {
            id: authUser.id,
            email: authUser.email,
            emailConfirmed: Boolean(authUser.email_confirmed_at),
          },
        },
        { status: 201 },
      );
    }

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
      error.status || 500,
      'Signup sync failed.',
      safeErrorDetails(error),
    );
  }
}

export function GET() {
  return methodNotAllowed(['POST']);
}
