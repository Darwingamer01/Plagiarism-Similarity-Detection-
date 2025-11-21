# OAuth User Flow Diagrams

## Flow 1: New User Registration via OAuth

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW USER OAUTH FLOW                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Login Page   │ ◄── User can start from either page
│    OR        │
│ Register Page│
└──────┬───────┘
       │
       │ User clicks "Continue with Google" or "Continue with Apple"
       ▼
┌────────────────┐
│ OAuth Provider │
│   (Google/     │ ◄── User authenticates with their OAuth account
│    Apple)      │
└────────┬───────┘
         │
         │ Returns token
         ▼
┌──────────────────┐
│   Backend API    │
│ POST /auth/google│ ◄── Verifies token with provider
│  or /auth/apple  │     Checks if user exists in database
└────────┬─────────┘
         │
         │ User NOT found → isNewUser: true
         ▼
┌─────────────────────┐
│  Frontend receives  │
│  profile data:      │
│  - email            │ ◄── Email pre-filled from OAuth
│  - fullName         │     Full name from OAuth (editable)
│  - provider         │
│  - providerId       │
└────────┬────────────┘
         │
         │ Navigate to /complete-registration
         ▼
┌──────────────────────────┐
│ Complete Registration    │
│ Page                     │
│                          │
│ ┌────────────────────┐   │
│ │ Email: [readonly]  │   │ ◄── User reviews/edits info
│ │ Name:  [editable]  │   │
│ │ [Complete Reg Btn] │   │
│ └────────────────────┘   │
└────────┬─────────────────┘
         │
         │ User clicks "Complete Registration"
         ▼
┌────────────────────────┐
│   Backend API          │
│ POST /auth/oauth-      │ ◄── Creates user in database
│      complete          │     with provider ID
└────────┬───────────────┘
         │
         │ Returns: accessToken, refreshToken, user
         ▼
┌────────────────┐
│   Dashboard    │ ◄── User is logged in and redirected
└────────────────┘

Database Entry Created:
┌──────────────────────────────────────┐
│ email: user@gmail.com                │
│ full_name: John Doe                  │
│ google_id: "google_123456"           │
│ apple_id: NULL                       │
│ password_hash: NULL                  │ ◄── No password yet
│ role: "user"                         │
└──────────────────────────────────────┘
```

## Flow 2: Existing User Login via OAuth

```
┌─────────────────────────────────────────────────────────────────┐
│                EXISTING USER OAUTH LOGIN                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Login Page   │ ◄── User can start from either page
│    OR        │
│ Register Page│
└──────┬───────┘
       │
       │ User clicks "Continue with Google" or "Continue with Apple"
       ▼
┌────────────────┐
│ OAuth Provider │
│   (Google/     │ ◄── User authenticates
│    Apple)      │
└────────┬───────┘
         │
         │ Returns token
         ▼
┌──────────────────┐
│   Backend API    │
│ POST /auth/google│ ◄── Verifies token
│  or /auth/apple  │     Finds user in database (by email or provider_id)
└────────┬─────────┘
         │
         │ User FOUND → isNewUser: false
         │ Returns: accessToken, refreshToken, user
         ▼
┌────────────────┐
│   Dashboard    │ ◄── Direct login, no registration needed
└────────────────┘

Database Entry Found:
┌──────────────────────────────────────┐
│ email: user@gmail.com                │
│ full_name: John Doe                  │
│ google_id: "google_123456"           │
│ password_hash: NULL or "hash..."     │ ◄── May or may not have password
└──────────────────────────────────────┘
```

## Flow 3: OAuth User Sets Password (Forgot Password)

```
┌─────────────────────────────────────────────────────────────────┐
│           OAUTH USER ENABLES PASSWORD LOGIN                     │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐
│  Login Page    │
└────────┬───────┘
         │
         │ User clicks "Forgot Password?"
         ▼
┌─────────────────────┐
│ Forgot Password Page│
└────────┬────────────┘
         │
         │ User enters email (their OAuth email)
         ▼
┌──────────────────────────┐
│   Backend API            │
│ POST /auth/forgot-       │ ◄── Generates reset token
│      password            │     Sends reset email
└────────┬─────────────────┘
         │
         │ User receives email
         ▼
┌──────────────────────┐
│    Email Client      │ ◄── Contains reset link
└────────┬─────────────┘
         │
         │ User clicks reset link
         ▼
┌──────────────────────┐
│ Reset Password Page  │
│                      │
│ ┌──────────────────┐ │
│ │ New Password     │ │ ◄── User sets password
│ │ Confirm Password │ │
│ │ [Reset Password] │ │
│ └──────────────────┘ │
└────────┬─────────────┘
         │
         │ POST /auth/reset-password
         ▼
┌────────────────────────┐
│   Backend API          │ ◄── Updates password_hash
└────────┬───────────────┘
         │
         │ Success message
         ▼
┌────────────────┐
│  Login Page    │ ◄── User can now login with:
└────────────────┘     1. Google/Apple button, OR
                       2. Email + Password

Database Entry Updated:
┌──────────────────────────────────────┐
│ email: user@gmail.com                │
│ google_id: "google_123456"           │
│ password_hash: "$2b$10$abcd..."     │ ◄── Password now set!
└──────────────────────────────────────┘
```

## Flow 4: OAuth User Attempts Password Login (No Password Set)

```
┌─────────────────────────────────────────────────────────────────┐
│        OAUTH USER TRIES PASSWORD LOGIN (ERROR CASE)             │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐
│  Login Page    │
└────────┬───────┘
         │
         │ User enters: email + password
         │ (Tries to use their Google password)
         ▼
┌──────────────────┐
│   Backend API    │
│ POST /auth/login │
└────────┬─────────┘
         │
         │ Checks database
         ▼
┌──────────────────────────────────────┐
│ User found:                          │
│ - has google_id: "google_123456"     │
│ - password_hash: NULL                │ ◄── No password set!
└────────┬─────────────────────────────┘
         │
         │ Backend detects OAuth-only user
         ▼
┌─────────────────────────────────────────────────────────┐
│  Error Response:                                        │
│                                                         │
│  "This account was created using Google Sign-In.       │
│   Please use the Google button to login, or reset     │
│   your password to enable email/password login."       │
└────────┬────────────────────────────────────────────────┘
         │
         │ Frontend shows error toast
         ▼
┌────────────────────────────────────┐
│  Login Page                        │
│  🔴 Error Toast Displayed          │ ◄── User sees helpful error
│                                    │
│  Options:                          │
│  1. Click "Continue with Google"   │
│  2. Click "Forgot Password" to set │
│     a password                     │
└────────────────────────────────────┘
```

## Flow 5: Dual Authentication (OAuth + Password)

```
┌─────────────────────────────────────────────────────────────────┐
│           USER WITH BOTH OAUTH AND PASSWORD                     │
└─────────────────────────────────────────────────────────────────┘

After setting password (Flow 3), user can login two ways:

METHOD 1: OAuth Login
┌────────────────┐
│  Login Page    │
└────────┬───────┘
         │
         │ Click "Continue with Google"
         ▼
     (Flow 2)
         │
         ▼
┌────────────────┐
│   Dashboard    │ ✅ Success
└────────────────┘

METHOD 2: Password Login
┌────────────────┐
│  Login Page    │
└────────┬───────┘
         │
         │ Enter email + password
         ▼
┌──────────────────┐
│   Backend API    │
│ POST /auth/login │
└────────┬─────────┘
         │
         │ Checks database
         ▼
┌──────────────────────────────────────┐
│ User found:                          │
│ - google_id: "google_123456"         │
│ - password_hash: "$2b$10$abcd..."    │ ◄── Has both!
└────────┬─────────────────────────────┘
         │
         │ Verifies password → Success
         ▼
┌────────────────┐
│   Dashboard    │ ✅ Success
└────────────────┘

Both methods work! User can choose their preferred login method.
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

Frontend:
┌──────────────────────────────────────────────────────────────┐
│  main.tsx                                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │ GoogleOAuthProvider                                │     │
│  │   (wraps entire app)                               │     │
│  │                                                     │     │
│  │  ┌─────────────────────────────────────────────┐  │     │
│  │  │ App.tsx (Router)                            │  │     │
│  │  │                                             │  │     │
│  │  │  ┌────────────┐  ┌──────────────┐          │  │     │
│  │  │  │ LoginPage  │  │ RegisterPage │          │  │     │
│  │  │  │            │  │              │          │  │     │
│  │  │  │ [Google]   │  │  [Google]    │          │  │     │
│  │  │  │ [Apple]    │  │  [Apple]     │          │  │     │
│  │  │  └─────┬──────┘  └──────┬───────┘          │  │     │
│  │  │        │                 │                  │  │     │
│  │  │        └────────┬────────┘                  │  │     │
│  │  │                 │                           │  │     │
│  │  │        ┌────────▼────────┐                  │  │     │
│  │  │        │ authService.ts  │                  │  │     │
│  │  │        │ - googleLogin() │                  │  │     │
│  │  │        │ - appleLogin()  │                  │  │     │
│  │  │        └────────┬────────┘                  │  │     │
│  │  │                 │                           │  │     │
│  │  │        ┌────────▼──────────────┐            │  │     │
│  │  │        │ CompleteRegistration  │            │  │     │
│  │  │        │ Page                  │            │  │     │
│  │  │        └───────────────────────┘            │  │     │
│  │  └─────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘

Backend:
┌──────────────────────────────────────────────────────────────┐
│  authRoutes.ts                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │ POST /auth/google    ────►  googleLogin()          │     │
│  │ POST /auth/apple     ────►  appleLogin()           │     │
│  │ POST /auth/oauth-    ────►  completeOAuthReg()     │     │
│  │      complete                                      │     │
│  └───────────────────────┬────────────────────────────┘     │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │ authController.ts                                │       │
│  └───────────────────────┬──────────────────────────┘       │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │ authService.ts                                   │       │
│  │ - verifyGoogleToken()                            │       │
│  │ - verifyAppleToken()                             │       │
│  │ - handleOAuthLogin()                             │       │
│  │ - completeOAuthRegistration()                    │       │
│  └───────────────────────┬──────────────────────────┘       │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Database (PostgreSQL)                            │       │
│  │ - users table with google_id, apple_id           │       │
│  └──────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE FLOW DIAGRAM                           │
└─────────────────────────────────────────────────────────────────┘

User Action:
  Click OAuth Button
         │
         ▼
  useGoogleLogin() hook
         │
         │ Returns: access_token
         ▼
  googleLoginMutation.mutate(token)
         │
         ▼
  authService.googleLogin(token)
         │
         │ API Call: POST /auth/google
         ▼
  Backend Response
         │
         ├──► isNewUser: true
         │         │
         │         ▼
         │    navigate('/complete-registration', {
         │      state: { oauthData }
         │    })
         │         │
         │         ▼
         │    User completes registration
         │         │
         │         ▼
         │    setUser(user)
         │    setTokens(access, refresh)
         │         │
         └─────────┴──► navigate('/dashboard')
         │
         └──► isNewUser: false
                   │
                   ▼
              setUser(user)
              setTokens(access, refresh)
                   │
                   ▼
              navigate('/dashboard')
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                               │
└─────────────────────────────────────────────────────────────────┘

OAuth Flow Errors:

1. Network Error
   Backend Unreachable ──► toast.error('Google login failed')

2. Invalid Token
   Token Verification Fails ──► toast.error('Invalid Google token')

3. Email Not Provided
   OAuth doesn't return email ──► toast.error('Email not provided')

4. User Exists (Different Method)
   Email exists, wrong provider ──► toast.error('Email already in use')

5. Session Expired
   Complete Reg session expired ──► Navigate back to /register

Password Login Errors (OAuth User):

1. OAuth User, No Password
   ┌──────────────────────────────────────────────────────────┐
   │ Check: google_id EXISTS && password_hash IS NULL         │
   │                                                          │
   │ Error: "This account was created using Google Sign-In.  │
   │         Please use the Google button to login, or       │
   │         reset your password to enable login."           │
   └──────────────────────────────────────────────────────────┘
   
2. Wrong Password
   Password doesn't match ──► toast.error('Invalid email or password')
```

## Database Schema Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    USERS TABLE SCHEMA                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────────────────────────┐
│ Column       │ Type         │ Description                      │
├──────────────┼──────────────┼──────────────────────────────────┤
│ id           │ UUID         │ Primary key                      │
│ email        │ VARCHAR(255) │ Unique, required                 │
│ password_hash│ VARCHAR(255) │ Optional (nullable)              │ ◄──┐
│ full_name    │ VARCHAR(255) │ User's name                      │    │
│ role         │ VARCHAR(50)  │ Default: 'user'                  │    │
│ api_key      │ VARCHAR(255) │ Unique                           │    │
│ google_id    │ VARCHAR(255) │ Google OAuth ID (nullable)       │ ◄──┤
│ apple_id     │ VARCHAR(255) │ Apple OAuth ID (nullable)        │ ◄──┤
│ created_at   │ TIMESTAMP    │ Account creation time            │    │
│ updated_at   │ TIMESTAMP    │ Last update time                 │    │
│ last_login   │ TIMESTAMP    │ Last login time                  │    │
└──────────────┴──────────────┴──────────────────────────────────┘    │
                                                                       │
User Types:                                                            │
                                                                       │
1. Traditional User:                                                   │
   password_hash: ✓    google_id: ✗    apple_id: ✗                   │
                                                                       │
2. Google OAuth Only:                                                  │
   password_hash: ✗    google_id: ✓    apple_id: ✗   ◄───────────────┘
                                                          OAuth columns
3. Apple OAuth Only:                                      allow NULL
   password_hash: ✗    google_id: ✗    apple_id: ✓   

4. Google + Password:
   password_hash: ✓    google_id: ✓    apple_id: ✗

5. Apple + Password:
   password_hash: ✓    google_id: ✗    apple_id: ✓

6. All Methods:
   password_hash: ✓    google_id: ✓    apple_id: ✓
```

---

These flow diagrams show all the OAuth authentication paths and how they interact with the system.
