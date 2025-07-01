from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import base64

from app.models.translation import (
    TranslationRequest,
    TextTranslationRequest,
    TranslationResponse
)
from app.services.ai_service import ai_service
from app.core.config import settings

router = APIRouter()


@router.post("/image", response_model=TranslationResponse)
async def translate_image(
    target_language: str = Form(description="Target language code (e.g., 'English', 'Spanish')"),
    source_language: Optional[str] = Form(default=None, description="Source language hint"),
    context: Optional[str] = Form(default=None, description="Additional context"),
    image: UploadFile = File(description="Image file containing text to translate")
):
    """
    Translate text found in an uploaded image.
    
    This endpoint processes images containing text (signs, documents, menus, etc.)
    and provides translations with cultural context to help refugees navigate
    their new environment.
    """
    # Validate file type
    if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )
    
    # Check file size
    content = await image.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    try:
        # Encode image to base64
        image_base64 = base64.b64encode(content).decode('utf-8')
        
        # Process translation
        result = await ai_service.translate_image(
            image_base64=image_base64,
            target_language=target_language,
            source_language=source_language,
            context=context
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Translation processing failed: {str(e)}"
        )


@router.post("/text", response_model=TranslationResponse)
async def translate_text(request: TextTranslationRequest):
    """
    Translate text with cultural context.
    
    Provides not just translation but also cultural explanations and usage tips
    to help refugees understand how to use phrases appropriately in their new country.
    """
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty"
        )
    
    try:
        result = await ai_service.translate_text(
            text=request.text,
            target_language=request.target_language,
            source_language=request.source_language,
            context=request.context
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text translation failed: {str(e)}"
        )


@router.get("/languages")
async def get_supported_languages():
    """
    Get list of supported languages for translation.
    
    Returns commonly used languages with their codes and native names
    to help users select their preferred languages.
    """
    # In a real implementation, this would come from your translation service
    languages = [
        {"code": "English", "name": "English", "native_name": "English"},
        {"code": "Spanish", "name": "Spanish", "native_name": "Español"},
        {"code": "French", "name": "French", "native_name": "Français"},
        {"code": "German", "name": "German", "native_name": "Deutsch"},
        {"code": "Arabic", "name": "Arabic", "native_name": "العربية"},
        {"code": "Ukrainian", "name": "Ukrainian", "native_name": "Українська"},
        {"code": "Russian", "name": "Russian", "native_name": "Русский"},
        {"code": "Polish", "name": "Polish", "native_name": "Polski"},
        {"code": "Turkish", "name": "Turkish", "native_name": "Türkçe"},
        {"code": "Persian", "name": "Persian", "native_name": "فارسی"},
        {"code": "Pashto", "name": "Pashto", "native_name": "پښتو"},
        {"code": "Dari", "name": "Dari", "native_name": "دری"},
        {"code": "Portuguese", "name": "Portuguese", "native_name": "Português"},
        {"code": "Italian", "name": "Italian", "native_name": "Italiano"},
        {"code": "Dutch", "name": "Dutch", "native_name": "Nederlands"},
        {"code": "Swedish", "name": "Swedish", "native_name": "Svenska"},
        {"code": "Norwegian", "name": "Norwegian", "native_name": "Norsk"},
        {"code": "Danish", "name": "Danish", "native_name": "Dansk"},
        {"code": "Finnish", "name": "Finnish", "native_name": "Suomi"}
    ]
    
    return {"languages": languages} 