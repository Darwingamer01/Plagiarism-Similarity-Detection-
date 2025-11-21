import faiss
import numpy as np
import pickle
import os
from typing import List, Dict, Any, Optional
import logging

from .config import settings

logger = logging.getLogger(__name__)

class SimilarityChecker:
    def __init__(self):
        self.index = None
        self.metadata = []  # Store document metadata
        self.index_path = f"{settings.DATA_DIR}/faiss_index/index.faiss"
        self.metadata_path = f"{settings.DATA_DIR}/faiss_index/metadata.pkl"
        self.dimension = 384  # all-MiniLM-L6-v2 embedding dimension
    
    def load_index(self):
        """Load existing FAISS index or create new one"""
        try:
            if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
                logger.info("📂 Loading existing FAISS index...")
                self.index = faiss.read_index(self.index_path)
                
                with open(self.metadata_path, 'rb') as f:
                    self.metadata = pickle.load(f)
                
                logger.info(f"✅ Loaded index with {self.index.ntotal} vectors")
            else:
                logger.info("🆕 Creating new FAISS index...")
                self.index = faiss.IndexFlatL2(self.dimension)
                self.metadata = []
                logger.info("✅ New index created")
        
        except Exception as e:
            logger.error(f"Error loading index: {str(e)}")
            # Create new index if loading fails
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = []
    
    def save_index(self):
        """Save FAISS index and metadata to disk"""
        try:
            faiss.write_index(self.index, self.index_path)
            
            with open(self.metadata_path, 'wb') as f:
                pickle.dump(self.metadata, f)
            
            logger.info(f"💾 Index saved with {self.index.ntotal} vectors")
        
        except Exception as e:
            logger.error(f"Error saving index: {str(e)}")
            raise
    
    def add_documents(
        self,
        embeddings: np.ndarray,
        chunks: List[str],
        document_id: str,
        user_id: str
    ) -> str:
        """
        Add document embeddings to FAISS index
        
        Args:
            embeddings: NumPy array of embeddings
            chunks: List of text chunks
            document_id: Unique document identifier
            user_id: User ID who owns the document
        
        Returns:
            Document ID
        """
        try:
            # Ensure embeddings are float32
            embeddings = embeddings.astype('float32')
            
            # Add to FAISS index
            start_idx = self.index.ntotal
            self.index.add(embeddings)
            
            # Store metadata for each chunk
            for i, chunk in enumerate(chunks):
                self.metadata.append({
                    'document_id': document_id,
                    'user_id': user_id,
                    'chunk_index': i,
                    'chunk_text': chunk,
                    'faiss_index': start_idx + i
                })
            
            # Save index
            self.save_index()
            
            logger.info(f"✅ Added {len(chunks)} chunks to index. Total vectors: {self.index.ntotal}")
            
            return document_id
        
        except Exception as e:
            logger.error(f"Error adding documents to index: {str(e)}")
            raise
    
    def search_similar(
        self,
        query_embeddings: np.ndarray,
        query_chunks: List[str],
        threshold: float = 0.88,
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Search for similar documents in the index
        
        Args:
            query_embeddings: Query embeddings
            query_chunks: Query text chunks
            threshold: Similarity threshold (0-1)
            top_k: Number of results to return
        
        Returns:
            Dictionary with similarity results
        """
        try:
            if self.index.ntotal == 0:
                logger.warning("Index is empty, no documents to search")
                return {
                    "max_similarity": 0.0,
                    "similar_documents": []
                }
            
            # Ensure embeddings are float32
            query_embeddings = query_embeddings.astype('float32')
            
            # Search in FAISS (returns distances, need to convert to similarity)
            k = min(top_k * 10, self.index.ntotal)  # Search more to find best matches
            distances, indices = self.index.search(query_embeddings, k)
            
            # Convert L2 distances to cosine similarity
            # Since embeddings are normalized, L2 distance relates to cosine similarity
            # similarity = 1 - (distance / 2)
            similarities = 1 - (distances / 2)
            
            # Group results by document
            document_matches = {}
            
            for query_idx, (query_chunk, query_sims, query_indices) in enumerate(
                zip(query_chunks, similarities, indices)
            ):
                for sim, idx in zip(query_sims, query_indices):
                    if idx < 0 or idx >= len(self.metadata):
                        continue
                    
                    # REMOVED threshold filter - now includes ALL documents even with 0% similarity
                    # if sim < threshold:
                    #     continue
                    
                    meta = self.metadata[idx]
                    doc_id = meta['document_id']
                    
                    if doc_id not in document_matches:
                        document_matches[doc_id] = {
                            'document_id': doc_id,
                            'max_similarity': 0.0,
                            'matched_chunks': 0,
                            'matches': []
                        }
                    
                    # Update document stats
                    if sim > document_matches[doc_id]['max_similarity']:
                        document_matches[doc_id]['max_similarity'] = float(sim)
                    
                    document_matches[doc_id]['matched_chunks'] += 1
                    document_matches[doc_id]['matches'].append({
                        'query_text': query_chunk[:200] + '...' if len(query_chunk) > 200 else query_chunk,
                        'matched_text': meta['chunk_text'][:200] + '...' if len(meta['chunk_text']) > 200 else meta['chunk_text'],
                        'similarity': float(sim),
                        'chunk_index': meta['chunk_index']
                    })
            
            # Sort documents by max similarity (highest first)
            similar_documents = sorted(
                document_matches.values(),
                key=lambda x: x['max_similarity'],
                reverse=True
            )[:top_k]  # Still limit by top_k which is set to total docs count
            
            # Calculate overall max similarity
            max_similarity = max(
                [doc['max_similarity'] for doc in similar_documents],
                default=0.0
            )
            
            logger.info(f"🔍 Found {len(similar_documents)} similar documents (max similarity: {max_similarity:.2f})")
            
            return {
                "max_similarity": float(max_similarity),
                "similar_documents": similar_documents
            }
        
        except Exception as e:
            logger.error(f"Error searching for similar documents: {str(e)}")
            raise
    
    def delete_document(self, document_id: str, user_id: str):
        """
        Delete a document from the index by rebuilding it without the deleted document's vectors.
        This ensures vectors are actually removed from FAISS.
        """
        try:
            # Identify chunks to keep
            new_metadata = []
            vectors_to_keep = []
            
            logger.info(f"🗑️ Starting deletion for document: {document_id}")
            
            # Iterate through existing metadata to filter and collect vectors
            for meta in self.metadata:
                # Skip if this is the document we want to delete
                if meta['document_id'] == document_id and meta['user_id'] == user_id:
                    continue
                
                # Reconstruct vector from current index
                try:
                    vector = self.index.reconstruct(meta['faiss_index'])
                    vectors_to_keep.append(vector)
                    
                    # Update metadata for new index (will be appended sequentially)
                    meta_copy = meta.copy()
                    meta_copy['faiss_index'] = len(vectors_to_keep) - 1
                    new_metadata.append(meta_copy)
                except Exception as e:
                    logger.warning(f"Failed to reconstruct vector at index {meta['faiss_index']}: {e}")
            
            deleted_count = len(self.metadata) - len(new_metadata)
            
            if deleted_count > 0:
                logger.info(f"♻️ Rebuilding index. Removing {deleted_count} chunks.")
                
                # Create new index
                new_index = faiss.IndexFlatL2(self.dimension)
                
                if vectors_to_keep:
                    # Convert list of arrays to single numpy array
                    vectors_array = np.array(vectors_to_keep).astype('float32')
                    new_index.add(vectors_array)
                
                # Atomically replace index and metadata
                self.index = new_index
                self.metadata = new_metadata
                
                # Save changes
                self.save_index()
                logger.info(f"✅ Index rebuilt. New total vectors: {self.index.ntotal}")
            else:
                logger.info("ℹ️ Document not found in index, nothing to delete.")
        
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            raise
    
    def get_stats(self) -> Dict[str, Any]:
        """Get index statistics"""
        unique_documents = len(set(m['document_id'] for m in self.metadata))
        unique_users = len(set(m['user_id'] for m in self.metadata))
        
        return {
            "total_vectors": self.index.ntotal if self.index else 0,
            "total_chunks": len(self.metadata),
            "unique_documents": unique_documents,
            "unique_users": unique_users,
            "index_dimension": self.dimension
        }
