# Authentication 400 Error Troubleshooting

## The Problem
When logging in, you get this error:
```
POST https://jpuqopyiatzpxwrsygyz.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
```

## Root Causes

### 1. **Email Not Confirmed** (Most Common)
After signing up, Supabase sends a confirmation email. Until you confirm your email:
- ❌ You **cannot** log in
- ✅ You **can** see the account was created

**Fix:** Check your email inbox (and spam folder) for a confirmation link. Click it, then try logging in again.

### 2. **Wrong Credentials**
- Email or password doesn't match what was signed up with
- **Fix:** Double-check spelling. Remember passwords are case-sensitive.

### 3. **User Doesn't Exist**
Tried to log in with an email that was never signed up
- **Fix:** Sign up first before logging in

### 4. **Supabase Configuration Issue**
The project's Supabase settings have email confirmation enabled
- **Fix:** Check Supabase dashboard > Authentication > Providers > Email

---

## How the Auth Flow Works

```
1. SIGNUP (src/pages/general/signup.vue)
   ├─ User enters email & password
   ├─ POST to supabase.auth.signUp()
   ├─ Supabase sends confirmation email
   └─ User clicks link in email to confirm
      
2. LOGIN (src/pages/general/login.vue)
   ├─ User enters email & password (ONLY after confirming email)
   ├─ POST to supabase.auth.signInWithPassword()
   ├─ Supabase verifies credentials
   ├─ Returns access token
   └─ Frontend syncs user profile to backend
```

---

## Testing Locally (Skip Email Confirmation)

To allow instant login without email confirmation:

### Option A: Disable Email Confirmation (Dev Only)
1. Go to **Supabase Dashboard** > Authentication > Providers > Email
2. Toggle **"Confirm email"** to OFF
3. Now users can log in immediately after signup

### Option B: Use Magic Links (No Password Verification)
1. Update signup to use `signInWithOtp()` instead of `signUp()`
2. Users get a magic link via email (instant if confirmation disabled)

### Option C: Use Test Users
1. Supabase dashboard > Authentication > Users
2. Create a test user manually with "Auto confirm"
3. Use this email/password to test login flow

---

## Backend Auth Flow

After login succeeds on frontend:

```
Frontend (browser):
  supabase.auth.signInWithPassword()
  ↓ (gets access token)
  ↓
  syncCurrentUserProfile() 
  ↓ (sends Authorization: Bearer <token>)
  
Backend (server.js):
  POST /api/auth/login
  ├─ Extract Bearer token from Authorization header
  ├─ Verify token with Supabase
  ├─ Get authenticated user
  ├─ Sync/create user in local database
  └─ Return user profile
```

---

## Debug Checklist

- [ ] Check email for Supabase confirmation link
- [ ] Did you click the confirmation link?
- [ ] Email confirmation is enabled? (expected for production)
- [ ] Correct email/password combo?
- [ ] Same email used in signup?
- [ ] Check browser console for full error message
- [ ] Test with a new account via Supabase dashboard (manual creation)

---

## Code References

- **Frontend Signup:** `src/pages/general/signup.vue` (lines 64-77)
- **Frontend Login:** `src/pages/general/login.vue` (lines 29-36)
- **Supabase Client:** `src/utils/supabase.js`
- **Backend Auth:** `api/auth/login.js` and `api/auth/signup.js`
- **Session Sync:** `src/utils/auth-session.js`
