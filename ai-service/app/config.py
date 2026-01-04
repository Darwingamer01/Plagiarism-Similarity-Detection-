from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    
    # Model Configuration
    MAX_FILE_SIZE: int = 5242880  # 5MB
    
    # Model Configuration
    MODEL_NAME: str = "sentence-transformers/all-mpnet-base-v2"
    SENTIMENT_MODEL: str = "distilbert-base-uncased-finetuned-sst-2-english"
    MODEL_CACHE_DIR: str = "/app/models"
    DATA_DIR: str = "/app/data"
    
    # Document Processing
    CHUNK_SIZE: int = 300
    CHUNK_OVERLAP: int = 50
    MAX_FILE_SIZE: int = 5242880  # 5MB
    
    # FAISS Configuration
    FAISS_INDEX_TYPE: str = "FlatL2"
    FAISS_NLIST: int = 100
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Ensure data directories exist
os.makedirs(f"{settings.DATA_DIR}/faiss_index", exist_ok=True)
os.makedirs(f"{settings.DATA_DIR}/documents", exist_ok=True)
os.makedirs(settings.MODEL_CACHE_DIR, exist_ok=True)
