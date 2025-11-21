# OAuth Quick Start Guide

## 🚀 Start Using OAuth in 5 Minutes

### Prerequisites
- Node.js installed
- Project cloned
- Basic familiarity with the project structure

### Step 1: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**Packages added:**
- Backend: `google-auth-library`, `apple-signin-auth`
- Frontend: `@react-oauth/google`

### Step 2: Start the Application (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Expected output:**
- Backend: Server running on http://localhost:8000
- Frontend: Running on http://localhost:3000 or http://localhost:5173

### Step 3: Test OAuth (2 minutes)

#### Test Google Sign-In (Mock Mode)

1. Open browser: http://localhost:3000/register
2. Click **"Continue with Google"** button
3. Mock OAuth activates automatically (no credentials needed!)
4. Observe the flow:
   - Redirects to Complete Registration page
   - Email is pre-filled
   - Enter any name
   - Click "Complete Registration"
   - Redirected to Dashboard ✅

#### Test Existing User Login

1. After registering (Step 3 above)
2. Click logout
3. Go to Login page
4. Click **"Continue with Google"** button
5. Observe:
   - No registration page this time
   - Direct redirect to Dashboard ✅

### Step 4: Verify in Database (Optional)

```bash
# Connect to PostgreSQL
psql -U plagiarism_user -d plagiarism_db

# View OAuth users
SELECT email, full_name, google_id, apple_id, password_hash 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;
```

**Expected result:**
```
email                       | full_name    | google_id        | password_hash
----------------------------|--------------|------------------|---------------
mock-google-1234@ex.com    | Test User    | google_mock_123  | NULL
```

## 🎯 What You Just Did

✅ Installed OAuth libraries  
✅ Started app with OAuth support  
✅ Tested new user registration via OAuth  
✅ Tested existing user login via OAuth  
✅ Verified OAuth user in database  

## 🔧 Mock Mode vs Production Mode

### Mock Mode (Current - No Setup Needed)
- **Active when**: No OAuth credentials configured
- **Behavior**: Generates fake OAuth tokens and users
- **Use for**: Development, testing, demos
- **Email format**: `mock-google-123@example.com`

### Production Mode (Requires OAuth Credentials)

**To enable real Google OAuth:**

1. Get Google Client ID:
   - Go to https://console.cloud.google.com/
   - Create project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Copy Client ID

2. Add to backend `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   ```

3. Add to frontend `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here
   ```

4. Restart both backend and frontend

**To enable real Apple Sign In:**

1. Get Apple credentials:
   - Go to https://developer.apple.com/
   - Configure Sign In with Apple
   - Download private key

2. Add to backend `.env`:
   ```env
   APPLE_CLIENT_ID=your-apple-service-id
   APPLE_TEAM_ID=your-team-id
   APPLE_KEY_ID=your-key-id
   APPLE_PRIVATE_KEY_PATH=./keys/apple-private-key.p8
   ```

3. Restart backend

## 📋 Quick Test Checklist

Test these scenarios to verify everything works:

### ✅ Basic OAuth Flow
- [ ] Click Google button on Register page
- [ ] Complete registration page appears
- [ ] Email is pre-filled (read-only)
- [ ] Can edit full name
- [ ] Registration completes successfully
- [ ] Redirected to Dashboard

### ✅ Returning User
- [ ] Logout from Dashboard
- [ ] Click Google button on Login page
- [ ] No registration page (direct login)
- [ ] Redirected to Dashboard

### ✅ OAuth from Both Pages
- [ ] Google button works on Login page
- [ ] Google button works on Register page
- [ ] Both flows behave identically

### ✅ Password Reset for OAuth User
- [ ] Register via OAuth
- [ ] Logout
- [ ] Click "Forgot Password"
- [ ] Enter OAuth email
- [ ] Receive reset email
- [ ] Set password
- [ ] Can login with password OR OAuth

### ✅ Error Handling
- [ ] OAuth user tries password login without setting password
- [ ] Error message: "This account was created using Google Sign-In..."
- [ ] Message guides user to use OAuth button or reset password

## 🐛 Troubleshooting

### Issue: "Google login failed"

**Check:**
1. Is backend running? (http://localhost:8000)
2. Is frontend running? (http://localhost:3000 or 5173)
3. Check browser console for errors
4. Check backend logs for errors

**Solution:**
- Restart backend
- Clear browser cache
- Check network tab in browser DevTools

### Issue: Complete Registration shows "Invalid OAuth session"

**Cause:**
- Directly navigating to /complete-registration URL
- Bookmarking the complete-registration page

**Solution:**
- Must come from OAuth flow
- Don't bookmark or manually navigate to this page

### Issue: Mock mode not working

**Check:**
1. Backend logs should show: "Google OAuth: No GOOGLE_CLIENT_ID found, using mock mode"
2. Remove any GOOGLE_CLIENT_ID from backend .env
3. Restart backend

### Issue: Database error

**Check:**
1. PostgreSQL is running
2. Database exists: `plagiarism_db`
3. Run migrations: `npm run migrate` (from backend folder)

**Solution:**
```bash
cd backend
npm run migrate
```

## 📱 Features to Try

### Feature 1: Multiple Auth Methods
1. Register via OAuth
2. Set password via "Forgot Password"
3. Logout
4. Try logging in with:
   - Google button ✅
   - Email + password ✅
5. Both should work!

### Feature 2: Smart Error Messages
1. Register via OAuth (no password)
2. Logout
3. Try login with email + random password
4. Get helpful error message
5. Guides you to use OAuth or set password

### Feature 3: Remember Me (Traditional Login)
1. Login with email + password
2. Check "Remember me" checkbox
3. Close browser
4. Reopen
5. Email field auto-suggests saved account

## 🎓 Learning Resources

### Documentation Files Created
1. **OAUTH_IMPLEMENTATION.md** - Technical details
2. **OAUTH_TESTING_GUIDE.md** - Testing scenarios
3. **OAUTH_COMPLETE_SUMMARY.md** - Executive summary
4. **OAUTH_FLOW_DIAGRAMS.md** - Visual flow diagrams
5. **This file** - Quick start guide

### Key Files to Explore

**Frontend:**
- `src/pages/LoginPage.tsx` - OAuth buttons
- `src/pages/RegisterPage.tsx` - OAuth buttons
- `src/pages/CompleteRegistrationPage.tsx` - New user flow
- `src/services/authService.ts` - OAuth API calls
- `src/main.tsx` - GoogleOAuthProvider setup

**Backend:**
- `src/routes/authRoutes.ts` - OAuth endpoints
- `src/controllers/authController.ts` - OAuth handlers
- `src/services/authService.ts` - OAuth logic
- `src/migrations/runner.ts` - Database schema

## 🎉 Success Indicators

You know OAuth is working when:

✅ Google/Apple buttons appear on Login and Register pages  
✅ Clicking them triggers OAuth flow (popup or redirect)  
✅ New users see Complete Registration page  
✅ Existing users login directly  
✅ Database shows google_id or apple_id for OAuth users  
✅ OAuth users can set passwords later  
✅ Clear error messages for auth issues  

## 📞 Need Help?

### Check Documentation
- Read: `OAUTH_IMPLEMENTATION.md` for technical details
- Read: `OAUTH_TESTING_GUIDE.md` for test scenarios
- Read: `OAUTH_FLOW_DIAGRAMS.md` for visual guides

### Check Logs
```bash
# Backend logs
cd backend
npm run dev
# Watch terminal output

# Frontend logs
# Open browser console (F12)
# Check Console tab
```

### Common Commands
```bash
# Restart backend
cd backend
npm run dev

# Restart frontend
cd frontend
npm run dev

# Run migrations
cd backend
npm run migrate

# Check database
psql -U plagiarism_user -d plagiarism_db
\dt                    # List tables
\d users               # Describe users table
SELECT * FROM users;   # View users
```

## 🚀 Next Steps

After testing basic OAuth:

1. **Try password reset** for OAuth users
2. **Test on mobile browser** (responsive design)
3. **Set up real OAuth credentials** for production
4. **Explore dual authentication** (OAuth + password)
5. **Check email templates** for OAuth-related emails
6. **Monitor database** for OAuth user entries

## ⚡ Tips for Development

1. **Use Mock Mode** - No OAuth credentials needed for development
2. **Check Backend Logs** - Shows OAuth verification status
3. **Clear Browser Data** - If testing multiple accounts
4. **Use Incognito Mode** - For fresh OAuth sessions
5. **Keep Terminals Open** - To see real-time logs

---

**You're ready to use OAuth! Start testing now.** 🎯

Mock mode is active by default - just click the OAuth buttons and watch it work!
