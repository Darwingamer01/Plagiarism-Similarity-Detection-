# AI-Powered Plagiarism Detection System

## 🌐 Hosted Project

[Live Demo](https://plagiarism-similarity-detection.vercel.app/)


A comprehensive, full-stack plagiarism detection solution that leverages advanced AI to compare documents and detect similarities. Built with a modern tech stack including React, Node.js, Python, and Docker.

## 🚀 Features

### Authentication & User Management
- **Secure Authentication**: Email/Password login with JWT (Access & Refresh Tokens).
- **OAuth Integration**: One-click login/register with **Google**.
- **Email Verification**: OTP-based email verification for new accounts.
- **Password Management**: Forgot Password, Reset Password, and Change Password flows.
- **Profile Management**: Update profile details and manage API keys.

### Document Management
- **File Upload**: Support for **PDF**, **DOCX**, and **TXT** files.
- **Document Indexing**: Automatic text extraction, chunking, and vector embedding.
- **Bulk Actions**: Delete multiple documents or clear history.

### Plagiarism Detection (AI Service)
- **Advanced Similarity Search**: Uses **Sentence Transformers** (`all-MiniLM-L6-v2`) for semantic understanding.
- **Vector Database**: **FAISS** (Facebook AI Similarity Search) for high-performance similarity matching.
- **Detailed Results**: View similarity scores, matched documents, and highlighted text segments.
- **History**: Track all past similarity checks.

### System
- **Dockerized**: Full stack containerization for easy deployment.
- **Rate Limiting**: Protection against API abuse.
- **Audit Logging**: Comprehensive logs for security and debugging.


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
- **Auth**: JWT, Google Auth Library, Apple Sign-In

### AI Service
- **Language**: Python 3.11
- **Framework**: FastAPI
- **ML Libraries**: Sentence Transformers, PyTorch, FAISS
- **Server**: Uvicorn

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx (Production)

---

## 📂 Project Structure

Understanding the codebase structure will help you navigate and contribute effectively.

```
├── ai-service/          # Python FastAPI service for AI logic
│   ├── app/             # Core application code
│   │   ├── document_processor.py # Text extraction & embedding logic
│   │   ├── similarity_checker.py # FAISS index management
│   │   └── main.py      # API endpoints
│   ├── data/            # FAISS index storage (persisted)
│   └── models/          # ML model cache (downloaded on first run)
├── backend/             # Node.js Express API
│   ├── src/
│   │   ├── controllers/ # Request handlers (Auth, Document, etc.)
│   │   ├── models/      # Database models
│   │   ├── routes/      # API route definitions
│   │   └── services/    # Business logic (AuthService, EmailService)
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components (Buttons, Inputs, Modals)
│   │   ├── pages/       # Application pages (Login, Dashboard, Upload)
│   │   └── services/    # API client services (Axios configuration)
├── nginx/               # Nginx configuration for production
└── docker-compose.yml   # Docker orchestration configuration
```

### 📁 Script Location Update

All utility scripts (`.bat`, `.ps1`, `.sql`) are now located in the `scripts/` folder at the project root. To run any script, use the path `scripts/<script-name>` instead of the root folder.

**Example:**

```bash
scripts/clear-all-data.bat
scripts/clear-users.bat
scripts/clear-database.sql
```

This change helps keep the project organized. Update any custom commands or documentation to use the new path.

---

## ⚡ Getting Started

You can run the project using **Docker** (recommended for ease) or **Locally** (for development).

### Prerequisites
- **Docker & Docker Compose** (for Docker method)
- **Node.js v18+** (for Local method)
- **Python 3.11+** (for Local method)
- **PostgreSQL & Redis** (for Local method)

### Method 1: Run with Docker (Recommended)

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd Final-year-major-project
    ```

2.  **Configure Environment:**
    - The project comes with default configuration in `docker-compose.yml`.
    - For Google OAuth, you must set `GOOGLE_CLIENT_ID` in `backend/.env` (create it from `.env.example`).

3.  **Start the application:**
    ```bash
    docker-compose up --build
    ```
    *This command builds all images and starts Frontend, Backend, AI Service, Postgres, and Redis.*

4.  **Access the application:**
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:8000`
    - AI Service: `http://localhost:8001`

### Method 2: Run Locally (Without Docker)

If you prefer to run services individually in separate terminals:

#### 1. Database Setup
Ensure you have PostgreSQL and Redis running locally.
- Create a database named `plagiarism_db`.
- Update `.env` files in `backend` if your credentials differ from defaults.

#### 2. Backend Setup
```bash
cd backend
# Copy example env
cp .env.example .env
# Edit .env with your DB credentials and Google Client ID
npm install
# Run database migrations/setup
npm run migrate # or execute setup-db.sql manually
# Start server
npm run dev
```
*Backend runs on port 8000.*

#### 3. AI Service Setup
```bash
cd ai-service
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*AI Service runs on port 8001.*

#### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on port 5173 (or 3000 if configured).*

---

## 📖 Detailed User Guide & Flow

### 1. Authentication Flow
The system supports both traditional email/password and OAuth.

#### Registration (Email/Password)
1.  Go to the **Register** page.
2.  Enter Name, Email, and Password.
3.  **OTP Verification**:
    - The system sends a 6-digit OTP to your email.
    - **Local Development**: Since we use a Mock Email Service, **check the Backend Terminal/Logs**.
    - Look for:
      ```
      INFO: 📧 EMAIL MOCK: Email Verification
      INFO: To: user@example.com
      INFO: OTP: 123456
      ```
    - Enter `123456` in the frontend to verify and complete registration.

#### Login & Dashboard
- Login with your credentials.
- You will be redirected to the **Dashboard**, which shows:
    - Recent activity stats.
    - Quick actions (Upload, Check Similarity).
    - Usage metrics.

#### Google OAuth (One-Click Login)
1.  **Configuration**:
    - Create a project in Google Cloud Console.
    - Enable "Google Identity" / "OAuth 2.0".
    - Get your `CLIENT_ID`.
    - Add it to `backend/.env` (`GOOGLE_CLIENT_ID`) and `frontend/.env` (`VITE_GOOGLE_CLIENT_ID`).
2.  **Usage**:
    - Click "Continue with Google" on Login/Register page.
    - **First Time**: You will be asked to confirm your name. An account is created automatically (no password needed).
    - **Returning**: Logs you in directly.

### 2. Password Management
- **Forgot Password**:
    - Click "Forgot Password" on login page.
    - Enter email -> Check Backend Logs for **Reset Link**.
    - Click link -> Set new password.
- **Change Password**:
    - Go to **Settings**.
    - Enter current password and new password.
- **Set Password (OAuth Users)**:
    - If you logged in via Google, you don't have a password.
    - Go to **Settings** -> "Set Password".
    - This enables you to login with email/password in the future.

### 3. Plagiarism Detection Flow
1.  **Upload Document**:
    - Go to **Upload** page.
    - Drag & drop a PDF/DOCX/TXT file.
    - The file is sent to the AI Service, text is extracted, chunked, and indexed.
2.  **Check Similarity**:
    - Go to **Check Similarity** page.
    - Upload a *query document*.
    - The system compares this document against *all previously indexed documents*.
3.  **View Results**:
    - See a percentage score (e.g., "85% Similar").
    - View the specific document it matched with.
    - See the exact text segments that matched.

---

## 🧠 Technical Deep Dive: AI Service

The `ai-service` is the brain of the operation. Here's how it works:

### 1. Text Extraction & Cleaning
- **File Handling**: Uses `pdfplumber` for PDFs and `python-docx` for Word docs.
- **Cleaning**: Removes excessive whitespace and special characters to normalize text for the model.

### 2. Smart Chunking Algorithm
- **Why Chunking?** LLMs and embedding models have token limits. We can't feed a whole book at once.
- **Algorithm**:
    - Splits text into chunks of **300 words**.
    - Uses an **Overlap of 50 words**.
    - *Why Overlap?* To preserve context between chunks. If a plagiarized sentence is split between two chunks, the overlap ensures it's caught in at least one.

### 3. Vector Embeddings
- **Model**: `sentence-transformers/all-MiniLM-L6-v2`.
- **Process**: Converts every text chunk into a **384-dimensional vector** (a list of 384 numbers).
- **Semantic Meaning**: These numbers represent the *meaning* of the text, not just keywords. "The cat sat on the mat" and "The feline rested on the rug" will have very similar vectors.

### 4. Similarity Search (FAISS)
- **Storage**: Vectors are stored in a FAISS (Facebook AI Similarity Search) index.
- **Search**: When you query a document, we calculate the **Cosine Similarity** between the query vectors and the stored vectors.
- **Speed**: FAISS is optimized for searching millions of vectors in milliseconds.

---

## 🧹 Data Cleanup Scripts

This system includes several scripts to help you clear different types of data from the plagiarism detection system. These are useful for troubleshooting, starting fresh, or cleaning up specific data. All scripts require typing `YES` (in uppercase) to confirm before deleting data.

### Available Scripts

#### 🗑️ `clear-all-data.bat`
**Clears EVERYTHING** – Complete system reset
- Database tables (all data)
- Uploaded files
- Redis cache
- FAISS index
**Use when:** Starting completely fresh

---

#### 📄 `clear-documents.bat`
**Clears only documents**
- Documents from database
- Uploaded files
- FAISS index
- Users and similarity history are kept
**Use when:** You want to remove all documents but keep user accounts and check history

---

#### 📊 `clear-similarity-history.bat`
**Clears only similarity check history**
- Similarity check records
- Documents and users are kept
**Use when:** You want to clear the history of similarity checks but keep documents and users

---

#### 👥 `clear-users.bat`
**Clears all users** (⚠️ Cascades to everything)
- All users
- All documents (CASCADE)
- All similarity checks (CASCADE)
- Uploaded files
- FAISS index
**Use when:** You want to remove all user accounts (this will delete everything due to CASCADE)

---

#### 🔴 `clear-redis.bat`
**Clears only Redis cache**
- Redis cache
- Database data is kept
**Use when:** You want to flush cached data without affecting the database

---

#### 🧠 `clear-faiss-index.bat`
**Clears only FAISS index**
- FAISS index (document embeddings)
- Database documents are kept
**Use when:** FAISS index is out of sync with database, or you want to rebuild embeddings

---

### Database Relationship (CASCADE)

```
users
    └── documents (CASCADE DELETE)
             └── document_chunks (CASCADE DELETE)
    └── similarity_checks (CASCADE DELETE)
```

**Important:** Deleting users will automatically delete all their documents and similarity checks due to CASCADE constraints.

---

### After Clearing FAISS Index

If you clear the FAISS index, remember to **restart the AI Service**:

```bash
# Find the AI Service terminal and press Ctrl+C, then:
cd ai-service
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

The FAISS index will be rebuilt automatically as you upload new documents.

---

### Safety

All scripts require typing `YES` (in uppercase) to confirm before deleting data.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1.  **Fork & Clone**: Fork the repo and clone it locally.
2.  **Branch**: Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
3.  **Develop**:
    - **Frontend**: Work in `frontend/src`. Components are in `components/`, pages in `pages/`.
    - **Backend**: Work in `backend/src`. Add routes in `routes/` and logic in `controllers/`.
    - **AI**: Work in `ai-service/app`.
4.  **Test**:
    - Run `npm run test` in backend/frontend (if tests exist).
    - Manually verify flows using the Local Development steps above.
5.  **Commit & Push**: Use descriptive commit messages.
6.  **Pull Request**: Open a PR describing your changes.

---

## 🚀 Deployment

To deploy this to a production server (e.g., AWS EC2, DigitalOcean):

1.  **Provision Server**: Get a Linux server with Docker installed.
2.  **Environment Variables**:
    - Create a `.env` file on the server with production values (strong passwords, real API keys).
3.  **Run with Docker**:
    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    ```
    *(Note: You may need to create a `docker-compose.prod.yml` for specific production overrides like removing exposed ports or setting restart policies).*
4.  **Nginx**: The included Nginx configuration handles routing and can be configured for SSL (Let's Encrypt).

---

