import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock
from app.models.translation import TranslationResponse


class TestTranslationAPI:
    """Test suite for translation endpoints."""
    
    def test_translate_text_success(self, client, mock_ai_service, mock_translation_response):
        """Test successful text translation."""
        # Mock the AI service response
        mock_ai_service.translate_text = AsyncMock(return_value=TranslationResponse(**mock_translation_response))
        
        # Test data
        request_data = {
            "text": "Hello",
            "target_language": "Spanish",
            "source_language": "English",
            "context": "greeting"
        }
        
        # Make request
        response = client.post("/api/v1/translate/text", json=request_data)
        
        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert data["original_text"] == "Hello"
        assert data["translated_text"] == "Hola"
        assert data["target_language"] == "Spanish"
        assert "context_explanation" in data
        
        # Verify AI service was called correctly
        mock_ai_service.translate_text.assert_called_once_with(
            text="Hello",
            target_language="Spanish",
            source_language="English",
            context="greeting"
        )
    
    def test_translate_text_empty_text(self, client):
        """Test translation with empty text."""
        request_data = {
            "text": "",
            "target_language": "Spanish"
        }
        
        response = client.post("/api/v1/translate/text", json=request_data)
        assert response.status_code == 400
        assert "cannot be empty" in response.json()["detail"]
    
    def test_translate_text_missing_target_language(self, client):
        """Test translation without target language."""
        request_data = {
            "text": "Hello"
        }
        
        response = client.post("/api/v1/translate/text", json=request_data)
        assert response.status_code == 422  # Validation error
    
    def test_translate_image_success(self, client, mock_ai_service, mock_translation_response, sample_image_file):
        """Test successful image translation."""
        # Mock the AI service response
        mock_ai_service.translate_image = AsyncMock(return_value=TranslationResponse(**mock_translation_response))
        
        # Prepare form data
        filename, file_content, content_type = sample_image_file
        
        # Make request
        response = client.post(
            "/api/v1/translate/image",
            data={
                "target_language": "Spanish",
                "source_language": "English",
                "context": "street sign"
            },
            files={"image": (filename, file_content, content_type)}
        )
        
        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert data["translated_text"] == "Hola"
        assert data["target_language"] == "Spanish"
        
        # Verify AI service was called
        mock_ai_service.translate_image.assert_called_once()
    
    def test_translate_image_invalid_file_type(self, client):
        """Test image translation with invalid file type."""
        # Create a text file instead of image
        response = client.post(
            "/api/v1/translate/image",
            data={"target_language": "Spanish"},
            files={"image": ("test.txt", b"not an image", "text/plain")}
        )
        
        assert response.status_code == 400
        assert "Invalid file type" in response.json()["detail"]
    
    def test_translate_image_missing_target_language(self, client, sample_image_file):
        """Test image translation without target language."""
        filename, file_content, content_type = sample_image_file
        
        response = client.post(
            "/api/v1/translate/image",
            files={"image": (filename, file_content, content_type)}
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_get_supported_languages(self, client):
        """Test getting supported languages."""
        response = client.get("/api/v1/translate/languages")
        
        assert response.status_code == 200
        data = response.json()
        assert "languages" in data
        assert len(data["languages"]) > 0
        
        # Check language structure
        first_lang = data["languages"][0]
        assert "code" in first_lang
        assert "name" in first_lang
        assert "native_name" in first_lang
    
    def test_translate_text_ai_service_error(self, client, mock_ai_service):
        """Test handling of AI service errors."""
        # Mock AI service to raise an exception
        mock_ai_service.translate_text = AsyncMock(side_effect=Exception("AI service error"))
        
        request_data = {
            "text": "Hello",
            "target_language": "Spanish"
        }
        
        response = client.post("/api/v1/translate/text", json=request_data)
        assert response.status_code == 500
        assert "Translation processing failed" in response.json()["detail"] 