import { ensureDatabaseSchema, pool } from './database.js';
import { getAuthenticatedSupabaseUser } from './supabase.js';

const normalizeAccountType = (value) => (value === 'business' ? 'business' : 'client');

const trimOrNull = (value) => {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || null;
};

const buildProfileSeed = (authUser, overrides = {}) => {
  const metadata = authUser.user_metadata || {};
  const accountType = normalizeAccountType(
    overrides.accountType ||
      overrides.account_type ||
      metadata.accountType ||
      metadata.account_type,
  );

  return {
    email: (authUser.email || overrides.email || metadata.email || '').toLowerCase(),
    accountType,
    fullName:
      accountType === 'client'
        ? trimOrNull(
            overrides.fullName ||
              overrides.full_name ||
              metadata.fullName ||
              metadata.full_name,
          )
        : null,
    businessName:
      accountType === 'business'
        ? trimOrNull(
            overrides.businessName ||
              overrides.business_name ||
              metadata.businessName ||
              metadata.business_name,
          )
        : null,
    businessType:
      accountType === 'business'
        ? trimOrNull(
            overrides.businessType ||
              overrides.business_type ||
              metadata.businessType ||
              metadata.business_type,
          )
        : null,
    city: accountType === 'client' ? trimOrNull(overrides.city || metadata.city) : null,
    phone: accountType === 'client' ? trimOrNull(overrides.phone || metadata.phone) : null,
  };
};

const selectUserByAuthIdentity = async (authUserId, email) => {
  const result = await pool.query(
    `
      SELECT
        user_id,
        auth_user_id,
        full_name,
        business_name,
        email,
        account_type,
        business_type,
        city,
        phone
      FROM users
      WHERE auth_user_id = $1 OR email = $2
      ORDER BY CASE WHEN auth_user_id = $1 THEN 0 ELSE 1 END
      LIMIT 1
    `,
    [authUserId, email],
  );

  return result.rows[0] || null;
};

export const getOrSyncAppUserFromRequest = async (
  request,
  profileOverrides = {},
  { createIfMissing = false, touchLastLogin = false } = {},
) => {
  await ensureDatabaseSchema();

  const { user: authUser } = await getAuthenticatedSupabaseUser(request);
  const profile = buildProfileSeed(authUser, profileOverrides);
  let appUser = await selectUserByAuthIdentity(authUser.id, profile.email);

  if (!appUser && !createIfMissing) {
    return null;
  }

  if (!appUser) {
    const inserted = await pool.query(
      `
        INSERT INTO users (
          auth_user_id,
          full_name,
          business_name,
          email,
          password_hash,
          account_type,
          business_type,
          city,
          phone,
          last_login
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING user_id, auth_user_id, full_name, business_name, email, account_type, business_type, city, phone
      `,
      [
        authUser.id,
        profile.fullName,
        profile.businessName,
        profile.email,
        'supabase-auth',
        profile.accountType,
        profile.businessType,
        profile.city,
        profile.phone,
        touchLastLogin ? new Date().toISOString() : null,
      ],
    );

    return inserted.rows[0];
  }

  const updated = await pool.query(
    `
      UPDATE users
      SET
        auth_user_id = COALESCE(auth_user_id, $2),
        email = $3,
        full_name = COALESCE($4, full_name),
        business_name = COALESCE($5, business_name),
        account_type = COALESCE(account_type, $6),
        business_type = COALESCE($7, business_type),
        city = COALESCE($8, city),
        phone = COALESCE($9, phone),
        last_login = CASE WHEN $10 THEN CURRENT_TIMESTAMP ELSE last_login END
      WHERE user_id = $1
      RETURNING user_id, auth_user_id, full_name, business_name, email, account_type, business_type, city, phone
    `,
    [
      appUser.user_id,
      authUser.id,
      profile.email,
      profile.fullName,
      profile.businessName,
      profile.accountType,
      profile.businessType,
      profile.city,
      profile.phone,
      touchLastLogin,
    ],
  );

  return updated.rows[0];
};
