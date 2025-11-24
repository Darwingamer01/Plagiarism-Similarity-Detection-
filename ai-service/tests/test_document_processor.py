"""
Tests for document processor module
"""
import pytest
from app.document_processor import DocumentProcessor


@pytest.fixture
def processor():
    """Create a document processor instance"""
    return DocumentProcessor()


def test_processor_initialization(processor):
    """Test that document processor initializes correctly"""
    assert processor is not None
    assert processor.model is None  # Model loads lazily


def test_chunk_text(processor):
    """Test text chunking functionality"""
    text = "This is a test. " * 100  # Create text longer than chunk size
    chunks = processor.chunk_text(text)
    
    assert len(chunks) > 0
    assert all(isinstance(chunk, str) for chunk in chunks)
    assert all(len(chunk) > 0 for chunk in chunks)


def test_chunk_text_short(processor):
    """Test chunking with short text"""
    text = "This is a short text."
    chunks = processor.chunk_text(text)
    
    assert len(chunks) >= 1
    assert chunks[0] == text


def test_chunk_text_empty(processor):
    """Test chunking with empty text"""
    chunks = processor.chunk_text("")
    assert len(chunks) == 0


def test_extract_text_txt(processor):
    """Test extracting text from plain text"""
    content = b"This is plain text content for testing."
    filename = "test.txt"
    
    text = processor.extract_text(content, filename)
    assert text == "This is plain text content for testing."
    assert isinstance(text, str)


def test_extract_text_unsupported_format(processor):
    """Test extracting text from unsupported format raises error"""
    content = b"Some content"
    filename = "test.xyz"
    
    with pytest.raises(ValueError) as exc_info:
        processor.extract_text(content, filename)
    assert "Unsupported file format" in str(exc_info.value)


def test_extract_text_empty_content(processor):
    """Test extracting text from empty content"""
    content = b""
    filename = "test.txt"
    
    text = processor.extract_text(content, filename)
    assert text == ""
