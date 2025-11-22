from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from typing import Optional, List
import logging

from app.config import settings
from app.document_processor import DocumentProcessor
from app.similarity_checker import SimilarityChecker
from app.utils import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Plagiarism Detection AI Service",
    description="AI-powered document similarity detection using sentence transformers and FAISS",
    version="3.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

document_processor = DocumentProcessor()
similarity_checker = SimilarityChecker()

@app.get("/admin/clear-index")
async def clear_index_get():
    """
    Admin GET endpoint to clear the FAISS index and metadata.
    """
    try:
        similarity_checker.index = similarity_checker.__class__().index
        similarity_checker.metadata = []
        similarity_checker.save_index()
        logger.info("🧹 FAISS index and metadata cleared by admin GET endpoint.")
        return {"success": True, "message": "FAISS index and metadata cleared."}
    except Exception as e:
        logger.error(f"❌ Error clearing FAISS index: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear FAISS index: {str(e)}")
@app.post("/admin/clear-index", status_code=status.HTTP_200_OK)
async def clear_index():
    """
    Admin endpoint to clear the FAISS index and metadata.
    """
    try:
        # Re-initialize the index and metadata
        similarity_checker.index = similarity_checker.__class__().index
        similarity_checker.metadata = []
        # Save the cleared index to disk
        similarity_checker.save_index()
        logger.info("🧹 FAISS index and metadata cleared by admin endpoint.")
        return {"success": True, "message": "FAISS index and metadata cleared."}
    except Exception as e:
        logger.error(f"❌ Error clearing FAISS index: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear FAISS index: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Initialize FAISS index on startup"""
    logger.info("🚀 Starting AI Service...")
    logger.info(f"📦 Model will be loaded on first request: {settings.MODEL_NAME}")
    # Don't load model on startup - let it load lazily on first request
    # document_processor.load_model()
    similarity_checker.load_index()
    logger.info("✅ AI Service ready! Model will download on first use (~80MB)")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Plagiarism Detection AI Service",
        "version": "3.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": document_processor.model is not None,
        "index_loaded": similarity_checker.index is not None
    }

@app.post("/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    filename: str = Form(...),
    user_id: str = Form(...),
    document_id: Optional[str] = Form(None)
):
    """
    Process and index a document for plagiarism detection
    
    Args:
        file: Uploaded document file
        filename: Original filename
        user_id: User ID who uploaded the document
    
    Returns:
        Processing results including chunk count and embeddings
    """
    try:
        logger.info(f"📥 Ingesting document: {filename} for user: {user_id}")
        
        # Validate file size
        contents = await file.read()
        if len(contents) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
        
        # Extract text from document
        text = document_processor.extract_text(contents, filename)
        
        if not text or len(text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Document contains insufficient text")
        
        # Chunk the document
        chunks = document_processor.chunk_text(text)
        logger.info(f"📄 Created {len(chunks)} chunks from document")
        
        # Generate embeddings
        embeddings = document_processor.generate_embeddings(chunks)
        
        # Add to FAISS index
        doc_id_for_index = document_id if document_id else filename
        stored_doc_id = similarity_checker.add_documents(
            embeddings=embeddings,
            chunks=chunks,
            document_id=doc_id_for_index,
            user_id=user_id
        )
        
        logger.info(f"✅ Document indexed successfully: {filename}")
        
        return {
            "success": True,
            "document_id": stored_doc_id,
            "chunks_added": len(chunks),
            "chunks": [
                {
                    "text": chunk,
                    "start": i * settings.CHUNK_SIZE,
                    "end": min((i + 1) * settings.CHUNK_SIZE, len(text))
                }
                for i, chunk in enumerate(chunks)
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error ingesting document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@app.post("/check-similarity")
async def check_similarity(
    file: UploadFile = File(...),
    filename: str = Form(...),
    user_id: str = Form(...),
    threshold: float = Form(0.88),
    top_k: int = Form(5)
):
    """
    Check document similarity against indexed documents
    
    Args:
        file: Document to check
        filename: Original filename
        user_id: User ID
        threshold: Similarity threshold (0-1)
        top_k: Number of similar documents to return
    
    Returns:
        Similarity results with matched documents and scores
    """
    try:
        logger.info(f"🔍 Checking similarity for: {filename} (threshold: {threshold})")
        
        # Validate file size
        contents = await file.read()
        if len(contents) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
        
        # Extract and process text
        text = document_processor.extract_text(contents, filename)
        
        if not text or len(text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Document contains insufficient text")
        
        # Chunk and generate embeddings
        chunks = document_processor.chunk_text(text)
        embeddings = document_processor.generate_embeddings(chunks)
        
        # Search for similar documents
        results = similarity_checker.search_similar(
            query_embeddings=embeddings,
            query_chunks=chunks,
            threshold=threshold,
            top_k=top_k
        )
        
        logger.info(f"✅ Similarity check completed: max similarity = {results['max_similarity']:.2f}")
        
        return {
            "success": True,
            "query_filename": filename,
            "max_similarity": results["max_similarity"],
            "similar_documents": results["similar_documents"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error checking similarity: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to check similarity: {str(e)}")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str, user_id: str):
    """
    Delete a document from the index
    
    Args:
        document_id: Document ID to delete
        user_id: User ID for verification
    
    Returns:
        Success status
    """
    try:
        logger.info(f"🗑️ Deleting document: {document_id}")
        similarity_checker.delete_document(document_id, user_id)
        logger.info(f"✅ Document deleted: {document_id}")
        
        return {
            "success": True,
            "message": "Document deleted successfully"
        }
    except Exception as e:
        logger.error(f"❌ Error deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")

@app.get("/stats")
async def get_stats():
    """Get index statistics"""
    try:
        stats = similarity_checker.get_stats()
        return {
            "success": True,
            "stats": stats
        }
    except Exception as e:
        logger.error(f"❌ Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
