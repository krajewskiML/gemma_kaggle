from pydantic import Field
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # API Configuration
    DEBUG: bool = Field(default=True, description="Enable debug mode")
    HOST: str = Field(default="0.0.0.0", description="API host address")
    PORT: int = Field(default=8000, description="API port number")
    ALLOWED_HOSTS: List[str] = Field(default=["*"], description="CORS allowed hosts")
    
    # Security
    SECRET_KEY: str = Field(default="dev-secret-key-change-in-production-123456789", description="Secret key for JWT tokens")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="JWT token expiration time")
    
    # Database
    DATABASE_URL: str = Field(default="sqlite:///./app.db", description="Database connection URL")
    
    # External APIs
    OPENROUTER_API_KEY: str = Field(default="", description="OpenRouter API key for AI models")
    OPENROUTER_BASE_URL: str = Field(default="https://openrouter.ai/api/v1", description="OpenRouter API base URL")
    
    # AI Model Configuration
    VISION_MODEL: str = Field(default="google/gemma-3n-e4b-it", description="Vision AI model identifier")
    TEXT_MODEL: str = Field(default="google/gemma-3n-e4b-it", description="Text AI model identifier")
    MAX_TOKENS: int = Field(default=1000, description="Maximum tokens for AI responses")
    
    # File Upload
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024, description="Maximum file upload size in bytes")
    ALLOWED_IMAGE_TYPES: List[str] = Field(
        default=["image/jpeg", "image/png", "image/webp"], 
        description="Allowed image MIME types"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings() 