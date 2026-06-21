# Supabase Auth 400 Debug

## Issue

A user gets a 400 on login despite successful signup.

## Important Context

Email verification is no longer part of signup or login. The backend signup path creates Supabase Auth users with `email_confirm: true`, then the frontend signs in immediately with `supabase.auth.signInWithPassword()`.

## Troubleshooting Steps

### Step 1: Confirm the User Exists

1. Go to https://app.supabase.com
2. Select the correct project.
3. Go to Authentication > Users.
4. Search for the user's email.
5. If the user is missing, sign up again through the app.

### Step 2: Reset Password

1. Open the user in Authentication > Users.
2. Use Reset password.
3. Follow the reset link and set a new password.
4. Try logging in with the new password.

### Step 3: Check Auth Provider Settings

1. Go to Authentication > Providers > Email.
2. Confirm the app is using the intended project.
3. Email confirmation does not need to be enabled for this app flow.

### Step 4: Manual User Creation Test

1. Go to Authentication > Users.
2. Click + Add user.
3. Enter:
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Auto confirm: ON
4. Try logging in with `test@example.com` / `Test1234!`.

### Step 5: Check for Auth Hooks

1. Go to Authentication > Auth Hooks, if available.
2. Check if any hooks might reject logins.

## If Still Not Working

Provide:

- Screenshot of the user in Supabase dashboard, with sensitive data redacted.
- Screenshot of Auth Provider settings.
- Browser network tab showing the exact response from the 400 error.
