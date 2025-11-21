# Data Cleanup Scripts

This directory contains various scripts to clear different types of data from the plagiarism detection system.

## Available Scripts

### 🗑️ `clear-all-data.bat`
**Clears EVERYTHING** - Complete system reset
- ✅ Database tables (all data)
- ✅ Uploaded files
- ✅ Redis cache
- ✅ FAISS index

**Use when:** Starting completely fresh

---

### 📄 `clear-documents.bat`
**Clears only documents**
- ✅ Documents from database
- ✅ Uploaded files
- ✅ FAISS index
- ❌ Users (kept)
- ❌ Similarity check history (kept)

**Use when:** You want to remove all documents but keep user accounts and check history

---

### 📊 `clear-similarity-history.bat`
**Clears only similarity check history**
- ✅ Similarity check records
- ❌ Documents (kept)
- ❌ Users (kept)

**Use when:** You want to clear the history of similarity checks but keep documents and users

---

### 👥 `clear-users.bat`
**Clears all users** (⚠️ Cascades to everything)
- ✅ All users
- ✅ All documents (CASCADE)
- ✅ All similarity checks (CASCADE)
- ✅ Uploaded files
- ✅ FAISS index

**Use when:** You want to remove all user accounts (this will delete everything due to CASCADE)

---

### 🔴 `clear-redis.bat`
**Clears only Redis cache**
- ✅ Redis cache
- ❌ Database data (kept)

**Use when:** You want to flush cached data without affecting the database

---

### 🧠 `clear-faiss-index.bat`
**Clears only FAISS index**
- ✅ FAISS index (document embeddings)
- ❌ Database documents (kept)

**Use when:** FAISS index is out of sync with database, or you want to rebuild embeddings

---

## Database Relationship (CASCADE)

```
users
  └── documents (CASCADE DELETE)
       └── document_chunks (CASCADE DELETE)
  └── similarity_checks (CASCADE DELETE)
```

**Important:** Deleting users will automatically delete all their documents and similarity checks due to CASCADE constraints.

---

## After Clearing FAISS Index

If you clear the FAISS index, remember to **restart the AI Service**:

```bash
# Find the AI Service terminal and press Ctrl+C, then:
cd ai-service
venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

The FAISS index will be rebuilt automatically as you upload new documents.

---

## Safety

All scripts require typing `YES` (in uppercase) to confirm before deleting data.
