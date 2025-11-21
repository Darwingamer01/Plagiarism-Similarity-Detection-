# Quick Setup Guide

## Prerequisites

Ensure you have the following installed:
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.x

## Setup Steps

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd plagiarism-detection-system
```

### 2. Configure Environment Variables

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and set your JWT secrets and database credentials
```

#### Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL is already set to http://localhost:8000
```

#### AI Service
```bash
cd ai-service
cp .env.example .env
# Defaults are fine for development
```

### 3. Start Services

From the root directory:

```bash
# Build and start all services
docker-compose up --build -d

# This will start:
# - Frontend (React) on http://localhost:3000
# - Backend (Node.js) on http://localhost:8000
# - AI Service (Python) on http://localhost:8001
# - PostgreSQL on localhost:5432
# - Redis on localhost:6379
# - nginx on http://localhost:80
```

### 4. Initialize Database

```bash
# Run database migrations
docker-compose exec backend npm run migrate

# Verify tables were created
docker-compose exec postgres psql -U plagiarism_user -d plagiarism_db -c "\dt"
```

### 5. Check Service Health

```bash
# Check all services are running
docker-compose ps

# Check backend health
curl http://localhost:8000/health

# Check AI service health
curl http://localhost:8001/health
```

### 6. Access Application

Open your browser and navigate to:
- **Frontend UI:** http://localhost:3000
- **Backend API Docs:** http://localhost:8000/api-docs
- **AI Service Docs:** http://localhost:8001/docs

### 7. Create Test Account

1. Navigate to http://localhost:3000/register
2. Fill in registration form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPass123!
3. Click "Register"
4. Login with your credentials

## Troubleshooting

### Port Already in Use

If you get port conflicts, you can change ports in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3001:80"  # Change 3000 to 3001
  backend:
    ports:
      - "8001:8000"  # Change 8000 to 8001
```

### Database Connection Failed

Ensure PostgreSQL is running:
```bash
docker-compose logs postgres
docker-compose restart postgres
```

### AI Service Not Loading Model

The first startup takes longer to download the model (~90MB). Check logs:
```bash
docker-compose logs ai-service
```

### Frontend Build Errors

Clear Docker cache and rebuild:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## Development Mode

For local development without Docker:

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### Database
```bash
docker-compose up postgres redis -d
```

## Useful Commands

```bash
# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f ai-service

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Scale backend instances
docker-compose up --scale backend=3 -d

# Execute commands in containers
docker-compose exec backend npm run migrate
docker-compose exec postgres psql -U plagiarism_user -d plagiarism_db

# Check resource usage
docker stats
```

## Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### API Testing
```bash
# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!","fullName":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

## Production Deployment

For production deployment:

1. **Update environment variables** with strong secrets
2. **Enable HTTPS** in nginx configuration
3. **Set up SSL certificates** (Let's Encrypt recommended)
4. **Configure firewall** rules
5. **Set up monitoring** and logging
6. **Configure backups** for PostgreSQL
7. **Use managed Redis** (AWS ElastiCache, Azure Cache, etc.)
8. **Deploy to cloud** (AWS, GCP, Azure, DigitalOcean)

## Next Steps

1. ✅ Services are running
2. ✅ Database is initialized
3. ✅ User account created
4. 📤 Upload documents
5. 🔍 Check similarity
6. 📊 View results

For detailed API documentation, visit http://localhost:8000/api-docs

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review documentation in `/docs` folder
- Check GitHub Issues
