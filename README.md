# AI-Powered Plagiarism Detection System

## 🌐 Hosted Project

[Live Demo]([https://plagiarism-similarity-detection.vercel.app/](https://www.plagiarism-detector.in/))

A comprehensive, full-stack plagiarism detection solution that leverages advanced AI to compare documents and detect similarities. Built with a modern tech stack including React, Node.js, Python, and Docker.

---

## 🚀 Features

### Authentication & User Management

- **Secure Authentication**: Email/Password login with JWT (Access & Refresh Tokens).
- **OAuth Integration**: One-click login/register with **Google**.
- **Email Verification**: OTP-based email verification for new accounts.
- **Password Management**: Forgot Password, Reset Password, and Change Password flows.
- **Profile Management**: Update profile details and manage settings.

### Document Management

- **File Upload**: Support for **PDF**, **DOCX**, and **TXT** files.
- **Document Indexing**: Automatic text extraction, chunking, and vector embedding.
- **My Documents**: View and manage your uploaded documents.
- **Community Library**: Browse documents uploaded by other users.
- **Bulk Actions**: Delete multiple documents or clear history.

### Plagiarism Detection (AI Service)

- **Advanced Similarity Search**: Uses **Sentence Transformers** (`all-MiniLM-L6-v2`) for semantic understanding.
- **Vector Database**: **FAISS** (Facebook AI Similarity Search) for high-performance similarity matching.
- **Weighted Scoring System**: Similarity scores calculated using weighted mean based on chunk lengths — longer matching sections carry more weight.
- **AI-Powered Analysis**: Comprehensive reports explaining what was found, why scores were given, and what it means.
- **Sentiment Analysis**: Detects document tone (Positive/Negative) using DistilBERT.
- **Context Extraction**: Extracts key topics and themes using KeyBERT.
- **Document Summarization**: Auto-generates summaries using DistilBART.
- **Detailed Results**: View similarity scores, matched documents, highlighted text segments, and in-depth AI analysis.
- **History Tracking**: Track all past similarity checks with simplified score display.

### System

- **Dockerized**: Full stack containerization for easy deployment.
- **Railway Deployment**: Production deployment via Railway with Docker Hub images.
- **Rate Limiting**: Protection against API abuse.
- **Audit Logging**: Comprehensive logs for security and debugging.

---

## 📊 Scoring System

The system uses a **weighted mean scoring approach** for accurate similarity detection:

| Score              | Meaning                                                     |
| ------------------ | ----------------------------------------------------------- |
| **Document Score** | How much of your content matches a specific source document |
| **Overall Score**  | How much of your content matches any source in the database |

### How Scoring Works

- Each matching section (chunk) is weighted by its length
- Longer matching sections contribute more to the final score
- This ensures small incidental matches don't inflate scores
- Substantial matching sections are properly weighted

### Risk Levels

| Score Range | Risk Level |
| ----------- | ---------- |
| 90%+        | Very High  |
| 70-90%      | High       |
| 50-70%      | Medium     |
| 30-50%      | Low        |
| <30%        | Very Low   |

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS, Radix UI, Shadcn/UI
- **State Management**: Zustand, React Query
- **Routing**: React Router DOM

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Primary), Redis (Caching & Session)
- **Auth**: JWT, Google Auth Library

### AI Service

- **Language**: Python 3.11
- **Framework**: FastAPI
- **ML Libraries**:
  - Sentence Transformers (Embeddings)
  - FAISS (Vector Search)
  - Transformers (Sentiment, Summarization)
  - KeyBERT (Keyword Extraction)
  - PyTorch
- **Server**: Uvicorn

### Infrastructure

- **Containerization**: Docker, Docker Compose
- **Container Registry**: Docker Hub
- **Deployment**: Railway
- **Reverse Proxy**: Nginx (Production)

---

## 📂 Project Structure

```
├── ai-service/              # Python FastAPI AI service
│   ├── app/                 # Core application modules
│   │   ├── config.py        # Service configuration
│   │   ├── context_extractor.py    # KeyBERT keyword extraction
│   │   ├── document_processor.py   # Text extraction & chunking
│   │   ├── report_generator.py     # AI analysis report generation
│   │   ├── sentiment_analyzer.py   # Sentiment analysis (DistilBERT)
│   │   ├── similarity_checker.py   # FAISS index & weighted scoring
│   │   ├── summary_generator.py    # Document summarization (DistilBART)
│   │   └── utils.py         # Utility functions
│   ├── main.py              # FastAPI endpoints
│   ├── data/                # FAISS index storage
│   └── tests/               # Unit tests
│
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── contactController.ts
│   │   │   ├── documentController.ts
│   │   │   ├── similarityController.ts
│   │   │   ├── systemController.ts
│   │   │   └── userController.ts
│   │   ├── services/        # Business logic
│   │   │   ├── aiService.ts
│   │   │   ├── authService.ts
│   │   │   ├── cacheService.ts
│   │   │   ├── documentService.ts
│   │   │   ├── emailService.ts
│   │   │   ├── similarityService.ts
│   │   │   └── userService.ts
│   │   ├── middleware/      # Auth, rate limiting, etc.
│   │   ├── routes/          # API route definitions
│   │   ├── config/          # Database & app config
│   │   └── utils/           # Helper utilities
│   └── migrations/          # Database migrations
│
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── UploadPage.tsx
│   │   │   ├── SimilarityCheckPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── DocumentsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── SecurityPage.tsx
│   │   │   ├── FAQPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── PrivacyPage.tsx
│   │   │   ├── TermsPage.tsx
│   │   │   └── ... (auth pages)
│   │   ├── services/        # API client services
│   │   └── types/           # TypeScript interfaces
│
├── nginx/                   # Nginx configuration
├── scripts/                 # Utility scripts (.bat, .sql)
├── docker-compose.yml       # Docker orchestration
└── docker-compose.dev.yml   # Development configuration
```

---

## 🧠 AI Service Architecture

### Processing Pipeline

```
Document Upload
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│                    DOCUMENT PROCESSOR                        │
│  • Text extraction (PDF/DOCX/TXT)                           │
│  • Smart chunking (300 words, 50 word overlap)              │
│  • Vector embedding (all-MiniLM-L6-v2)                      │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│                    PARALLEL ANALYSIS                          │
├──────────────────┬─────────────────┬─────────────────────────┤
│ SENTIMENT        │ CONTEXT         │ SUMMARY                 │
│ ANALYZER         │ EXTRACTOR       │ GENERATOR               │
│ (DistilBERT)     │ (KeyBERT)       │ (DistilBART)            │
│                  │                 │                         │
│ Detects:         │ Extracts:       │ Creates:                │
│ • POSITIVE       │ • Keywords      │ • Concise summary       │
│ • NEGATIVE       │ • Key phrases   │ • Main points           │
└──────────────────┴─────────────────┴─────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│                   SIMILARITY CHECKER                         │
│  • FAISS vector index                                        │
│  • Cosine similarity search                                  │
│  • Weighted mean scoring (by chunk length)                   │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│                   REPORT GENERATOR                           │
│  • Score interpretation                                      │
│  • Detailed analysis breakdown                               │
│  • Type of similarity detection                              │
│  • Actionable recommendations                                │
└─────────────────────────────────────────────────────────────┘
```

### ML Models Used

| Model                                             | Purpose                          | Library               |
| ------------------------------------------------- | -------------------------------- | --------------------- |
| `all-MiniLM-L6-v2`                                | Text embeddings (384 dimensions) | Sentence Transformers |
| `distilbert-base-uncased-finetuned-sst-2-english` | Sentiment analysis               | Transformers          |
| `distilbart-cnn-12-6`                             | Document summarization           | Transformers          |
| KeyBERT                                           | Keyword/keyphrase extraction     | KeyBERT               |

### AI Report Contents

When you run a similarity check, the AI generates a detailed report including:

1. **Understanding Your Scores**

   - Document-specific similarity percentage
   - Overall database similarity percentage

2. **What We Found**

   - Result classification (Very High/Moderate/Some/Low Match)
   - Plain-language explanation

3. **Detailed Analysis**

   - Number of sections compared
   - Breakdown by similarity level (90%+, 70-90%, etc.)
   - Type of similarity (direct copy, paraphrasing, topical)
   - Sample of matched content

4. **Why This Matters**

   - Actionable interpretation
   - Recommendations for next steps

5. **Related Topics**
   - Common themes between documents
   - Keyword overlap

---

## 🔌 API Endpoints

### AI Service (Port 8001)

| Method   | Endpoint            | Description                  |
| -------- | ------------------- | ---------------------------- |
| `GET`    | `/`                 | Root endpoint                |
| `GET`    | `/health`           | Health check                 |
| `POST`   | `/ingest`           | Process and index a document |
| `POST`   | `/check-similarity` | Check document against index |
| `DELETE` | `/document/{id}`    | Remove document from index   |
| `GET`    | `/stats`            | Get index statistics         |
| `POST`   | `/clear-index`      | Admin: Clear entire index    |

### Backend (Port 8000)

| Category       | Endpoints                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **Auth**       | `/api/auth/register`, `/api/auth/login`, `/api/auth/google`, `/api/auth/refresh`, `/api/auth/logout` |
| **Documents**  | `/api/documents`, `/api/documents/:id`, `/api/documents/upload`                                      |
| **Similarity** | `/api/similarity/check`, `/api/similarity/history`, `/api/similarity/:id`                            |
| **User**       | `/api/users/profile`, `/api/users/settings`                                                          |
| **System**     | `/api/system/health`, `/api/contact`                                                                 |

---

## ⚡ Getting Started

### Prerequisites

- **Docker & Docker Compose** (for Docker method)
- **Node.js v18+** (for Local method)
- **Python 3.11+** (for Local method)
- **PostgreSQL & Redis** (for Local method)

### Method 1: Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Darwingamer01/Plagiarism-Similarity-Detection-.git
cd Plagiarism-Similarity-Detection-

# Configure environment (copy and edit .env files)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up --build
```

**Access Points:**

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- AI Service: `http://localhost:8001`

### Method 2: Run Locally

#### 1. Database Setup

```bash
# Ensure PostgreSQL and Redis are running
# Create database: plagiarism_db
```

#### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev
```

#### 3. AI Service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
python main.py
```

#### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

### Docker Hub Images

The project is deployed using Docker Hub:

- **AI Service**: `darwingamer01/final-year-major-project-ai-service`
- **Backend**: `darwingamer01/final-year-major-project-backend`

### Railway Deployment

The production environment is hosted on Railway:

- Services automatically pull latest images from Docker Hub
- PostgreSQL and Redis provided by Railway

### Build & Push

```bash
# Login to Docker Hub
docker login

# Build and push AI Service
docker build -t darwingamer01/final-year-major-project-ai-service:latest ./ai-service
docker push darwingamer01/final-year-major-project-ai-service:latest

# Build and push Backend
docker build -t darwingamer01/final-year-major-project-backend:latest ./backend
docker push darwingamer01/final-year-major-project-backend:latest
```

---

## 🧹 Data Cleanup Scripts

All scripts are in the `scripts/` folder:

| Script                         | What it clears                    |
| ------------------------------ | --------------------------------- |
| `clear-all-data.bat`           | Everything (complete reset)       |
| `clear-documents.bat`          | Documents only                    |
| `clear-similarity-history.bat` | Similarity check history only     |
| `clear-users.bat`              | All users (cascades to documents) |
| `clear-redis.bat`              | Redis cache only                  |
| `clear-faiss-index.bat`        | FAISS vector index only           |

All scripts require typing `YES` to confirm.

---

## 📖 User Guide

### 1. Upload a Document

- Go to **Upload** page
- Drag & drop a PDF/DOCX/TXT file
- Document is processed, indexed, and analyzed

### 2. Check Similarity

- Go to **Check Similarity** page
- Upload a query document
- System compares against all indexed documents

### 3. View Results

- See **Overall Score** (percentage)
- View **matched documents** with individual scores
- Read **AI Analysis** explaining findings
- Review **matched text segments**

### 4. Manage History

- Go to **History** page
- View past similarity checks
- See **Score** and **Risk Level** for each
- Delete individual checks or clear all

---

## 🤝 Contributing

1. Fork & Clone
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes in appropriate directory:
   - **Frontend**: `frontend/src`
   - **Backend**: `backend/src`
   - **AI Service**: `ai-service/app`
4. Test your changes
5. Commit: `git commit -m "feat: description"`
6. Push & create Pull Request

---

## 📄 License

This project is for educational purposes as part of a Final Year Major Project.

---

## 🙏 Acknowledgments

- [Sentence Transformers](https://www.sbert.net/)
- [FAISS](https://github.com/facebookresearch/faiss)
- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [KeyBERT](https://github.com/MaartenGr/KeyBERT)
- [Shadcn/UI](https://ui.shadcn.com/)
