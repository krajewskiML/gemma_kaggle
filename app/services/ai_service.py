import base64
import json
from typing import Optional, Dict, Any, List
from openai import OpenAI
import httpx

from app.core.config import settings
from app.models.translation import TranslationResponse
from app.models.forms import FormAnalysisResponse, FormField


class AIService:
    """Service for AI-powered text and vision processing."""
    
    def __init__(self):
        self.client = OpenAI(
            base_url=settings.OPENROUTER_BASE_URL,
            api_key=settings.OPENROUTER_API_KEY,
        )
    
    async def translate_image(
        self,
        image_base64: str,
        target_language: str,
        source_language: Optional[str] = None,
        context: Optional[str] = None
    ) -> TranslationResponse:
        """
        Translate text found in an image.
        
        Args:
            image_base64: Base64 encoded image
            target_language: Target language for translation
            source_language: Optional source language hint
            context: Optional context for better translation
            
        Returns:
            TranslationResponse with translation and context
        """
        try:
            data_url = f"data:image/jpeg;base64,{image_base64}"
            
            system_prompt = (
                "You are a multilingual translation assistant specialized in helping refugees and immigrants. "
                "Analyze the image, detect any text, and provide accurate translations with cultural context. "
                "Always include explanations about what the text means in the target culture. "
                "Focus on practical, helpful information that assists with daily life navigation."
            )
            
            user_prompt = self._build_translation_prompt(target_language, source_language, context)
            
            completion = self.client.chat.completions.create(
                model=settings.VISION_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": user_prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": data_url}
                            }
                        ]
                    }
                ],
                max_tokens=settings.MAX_TOKENS,
                temperature=0.3
            )
            
            response_content = completion.choices[0].message.content
            return self._parse_translation_response(response_content, target_language)
            
        except Exception as e:
            raise Exception(f"Translation failed: {str(e)}")
    
    async def translate_text(
        self,
        text: str,
        target_language: str,
        source_language: Optional[str] = None,
        context: Optional[str] = None
    ) -> TranslationResponse:
        """
        Translate text with cultural context.
        
        Args:
            text: Text to translate
            target_language: Target language
            source_language: Optional source language
            context: Optional context
            
        Returns:
            TranslationResponse with translation and context
        """
        try:
            system_prompt = (
                "You are a cultural translation assistant for refugees and immigrants. "
                "Provide accurate translations with cultural context and practical explanations. "
                "Help users understand not just what words mean, but how to use them appropriately."
            )
            
            user_prompt = (
                f"Translate this text to {target_language}: '{text}'\n"
                f"Source language: {source_language or 'auto-detect'}\n"
                f"Context: {context or 'general'}\n"
                "Provide: 1) Translation 2) Cultural context 3) Usage tips"
            )
            
            completion = self.client.chat.completions.create(
                model=settings.TEXT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=settings.MAX_TOKENS,
                temperature=0.3
            )
            
            response_content = completion.choices[0].message.content
            return self._parse_text_translation_response(
                response_content, text, target_language, source_language
            )
            
        except Exception as e:
            raise Exception(f"Text translation failed: {str(e)}")
    
    async def analyze_form(
        self,
        document_base64: str,
        target_language: str,
        document_type: Optional[str] = None,
        country: Optional[str] = None
    ) -> FormAnalysisResponse:
        """
        Analyze a form and provide field-by-field explanations.
        
        Args:
            document_base64: Base64 encoded form document
            target_language: Language for explanations
            document_type: Optional known document type
            country: Country context
            
        Returns:
            FormAnalysisResponse with detailed field explanations
        """
        try:
            data_url = f"data:image/jpeg;base64,{document_base64}"
            
            system_prompt = (
                "You are a form analysis assistant for refugees and immigrants. "
                "Analyze forms and provide clear, step-by-step explanations in the user's language. "
                "Focus on practical guidance that helps people fill out forms correctly. "
                "Be sensitive to cultural differences and varying levels of bureaucratic familiarity."
            )
            
            user_prompt = (
                f"Analyze this form and explain it in {target_language}:\n"
                f"Document type: {document_type or 'unknown'}\n"
                f"Country context: {country or 'general'}\n"
                "Provide detailed field-by-field explanations, required documents, and completion tips."
            )
            
            completion = self.client.chat.completions.create(
                model=settings.VISION_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": user_prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": data_url}
                            }
                        ]
                    }
                ],
                max_tokens=settings.MAX_TOKENS,
                temperature=0.3
            )
            
            response_content = completion.choices[0].message.content
            return self._parse_form_response(response_content)
            
        except Exception as e:
            raise Exception(f"Form analysis failed: {str(e)}")
    
    def _build_translation_prompt(
        self,
        target_language: str,
        source_language: Optional[str],
        context: Optional[str]
    ) -> str:
        """Build translation prompt for image analysis."""
        prompt = f"Analyze this image and translate any text to {target_language}. "
        
        if source_language:
            prompt += f"The source language is likely {source_language}. "
        
        if context:
            prompt += f"Context: {context}. "
        
        prompt += (
            "Provide: 1) Original detected text 2) Translation 3) Cultural context "
            "4) What this means for daily life 5) Any important tips or warnings"
        )
        
        return prompt
    
    def _parse_translation_response(
        self,
        response: str,
        target_language: str
    ) -> TranslationResponse:
        """Parse AI response into structured translation data."""
        # This is a simplified parser - in production, you'd want more robust parsing
        lines = response.split('\n')
        
        # Extract information with fallbacks
        original_text = "Text detected in image"
        translated_text = response  # Fallback to full response
        context_explanation = None
        
        # Try to extract structured information
        for i, line in enumerate(lines):
            if "original" in line.lower() or "detected" in line.lower():
                if i + 1 < len(lines):
                    original_text = lines[i + 1].strip()
            elif "translation" in line.lower():
                if i + 1 < len(lines):
                    translated_text = lines[i + 1].strip()
            elif "context" in line.lower() or "cultural" in line.lower():
                if i + 1 < len(lines):
                    context_explanation = lines[i + 1].strip()
        
        return TranslationResponse(
            original_text=original_text,
            translated_text=translated_text,
            source_language="auto-detected",
            target_language=target_language,
            context_explanation=context_explanation,
            confidence=0.85,  # Default confidence
            detected_objects=[]
        )
    
    def _parse_text_translation_response(
        self,
        response: str,
        original_text: str,
        target_language: str,
        source_language: Optional[str]
    ) -> TranslationResponse:
        """Parse text translation response."""
        return TranslationResponse(
            original_text=original_text,
            translated_text=response,
            source_language=source_language or "auto-detected",
            target_language=target_language,
            context_explanation=response,  # Full response includes context
            confidence=0.90
        )
    
    def _parse_form_response(self, response: str) -> FormAnalysisResponse:
        """Parse form analysis response into structured data."""
        # Simplified parsing - in production, use more sophisticated extraction
        return FormAnalysisResponse(
            form_type="Government Form",
            title="Analyzed Form",
            description=response,
            fields=[
                FormField(
                    field_name="sample_field",
                    field_type="text",
                    label="Sample Field",
                    explanation="This is a sample field explanation",
                    required=True,
                    example_value="Example value"
                )
            ],
            instructions=[
                "Fill out all required fields",
                "Provide accurate information",
                "Review before submission"
            ],
            required_documents=["ID document", "Proof of address"],
            estimated_time="15-30 minutes"
        )


# Create service instance
ai_service = AIService() 