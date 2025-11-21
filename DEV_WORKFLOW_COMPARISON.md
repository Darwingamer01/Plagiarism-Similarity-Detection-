# Development Workflow Comparison

## 🐌 Traditional Docker Approach

### Build Time: **10-15 minutes**
```bash
docker-compose up --build
```

**Issues:**
- ❌ Slow build process (3 services × 3-5 min each)
- ❌ Need to rebuild for every code change
- ❌ Large image sizes (1-2 GB per service)
- ❌ Port conflicts common
- ❌ Hard to debug - logs mixed together
- ❌ High memory usage (4GB+ RAM)

---

## ⚡ Fast Terminal Approach (Recommended)

### Startup Time: **30 seconds**

### **One-Time Setup (5 minutes)**
```bash
setup-first-time.bat
```

### **Daily Development (30 seconds)**
```bash
start-dev.bat
```

**Benefits:**
- ✅ **10x faster** than Docker builds
- ✅ **Hot reload** - instant code updates
- ✅ **Separate logs** - easy debugging
- ✅ **Less memory** - ~2GB RAM
- ✅ **No port conflicts**
- ✅ **Native debugging** tools work

---

## 📊 Time Comparison

| Task | Docker | Terminal | Savings |
|------|--------|----------|---------|
| First build | 15 min | 5 min | **10 min** |
| Daily start | 3 min | 30 sec | **2.5 min** |
| Code change | Rebuild (5 min) | Instant | **5 min** |
| Per day (10 changes) | ~53 min | ~1 min | **52 min/day** |

---

## 🎯 When to Use What?

### Use Terminal Approach For:
- ✅ Daily development
- ✅ Testing features
- ✅ Debugging issues
- ✅ Quick iterations
- ✅ Learning/experimentation

### Use Docker For:
- ✅ Production deployment
- ✅ Testing final build
- ✅ CI/CD pipelines
- ✅ Sharing environment
- ✅ Container orchestration

---

## 🚀 Quick Start Commands

### Terminal Approach
```bash
# First time only
setup-first-time.bat

# Start development
start-dev.bat

# Stop everything
stop-dev.bat
```

### Docker Approach
```bash
# Development (DB only)
docker-compose -f docker-compose.dev.yml up -d

# Production (all services)
docker-compose up --build
```

---

## 💡 Pro Tips

### Speed Up npm install
```bash
# Use npm ci instead of npm install (faster)
npm ci

# Enable npm cache
npm config set cache ~/.npm-cache --global
```

### Speed Up pip install
```bash
# Use pip cache
pip install --cache-dir ~/.pip-cache -r requirements.txt

# Or use pre-built wheels
pip install --only-binary :all: -r requirements.txt
```

### Speed Up Docker Builds (if needed)
```dockerfile
# Use multi-stage builds
# Add .dockerignore files
# Use layer caching wisely
# Use smaller base images (alpine)
```

---

## 📝 Environment File Templates

### Backend .env
```env
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://plagiarism_user:plagiarism_pass_2024@localhost:5432/plagiarism_db
REDIS_HOST=localhost
REDIS_PORT=6379
AI_SERVICE_URL=http://localhost:8001
JWT_SECRET=your-secret-key-at-least-32-characters-long-here
JWT_REFRESH_SECRET=your-refresh-secret-at-least-32-chars
```

### Frontend .env
```env
VITE_API_URL=http://localhost:8000
```

### AI Service .env
```env
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
DATA_DIR=./data
CHUNK_SIZE=300
CHUNK_OVERLAP=50
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Check Docker
docker ps

# Test connection
psql -U plagiarism_user -d plagiarism_db -h localhost
```

### Module Not Found
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install

# AI Service
cd ai-service && venv\Scripts\activate && pip install -r requirements.txt
```

---

**Bottom Line:** Use the terminal approach for development. It's **10x faster** and gives you better control!
