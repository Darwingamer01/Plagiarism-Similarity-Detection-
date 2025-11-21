# 🚀 GETTING STARTED - YOUR SITUATION

## Current Status

✅ Docker is running (PostgreSQL + Redis)
✅ Backend and Frontend are set up
❌ Python is not installed (needed for AI service)

---

## 🎯 OPTION 1: Quick Start Without AI (Recommended for Now)

Run the application **without** the AI plagiarism detection feature initially. You can add Python/AI later.

### Steps:

```bash
# 1. Run simple setup (skip AI service)
setup-simple.bat

# 2. Start backend + frontend only
start-simple.bat
```

**What works:**
- ✅ User registration/login
- ✅ File uploads
- ✅ Dashboard
- ✅ Database operations
- ❌ AI plagiarism detection (requires Python)

---

## 🎯 OPTION 2: Install Python & Full Setup

Get everything working including AI features.

### Step 1: Install Python

1. Download Python 3.11+ from: https://www.python.org/downloads/
2. **IMPORTANT:** Check "Add Python to PATH" during installation
3. Restart your terminal after installation
4. Verify: `python --version`

### Step 2: Run Full Setup

```bash
# Run the full setup
setup-first-time.bat

# Start everything
start-dev.bat
```

---

## 🐛 Fixing the Database Password Error

The error you saw: `"client password must be a string"` means the environment variables might not be loading correctly.

### Fix:

Open `backend\.env` and make sure it has these **exact** lines:

```env
DATABASE_URL=postgresql://plagiarism_user:plagiarism_pass_2024@localhost:5432/plagiarism_db
DB_PASSWORD=plagiarism_pass_2024
```

Then rebuild:

```bash
cd backend
npm run build
npm run migrate
```

---

## 📋 Step-by-Step Manual Setup (If Scripts Fail)

### Terminal 1: Databases
```bash
docker-compose up postgres redis -d
```

### Terminal 2: Backend
```bash
cd backend
npm install
npm run build
npm run migrate
npm run dev
```

### Terminal 3: Frontend
```bash
cd frontend
npm install
npm run dev
```

### Terminal 4: AI Service (Only if Python is installed)
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

---

## 🎓 What You Should Do Now

### Beginner Path (Start Here):
1. Run `setup-simple.bat`
2. Run `start-simple.bat`
3. Build the UI and backend features first
4. Install Python later when you need AI features

### Advanced Path:
1. Install Python from python.org
2. Run `setup-first-time.bat`
3. Run `start-dev.bat`
4. Full system with AI

---

## 🔍 Checking What's Running

```bash
# Check Docker containers
docker ps

# Check ports
netstat -ano | findstr :8000   # Backend
netstat -ano | findstr :5173   # Frontend
netstat -ano | findstr :8001   # AI Service
netstat -ano | findstr :5432   # PostgreSQL
netstat -ano | findstr :6379   # Redis
```

---

## 💡 Quick Commands

### Start Just Databases
```bash
docker-compose up postgres redis -d
```

### Start Backend (Manual)
```bash
cd backend
npm run dev
```

### Start Frontend (Manual)
```bash
cd frontend
npm run dev
```

### Stop Databases
```bash
docker-compose down
```

---

## 🆘 Common Issues & Solutions

### Issue: "Python is not recognized"
**Solution:** Install Python and check "Add to PATH" during installation.

### Issue: "Port 8000 already in use"
**Solution:**
```bash
netstat -ano | findstr :8000
taskkill /PID <NUMBER> /F
```

### Issue: "Cannot connect to database"
**Solution:**
```bash
docker ps  # Check if PostgreSQL is running
docker-compose restart postgres
```

### Issue: "Database password error"
**Solution:** Edit `backend\.env` and verify DB_PASSWORD line exists and is correct.

---

## 📚 Useful Scripts Created

| Script | Purpose | Use When |
|--------|---------|----------|
| `setup-simple.bat` | Backend + Frontend only | No Python installed |
| `start-simple.bat` | Start without AI | Quick testing |
| `setup-first-time.bat` | Full setup with AI | Python installed |
| `start-dev.bat` | Full startup with AI | Daily development |
| `stop-dev.bat` | Stop everything | Done working |

---

## 🎯 Recommended Next Steps for You

1. **Right now:** Run `setup-simple.bat` and `start-simple.bat`
2. **Build UI:** Work on React components and pages
3. **Build API:** Work on backend endpoints
4. **Later:** Install Python and add AI features

This way you can start working immediately without Python blocking you!

---

## 📞 Quick Reference

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

---

## ✅ Summary

**You have 2 options:**

### Option 1: Start Simple (Recommended Now)
```bash
setup-simple.bat  # One time
start-simple.bat  # Daily
```
- No Python needed
- Backend + Frontend work
- Add AI later

### Option 2: Full Setup (After Installing Python)
```bash
setup-first-time.bat  # One time  
start-dev.bat         # Daily
```
- Everything works
- Includes AI features
- Requires Python installed

**Choose Option 1 to start coding now!** 🚀
