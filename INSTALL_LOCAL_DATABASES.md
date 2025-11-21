# Install PostgreSQL and Redis Locally (Windows)

## Why Install Locally?

- ✅ No Docker needed
- ✅ Faster startup
- ✅ Always available
- ✅ Better for development

---

## 🗄️ PostgreSQL Installation

### Step 1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download PostgreSQL 15 or 16 (Windows x86-64)
4. Run the installer

### Step 2: Installation Settings

During installation, use these settings:

- **Password:** `plagiarism_pass_2024` (or your choice)
- **Port:** `5432` (default)
- **Install pgAdmin:** ✅ Yes
- **Stack Builder:** Skip (not needed)

### Step 3: Create Database and User

Open **SQL Shell (psql)** from Start menu:

```sql
-- Press Enter for defaults (localhost, 5432, postgres)
-- Enter the password you set during installation

-- Create database
CREATE DATABASE plagiarism_db;

-- Create user
CREATE USER plagiarism_user WITH PASSWORD 'plagiarism_pass_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE plagiarism_db TO plagiarism_user;

-- Connect to new database
\c plagiarism_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO plagiarism_user;

-- Exit
\q
```

### Step 4: Verify Installation

Test connection:
```bash
psql -U plagiarism_user -d plagiarism_db -h localhost
# Enter password: plagiarism_pass_2024
# If it connects, you're good! Type \q to exit
```

---

## 🔴 Redis Installation

### Step 1: Download Redis for Windows

**Option A: Memurai (Recommended - Easier)**
1. Go to: https://www.memurai.com/get-memurai
2. Download Memurai (Redis-compatible for Windows)
3. Install with defaults
4. Redis will start automatically as a service

**Option B: Redis MSI Installer**
1. Go to: https://github.com/microsoftarchive/redis/releases
2. Download `Redis-x64-3.0.504.msi`
3. Install with defaults
4. Port: `6379`
5. Check "Add Redis to Windows Service"

### Step 2: Start Redis

**If using Memurai:**
- Already running as a service!

**If using Redis MSI:**
```bash
# Check if running
redis-cli ping
# Should return: PONG

# If not running, start the service
net start Redis
```

### Step 3: Verify Installation

Test Redis:
```bash
redis-cli
# Should open Redis CLI
> ping
# Should return: PONG
> exit
```

---

## ⚙️ Update Backend Configuration

Your backend `.env` is already configured correctly!

Just verify these lines in `backend\.env`:

```env
# Database
DATABASE_URL=postgresql://plagiarism_user:plagiarism_pass_2024@localhost:5432/plagiarism_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plagiarism_db
DB_USER=plagiarism_user
DB_PASSWORD=plagiarism_pass_2024

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🚀 Run Migrations

After PostgreSQL is installed and database created:

```bash
cd backend
npm run migrate
```

You should see:
```
✓ Database connection established
✓ Creating users table...
✓ Creating documents table...
✓ Creating similarity_results table...
✓ Migrations completed successfully!
```

---

## ✅ Test Everything

### Test PostgreSQL
```bash
psql -U plagiarism_user -d plagiarism_db -h localhost
\dt
# Should show tables: users, documents, similarity_results
\q
```

### Test Redis
```bash
redis-cli
ping
# Should return: PONG
exit
```

### Test Backend
```bash
cd backend
npm run dev
```

Should see:
```
✓ Database connection established
✓ Redis connected
🚀 Server running on port 8000
```

---

## 🎯 Start Your App (No Docker!)

Now you can run everything locally:

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

**Terminal 3 - AI Service (optional):**
```bash
cd ai-service
venv\Scripts\activate
uvicorn main:app --reload --port 8001
```

---

## 🛠️ Useful Commands

### PostgreSQL

```bash
# Connect to database
psql -U plagiarism_user -d plagiarism_db -h localhost

# List databases
\l

# List tables
\dt

# View table structure
\d users

# Run SQL
SELECT * FROM users;

# Exit
\q
```

### Redis

```bash
# Open Redis CLI
redis-cli

# Test connection
ping

# View all keys
keys *

# Get value
get key_name

# Clear all data
FLUSHALL

# Exit
exit
```

### Services Management

```bash
# Stop PostgreSQL service
net stop postgresql-x64-15

# Start PostgreSQL service
net start postgresql-x64-15

# Stop Redis service
net stop Redis

# Start Redis service
net start Redis
```

---

## 🐛 Troubleshooting

### PostgreSQL Won't Start
1. Open Services (Win + R → `services.msc`)
2. Find "postgresql-x64-15" (or similar)
3. Right-click → Start
4. Set to "Automatic" startup

### Redis Won't Start
1. Open Services
2. Find "Redis" or "Memurai"
3. Right-click → Start
4. Set to "Automatic" startup

### Can't Connect to Database
```bash
# Check if PostgreSQL is running
netstat -ano | findstr :5432

# Test with psql
psql -U postgres -h localhost
# Enter your installation password
# Then create the database and user again
```

### Backend Still Shows Errors
1. Rebuild backend: `cd backend && npm run build`
2. Check `.env` file exists and has correct values
3. Restart backend: `npm run dev`

---

## ⏱️ Installation Time

- PostgreSQL: 5-10 minutes
- Redis: 2-5 minutes
- Setup & Testing: 5 minutes
- **Total: ~15-20 minutes**

---

## 🎉 Benefits of Local Installation

✅ **No Docker issues**
✅ **Faster startup** (services run as Windows services)
✅ **Better performance** (native Windows)
✅ **Always available** (start with Windows)
✅ **Easier to debug** (direct access with psql/redis-cli)
✅ **Less memory usage** (no Docker overhead)

---

## 📞 Quick Links

- PostgreSQL Installer: https://www.postgresql.org/download/windows/
- Memurai (Redis): https://www.memurai.com/get-memurai
- Redis MSI: https://github.com/microsoftarchive/redis/releases
- pgAdmin (GUI): Installed with PostgreSQL

---

**Ready to install?** Start with PostgreSQL, then Redis, then run migrations!
