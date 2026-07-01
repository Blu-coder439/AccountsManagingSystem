const parseConnectionString = (connectionString) => {
  if (!connectionString) {
    return null;
  }

  try {
    return new URL(connectionString);
  } catch {
    return null;
  }
};

export const createPostgresSslConfig = ({ connectionString, envValue }) => {
  const parsedConnectionString = parseConnectionString(connectionString);
  const sslMode = (
    envValue('PGSSLMODE') ||
    parsedConnectionString?.searchParams.get('sslmode') ||
    ''
  ).toLowerCase();

  if (sslMode === 'disable') {
    return false;
  }

  const host = parsedConnectionString?.hostname || envValue('PGHOST') || '';
  const shouldUseSsl =
    sslMode === 'require' ||
    sslMode === 'verify-full' ||
    sslMode === 'verify-ca' ||
    sslMode === 'no-verify' ||
    envValue('NODE_ENV') === 'production' ||
    host.includes('supabase');

  if (!shouldUseSsl) {
    return false;
  }

  const rejectUnauthorizedOverride = envValue('PG_SSL_REJECT_UNAUTHORIZED');
  const shouldRejectUnauthorized =
    rejectUnauthorizedOverride === undefined
      ? sslMode === 'verify-full' || sslMode === 'verify-ca'
      : rejectUnauthorizedOverride !== 'false';

  return { rejectUnauthorized: shouldRejectUnauthorized };
};
