from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Union
import pdfplumber
from docx import Document
import io
import re
import logging

from .config import settings

logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        self.model = None
        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP
    
    def load_model(self):
        """Load the sentence transformer model"""
        try:
            logger.info(f"Loading model: {settings.MODEL_NAME}")
            self.model = SentenceTransformer(
                settings.MODEL_NAME,
                cache_folder=settings.MODEL_CACHE_DIR
            )
            logger.info(f"✅ Model loaded successfully. Embedding dimension: {self.model.get_sentence_embedding_dimension()}")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """
        Extract text from different file formats
        
        Args:
            file_content: File content as bytes
            filename: Name of the file to determine type
        
        Returns:
            Extracted text as string
        """
        file_ext = filename.lower().split('.')[-1]
        
        try:
            if file_ext == 'txt':
                return file_content.decode('utf-8', errors='ignore')
            
            elif file_ext == 'pdf':
                return self._extract_from_pdf(file_content)
            
            elif file_ext in ['docx', 'doc']:
                return self._extract_from_docx(file_content)
            
            else:
                raise ValueError(f"Unsupported file format: {file_ext}")
        
        except Exception as e:
            logger.error(f"Error extracting text from {filename}: {str(e)}")
            raise
    
    def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file"""
        text = ""
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    
    def _extract_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file"""
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            if paragraph.text:
                text += paragraph.text + "\n"
        return text
    
    def chunk_text(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks
        
        Args:
            text: Input text to chunk
        
        Returns:
            List of text chunks
        """
        # Clean and normalize text
        text = self._clean_text(text)
        
        # Split into words
        words = text.split()
        
        if len(words) == 0:
            return []
        
        chunks = []
        start = 0
        
        while start < len(words):
            end = start + self.chunk_size
            chunk = ' '.join(words[start:end])
            
            if chunk.strip():
                chunks.append(chunk)
            
            # Move start position with overlap
            start += self.chunk_size - self.chunk_overlap
        
        logger.info(f"Created {len(chunks)} chunks from text with {len(words)} words")
        return chunks
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,;:!?\'"-]', ' ', text)
        
        # Remove excessive punctuation
        text = re.sub(r'([.,;:!?]){2,}', r'\1', text)
        
        return text.strip()
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for a list of texts
        
        Args:
            texts: List of text strings
        
        Returns:
            NumPy array of embeddings
        """
        # Lazy load model if not loaded
        if self.model is None:
            logger.info("Model not loaded, loading now...")
            self.load_model()
        
        if not texts:
            return np.array([])
        
        try:
            # Generate embeddings
            embeddings = self.model.encode(
                texts,
                batch_size=32,
                show_progress_bar=False,
                convert_to_numpy=True,
                normalize_embeddings=True
            )
            
            logger.info(f"Generated embeddings with shape: {embeddings.shape}")
            return embeddings
        
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise

