# 🎯 DO THIS NOW - Installation Order

## Current Situation
✅ Frontend running (http://localhost:3001)
✅ Backend running (http://localhost:8000)  
✅ Python installed (3.11.5)
❌ Docker Desktop having issues
❌ PostgreSQL not installed
❌ Redis not installed

---

## 🚀 Action Plan (30 minutes total)

### RIGHT NOW - Install Databases (20 minutes)

#### 1. Install PostgreSQL (10 minutes)
```
Download: https://www.postgresql.org/download/windows/
- Get PostgreSQL 15 or 16
- Password: plagiarism_pass_2024
- Port: 5432
- Install pgAdmin: Yes
```

After installation, open **SQL Shell (psql)**:
```sql
CREATE DATABASE plagiarism_db;
CREATE USER plagiarism_user WITH PASSWORD 'plagiarism_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE plagiarism_db TO plagiarism_user;
\c plagiarism_db
GRANT ALL ON SCHEMA public TO plagiarism_user;
\q
```

#### 2. Install Memurai (Redis) (5 minutes)
```
Download: https://www.memurai.com/get-memurai
- Install with defaults
- Runs automatically
```

Test:
```bash
redis-cli ping
# Should return: PONG
```

#### 3. Run Migrations (2 minutes)
```bash
cd backend
npm run migrate
```

#### 4. Restart Backend (1 minute)
- Go to backend terminal
- Press `Ctrl+C`
- Run: `npm run dev`
- ✅ No more Redis errors!

---

### LATER - Setup AI Service (10 minutes)

When databases are working:
```bash
.\setup-ai-service.bat
```

This installs AI dependencies (takes 5-10 minutes).

---

## 📋 Installation Links

**PostgreSQL:**
https://www.postgresql.org/download/windows/

**Memurai (Redis):**
https://www.memurai.com/get-memurai

---

## 🎓 After Installation

### Your App Structure:
```
✅ PostgreSQL - Windows Service (port 5432)
✅ Redis/Memurai - Windows Service (port 6379)
✅ Backend - Terminal 1 (port 8000)
✅ Frontend - Terminal 2 (port 3001/5173)
✅ AI Service - Terminal 3 (port 8001) [optional]
```

### Start Everything:
```bash
# Databases start automatically with Windows!
# Just start the app:
.\start-simple.bat
```

---

## ✅ Benefits of Local Install

✅ **No Docker issues** - Direct Windows install
✅ **Faster** - Native performance
✅ **Auto-start** - Services start with Windows
✅ **Always available** - No "Docker not running" errors
✅ **Easier debugging** - Direct access with psql/redis-cli

---

## 🎯 Summary

**Now:** Install PostgreSQL + Memurai (20 minutes)
**Then:** Restart backend (no more errors!)
**Later:** Setup AI service (10 minutes)
**Total:** 30 minutes to full working app

---

**Start with PostgreSQL:** https://www.postgresql.org/download/windows/

See `SETUP_LOCAL_DB_QUICK.md` for step-by-step guide!
