# Authentication 400 Error Troubleshooting

## The Problem

When logging in, you get this error:

```text
POST https://jpuqopyiatzpxwrsygyz.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
```

## Current Auth Flow

Signup no longer requires the user to verify their email before logging in.

```text
1. SIGNUP (src/pages/general/signup.vue)
   - User enters email and password
   - Frontend calls /api/auth/signup
   - Backend creates a Supabase Auth user with email_confirm: true
   - Frontend signs in immediately with the password
   - Frontend syncs the app profile

2. LOGIN (src/pages/general/login.vue)
   - User enters email and password
   - Frontend calls supabase.auth.signInWithPassword()
   - Supabase verifies credentials and returns an access token
   - Frontend syncs the app profile to the backend
```

## Root Causes

### 1. Wrong Credentials

- Email or password does not match what was used at signup.
- Fix: double-check spelling and remember passwords are case-sensitive.

### 2. User Does Not Exist

- The email was never signed up or the Supabase Auth user was deleted.
- Fix: sign up first or recreate the user in Supabase.

### 3. Supabase Configuration Issue

- The app may be pointed at the wrong Supabase project or using stale deployed environment variables.
- Fix: check `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

### 4. Legacy Unconfirmed User

- Users created before this change may still be unconfirmed in Supabase Auth.
- Fix: recreate the account through the current signup flow or manually confirm that one legacy user in the Supabase dashboard.

## Backend Auth Flow

After login succeeds on the frontend:

```text
Frontend:
  supabase.auth.signInWithPassword()
  -> receives access token
  -> syncCurrentUserProfile()
  -> sends Authorization: Bearer <token>

Backend:
  POST /api/auth/login
  - Extract Bearer token
  - Verify token with Supabase
  - Get authenticated user
  - Sync or create user in app database
  - Return user profile
```

## Debug Checklist

- [ ] Correct email/password combo?
- [ ] Same email used in signup?
- [ ] User exists in Supabase Authentication > Users?
- [ ] New signup was created through `/api/auth/signup`?
- [ ] Supabase environment variables match the intended project?
- [ ] Browser console and network tab show the exact Supabase error?

## Code References

- Frontend Signup: `src/pages/general/signup.vue`
- Frontend Login: `src/pages/general/login.vue`
- Supabase Client: `src/utils/supabase.js`
- Backend Auth: `api/auth/login.js` and `api/auth/signup.js`
- Session Sync: `src/utils/auth-session.js`
