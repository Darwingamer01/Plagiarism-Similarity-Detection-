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
        Search for similar documents in the index using weighted mean scoring.
        
        Scoring formula (weighted by chunk length):
        - Per-document: Σ(len(chunk_i) * similarity_i) / Σ(len(chunk_i))
        - Overall: Σ(len(chunk_i) * similarity_i) / Σ(len(chunk_i)) across all matches
        
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
                    "overall_score": 0.0,
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
            
            # Group results by document, tracking weighted sums for scoring
            document_matches = {}
            # Keep track of the absolute best match found, even if below threshold, for reporting
            best_match_any_score = None
            best_match_score = -1.0
            
            # For global weighted score calculation
            global_weighted_sum = 0.0
            global_weight_sum = 0.0

            for query_idx, (query_chunk, query_sims, query_indices) in enumerate(
                zip(query_chunks, similarities, indices)
            ):
                query_chunk_length = len(query_chunk)
                
                for sim, idx in zip(query_sims, query_indices):
                    if idx < 0 or idx >= len(self.metadata):
                        continue
                    meta = self.metadata[idx]
                    
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
                        doc_id = meta['document_id']
                        
                        # Add to global weighted score
                        global_weighted_sum += query_chunk_length * float(sim)
                        global_weight_sum += query_chunk_length
                        
                        if doc_id not in document_matches:
                            document_matches[doc_id] = {
                                'document_id': doc_id,
                                'filename': meta.get('filename'),
                                'matched_chunks': 0,
                                'matches': [],
                                # For weighted mean calculation
                                'weighted_sum': 0.0,
                                'weight_sum': 0.0
                            }
                        
                        # Update weighted sums for per-document score
                        document_matches[doc_id]['weighted_sum'] += query_chunk_length * float(sim)
                        document_matches[doc_id]['weight_sum'] += query_chunk_length
                        document_matches[doc_id]['matched_chunks'] += 1
                        
                        document_matches[doc_id]['matches'].append({
                            'query_text': query_chunk[:200] + '...' if len(query_chunk) > 200 else query_chunk,
                            'matched_text': meta['chunk_text'][:200] + '...' if len(meta['chunk_text']) > 200 else meta['chunk_text'],
                            'similarity': float(sim),
                            'chunk_index': meta['chunk_index'],
                            'chunk_length': query_chunk_length
                        })
            
            # Deduplicate by filename: Keep only the single best match for each filename
            unique_filename_map = {}
            for doc_id, data in document_matches.items():
                fname = data.get('filename')
                key = fname if fname else doc_id
                
                # Sort matches by similarity descending
                data['matches'].sort(key=lambda x: x['similarity'], reverse=True)
                
                if key not in unique_filename_map:
                    unique_filename_map[key] = data
                else:
                    # If we found a better version (higher weighted_sum), replace it
                    if data['weighted_sum'] > unique_filename_map[key]['weighted_sum']:
                        unique_filename_map[key] = data
            
            # Update document_matches to only contain the unique best matches
            document_matches = {d['document_id']: d for d in unique_filename_map.values()}

            # Calculate per-document weighted mean scores
            for doc_id, doc_data in document_matches.items():
                if doc_data['weight_sum'] > 0:
                    doc_data['similarity_score'] = doc_data['weighted_sum'] / doc_data['weight_sum']
                else:
                    doc_data['similarity_score'] = 0.0
                
                # Clean up internal calculation fields
                del doc_data['weighted_sum']
                del doc_data['weight_sum']

            # Sort documents by similarity_score (highest first)
            similar_documents = sorted(
                document_matches.values(),
                key=lambda x: x['similarity_score'],
                reverse=True
            )[:top_k]
            
            # Calculate global overall weighted score
            if global_weight_sum > 0:
                overall_score = global_weighted_sum / global_weight_sum
            else:
                overall_score = 0.0
            
            logger.info(f"Scores -> Overall Weighted: {overall_score:.2f}")
            
            return {
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
