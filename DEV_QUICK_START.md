# Quick Development Setup - Individual Terminals

This guide helps you run the application **without Docker** for faster development. Each service runs in its own terminal.

## ⚡ Why This is Faster

- **No Docker builds** (saves 5-10 minutes)
- **Instant code reloads** with hot-reload enabled
- **Easy debugging** - see logs in each terminal
- **Less resource intensive** - no Docker overhead

---

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Python** (v3.9+) - [Download](https://www.python.org/)
- **PostgreSQL** (v15) - [Download](https://www.postgresql.org/download/windows/)
- **Redis** (via Docker or Windows installer)

---

## 🚀 Step-by-Step Setup

### **Terminal 1: PostgreSQL Database**

**Option A - Use Docker for Database Only:**
```bash
docker-compose up postgres -d
```

**Option B - Use Local PostgreSQL:**
```bash
# After installing PostgreSQL, create database:
psql -U postgres
CREATE DATABASE plagiarism_db;
CREATE USER plagiarism_user WITH PASSWORD 'plagiarism_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE plagiarism_db TO plagiarism_user;
\q
```

---

### **Terminal 2: Redis Cache**

**Option A - Use Docker:**
```bash
docker-compose up redis -d
```

**Option B - Use Local Redis:**
```bash
# Download Redis for Windows or use WSL
redis-server
```

---

### **Terminal 3: Backend (Node.js API)**

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Create .env file
copy .env.example .env

# Edit .env with these values:
# NODE_ENV=development
# PORT=8000
# DATABASE_URL=postgresql://plagiarism_user:plagiarism_pass_2024@localhost:5432/plagiarism_db
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_URL=redis://localhost:6379
# AI_SERVICE_URL=http://localhost:8001
# JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
# JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
# UPLOAD_DIR=./uploads
# MAX_FILE_SIZE=5242880

# Run migrations (first time only)
npm run migrate

# Start development server (with hot-reload)
npm run dev
```

**Backend will run on:** `http://localhost:8000`

---

### **Terminal 4: AI Service (Python/FastAPI)**

```bash
# Navigate to ai-service
cd ai-service

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows CMD:
venv\Scripts\activate
# Windows PowerShell:
venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env with these values:
# MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
# DATA_DIR=./data
# CHUNK_SIZE=300
# CHUNK_OVERLAP=50

# Start development server (with hot-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**AI Service will run on:** `http://localhost:8001`

---

### **Terminal 5: Frontend (React/Vite)**

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Create .env file
copy .env.example .env

# Edit .env with:
# VITE_API_URL=http://localhost:8000

# Start development server (with hot-reload)
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 🎯 Testing Your Setup

Once all services are running, test them:

1. **Frontend:** Open `http://localhost:5173` in your browser
2. **Backend Health:** Visit `http://localhost:8000/health`
3. **AI Service Health:** Visit `http://localhost:8001/health`
4. **API Docs:** Visit `http://localhost:8001/docs` (FastAPI auto-docs)

---

## 🛠️ Common Issues & Fixes

### Issue: Port Already in Use

```bash
# Windows - Find and kill process using port 8000:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Or change the port in .env files
```

### Issue: Database Connection Failed

```bash
# Check if PostgreSQL is running:
docker ps  # If using Docker
# OR
# Check Windows Services for PostgreSQL

# Test connection:
psql -U plagiarism_user -d plagiarism_db -h localhost
```

### Issue: Redis Connection Failed

```bash
# Check if Redis is running:
docker ps  # If using Docker

# Test Redis:
redis-cli ping  # Should return "PONG"
```

### Issue: Module Not Found (Python)

```bash
# Make sure virtual environment is activated
cd ai-service
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: TypeScript Errors (Backend)

```bash
# Install missing types
cd backend
npm install --save-dev @types/pg @types/node @types/express
```

---

## 💡 Development Tips

### Hot Reload is Enabled!

- **Backend:** Changes to `.ts` files reload automatically
- **Frontend:** Changes to `.tsx/.jsx/.css` files reload instantly
- **AI Service:** Changes to `.py` files reload automatically

### Viewing Logs

Each terminal shows its service logs in real-time. No need to run `docker logs`!

### Stopping Services

Just press `Ctrl+C` in each terminal to stop the service.

### Restarting a Single Service

Just press `Ctrl+C` and run the start command again in that terminal. No need to restart everything!

---

## 📦 When to Use Docker?

Use Docker only for:
- **Production deployment**
- **Testing the full production build**
- **Running just databases** (postgres + redis)

For daily development, this terminal-based setup is **much faster**!

---

## 🔄 Quick Commands Cheat Sheet

### Start Everything (5 terminals)

```bash
# Terminal 1
docker-compose up postgres redis -d

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd ai-service && venv\Scripts\activate && uvicorn main:app --reload --port 8001

# Terminal 4
cd frontend && npm run dev
```

### Stop Everything

```bash
# Stop databases
docker-compose down

# Stop each service: Ctrl+C in each terminal
```

### Check Status

```bash
# Check databases
docker ps

# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :5173
```

---

## 🚀 First Time Complete Setup Script

Run these commands once:

```bash
# 1. Start databases
docker-compose up postgres redis -d

# 2. Setup Backend
cd backend
npm install
copy .env.example .env
# Edit .env with your values
npm run migrate

# 3. Setup AI Service
cd ../ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env

# 4. Setup Frontend
cd ../frontend
npm install
copy .env.example .env

# Now you're ready! Use the 5-terminal setup above
```

---

## ⏱️ Time Comparison

| Method | Initial Setup | Subsequent Starts | Code Changes |
|--------|--------------|-------------------|--------------|
| **Docker** | 10-15 min | 2-3 min | Rebuild required |
| **Individual Terminals** | 5 min | 30 sec | Hot reload! |

---

Happy Coding! 🎉
