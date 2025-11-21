# Product Requirements Document (PRD)
## AI-Powered Plagiarism Detection System
### React + TypeScript Frontend | Node.js + TypeScript Backend

---

## 📋 Executive Summary

**Project Name:** AI Plagiarism Detection System (React/Node Rebuild)  
**Version:** 3.0.0  
**Status:** Requirements Document  
**Target Stack:** React + TypeScript + Node.js + Docker  
**Deployment:** Docker-optimized, Cloud-ready  

### Purpose
Rebuild the existing Python-based plagiarism detection system using modern JavaScript/TypeScript stack while maintaining all core functionality and improving performance, scalability, and developer experience.

---

## 🎯 Project Overview

### Current System Analysis
The existing system is a **production-ready AI plagiarism detection platform** built with:
- **Frontend:** Streamlit (Python)
- **Backend:** FastAPI (Python)
- **AI Engine:** sentence-transformers + FAISS vector database
- **Features:** Document ingestion, similarity checking, real-time threshold tuning
- **Accuracy:** 0.79-0.97 similarity detection
- **Deployment:** Docker containerized

### Business Requirements
1. **Document Upload & Processing** - Support TXT, PDF, DOCX formats (5MB limit)
2. **Similarity Detection** - AI-powered semantic similarity analysis
3. **Real-time Results** - Interactive dashboards with visual similarity scores
4. **Multi-document Comparison** - Compare uploaded documents against indexed corpus
5. **Threshold Configuration** - Adjustable plagiarism detection thresholds
6. **API-first Architecture** - RESTful API for integrations
7. **Production Security** - API authentication, input validation, CORS
8. **Scalable Infrastructure** - Docker deployment with horizontal scaling support

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
├─────────────────────────────────────────────────────────────┤
│  React + TypeScript Frontend (Port 3000)                    │
│  ├── Material-UI / Ant Design / Tailwind                    │
│  ├── React Query (data fetching)                            │
│  ├── React Router (navigation)                              │
│  ├── Zustand/Redux (state management)                       │
│  └── Axios (HTTP client)                                    │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Node.js + TypeScript Backend (Port 8000)                   │
│  ├── Express.js / Fastify (web framework)                   │
│  ├── Multer (file upload)                                   │
│  ├── JWT / API Key (authentication)                         │
│  ├── Helmet (security)                                      │
│  ├── Winston (logging)                                      │
│  └── Swagger/OpenAPI (documentation)                        │
└─────────────────────────────────────────────────────────────┘
                            ↕ Internal
┌─────────────────────────────────────────────────────────────┐
│                   AI Processing Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Python Microservice (Port 8001)                            │
│  ├── FastAPI (lightweight API)                              │
│  ├── sentence-transformers (embeddings)                     │
│  ├── FAISS (vector search)                                  │
│  ├── PyPDF2/pdfplumber (PDF processing)                     │
│  └── python-docx (DOCX processing)                          │
└─────────────────────────────────────────────────────────────┘
                            ↕ Storage
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│  ├── PostgreSQL (metadata, users, documents)                │
│  ├── Redis (caching, sessions)                              │
│  ├── File System / S3 (document storage)                    │
│  └── FAISS Index Files (vector embeddings)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend Stack

#### Core Framework
- **React 18.x** - UI library with hooks and concurrent features
- **TypeScript 5.x** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing

#### UI/UX Libraries
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Unstyled accessible components
- **React Dropzone** - Drag-and-drop file upload
- **Recharts** - Data visualization for similarity graphs
- **React Hot Toast** - Notification system
- **Framer Motion** - Animation library

#### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client with interceptors

#### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest + React Testing Library** - Testing

### Backend Stack (Node.js)

#### Core Framework
- **Node.js 20.x LTS** - JavaScript runtime
- **TypeScript 5.x** - Type safety
- **Express.js 4.x** - Web framework
- **ts-node-dev** - Development with hot reload

#### API & Documentation
- **Swagger/OpenAPI** - API documentation
- **express-validator** - Input validation
- **multer** - File upload handling
- **helmet** - Security headers
- **cors** - CORS middleware

#### Authentication & Security
- **jsonwebtoken (JWT)** - Token-based auth
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting
- **joi** - Schema validation

#### Database & Caching
- **PostgreSQL 15** - Relational database
- **pg (node-postgres)** - PostgreSQL client
- **TypeORM / Prisma** - ORM (choose one)
- **ioredis** - Redis client for caching

#### Communication with Python AI Service
- **axios** - HTTP client for AI service calls
- **bullmq** - Queue for async processing (optional)

#### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **nodemon** - Development auto-reload
- **Winston** - Logging

### AI Processing Stack (Python Microservice)

- **Python 3.11** - Runtime
- **FastAPI** - Lightweight API framework
- **sentence-transformers** - Embedding model
- **FAISS** - Vector similarity search
- **torch** - Deep learning framework
- **pdfplumber** - PDF text extraction
- **python-docx** - DOCX processing
- **numpy** - Numerical computing

### Database & Storage

- **PostgreSQL 15** - Primary database
  - User management
  - Document metadata
  - Processing history
  - Audit logs

- **Redis 7** - Caching layer
  - Session storage
  - API response caching
  - Rate limiting

- **AWS S3 / MinIO** - Object storage (optional)
  - Document file storage
  - Processed results

### DevOps & Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **nginx** - Reverse proxy (production)
- **GitHub Actions** - CI/CD pipeline
- **ESLint + Prettier** - Code quality
- **Jest** - Testing framework

---

## 📦 Core Features & Requirements

### 1. Document Ingestion Module

#### FR-1.1: File Upload
- **Requirement:** Users can upload documents (TXT, PDF, DOCX)
- **Max File Size:** 5MB per file
- **Multi-file Support:** Upload up to 10 files simultaneously
- **Validation:** File type detection, size limits, malware scanning
- **Storage:** Files stored with UUID naming, metadata in PostgreSQL

#### FR-1.2: Document Processing
- **Text Extraction:** Extract text from PDF, DOCX, TXT
- **Chunking:** Split documents into 300-token chunks with 50-token overlap
- **Embedding Generation:** Convert chunks to 384-dimensional vectors
- **Index Storage:** Store vectors in FAISS index with metadata
- **Status Tracking:** Real-time processing status updates

#### FR-1.3: Metadata Management
- **Document Info:** Filename, upload date, user ID, file size
- **Chunk Tracking:** Number of chunks, character positions
- **Status:** Processing, indexed, failed states
- **Versioning:** Track document versions and updates

### 2. Similarity Detection Module

#### FR-2.1: Similarity Checking
- **Query Processing:** Upload document for comparison
- **Vector Search:** Find top-K similar chunks using FAISS
- **Score Aggregation:** Calculate overall similarity percentage
- **Threshold Detection:** Flag plagiarism based on configurable threshold
- **Multi-document Results:** Rank similar documents by score

#### FR-2.2: Results Visualization
- **Similarity Score:** 0-100% with color-coded risk levels (Low/Medium/High)
- **Side-by-side Comparison:** Show matched text snippets
- **Heatmap Visualization:** Visual representation of similarity distribution
- **Detailed Report:** Chunk-level matches with character positions
- **Export Options:** PDF, JSON, CSV report formats

#### FR-2.3: Real-time Configuration
- **Threshold Tuning:** Adjust similarity threshold (0.0-1.0)
- **Chunk Size:** Configure chunk size (100-500 tokens)
- **Overlap Setting:** Set overlap (0-100 tokens)
- **Top-K Results:** Number of similar documents to return (1-20)

### 3. User Interface Module

#### FR-3.1: Dashboard
- **Statistics:** Total documents, chunks indexed, processing queue
- **Recent Activity:** Latest uploads and similarity checks
- **Quick Actions:** Upload, check similarity, view reports
- **System Health:** Backend status, AI service status

#### FR-3.2: Upload Interface
- **Drag & Drop:** Intuitive file upload with preview
- **Progress Indicators:** Real-time upload and processing progress
- **Batch Upload:** Queue multiple files for processing
- **Error Handling:** Clear error messages with retry options

#### FR-3.3: Similarity Check Interface
- **Document Selection:** Choose document to check
- **Configuration Panel:** Adjust thresholds and settings
- **Results Display:** Interactive similarity results
- **Comparison View:** Side-by-side text comparison

#### FR-3.4: Settings & Configuration
- **User Profile:** Manage account settings
- **API Keys:** Generate and manage API keys
- **Threshold Presets:** Save custom threshold configurations
- **Export Settings:** Configure report formats

### 4. REST API Module

#### FR-4.1: Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

#### FR-4.2: Document Endpoints
- `POST /api/documents/ingest` - Upload and index documents
- `GET /api/documents` - List indexed documents
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document

#### FR-4.3: Similarity Endpoints
- `POST /api/similarity/check` - Check document similarity
- `GET /api/similarity/results/:id` - Get similarity results
- `GET /api/similarity/history` - Get check history

#### FR-4.4: System Endpoints
- `GET /api/health` - Health check (no auth)
- `GET /api/status` - System status (auth required)
- `GET /api/stats` - Usage statistics

### 5. Security & Authentication

#### FR-5.1: User Authentication
- **JWT Tokens:** Access token (15min) + refresh token (7 days)
- **Password Security:** bcrypt hashing with salt rounds
- **Session Management:** Redis-based session storage
- **Multi-factor Auth:** Optional 2FA with TOTP (future)

#### FR-5.2: API Security
- **API Key Auth:** Alternative to JWT for integrations
- **Rate Limiting:** 100 requests/minute per user
- **CORS Policy:** Configurable allowed origins
- **Input Validation:** Sanitize all inputs
- **File Upload Security:** MIME type validation, size limits

#### FR-5.3: Data Security
- **Encryption at Rest:** Encrypt sensitive data in database
- **Encryption in Transit:** HTTPS/TLS for all communications
- **Access Control:** Role-based permissions (admin, user, viewer)
- **Audit Logging:** Track all user actions

---

## 🐳 Docker Architecture

### Multi-Container Setup

```yaml
version: '3.8'

services:
  # Frontend - React App
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend
    networks:
      - plagiarism-network

  # Backend - Node.js API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/plagiarism
      - REDIS_URL=redis://redis:6379
      - AI_SERVICE_URL=http://ai-service:8001
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
      - ai-service
    networks:
      - plagiarism-network

  # AI Service - Python Microservice
  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
      - DATA_DIR=/app/data
    volumes:
      - ai-data:/app/data
    networks:
      - plagiarism-network

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=plagiarism
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - plagiarism-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - plagiarism-network

  # nginx Reverse Proxy (Production)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - plagiarism-network

volumes:
  postgres-data:
  redis-data:
  ai-data:

networks:
  plagiarism-network:
    driver: bridge
```

### Docker Optimization Strategies

#### Frontend Dockerfile (Multi-stage)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile (Multi-stage)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 8000
USER node
CMD ["node", "dist/index.js"]
```

#### AI Service Dockerfile (Optimized)
```dockerfile
FROM python:3.11-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8001
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s \
  CMD python -c "import requests; requests.get('http://localhost:8001/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

---

## 📊 Database Schema

### PostgreSQL Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  api_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

#### Documents Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  chunks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);
```

#### Document Chunks Table
```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  text_content TEXT NOT NULL,
  start_pos INTEGER NOT NULL,
  end_pos INTEGER NOT NULL,
  embedding_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Similarity Checks Table
```sql
CREATE TABLE similarity_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query_document_id UUID REFERENCES documents(id),
  query_filename VARCHAR(255) NOT NULL,
  similarity_threshold FLOAT NOT NULL,
  max_similarity_score FLOAT,
  status VARCHAR(50) DEFAULT 'processing',
  results JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);
```

#### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Specification

### Authentication

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

Or API key:
```
X-API-KEY: <api_key>
```

### Endpoints Documentation

#### POST /api/auth/register
**Description:** Register new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

#### POST /api/auth/login
**Description:** Login and receive JWT tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
}
```

#### POST /api/documents/ingest
**Description:** Upload and index documents

**Request:** `multipart/form-data`
- files: File[] (required)
- threshold: number (optional, default: 0.88)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "processedFiles": [
      {
        "documentId": "uuid",
        "filename": "document.pdf",
        "chunksAdded": 12,
        "status": "indexed"
      }
    ]
  }
}
```

#### POST /api/similarity/check
**Description:** Check document similarity against indexed corpus

**Request:** `multipart/form-data`
- file: File (required)
- threshold: number (optional, default: 0.88)
- topK: number (optional, default: 5)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "checkId": "uuid",
    "queryFilename": "suspicious.pdf",
    "maxSimilarity": 0.92,
    "riskLevel": "HIGH",
    "similarDocuments": [
      {
        "documentId": "uuid",
        "filename": "original.pdf",
        "similarityScore": 0.92,
        "matchedChunks": 8,
        "matches": [
          {
            "queryText": "Lorem ipsum dolor...",
            "matchedText": "Lorem ipsum dolor...",
            "similarity": 0.95,
            "positions": {
              "query": { "start": 0, "end": 300 },
              "match": { "start": 100, "end": 400 }
            }
          }
        ]
      }
    ]
  }
}
```

#### GET /api/documents
**Description:** List user's indexed documents

**Query Parameters:**
- page: number (default: 1)
- limit: number (default: 20)
- sort: string (default: "created_at")
- order: "asc" | "desc" (default: "desc")

**Response (200):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "uuid",
        "filename": "document.pdf",
        "fileType": "pdf",
        "fileSize": 1024000,
        "chunksCount": 15,
        "status": "indexed",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

## 🎨 Frontend Components Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Sidebar (optional)
│   └── Footer
├── Pages
│   ├── Dashboard
│   │   ├── StatsCards
│   │   ├── RecentActivity
│   │   └── QuickActions
│   ├── Upload
│   │   ├── FileDropzone
│   │   ├── FileList
│   │   └── UploadProgress
│   ├── SimilarityCheck
│   │   ├── DocumentSelector
│   │   ├── ConfigurationPanel
│   │   └── CheckButton
│   ├── Results
│   │   ├── SimilarityScore
│   │   ├── RiskIndicator
│   │   ├── SimilarDocumentsList
│   │   ├── ComparisonView
│   │   └── ExportButton
│   ├── Documents
│   │   ├── DocumentsTable
│   │   ├── SearchFilter
│   │   └── DeleteButton
│   ├── Settings
│   │   ├── ProfileSettings
│   │   ├── APIKeyManagement
│   │   └── ThresholdPresets
│   └── Auth
│       ├── Login
│       └── Register
└── Shared
    ├── Button
    ├── Input
    ├── Modal
    ├── Toast
    ├── Loader
    └── ErrorBoundary
```

### State Management (Zustand)

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// documentsStore.ts
interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadDocuments: (files: File[]) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

// similarityStore.ts
interface SimilarityState {
  results: SimilarityResult | null;
  checking: boolean;
  threshold: number;
  checkSimilarity: (file: File) => Promise<void>;
  setThreshold: (threshold: number) => void;
}
```

---

## 🔧 Backend Architecture (Node.js)

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # PostgreSQL config
│   │   ├── redis.ts             # Redis config
│   │   └── environment.ts       # Environment variables
│   ├── models/
│   │   ├── User.ts
│   │   ├── Document.ts
│   │   ├── DocumentChunk.ts
│   │   └── SimilarityCheck.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── documentController.ts
│   │   └── similarityController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── documentService.ts
│   │   ├── aiService.ts         # Calls Python AI service
│   │   └── cacheService.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── validationMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── documentRoutes.ts
│   │   └── similarityRoutes.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── fileUpload.ts
│   │   └── validation.ts
│   ├── types/
│   │   ├── express.d.ts
│   │   └── api.ts
│   └── index.ts                 # Entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```

### Key Backend Services

#### AI Service Client (aiService.ts)
```typescript
import axios from 'axios';

class AIService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.AI_SERVICE_URL || 'http://localhost:8001';
  }

  async ingestDocument(filename: string, content: Buffer): Promise<any> {
    const formData = new FormData();
    formData.append('file', new Blob([content]), filename);

    const response = await axios.post(`${this.baseURL}/ingest`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds
    });

    return response.data;
  }

  async checkSimilarity(
    filename: string,
    content: Buffer,
    threshold: number = 0.88
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', new Blob([content]), filename);
    formData.append('threshold', threshold.toString());

    const response = await axios.post(`${this.baseURL}/check`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });

    return response.data;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await axios.get(`${this.baseURL}/health`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

export default new AIService();
```

---

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests:** Jest + React Testing Library
- **Component Tests:** Render, interaction, state changes
- **Integration Tests:** User flows, API mocking
- **E2E Tests:** Cypress (optional)
- **Coverage Target:** >80%

### Backend Testing
- **Unit Tests:** Jest
- **Integration Tests:** Supertest for API endpoints
- **Database Tests:** Test database with seed data
- **Load Tests:** Artillery or k6
- **Coverage Target:** >85%

### Test Structure Example
```typescript
// frontend: SimilarityCheck.test.tsx
describe('SimilarityCheck Component', () => {
  it('renders file upload dropzone', () => {
    render(<SimilarityCheck />);
    expect(screen.getByText(/drag.*drop/i)).toBeInTheDocument();
  });

  it('uploads file and shows progress', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    // Test implementation
  });
});

// backend: documentController.test.ts
describe('POST /api/documents/ingest', () => {
  it('should upload and index document', async () => {
    const response = await request(app)
      .post('/api/documents/ingest')
      .set('Authorization', `Bearer ${token}`)
      .attach('files', 'test-file.txt')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.processedFiles).toHaveLength(1);
  });
});
```

---

## 🚀 Deployment Strategy

### Development Environment
```bash
# Clone repository
git clone <repo-url>
cd plagiarism-detector

# Frontend setup
cd frontend
npm install
npm run dev  # Runs on http://localhost:3000

# Backend setup (new terminal)
cd backend
npm install
cp .env.example .env  # Configure environment
npm run dev  # Runs on http://localhost:8000

# AI Service setup (new terminal)
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

# Database setup (new terminal)
docker-compose up postgres redis
npm run migrate  # Run database migrations
```

### Production Deployment (Docker)
```bash
# Build and run all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Scale services
docker-compose up --scale backend=3
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run test
      - run: cd frontend && npm run build

  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm run test
      - run: cd backend && npm run build

  ai-service-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd ai-service && pip install -r requirements.txt
      - run: cd ai-service && pytest

  docker-build:
    needs: [frontend-tests, backend-tests, ai-service-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker-compose build
      - run: docker-compose up -d
      - run: docker-compose run backend npm run test:e2e
```

---

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting:** React.lazy() for route-based splitting
- **Bundle Optimization:** Tree shaking, minification
- **Image Optimization:** WebP format, lazy loading
- **Caching:** Service workers for offline support
- **CDN:** Static assets served from CDN

### Backend Optimization
- **Database Indexing:** Index on frequently queried columns
- **Connection Pooling:** PostgreSQL connection pool
- **Caching Strategy:** Redis for API responses
- **Query Optimization:** Use SELECT specific columns, avoid N+1
- **Compression:** gzip/brotli for responses

### AI Service Optimization
- **Model Caching:** Load model once, keep in memory
- **Batch Processing:** Process multiple documents together
- **GPU Support:** CUDA for faster embedding generation
- **Index Optimization:** FAISS IVF clustering for large datasets

### Docker Optimization
- **Multi-stage Builds:** Reduce image size
- **Layer Caching:** Order Dockerfile commands efficiently
- **Alpine Images:** Use minimal base images
- **Health Checks:** Ensure services are ready
- **Resource Limits:** Set CPU/memory limits

---

## 🔐 Security Requirements

### Application Security
- **HTTPS Only:** Enforce TLS 1.3 in production
- **CORS:** Strict origin validation
- **CSP Headers:** Content Security Policy
- **Rate Limiting:** Per-user and per-IP limits
- **Input Sanitization:** Validate and escape all inputs
- **SQL Injection Prevention:** Use parameterized queries
- **XSS Prevention:** Sanitize HTML output
- **CSRF Protection:** CSRF tokens for forms

### Authentication Security
- **Password Policy:** Min 8 chars, complexity requirements
- **JWT Security:** Short expiry, HttpOnly cookies
- **Refresh Tokens:** Rotate on use, store securely
- **Session Management:** Redis-based with TTL
- **Account Lockout:** After 5 failed attempts
- **Email Verification:** Required for new accounts

### File Upload Security
- **MIME Type Validation:** Check actual file content
- **File Size Limits:** 5MB maximum
- **Virus Scanning:** ClamAV integration (optional)
- **Filename Sanitization:** Remove special characters
- **Storage Isolation:** User-specific directories

### Infrastructure Security
- **Environment Variables:** Never commit secrets
- **Secret Management:** Use Docker secrets or Vault
- **Database Security:** Encrypted connections, strong passwords
- **Container Security:** Non-root user, minimal permissions
- **Network Isolation:** Internal Docker network

---

## 📊 Monitoring & Observability

### Logging Strategy
- **Winston Logger:** Structured JSON logs
- **Log Levels:** ERROR, WARN, INFO, DEBUG
- **Correlation IDs:** Track requests across services
- **Log Aggregation:** ELK Stack or CloudWatch

### Metrics Collection
- **Application Metrics:** Request count, response time, error rate
- **Business Metrics:** Documents processed, similarity checks
- **System Metrics:** CPU, memory, disk usage
- **Database Metrics:** Query time, connection pool

### Health Monitoring
```typescript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    aiService: await checkAIService(),
    storage: await checkStorage(),
  };

  const isHealthy = Object.values(checks).every(check => check.healthy);

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
  });
});
```

### Error Tracking
- **Sentry Integration:** Frontend + Backend
- **Error Context:** User, session, request details
- **Performance Monitoring:** Track slow queries/requests
- **Alerting:** Email/Slack notifications for critical errors

---

## 🎯 Success Metrics & KPIs

### Technical Metrics
- **API Response Time:** <200ms for 95th percentile
- **Document Processing:** <10 seconds per document
- **System Uptime:** 99.9% availability
- **Error Rate:** <0.1% of requests
- **Test Coverage:** >80% frontend, >85% backend

### Performance Metrics
- **Similarity Accuracy:** >95% precision
- **Processing Throughput:** 100+ documents/minute
- **Concurrent Users:** Support 1000+ simultaneous users
- **Page Load Time:** <2 seconds for dashboard
- **API Latency:** <100ms for cached responses

### Business Metrics
- **User Growth:** Track active users over time
- **Document Volume:** Total documents processed
- **Engagement:** Daily/weekly active users
- **Feature Adoption:** Usage of similarity checks
- **Customer Satisfaction:** >4.5/5 rating

---

## 📅 Development Timeline

### Phase 1: Foundation (Weeks 1-3)
- **Week 1:** Project setup, Docker configuration, database schema
- **Week 2:** Authentication system, basic API endpoints
- **Week 3:** Python AI service integration, testing

### Phase 2: Core Features (Weeks 4-6)
- **Week 4:** Document upload and ingestion
- **Week 5:** Similarity detection and results
- **Week 6:** Frontend components and UI

### Phase 3: Integration (Weeks 7-8)
- **Week 7:** Frontend-backend integration
- **Week 8:** End-to-end testing, bug fixes

### Phase 4: Polish & Deploy (Weeks 9-10)
- **Week 9:** Performance optimization, security audit
- **Week 10:** Documentation, production deployment

---

## 🚧 Known Limitations & Future Enhancements

### Current Limitations
- **Single Language:** English only (model trained on English)
- **File Formats:** Limited to TXT, PDF, DOCX
- **Flat Index:** O(n) search complexity for large datasets
- **No Real-time:** Batch processing only

### Future Enhancements
- **Multi-language Support:** Spanish, French, German models
- **OCR Integration:** Process scanned documents
- **Real-time Processing:** WebSocket updates
- **Advanced Analytics:** Temporal analysis, source attribution
- **Mobile App:** React Native mobile client
- **API Webhooks:** Event-driven integrations
- **Team Collaboration:** Shared workspaces
- **Advanced Reporting:** Custom report generation

---

## 📚 Documentation Requirements

### Technical Documentation
- **API Documentation:** OpenAPI/Swagger
- **Architecture Diagrams:** System design, data flow
- **Database Schema:** ER diagrams, migration scripts
- **Deployment Guide:** Docker setup, environment config

### User Documentation
- **User Manual:** Feature walkthrough with screenshots
- **Quick Start Guide:** 5-minute setup tutorial
- **FAQ:** Common questions and troubleshooting
- **Video Tutorials:** Screen recordings for key workflows

### Developer Documentation
- **Setup Guide:** Local development environment
- **Coding Standards:** ESLint/Prettier rules
- **Git Workflow:** Branching strategy, PR process
- **Testing Guide:** Writing and running tests

---

## 👥 Team & Responsibilities

### Recommended Team Structure
- **Frontend Developer (1-2):** React, TypeScript, UI/UX
- **Backend Developer (1-2):** Node.js, PostgreSQL, APIs
- **AI/ML Engineer (1):** Python, FAISS, model optimization
- **DevOps Engineer (0.5-1):** Docker, CI/CD, monitoring
- **QA Engineer (0.5):** Testing, quality assurance
- **Product Manager (0.5):** Requirements, prioritization

---

## 📝 Acceptance Criteria

### Must-Have Features (MVP)
- ✅ User registration and authentication
- ✅ Document upload (TXT, PDF, DOCX)
- ✅ AI-powered similarity detection (>90% accuracy)
- ✅ Results visualization with scores
- ✅ Docker deployment with docker-compose
- ✅ API documentation (Swagger)
- ✅ Basic testing (>70% coverage)

### Should-Have Features
- ✅ Multi-document batch processing
- ✅ Configurable similarity thresholds
- ✅ Document management (list, delete)
- ✅ Export reports (PDF, JSON)
- ✅ API rate limiting
- ✅ Comprehensive error handling

### Nice-to-Have Features
- 🔮 Real-time processing updates (WebSockets)
- 🔮 Advanced analytics dashboard
- 🔮 Team collaboration features
- 🔮 Kubernetes deployment manifests
- 🔮 Multi-language support

---

## 🎓 Learning Resources

### Frontend
- React Documentation: https://react.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Query: https://tanstack.com/query/latest

### Backend
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- Express.js Guide: https://expressjs.com/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/
- JWT.io: https://jwt.io/introduction

### DevOps
- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- GitHub Actions: https://docs.github.com/en/actions

---

## ✅ Checklist for Implementation

### Setup Phase
- [ ] Initialize Git repository
- [ ] Create project structure (frontend, backend, ai-service)
- [ ] Setup Docker and docker-compose
- [ ] Configure PostgreSQL and Redis
- [ ] Setup CI/CD pipeline

### Frontend Development
- [ ] Create React + TypeScript + Vite project
- [ ] Setup Tailwind CSS
- [ ] Implement authentication pages
- [ ] Build document upload interface
- [ ] Create similarity check interface
- [ ] Implement results visualization
- [ ] Add state management (Zustand)
- [ ] Setup React Query for API calls
- [ ] Write unit tests

### Backend Development
- [ ] Create Node.js + TypeScript + Express project
- [ ] Setup database models (TypeORM/Prisma)
- [ ] Implement JWT authentication
- [ ] Build document ingestion endpoints
- [ ] Create similarity check endpoints
- [ ] Integrate with Python AI service
- [ ] Add Redis caching
- [ ] Implement rate limiting
- [ ] Write API documentation (Swagger)
- [ ] Write integration tests

### AI Service
- [ ] Port Python FastAPI service
- [ ] Implement document processing
- [ ] Setup FAISS vector database
- [ ] Add embedding generation
- [ ] Create similarity search
- [ ] Optimize performance
- [ ] Write unit tests

### Testing & QA
- [ ] Write unit tests (>80% coverage)
- [ ] Write integration tests
- [ ] Perform security audit
- [ ] Load testing
- [ ] Browser compatibility testing
- [ ] Manual QA testing

### Documentation
- [ ] Write README.md
- [ ] Create API documentation
- [ ] Write deployment guide
- [ ] Create user manual
- [ ] Record video tutorials

### Deployment
- [ ] Build Docker images
- [ ] Test docker-compose locally
- [ ] Setup production environment
- [ ] Configure environment variables
- [ ] Deploy to cloud (AWS/Azure/GCP)
- [ ] Setup monitoring and alerts
- [ ] Configure backups

---

## 🏁 Conclusion

This PRD provides a comprehensive blueprint for rebuilding the AI Plagiarism Detection System using React, TypeScript, and Node.js with Docker optimization. The new architecture maintains all existing functionality while improving scalability, maintainability, and developer experience.

### Key Advantages of New Stack
- **Modern TypeScript Stack:** Type safety across frontend and backend
- **Better Performance:** React for fast UI, Node.js for efficient I/O
- **Microservices Architecture:** Separate AI service for better scaling
- **Developer Experience:** Hot reload, better tooling, larger ecosystem
- **Production Ready:** Docker-optimized, CI/CD, monitoring, security

### Next Steps
1. Review and approve this PRD
2. Setup development environment
3. Begin Phase 1 implementation
4. Regular sprint reviews and adjustments

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-18  
**Status:** Draft - Ready for Review  
**Contact:** [Your contact information]

---

*This document is a living specification and should be updated as requirements evolve.*
