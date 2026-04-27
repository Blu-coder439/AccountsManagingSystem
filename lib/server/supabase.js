import { createClient } from '@supabase/supabase-js';
import './env.js';

export class UnauthorizedError extends Error {
  constructor(message = 'Authentication required.') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

let supabaseServerClient;

export const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for server-side auth.');
  }

  if (!supabaseServerClient) {
    supabaseServerClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseServerClient;
};

export const getBearerToken = (request) => {
  const authorization = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

export const getAuthenticatedSupabaseUser = async (request) => {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    throw new UnauthorizedError();
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data?.user) {
    throw new UnauthorizedError(error?.message || 'Invalid or expired session.');
  }

  return { accessToken, user: data.user };
};
