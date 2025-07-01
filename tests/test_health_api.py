import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch


class TestHealthAPI:
    """Test suite for health check endpoints."""
    
    def test_health_status_success(self, client):
        """Test successful health status check."""
        response = client.get("/api/v1/health/status")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data
        assert "environment_checks" in data
        assert "api_configuration" in data
    
    def test_readiness_check_ready(self, client):
        """Test readiness check when all services are ready."""
        with patch('app.core.config.settings.OPENROUTER_API_KEY', 'test-key'), \
             patch('app.core.config.settings.SECRET_KEY', 'test-secret'):
            
            response = client.get("/api/v1/health/readiness")
            
            assert response.status_code == 200
            data = response.json()
            assert data["ready"] is True
            assert "checks" in data
            assert len(data["checks"]) > 0
    
    def test_readiness_check_not_ready(self, client):
        """Test readiness check when services are not ready."""
        with patch('app.core.config.settings.OPENROUTER_API_KEY', ''), \
             patch('app.core.config.settings.SECRET_KEY', ''):
            
            response = client.get("/api/v1/health/readiness")
            
            assert response.status_code == 503
            data = response.json()["detail"]
            assert data["ready"] is False
            assert "checks" in data
            
            # Check that at least one service is not ready
            not_ready_services = [check for check in data["checks"] if check["status"] == "not_ready"]
            assert len(not_ready_services) > 0
    
    def test_liveness_check(self, client):
        """Test liveness check."""
        response = client.get("/api/v1/health/liveness")
        
        assert response.status_code == 200
        data = response.json()
        assert data["alive"] is True
        assert "timestamp" in data
        assert data["service"] == "refugee-assistance-api"
    
    def test_main_health_endpoint(self, client):
        """Test the main health endpoint at root level."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "message" in data 