import logging
import torch
from transformers import pipeline
from typing import Optional

logger = logging.getLogger(__name__)

class SummaryGenerator:
    def __init__(self):
        self.summarizer = None
        self.device = 0 if torch.cuda.is_available() else -1
        self.model_name = "sshleifer/distilbart-cnn-12-6"

    def load_model(self):
        """Lazy load the summarization model"""
        if self.summarizer is None:
            logger.info(f"📦 Loading summarization model: {self.model_name}")
            try:
                self.summarizer = pipeline("summarization", model=self.model_name, device=self.device)
                logger.info("✅ Summarization model loaded")
            except Exception as e:
                logger.error(f"❌ Failed to load summarization model: {str(e)}")
                raise

    def generate_summary(self, text: str, max_length: int = 150, min_length: int = 40) -> Optional[str]:
        try:
            print(f"DEBUG: Generate summary called. Text type: {type(text)}")
            if not text:
                print("DEBUG: Text is empty or None")
                return None
            
            text_len = len(text.strip())
            print(f"DEBUG: Text length: {text_len}")
            
            if text_len < 100:
                print(f"DEBUG: Text too short ({text_len} chars < 100)")
                return None
            
            # Ensure model is loaded
            print("DEBUG: Loading model...")
            self.load_model()
            print("DEBUG: Model loaded.")
            
            # Truncate text if too long
            input_text = text[:4000]
            print(f"DEBUG: Generating summary for input of length {len(input_text)}...")
            
            summary_output = self.summarizer(input_text, max_length=max_length, min_length=min_length, do_sample=False)
            
            print(f"DEBUG: Raw output from summarizer: {summary_output}")
            
            if summary_output and len(summary_output) > 0:
                summary = summary_output[0]['summary_text']
                print(f"DEBUG: Summary generated: {summary[:50]}...")
                return summary
            
            print("DEBUG: Model returned empty summary list")
            return None
            
        except Exception as e:
            print(f"DEBUG: ERROR in generate_summary: {e}")
            logger.error(f"Error generating summary: {str(e)}")
            return None
            logger.error(f"Error generating summary: {str(e)}")
            return None
