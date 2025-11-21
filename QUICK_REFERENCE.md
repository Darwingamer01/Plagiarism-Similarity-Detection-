# Quick Reference Card

## 🎯 Choose Your Workflow

### For Daily Development → Use Terminal Approach
### For Production Deployment → Use Docker

---

## ⚡ Terminal Approach (FAST)

### First Time Setup
```bash
setup-first-time.bat
```

### Daily Use
```bash
# Start everything
start-dev.bat

# Stop everything
stop-dev.bat
# (or just close terminals)
```

### URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- AI Service: http://localhost:8001
- API Docs: http://localhost:8001/docs

### What's Running Where?
- **Terminal 1**: Docker (PostgreSQL + Redis)
- **Terminal 2**: Backend (Node.js) - Hot reload ✅
- **Terminal 3**: AI Service (Python) - Hot reload ✅
- **Terminal 4**: Frontend (React) - Hot reload ✅

---

## 🐳 Docker Approach (PRODUCTION)

### Development (DB only)
```bash
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
```

### Full Production
```bash
docker-compose up --build -d
docker-compose down
docker-compose logs -f
```

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- AI Service: http://localhost:8001
- nginx Proxy: http://localhost

---

## 🔧 Common Commands

### Check What's Running
```bash
# Docker containers
docker ps

# Ports in use
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :5173
```

### Kill Port (if blocked)
```bash
# Find PID
netstat -ano | findstr :8000

# Kill process
taskkill /PID <NUMBER> /F
```

### Database Commands
```bash
# Connect to PostgreSQL
docker exec -it dev-postgres psql -U plagiarism_user -d plagiarism_db

# Connect to Redis
docker exec -it dev-redis redis-cli
```

### Backend Commands
```bash
cd backend

# Install dependencies
npm install

# Run migrations
npm run migrate

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### AI Service Commands
```bash
cd ai-service

# Activate venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8001

# Run tests
pytest
```

---

## 📊 Time Comparison

| Task | Docker | Terminal |
|------|--------|----------|
| First setup | 15 min | 5 min |
| Daily start | 3 min | 30 sec |
| Code change reload | 5 min rebuild | Instant |

---

## 🐛 Troubleshooting

### Problem: "Port already in use"
```bash
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F
```

### Problem: "Cannot connect to database"
```bash
# Check Docker
docker ps

# Restart database
docker-compose restart postgres
```

### Problem: "Module not found"
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# AI Service
cd ai-service
venv\Scripts\activate
pip install -r requirements.txt
```

### Problem: "Docker build failed"
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `start-dev.bat` | Start all services (Terminal mode) |
| `stop-dev.bat` | Stop all services |
| `setup-first-time.bat` | Initial setup script |
| `DEV_QUICK_START.md` | Detailed terminal setup guide |
| `DEV_WORKFLOW_COMPARISON.md` | Compare Docker vs Terminal |
| `docker-compose.yml` | Full production Docker setup |
| `docker-compose.dev.yml` | Just databases for dev |

---

## 🎓 Best Practices

### Development
✅ Use terminal approach
✅ Keep terminals open to see logs
✅ Edit code in your IDE
✅ Changes reload automatically

### Testing
✅ Write tests as you code
✅ Run `npm test` in backend/frontend
✅ Run `pytest` in ai-service
✅ Use Postman/Thunder Client for API testing

### Production
✅ Use Docker compose
✅ Set proper environment variables
✅ Enable HTTPS with nginx
✅ Monitor logs: `docker-compose logs -f`

---

## 📞 Quick Help

- **Setup Issues**: See `DEV_QUICK_START.md`
- **Docker Issues**: See `DOCKER_BUILD_FIXES.md`
- **Architecture**: See `PROJECT_SUMMARY.md`
- **API Details**: Visit http://localhost:8001/docs

---

**Remember:** For development, always use the terminal approach. It's 10x faster! 🚀
