# 🎯 Quick Guide: Install Local Databases

## Why Local Databases?

Docker Desktop is having connection issues, so let's install PostgreSQL and Redis directly on Windows. This is actually **better** for development!

---

## ⚡ Quick Installation (20 minutes total)

### 1️⃣ PostgreSQL (10 minutes)

**Download:**
- Go to: https://www.postgresql.org/download/windows/
- Click "Download the installer"
- Get PostgreSQL 15 or 16

**Install:**
- Run installer
- Password: `plagiarism_pass_2024` (remember this!)
- Port: `5432` (keep default)
- Install pgAdmin: ✅ Yes

**Create Database:**
Open "SQL Shell (psql)" from Start menu:
```sql
-- Press Enter for defaults, enter your password

CREATE DATABASE plagiarism_db;
CREATE USER plagiarism_user WITH PASSWORD 'plagiarism_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE plagiarism_db TO plagiarism_user;

-- Connect to the database
\c plagiarism_db
GRANT ALL ON SCHEMA public TO plagiarism_user;
\q
```

---

### 2️⃣ Redis (5 minutes)

**Download Memurai (Redis for Windows):**
- Go to: https://www.memurai.com/get-memurai
- Download Memurai
- Install with defaults
- It runs automatically as a Windows service!

**Test Redis:**
```bash
redis-cli ping
# Should return: PONG
```

---

### 3️⃣ Run Migrations (2 minutes)

```bash
cd backend
npm run migrate
```

You should see success messages about creating tables!

---

### 4️⃣ Start Your App

Close all current terminals, then:

```bash
start-simple.bat
```

Or manually:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**No more Redis/PostgreSQL errors!** 🎉

---

## ✅ Verify Everything Works

### Test PostgreSQL:
```bash
psql -U plagiarism_user -d plagiarism_db -h localhost
# Password: plagiarism_pass_2024
\dt  # Should show tables
\q
```

### Test Redis:
```bash
redis-cli
ping  # Should return PONG
exit
```

### Test Backend:
Open http://localhost:8000/health
Should see: `{"status": "ok"}`

---

## 🎓 Useful Commands

### PostgreSQL Service:
```bash
# Start
net start postgresql-x64-15

# Stop
net stop postgresql-x64-15
```

### Redis/Memurai Service:
```bash
# Start
net start Memurai

# Stop
net stop Memurai
```

### Connect to Database:
```bash
psql -U plagiarism_user -d plagiarism_db -h localhost
```

### Connect to Redis:
```bash
redis-cli
```

---

## 🐛 Quick Troubleshooting

### "psql command not found"
Add to PATH:
- `C:\Program Files\PostgreSQL\15\bin`

### "redis-cli not found"
Add to PATH:
- `C:\Program Files\Memurai\`

### Backend still can't connect
1. Check services are running (Win + R → `services.msc`)
2. Look for "postgresql-x64-15" and "Memurai"
3. Make sure both are "Running"
4. Restart backend

---

## 📊 What You Get

✅ PostgreSQL - All database features work
✅ Redis - Caching works
✅ No Docker needed
✅ Faster startup
✅ Runs as Windows service
✅ Always available

---

## 🚀 Ready to Install?

1. **PostgreSQL first:** https://www.postgresql.org/download/windows/
2. **Then Memurai:** https://www.memurai.com/get-memurai
3. **Run migrations:** `cd backend && npm run migrate`
4. **Start app:** `start-simple.bat`

**Total time: ~20 minutes**

See `INSTALL_LOCAL_DATABASES.md` for detailed instructions!
