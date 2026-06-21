import { createClient } from '@supabase/supabase-js';
import './env.js';
const envValue = (name) => process.env[name]?.trim();

export class UnauthorizedError extends Error {
  constructor(message = 'Authentication required.') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

let supabaseServerClient;

export const getSupabaseServerClient = () => {
  const supabaseUrl = envValue('SUPABASE_URL') || envValue('VITE_SUPABASE_URL');
  const serviceRoleKey = envValue('SUPABASE_SERVICE_ROLE_KEY');

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

export const findSupabaseUserByEmail = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  let page = 1;
  const perPage = 100;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const match = data?.users?.find((user) => user.email?.toLowerCase() === normalizedEmail);

    if (match) {
      return match;
    }

    if (!data?.users?.length || data.users.length < perPage) {
      return null;
    }

    page += 1;
  }

  return null;
};

export const createAutoConfirmedSupabaseUser = async ({
  email,
  password,
  userMetadata = {},
}) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    const error = new Error('Email and password are required.');
    error.status = 400;
    throw error;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: userMetadata,
  });

  if (!error) {
    return data.user;
  }

  if (!/already|registered|exists/i.test(error.message || '')) {
    throw error;
  }

  const existingUser = await findSupabaseUserByEmail(normalizedEmail);

  if (!existingUser) {
    throw error;
  }

  const { data: updatedData, error: updateError } = await supabase.auth.admin.updateUserById(
    existingUser.id,
    {
      email_confirm: true,
      user_metadata: {
        ...(existingUser.user_metadata || {}),
        ...userMetadata,
      },
    },
  );

  if (updateError) {
    throw updateError;
  }

  return updatedData.user;
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
