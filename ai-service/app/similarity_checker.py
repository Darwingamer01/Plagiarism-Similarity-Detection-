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
                logger.info("Loading existing FAISS index...")
                self.index = faiss.read_index(self.index_path)
                
                with open(self.metadata_path, 'rb') as f:
                    self.metadata = pickle.load(f)
                
                logger.info(f"Loaded index with {self.index.ntotal} vectors")
            else:
                logger.info("Creating new FAISS index...")
                self.index = faiss.IndexFlatL2(self.dimension)
                self.metadata = []
                logger.info("New index created")
        
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
            
            logger.info(f"Index saved with {self.index.ntotal} vectors")
        
        except Exception as e:
            logger.error(f"Error saving index: {str(e)}")
            raise
    
    def add_documents(
        self,
        embeddings: np.ndarray,
        chunks: List[str],
        document_id: str,
        user_id: str,
        extra_metadata: Dict[str, Any] = None
    ) -> str:
        """
        Add document embeddings to FAISS index
        
        Args:
            embeddings: NumPy array of embeddings
            chunks: List of text chunks
            document_id: Unique document identifier
            user_id: User ID who owns the document
            extra_metadata: Additional metadata (sentiment, context, etc.)
        """
        try:
            # Ensure embeddings are float32
            embeddings = embeddings.astype('float32')
            
            # Add to FAISS index
            start_idx = self.index.ntotal
            self.index.add(embeddings)
            
            # Store metadata for each chunk
            for i, chunk in enumerate(chunks):
                meta = {
                    'document_id': document_id,
                    'user_id': user_id,
                    'chunk_index': i,
                    'chunk_text': chunk,
                    'faiss_index': start_idx + i
                }
                # Merge extra metadata if provided
                if extra_metadata:
                    meta.update(extra_metadata)
                    
                self.metadata.append(meta)
            
            # Save index
            self.save_index()
            
            logger.info(f"Added {len(chunks)} chunks to index. Total vectors: {self.index.ntotal}")
            
            return document_id
        
        except Exception as e:
            logger.error(f"Error adding documents to index: {str(e)}")
            raise
    
    def search_similar(
        self,
        query_embeddings: np.ndarray,
        query_chunks: List[str],
        threshold: float = 0.88,
        top_k: int = 5,
        user_id: Optional[str] = None
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
            
            logger.info(f"Searching index with {self.index.ntotal} vectors. Query userId: {user_id}")

            # Search in FAISS (returns distances, need to convert to similarity)
            k = min(top_k * 20, self.index.ntotal)  # Increase search multiplier
            distances, indices = self.index.search(query_embeddings, k)
            
            # Convert L2 distances to cosine similarity
            # similarity = 1 - (distance / 2)
            similarities = 1 - (distances / 2)
            
            # Group results by document
            document_matches = {}
            # Keep track of the absolute best match found, even if below threshold, for reporting
            best_match_any_score = None
            best_match_score = -1.0
            
            # Identify which query chunks had at least one match > threshold
            matched_query_chunk_indices = set()

            for query_idx, (query_chunk, query_sims, query_indices) in enumerate(
                zip(query_chunks, similarities, indices)
            ):
                has_match = False
                for sim, idx in zip(query_sims, query_indices):
                    if idx < 0 or idx >= len(self.metadata):
                        continue
                    meta = self.metadata[idx]
                    
                    # Only compare against documents uploaded by the current user
                    if user_id is not None and meta.get('user_id') != user_id:
                        continue
                    
                    # Track absolute best single chunk match for reporting
                    if user_id is None or meta.get('user_id') == user_id:
                         if sim > best_match_score:
                             best_match_score = sim
                             best_match_any_score = {
                                 'document_id': meta['document_id'],
                                 'similarity': float(sim),
                                 'metadata': {
                                     'sentiment': meta.get('sentiment'),
                                     'context': meta.get('context'),
                                     'summary': meta.get('summary')
                                 }
                             }

                    # threshold check
                    if sim >= threshold:
                        has_match = True
                        doc_id = meta['document_id']
                        if doc_id not in document_matches:
                            document_matches[doc_id] = {
                                'document_id': doc_id,
                                'max_similarity': 0.0,
                                'matched_chunks': 0,
                                'matches': []
                            }
                        if sim > document_matches[doc_id]['max_similarity']:
                            document_matches[doc_id]['max_similarity'] = float(sim)
                        document_matches[doc_id]['matched_chunks'] += 1
                        document_matches[doc_id]['matches'].append({
                            'query_text': query_chunk[:200] + '...' if len(query_chunk) > 200 else query_chunk,
                            'matched_text': meta['chunk_text'][:200] + '...' if len(meta['chunk_text']) > 200 else meta['chunk_text'],
                            'similarity': float(sim),
                            'chunk_index': meta['chunk_index']
                        })
                
                if has_match:
                    matched_query_chunk_indices.add(query_idx)
            
            # Calculate Global Aggregate Score FIRST
            # This represents the total volume of the document that is found in ANY source
            total_query_chunks = len(query_chunks) if len(query_chunks) > 0 else 1
            aggregate_score = len(matched_query_chunk_indices) / total_query_chunks
            aggregate_score = min(aggregate_score, 1.0)
            
            # Calculate scores for each document using the GLOBAL aggregate score
            for doc_id, doc_data in document_matches.items():
                # Document Overall Score: Formula = 60% Global Aggregate + 40% Document Max Similarity
                doc_overall_score = (0.6 * aggregate_score) + (0.4 * doc_data['max_similarity'])
                
                # Store the GLOBAL aggregate score so it displays consistently (e.g. "30%") everywhere
                doc_data['aggregate_score'] = float(aggregate_score)
                doc_data['overall_score'] = float(doc_overall_score)

            # Sort documents by overall score (highest first)
            similar_documents = sorted(
                document_matches.values(),
                key=lambda x: x['overall_score'],
                reverse=True
            )[:top_k]
            
            # Global Max Similarity
            max_similarity = max(
                [doc['max_similarity'] for doc in similar_documents],
                default=0.0
            )
            
            # Global Overall Score: Take the MAX of all individual document overall scores
            overall_score = max(
                [doc['overall_score'] for doc in similar_documents],
                default=0.0
            )
            
            logger.info(f"Scores -> Max Sim: {max_similarity:.2f}, Aggregate: {aggregate_score:.2f}, Overall: {overall_score:.2f}")
            
            return {
                "max_similarity": float(max_similarity),
                "aggregate_score": float(aggregate_score),
                "overall_score": float(overall_score),
                "similar_documents": similar_documents,
                "closest_match": best_match_any_score if not similar_documents else None
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
            
            logger.info(f"Starting deletion for document: {document_id}")
            
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
                logger.info(f"Rebuilding index. Removing {deleted_count} chunks.")
                
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
                logger.info(f"Index rebuilt. New total vectors: {self.index.ntotal}")
            else:
                logger.info("Document not found in index, nothing to delete.")
        
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
