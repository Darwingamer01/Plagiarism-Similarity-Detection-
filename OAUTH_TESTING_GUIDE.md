# OAuth Testing Quick Reference

## Testing Without Real OAuth Credentials (Mock Mode)

The implementation includes mock mode for development/testing without real OAuth provider credentials.

### Backend Mock Mode
- Automatically enabled when `GOOGLE_CLIENT_ID` or `APPLE_CLIENT_ID` are not set
- Generates mock user profiles for testing
- Check backend logs for "using mock mode" messages

### Testing Google OAuth (Mock)
1. Start backend: `npm run dev` (from backend folder)
2. Start frontend: `npm run dev` (from frontend folder)
3. Click "Continue with Google" button
4. Mock token will be processed
5. New user flow or login will proceed

### Testing Apple OAuth (Mock)
1. Click "Continue with Apple" button
2. Toast message: "Apple Sign In will be enabled once configured"
3. In development mode, mock implementation activates
4. Follow same flow as Google

## Testing User Flows

### Test 1: New User via OAuth
**Steps:**
1. Go to Register page
2. Click "Continue with Google"
3. Should redirect to Complete Registration page
4. Email should be pre-filled
5. Enter full name
6. Click "Complete Registration"
7. Should redirect to Dashboard
8. User should be logged in

**Expected Database:**
```sql
SELECT email, full_name, google_id, password_hash FROM users WHERE email = 'mock-google-...@example.com';
-- Should show google_id populated, password_hash NULL
```

### Test 2: Existing OAuth User Login
**Steps:**
1. Register via OAuth (complete Test 1 first)
2. Logout
3. Go to Login page
4. Click "Continue with Google"
5. Should directly redirect to Dashboard
6. No registration page shown

### Test 3: OAuth User Sets Password
**Steps:**
1. Register via OAuth
2. Logout
3. Go to Login page
4. Click "Forgot Password"
5. Enter OAuth email
6. Check email for reset link
7. Click link, set new password
8. Login using email + new password
9. Should succeed

**Expected Database:**
```sql
SELECT email, google_id, password_hash FROM users WHERE email = 'oauth-user@example.com';
-- Should show both google_id AND password_hash populated
```

### Test 4: OAuth User Tries Wrong Password
**Steps:**
1. Register via OAuth (without setting password)
2. Logout
3. Go to Login page
4. Enter OAuth email + any random password
5. Click "Sign in"

**Expected Result:**
Error toast: "This account was created using Google Sign-In. Please use the Google button to login, or reset your password to enable email/password login."

### Test 5: OAuth from Both Pages
**Test on Login Page:**
1. Go to `/login`
2. Click "Continue with Google"
3. Verify flow works

**Test on Register Page:**
1. Go to `/register`
2. Click "Continue with Google"
3. Verify flow works
4. Both should behave identically

## Database Queries for Verification

### Check User OAuth Status
```sql
-- View all users with their auth methods
SELECT 
  email, 
  full_name,
  CASE 
    WHEN google_id IS NOT NULL THEN 'Google'
    WHEN apple_id IS NOT NULL THEN 'Apple'
    ELSE 'None'
  END as oauth_provider,
  CASE 
    WHEN password_hash IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as has_password,
  created_at
FROM users
ORDER BY created_at DESC;
```

### Find OAuth-only Users (No Password)
```sql
SELECT email, full_name, google_id, apple_id
FROM users
WHERE password_hash IS NULL
AND (google_id IS NOT NULL OR apple_id IS NOT NULL);
```

### Find Dual-Auth Users (OAuth + Password)
```sql
SELECT email, full_name, google_id, apple_id
FROM users
WHERE password_hash IS NOT NULL
AND (google_id IS NOT NULL OR apple_id IS NOT NULL);
```

## API Testing with Postman/Curl

### Test Google Login Endpoint
```bash
curl -X POST http://localhost:8000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "token": "mock-google-token"
  }'
```

**Expected Response (New User):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "isNewUser": true,
    "profile": {
      "email": "mock-google-...@example.com",
      "fullName": "Mock Google User",
      "providerId": "google_mock_...",
      "provider": "google"
    }
  }
}
```

**Expected Response (Existing User):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "isNewUser": false,
    "accessToken": "jwt-token-here",
    "refreshToken": "refresh-token-here",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "user"
    }
  }
}
```

### Test Complete OAuth Registration
```bash
curl -X POST http://localhost:8000/api/auth/oauth-complete \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "fullName": "New User",
    "provider": "google",
    "providerId": "google_123456"
  }'
```

## Common Issues & Solutions

### Issue: "Google login failed"
**Causes:**
- Network error
- Invalid token
- Backend not running

**Solution:**
1. Check backend logs
2. Verify backend is running on port 8000
3. Check browser console for errors

### Issue: Redirect not working after OAuth
**Solution:**
1. Check browser console for navigation errors
2. Verify route exists in App.tsx
3. Check state is being passed correctly

### Issue: Complete Registration page shows "Invalid OAuth session"
**Cause:**
- OAuth data not in location state
- Direct navigation to /complete-registration

**Solution:**
- Must come from OAuth flow
- Don't bookmark or directly navigate to complete-registration

### Issue: Mock mode not working
**Solution:**
1. Remove GOOGLE_CLIENT_ID from backend .env
2. Restart backend
3. Check logs for "using mock mode" message

## Production Setup Checklist

Before deploying to production with real OAuth:

- [ ] Configure Google OAuth credentials
- [ ] Configure Apple Sign In credentials
- [ ] Set all environment variables
- [ ] Test with real OAuth providers
- [ ] Update CORS settings for production domain
- [ ] Configure authorized redirect URIs in OAuth consoles
- [ ] Test forgot password flow for OAuth users
- [ ] Test mixed authentication (OAuth + password)
- [ ] Verify email templates mention OAuth options
- [ ] Monitor OAuth provider API quotas/limits

## Environment Variables Checklist

### Backend (.env)
```env
# Required for Google OAuth
GOOGLE_CLIENT_ID=your-actual-client-id

# Required for Apple OAuth
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=./keys/apple-private-key.p8

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
# Required for Google OAuth
VITE_GOOGLE_CLIENT_ID=your-actual-client-id
```

## Browser Testing Matrix

Test on multiple browsers to ensure OAuth popups work:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (especially for Apple Sign In)
- [ ] Mobile browsers (Chrome, Safari)

## Security Reminders

1. ✅ OAuth tokens are verified server-side
2. ✅ Provider IDs are stored securely
3. ✅ Passwords are optional but hashed when set
4. ✅ Email validation from OAuth providers
5. ✅ Rate limiting applied to OAuth endpoints
6. ✅ HTTPS required in production
7. ✅ CORS properly configured
8. ✅ OAuth credentials never exposed to frontend (except client IDs)
