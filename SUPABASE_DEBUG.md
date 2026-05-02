# Supabase Auth 400 Debug

## Issue
User `ghanafoods@gmail.com` with password `gh@n@foods` gets 400 on login despite successful signup.

## Troubleshooting Steps

### Step 1: Reset Password in Supabase
1. Go to https://app.supabase.com
2. Select project `jpuqopyiatzpxwrsygyz`
3. Go to **Authentication** > **Users**
4. Find user `ghanafoods@gmail.com`
5. Click **•••** (three dots) > **Reset password**
6. This will send a password reset link to the email
7. Follow the link to set a new password
8. Try logging in with the new password

### Step 2: Check Auth Provider Settings
1. Go to **Authentication** > **Providers** > **Email**
2. Verify these settings:
   - **Confirm email**: OFF (you should have disabled this)
   - **Double confirm changes**: OFF
   - **Secure email change**: OFF
   - Email Templates: Use defaults

### Step 3: Manual User Creation (Test)
1. Go to **Authentication** > **Users**
2. Click **+ Add user**
3. Enter:
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Auto confirm: ON
4. Click **Create**
5. Try logging in with `test@example.com` / `Test1234!`
6. If this works, the issue is specific to the `ghanafoods@gmail.com` user

### Step 4: Check for Supabase Auth Hooks
1. Go to **Authentication** > **Auth Hooks** (if available)
2. Check if there are any hooks that might be rejecting logins

### Step 5: Check User Confirmation Status
1. Go to **Authentication** > **Users**
2. Click on `ghanafoods@gmail.com`
3. Check the **Status** field
4. If it shows "Awaiting confirmation", click **Confirm user**
5. Try logging in again

## If Still Not Working
Please provide:
- Screenshot of the user in Supabase dashboard (redact password)
- Screenshot of Auth Provider settings
- Browser network tab showing the exact response from the 400 error (right-click > Copy as cURL)
