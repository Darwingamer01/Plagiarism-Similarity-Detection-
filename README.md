# AI-Powered Plagiarism Detection System

**Version:** 3.0.0  
**Stack:** React + TypeScript + Node.js + Python + Docker

## 🎯 Overview

A production-ready AI plagiarism detection platform that uses semantic similarity analysis to detect document plagiarism. Built with a modern microservices architecture for scalability and performance.

### Key Features

- 📄 **Document Upload** - Support for TXT, PDF, DOCX formats (5MB limit)
- 🤖 **AI-Powered Detection** - Semantic similarity using sentence-transformers
- 📊 **Visual Results** - Interactive dashboards with color-coded risk levels
- 🔐 **Secure Authentication** - JWT-based authentication with refresh tokens
- 🚀 **Docker Deployment** - Fully containerized with docker-compose
- ⚡ **High Performance** - Redis caching, PostgreSQL database
- 📈 **Scalable Architecture** - Microservices with horizontal scaling support

## 🏗️ Architecture

```
Frontend (React + TypeScript) → Backend (Node.js + Express) → AI Service (Python + FastAPI)
                                         ↓                              ↓
                                   PostgreSQL + Redis              FAISS Vector DB
```

### Services

- **Frontend** - React 18 + TypeScript + Vite + Tailwind CSS (Port 3000)
- **Backend** - Node.js 20 + Express + TypeScript (Port 8000)
- **AI Service** - Python 3.11 + FastAPI + sentence-transformers (Port 8001)
- **Database** - PostgreSQL 15 (Port 5432)
- **Cache** - Redis 7 (Port 6379)
- **Proxy** - nginx (Port 80/443)

## 📋 Prerequisites

- **Docker** 20.10+ and Docker Compose 2.0+
- **Node.js** 20.x LTS (for local development)
- **Python** 3.11+ (for local AI service development)
- **Git** 2.x

## 🚀 Quick Start

### ⚡ **FAST** Development Setup (Recommended - 30 seconds)

For daily development, skip Docker and run services individually:

```bash
# One-time setup (5 minutes)
setup-first-time.bat

# Start all services (30 seconds)
start-dev.bat
```

See **[DEV_QUICK_START.md](DEV_QUICK_START.md)** for detailed instructions.

**Why?** 10x faster than Docker, instant hot-reload, easier debugging!

---

### 🐳 Docker Setup (For Production)

### 1. Clone Repository

```bash
git clone <repository-url>
cd plagiarism-detection-system
```

### 2. Environment Configuration

Create `.env` files for each service:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend (if needed for local dev)
cp frontend/.env.example frontend/.env

# AI Service
cp ai-service/.env.example ai-service/.env
```

### 3. Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Initialize Database

```bash
# Run database migrations
docker-compose exec backend npm run migrate

# (Optional) Seed sample data
docker-compose exec backend npm run seed
```

### 5. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/api-docs
- **AI Service:** http://localhost:8001/docs

## 💻 Local Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### AI Service Development

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Database Setup (Local)

```bash
# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# Run migrations
cd backend
npm run migrate
```

## 🧪 Testing

### Run All Tests

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# AI Service tests
cd ai-service && pytest
```

### Test Coverage

```bash
# Frontend coverage
cd frontend && npm run test:coverage

# Backend coverage
cd backend && npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Document Endpoints

- `POST /api/documents/ingest` - Upload and index documents
- `GET /api/documents` - List user's documents
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document

### Similarity Endpoints

- `POST /api/similarity/check` - Check document similarity
- `GET /api/similarity/results/:id` - Get similarity results
- `GET /api/similarity/history` - Get check history

### System Endpoints

- `GET /api/health` - Health check (no auth)
- `GET /api/status` - System status (requires auth)
- `GET /api/stats` - Usage statistics

**Full API Documentation:** http://localhost:8000/api-docs

## 🔐 Security

### Environment Variables

**Never commit sensitive credentials!** Use strong passwords and secrets in production.

Key environment variables:

- `JWT_SECRET` - Minimum 32 characters
- `JWT_REFRESH_SECRET` - Minimum 32 characters
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string

### Security Features

- JWT authentication with refresh tokens
- bcrypt password hashing (10 salt rounds)
- Rate limiting (100 requests/minute)
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- File upload restrictions (5MB limit)

## 📊 Database Schema

### Tables

- **users** - User accounts and authentication
- **documents** - Uploaded document metadata
- **document_chunks** - Document text chunks with embeddings
- **similarity_checks** - Similarity check results
- **audit_logs** - System audit trail

**Database Migrations:** Located in `backend/src/migrations/`

## 🐳 Docker Configuration

### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
```

### Scale Services

```bash
# Scale backend to 3 instances
docker-compose up --scale backend=3 -d
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:pass@postgres:5432/plagiarism_db
REDIS_URL=redis://redis:6379
AI_SERVICE_URL=http://ai-service:8001
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### AI Service Configuration

Edit `ai-service/.env`:

```env
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
DATA_DIR=/app/data
CHUNK_SIZE=300
CHUNK_OVERLAP=50
```

## 📈 Performance

### Optimization Tips

- Enable Redis caching for frequently accessed data
- Use connection pooling for database queries
- Implement CDN for static assets
- Enable gzip compression in nginx
- Use FAISS IVF indexing for large document sets

### Monitoring

- Check logs: `docker-compose logs -f`
- Health endpoint: `curl http://localhost:8000/api/health`
- Resource usage: `docker stats`

## 🚧 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Check what's using the port
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Linux/Mac

# Change port in docker-compose.yml
```

**Database Connection Error:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres
```

**AI Service Not Responding:**
```bash
# Check AI service status
docker-compose logs ai-service

# Restart AI service
docker-compose restart ai-service
```

## 📝 Development Workflow

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request
5. Merge to main after review

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/config changes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Developer** - React, TypeScript, UI/UX
- **Backend Developer** - Node.js, PostgreSQL, APIs
- **AI/ML Engineer** - Python, FAISS, embeddings
- **DevOps Engineer** - Docker, CI/CD, monitoring

## 📞 Support

For issues and questions:

- **GitHub Issues:** [Create an issue](issues)
- **Email:** support@example.com
- **Docs:** [Full Documentation](docs/)

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] OCR for scanned documents
- [ ] Real-time WebSocket updates
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] API webhooks
- [ ] Team collaboration features

---

**Version:** 3.0.0  
**Last Updated:** 2024-01-18  
**Status:** Production Ready
