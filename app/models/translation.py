from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class TranslationRequest(BaseModel):
    """Request model for image translation."""
    image: str = Field(description="Base64 encoded image data")
    source_language: Optional[str] = Field(default=None, description="Detected or specified source language")
    target_language: str = Field(description="User's preferred language code")
    context: Optional[str] = Field(default=None, description="Additional context for translation")


class TextTranslationRequest(BaseModel):
    """Request model for text-only translation."""
    text: str = Field(description="Text to translate")
    source_language: Optional[str] = Field(default=None, description="Source language code")
    target_language: str = Field(description="Target language code")
    context: Optional[str] = Field(default=None, description="Additional context for translation")


class TranslationResponse(BaseModel):
    """Response model for translation results."""
    original_text: str = Field(description="Original detected/input text")
    translated_text: str = Field(description="Translated text")
    source_language: str = Field(description="Detected source language")
    target_language: str = Field(description="Target language")
    context_explanation: Optional[str] = Field(default=None, description="Cultural context and explanation")
    confidence: Optional[float] = Field(default=None, description="Translation confidence score")
    detected_objects: Optional[list] = Field(default=[], description="Objects detected in image")


class TranslationHistory(BaseModel):
    """Model for translation history."""
    id: str = Field(description="Unique translation ID")
    user_id: Optional[str] = Field(default=None, description="User ID if authenticated")
    original_text: str = Field(description="Original text")
    translated_text: str = Field(description="Translated text")
    source_language: str = Field(description="Source language")
    target_language: str = Field(description="Target language")
    context_explanation: Optional[str] = Field(default=None, description="Context explanation")
    image_url: Optional[str] = Field(default=None, description="Image URL if applicable")
    created_at: datetime = Field(description="Timestamp of translation")
    
    class Config:
        from_attributes = True 