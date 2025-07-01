import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock
from app.models.forms import FormAnalysisResponse


class TestFormsAPI:
    """Test suite for forms endpoints."""
    
    def test_analyze_form_success(self, client, mock_ai_service, mock_form_analysis_response, sample_image_file):
        """Test successful form analysis."""
        # Mock the AI service response
        mock_ai_service.analyze_form = AsyncMock(return_value=FormAnalysisResponse(**mock_form_analysis_response))
        
        # Prepare form data
        filename, file_content, content_type = sample_image_file
        
        # Make request
        response = client.post(
            "/api/v1/forms/analyze",
            data={
                "target_language": "English",
                "document_type": "visa_application",
                "country": "US"
            },
            files={"document": (filename, file_content, content_type)}
        )
        
        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert data["form_type"] == "Visa Application"
        assert data["title"] == "Tourist Visa Form"
        assert len(data["fields"]) > 0
        assert len(data["instructions"]) > 0
        
        # Verify AI service was called correctly
        mock_ai_service.analyze_form.assert_called_once()
    
    def test_analyze_form_invalid_file_type(self, client):
        """Test form analysis with invalid file type."""
        response = client.post(
            "/api/v1/forms/analyze",
            data={"target_language": "English"},
            files={"document": ("test.txt", b"not a document", "text/plain")}
        )
        
        assert response.status_code == 400
        assert "Invalid file type" in response.json()["detail"]
    
    def test_analyze_form_missing_language(self, client, sample_image_file):
        """Test form analysis without target language."""
        filename, file_content, content_type = sample_image_file
        
        response = client.post(
            "/api/v1/forms/analyze",
            files={"document": (filename, file_content, content_type)}
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_explain_form_field_success(self, client):
        """Test successful form field explanation."""
        request_data = {
            "field_name": "full_name",
            "field_context": "Personal information section",
            "form_type": "visa_application",
            "target_language": "English",
            "user_situation": "first time applicant"
        }
        
        response = client.post("/api/v1/forms/explain", json=request_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["field_name"] == "full_name"
        assert "explanation" in data
        assert "example_values" in data
        assert "tips" in data
    
    def test_explain_form_field_empty_name(self, client):
        """Test form field explanation with empty field name."""
        request_data = {
            "field_name": "",
            "field_context": "Some context",
            "form_type": "visa_application",
            "target_language": "English"
        }
        
        response = client.post("/api/v1/forms/explain", json=request_data)
        assert response.status_code == 400
        assert "cannot be empty" in response.json()["detail"]
    
    def test_get_form_templates_all(self, client):
        """Test getting all form templates."""
        response = client.get("/api/v1/forms/templates")
        
        assert response.status_code == 200
        data = response.json()
        assert "templates" in data
        assert "categories" in data
        assert "countries" in data
        assert len(data["templates"]) > 0
    
    def test_get_form_templates_filtered_by_country(self, client):
        """Test getting form templates filtered by country."""
        response = client.get("/api/v1/forms/templates?country=US")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check that all returned templates are for the US
        for template in data["templates"]:
            assert template["country"] == "US"
    
    def test_get_form_templates_filtered_by_category(self, client):
        """Test getting form templates filtered by category."""
        response = client.get("/api/v1/forms/templates?category=immigration")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check that all returned templates are immigration-related
        for template in data["templates"]:
            assert template["category"] == "immigration"
    
    def test_get_form_templates_multiple_filters(self, client):
        """Test getting form templates with multiple filters."""
        response = client.get("/api/v1/forms/templates?country=US&category=immigration")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check that templates match both filters
        for template in data["templates"]:
            assert template["country"] == "US"
            assert template["category"] == "immigration"
    
    def test_get_form_categories(self, client):
        """Test getting form categories."""
        response = client.get("/api/v1/forms/categories")
        
        assert response.status_code == 200
        data = response.json()
        assert "categories" in data
        assert len(data["categories"]) > 0
        
        # Check category structure
        first_category = data["categories"][0]
        assert "id" in first_category
        assert "name" in first_category
        assert "description" in first_category
        assert "icon" in first_category
    
    def test_analyze_form_ai_service_error(self, client, mock_ai_service, sample_image_file):
        """Test handling of AI service errors during form analysis."""
        # Mock AI service to raise an exception
        mock_ai_service.analyze_form = AsyncMock(side_effect=Exception("AI service error"))
        
        filename, file_content, content_type = sample_image_file
        
        response = client.post(
            "/api/v1/forms/analyze",
            data={"target_language": "English"},
            files={"document": (filename, file_content, content_type)}
        )
        
        assert response.status_code == 500
        assert "Form analysis failed" in response.json()["detail"] 