# OAuth Implementation - Troubleshooting & Quick Fix

## ✅ Issues Fixed

The dependency issues you encountered have been resolved:

1. ✅ **Frontend Vite Plugin Issue** - `@vitejs/plugin-react` reinstalled
2. ✅ **Backend ts-node-dev Issue** - Dependencies verified
3. ✅ **Vite Cache Cleared** - Old cache removed

## 🚀 How to Restart Your Servers

### Step 1: Stop All Running Servers

**Press `Ctrl+C` in both terminal windows** (frontend and backend) to stop them.

### Step 2: Restart Backend

```bash
cd C:\Users\utkar\OneDrive\Desktop\Final-year-major-project\backend
npm run dev
```

**Expected Output:**
```
> plagiarism-detection-backend@3.0.0 dev
> ts-node-dev --respawn --transpile-only src/index.ts

[INFO] Starting compilation in watch mode...
Server running on http://localhost:8000
Database connected
Redis connected
```

### Step 3: Restart Frontend

```bash
cd C:\Users\utkar\OneDrive\Desktop\Final-year-major-project\frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🎯 Test OAuth Now

Once both servers are running:

1. Open browser: `http://localhost:5173` (or whatever port Vite shows)
2. Navigate to Login or Register page
3. Click **"Continue with Google"** button
4. Should work now! ✅

## 🐛 If You Still See Errors

### Error: "Failed to load @vitejs/plugin-react"

**Fix:**
```bash
cd frontend
npm install --force
npm run dev
```

### Error: "Cannot find module ts-node-dev"

**Fix:**
```bash
cd backend
npm install
npm run dev
```

### Error: Vite shows 404 or 500 errors

**Fix:**
```bash
cd frontend
# Delete cache
Remove-Item -Recurse -Force node_modules\.vite
Remove-Item -Recurse -Force .vite

# Restart
npm run dev
```

### Error: Port already in use

**Backend (Port 8000):**
```bash
# Find and kill process on port 8000
netstat -ano | findstr :8000
# Note the PID (last column)
taskkill /PID <PID_NUMBER> /F
```

**Frontend (Port 5173 or 3000):**
```bash
# Find and kill process
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

## ✨ Everything Should Work Now

After restarting:

✅ No more `ENOENT` errors  
✅ No more "Cannot find module" errors  
✅ OAuth buttons should load properly  
✅ Mock OAuth should work immediately  

## 📝 Quick Reference

### Backend Status Check
```bash
curl http://localhost:8000/api/system/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Frontend Status Check
- Open: `http://localhost:5173`
- Should see the login page
- OAuth buttons should be visible

## 🎉 Ready to Test

1. ✅ Both servers running
2. ✅ No errors in terminals
3. ✅ Browser loads the page
4. ✅ OAuth buttons visible

**You can now test the OAuth implementation!**

See `OAUTH_QUICK_START.md` for testing instructions.

## 💡 Pro Tips

- Always use `npm run dev` (not `npm start`)
- Keep terminal windows open to see logs
- Check backend logs for OAuth verification status
- Use browser DevTools console to see frontend errors
- Clear browser cache if you see old cached pages

## 📚 Documentation

For detailed OAuth information, see:
- `OAUTH_QUICK_START.md` - Getting started
- `OAUTH_TESTING_GUIDE.md` - Test scenarios
- `OAUTH_IMPLEMENTATION.md` - Technical details
- `OAUTH_FLOW_DIAGRAMS.md` - Visual guides
