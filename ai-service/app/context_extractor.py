from keybert import KeyBERT
import logging
from typing import List
from .config import settings

logger = logging.getLogger(__name__)

class ContextExtractor:
    def __init__(self):
        self.kw_model = None

    def load_model(self):
        """Load the KeyBERT model"""
        try:
            logger.info("Loading KeyBERT model...")
            self.kw_model = KeyBERT()
            logger.info("✅ KeyBERT model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load KeyBERT model: {str(e)}")
            raise

    def extract_context(self, text: str, top_n: int = 5) -> List[str]:
        """
        Extract top keywords/keyphrases from text
        """
        if self.kw_model is None:
            self.load_model()

        try:
            # Extract keywords
            keywords = self.kw_model.extract_keywords(
                text,
                keyphrase_ngram_range=(1, 2),
                stop_words='english',
                use_maxsum=True,
                nr_candidates=20,
                top_n=top_n
            )
            
            # Return just the words
            return [kw[0] for kw in keywords]
        except Exception as e:
            logger.error(f"Error extracting context: {str(e)}")
            return []
