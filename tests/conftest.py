import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
import base64
from io import BytesIO
from PIL import Image

from main import app
from app.core.config import settings


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def mock_ai_service():
    """Mock the AI service for testing."""
    with patch('app.services.ai_service.ai_service') as mock:
        yield mock


@pytest.fixture
def sample_image_base64():
    """Create a sample base64 encoded image for testing."""
    # Create a simple test image
    img = Image.new('RGB', (100, 100), color='white')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    image_data = buffer.getvalue()
    return base64.b64encode(image_data).decode('utf-8')


@pytest.fixture
def sample_image_file():
    """Create a sample image file for upload testing."""
    img = Image.new('RGB', (100, 100), color='white')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    buffer.seek(0)
    return ("test_image.jpg", buffer, "image/jpeg")


@pytest.fixture
def mock_translation_response():
    """Mock translation response."""
    return {
        "original_text": "Hello",
        "translated_text": "Hola",
        "source_language": "English",
        "target_language": "Spanish",
        "context_explanation": "A common greeting",
        "confidence": 0.95,
        "detected_objects": []
    }


@pytest.fixture
def mock_form_analysis_response():
    """Mock form analysis response."""
    return {
        "form_type": "Visa Application",
        "title": "Tourist Visa Form",
        "description": "Application for temporary visitor visa",
        "fields": [
            {
                "field_name": "full_name",
                "field_type": "text",
                "label": "Full Name",
                "explanation": "Enter your complete legal name as shown on passport",
                "required": True,
                "example_value": "John Smith"
            }
        ],
        "instructions": ["Fill all required fields", "Use black ink"],
        "required_documents": ["Passport", "Photo"],
        "estimated_time": "30 minutes"
    } 