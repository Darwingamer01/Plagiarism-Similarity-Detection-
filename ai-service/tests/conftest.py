"""
Pytest configuration and fixtures for AI service tests
"""
import pytest
import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

@pytest.fixture
def client():
    """Create a test client for the FastAPI app"""
    from starlette.testclient import TestClient
    return TestClient(app)

@pytest.fixture
def sample_text_content():
    """Sample text content for testing"""
    return b"This is a sample document for testing plagiarism detection. It contains multiple sentences to test chunking and similarity detection."

@pytest.fixture
def sample_pdf_filename():
    """Sample PDF filename"""
    return "test_document.pdf"

@pytest.fixture
def sample_user_id():
    """Sample user ID for testing"""
    return "test_user_123"
