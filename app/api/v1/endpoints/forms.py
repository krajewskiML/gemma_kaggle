from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import base64

from app.models.forms import (
    FormAnalysisRequest,
    FormAnalysisResponse,
    FormExplanationRequest,
    FormTemplate
)
from app.services.ai_service import ai_service
from app.core.config import settings

router = APIRouter()


@router.post("/analyze", response_model=FormAnalysisResponse)
async def analyze_form(
    target_language: str = Form(description="Language for explanations"),
    document_type: Optional[str] = Form(default=None, description="Known document type"),
    country: Optional[str] = Form(default=None, description="Country context"),
    document: UploadFile = File(description="Form document (PDF or image)")
):
    """
    Analyze a form document and provide field-by-field explanations.
    
    This endpoint helps refugees understand government forms, applications,
    and other official documents by breaking them down into clear, actionable steps.
    """
    # Validate file type
    allowed_types = settings.ALLOWED_IMAGE_TYPES + ["application/pdf"]
    if document.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: images and PDF"
        )
    
    # Check file size
    content = await document.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    try:
        # Encode document to base64
        document_base64 = base64.b64encode(content).decode('utf-8')
        
        # Analyze form
        result = await ai_service.analyze_form(
            document_base64=document_base64,
            target_language=target_language,
            document_type=document_type,
            country=country
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Form analysis failed: {str(e)}"
        )


@router.post("/explain")
async def explain_form_field(request: FormExplanationRequest):
    """
    Get detailed explanation for a specific form field.
    
    Provides contextual help for individual form fields, including
    what information is needed, how to format it, and why it's required.
    """
    if not request.field_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Field name cannot be empty"
        )
    
    try:
        # This would use AI service to provide detailed field explanation
        explanation = {
            "field_name": request.field_name,
            "explanation": f"Detailed explanation for {request.field_name} in {request.target_language}",
            "example_values": ["Example 1", "Example 2"],
            "common_mistakes": ["Don't leave blank", "Use proper format"],
            "required_documents": ["Supporting document if needed"],
            "tips": [
                "Be accurate and honest",
                "Double-check spelling",
                "Keep copies of everything"
            ]
        }
        
        return explanation
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Field explanation failed: {str(e)}"
        )


@router.get("/templates")
async def get_form_templates(
    country: Optional[str] = None,
    category: Optional[str] = None,
    language: str = "English"
):
    """
    Get available form templates and guides.
    
    Returns pre-analyzed forms and templates for common government
    and administrative documents by country and category.
    """
    # In a real implementation, this would query a database
    templates = [
        {
            "id": "visa-application-us",
            "name": "US Visa Application (I-94)",
            "country": "US",
            "category": "immigration",
            "description": "Tourist and temporary visitor visa application",
            "difficulty": "medium",
            "estimated_time": "30-45 minutes"
        },
        {
            "id": "employment-auth-us",
            "name": "Employment Authorization (I-765)",
            "country": "US",
            "category": "employment", 
            "description": "Work authorization application",
            "difficulty": "high",
            "estimated_time": "60-90 minutes"
        },
        {
            "id": "residence-permit-de",
            "name": "German Residence Permit",
            "country": "DE",
            "category": "immigration",
            "description": "Application for German residence permit",
            "difficulty": "high",
            "estimated_time": "45-60 minutes"
        },
        {
            "id": "housing-benefit-uk",
            "name": "UK Housing Benefit Application",
            "country": "UK",
            "category": "benefits",
            "description": "Application for housing assistance",
            "difficulty": "medium",
            "estimated_time": "30-45 minutes"
        }
    ]
    
    # Filter by country and category if provided
    if country:
        templates = [t for t in templates if t["country"].upper() == country.upper()]
    if category:
        templates = [t for t in templates if t["category"] == category]
    
    return {
        "templates": templates,
        "categories": ["immigration", "employment", "benefits", "healthcare", "education"],
        "countries": ["US", "UK", "DE", "FR", "CA", "AU", "SE", "NO"]
    }


@router.get("/categories")
async def get_form_categories():
    """Get available form categories with descriptions."""
    categories = [
        {
            "id": "immigration",
            "name": "Immigration & Visa",
            "description": "Visa applications, residence permits, citizenship forms",
            "icon": "passport"
        },
        {
            "id": "employment",
            "name": "Employment",
            "description": "Work permits, job applications, employment benefits",
            "icon": "briefcase"
        },
        {
            "id": "benefits",
            "name": "Social Benefits",
            "description": "Healthcare, housing assistance, social services",
            "icon": "heart"
        },
        {
            "id": "healthcare",
            "name": "Healthcare",
            "description": "Medical forms, insurance applications, health services",
            "icon": "medical"
        },
        {
            "id": "education",
            "name": "Education",
            "description": "School enrollment, university applications, credentials",
            "icon": "graduation-cap"
        },
        {
            "id": "banking",
            "name": "Banking & Finance",
            "description": "Bank account opening, loan applications, tax forms",
            "icon": "dollar-sign"
        }
    ]
    
    return {"categories": categories} 