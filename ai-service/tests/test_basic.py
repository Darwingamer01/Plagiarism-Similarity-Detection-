# Simple test file without complex imports
import pytest

def test_basic_math():
    """Basic test to verify pytest is working"""
    assert 1 + 1 == 2

def test_string_operations():
    """Test string operations"""
    text = "plagiarism detection"
    assert "plagiarism" in text
    assert text.upper() == "PLAGIARISM DETECTION"

def test_list_operations():
    """Test list operations"""
    items = [1, 2, 3, 4, 5]
    assert len(items) == 5
    assert sum(items) == 15
