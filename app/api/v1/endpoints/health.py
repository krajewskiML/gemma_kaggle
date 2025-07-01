from fastapi import APIRouter, HTTPException
from datetime import datetime
import os

from app.core.config import settings

router = APIRouter()


@router.get("/status")
async def health_status():
    """
    Basic health check endpoint.
    
    Returns the current status of the API and its dependencies.
    """
    try:
        # Check environment variables
        env_checks = {
            "openrouter_api_configured": bool(settings.OPENROUTER_API_KEY),
            "secret_key_configured": bool(hasattr(settings, 'SECRET_KEY') and settings.SECRET_KEY),
        }
        
        # Check API configuration
        api_status = {
            "debug_mode": settings.DEBUG,
            "host": settings.HOST,
            "port": settings.PORT,
            "vision_model": settings.VISION_MODEL,
            "text_model": settings.TEXT_MODEL
        }
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
            "environment_checks": env_checks,
            "api_configuration": api_status,
            "uptime": "Available"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Health check failed: {str(e)}"
        )


@router.get("/readiness")
async def readiness_check():
    """
    Readiness check for container orchestration.
    
    Verifies that all required services and dependencies are available.
    """
    checks = []
    overall_ready = True
    
    # Check OpenRouter API key
    if settings.OPENROUTER_API_KEY:
        checks.append({
            "service": "openrouter_api",
            "status": "ready",
            "message": "API key configured"
        })
    else:
        checks.append({
            "service": "openrouter_api", 
            "status": "not_ready",
            "message": "API key not configured"
        })
        overall_ready = False
    
    # Check required settings
    required_settings = ["SECRET_KEY"]
    for setting in required_settings:
        if hasattr(settings, setting) and getattr(settings, setting):
            checks.append({
                "service": f"config_{setting.lower()}",
                "status": "ready",
                "message": f"{setting} is configured"
            })
        else:
            checks.append({
                "service": f"config_{setting.lower()}",
                "status": "not_ready", 
                "message": f"{setting} is not configured"
            })
            overall_ready = False
    
    status_code = 200 if overall_ready else 503
    
    response = {
        "ready": overall_ready,
        "timestamp": datetime.utcnow().isoformat(),
        "checks": checks
    }
    
    if not overall_ready:
        raise HTTPException(status_code=status_code, detail=response)
    
    return response


@router.get("/liveness")
async def liveness_check():
    """
    Liveness check for container orchestration.
    
    Simple endpoint to verify the application is running.
    """
    return {
        "alive": True,
        "timestamp": datetime.utcnow().isoformat(),
        "service": "refugee-assistance-api"
    } 