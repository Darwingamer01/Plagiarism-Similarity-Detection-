# Google OAuth Setup Guide

## Current Error
```
Error 400: redirect_uri_mismatch
origin=http://localhost:3000
```

This means your Google OAuth client is not configured to accept requests from `http://localhost:3000`.

## Steps to Fix

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account (utkarsh11980@gmail.com)

### 2. Select or Create a Project
- If you have an existing project, select it from the dropdown at the top
- Or create a new project: Click "Select a project" → "NEW PROJECT"
- Name it something like "Plagiarism Detection App"

### 3. Enable Google+ API (if not already enabled)
- Go to "APIs & Services" → "Library"
- Search for "Google+ API"
- Click on it and press "ENABLE"

### 4. Configure OAuth Consent Screen
- Go to "APIs & Services" → "OAuth consent screen"
- Choose "External" (for testing) or "Internal" (if you have a Google Workspace)
- Fill in required fields:
  - App name: `Plagiarism Detection System`
  - User support email: `utkarsh11980@gmail.com`
  - Developer contact: `utkarsh11980@gmail.com`
- Click "Save and Continue"
- Skip the Scopes section (or add basic scopes if needed)
- Add test users if using External type
- Click "Save and Continue"

### 5. Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "CREATE CREDENTIALS" → "OAuth client ID"
- Choose "Web application"
- Name it: `Plagiarism Detection - Local Dev`

### 6. Configure Authorized Origins and Redirect URIs

**Authorized JavaScript origins:**
```
http://localhost:3000
http://localhost:8000
```

**Authorized redirect URIs:**
```
http://localhost:3000
http://localhost:3000/
http://localhost:8000/api/auth/google/callback
```

### 7. Copy the Client ID
- After creating, you'll see a popup with:
  - **Client ID** - Copy this!
  - Client Secret - Not needed for frontend OAuth
- Click "OK"

### 8. Update Your .env File
- Open: `frontend/.env`
- Update the line:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

Replace `YOUR_CLIENT_ID_HERE` with the Client ID you copied.

### 9. Restart the Frontend
Stop the frontend server (Ctrl+C) and restart it:
```bash
npm run dev
```

## Testing Google Login

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Choose your Google account
4. Grant permissions
5. You should be redirected back and logged in

## Production Setup

When deploying to production, add your production URLs:

**Authorized JavaScript origins:**
```
https://yourdomain.com
```

**Authorized redirect URIs:**
```
https://yourdomain.com
https://yourdomain.com/api/auth/google/callback
```

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"
- Make sure all URLs are added to Authorized JavaScript origins
- Ensure there are no trailing slashes in origins (except redirect URIs)
- Wait a few minutes after adding URLs (changes can take time to propagate)

### Error: "redirect_uri_mismatch"
- Double-check that `http://localhost:3000` is in Authorized JavaScript origins
- Make sure there are no typos
- Try adding both with and without trailing slash

### Error: "invalid_client"
- The Client ID in your .env file doesn't match the one in Google Cloud Console
- Copy the Client ID again from Google Cloud Console

## Current Configuration

Your `.env` file location:
```
C:\Users\utkar\OneDrive\Desktop\Final-year-major-project\frontend\.env
```

Current content should be:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
```

## Notes

- The Client ID is public and safe to commit to version control
- Never commit the Client Secret (not used in this app)
- For local development, you can use the same Client ID across team members
- For production, create a separate OAuth client with production URLs
