from transformers import pipeline
import logging
from typing import Dict, Any
from .config import settings

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    def __init__(self):
        self.pipeline = None
        self.model_name = settings.SENTIMENT_MODEL

    def load_model(self):
        """Load the sentiment analysis model"""
        try:
            logger.info(f"Loading sentiment model: {self.model_name}")
            self.pipeline = pipeline(
                "text-classification",
                model=self.model_name,
                device=-1  # Use CPU
            )
            logger.info("✅ Sentiment model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load sentiment model: {str(e)}")
            raise

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyze sentiment of text
        Returns: { 'label': 'POSITIVE'|'NEGATIVE', 'score': float }
        """
        if self.pipeline is None:
            self.load_model()

        try:
            # Truncate text to 512 tokens (approx) for DistilBERT
            truncated_text = text[:2000] 
            result = self.pipeline(truncated_text)[0]
            
            return {
                "label": result['label'],
                "score": float(result['score'])
            }
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return {"label": "NEUTRAL", "score": 0.0}
