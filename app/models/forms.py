from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any


class FormAnalysisRequest(BaseModel):
    """Request model for form analysis."""
    document: str = Field(description="Base64 encoded PDF or image of form")
    document_type: Optional[str] = Field(default=None, description="Known form type if available")
    target_language: str = Field(description="Language for explanations")
    country: Optional[str] = Field(default=None, description="Country context for form")


class FormField(BaseModel):
    """Model for individual form field."""
    field_name: str = Field(description="Name or identifier of the field")
    field_type: str = Field(description="Type of field (text, checkbox, dropdown, etc.)")
    label: str = Field(description="Field label or description")
    explanation: str = Field(description="User-friendly explanation in target language")
    required: bool = Field(default=False, description="Whether field is required")
    example_value: Optional[str] = Field(default=None, description="Example of acceptable input")
    validation_rules: Optional[List[str]] = Field(default=[], description="Field validation requirements")


class FormAnalysisResponse(BaseModel):
    """Response model for form analysis."""
    form_type: str = Field(description="Detected type of form")
    title: str = Field(description="Form title or purpose")
    description: str = Field(description="Overall form description in target language")
    fields: List[FormField] = Field(description="List of detected form fields")
    instructions: List[str] = Field(description="Step-by-step completion instructions")
    required_documents: List[str] = Field(default=[], description="Required supporting documents")
    estimated_time: Optional[str] = Field(default=None, description="Estimated completion time")
    tips: List[str] = Field(default=[], description="Helpful tips for form completion")


class FormExplanationRequest(BaseModel):
    """Request for explaining specific form field."""
    field_name: str = Field(description="Name of the field to explain")
    field_context: str = Field(description="Context around the field")
    form_type: str = Field(description="Type of form")
    target_language: str = Field(description="Language for explanation")
    user_situation: Optional[str] = Field(default=None, description="User's specific situation")


class FormTemplate(BaseModel):
    """Model for form templates."""
    id: str = Field(description="Template unique identifier")
    name: str = Field(description="Template name")
    country: str = Field(description="Country where form is used")
    category: str = Field(description="Category of form (visa, employment, etc.)")
    description: str = Field(description="Template description")
    field_explanations: Dict[str, Dict[str, str]] = Field(description="Field explanations by language")
    sample_data: Optional[Dict[str, Any]] = Field(default=None, description="Sample data for fields")
    created_at: Optional[str] = Field(default=None, description="Template creation date")
    
    class Config:
        from_attributes = True 