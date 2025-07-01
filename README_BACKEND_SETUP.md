# 🚀 Refugee Assistance API - Backend Setup

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies
uv sync

# Or if you prefer pip
pip install -e .
```

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
# Copy example environment file
cp .env.example .env
```

Required environment variables:
```env
SECRET_KEY=your-super-secret-key-change-this-in-production
OPENROUTER_API_KEY=your-openrouter-api-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/refugee_assistance
```

### 3. Run the API

```bash
# Development server with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Test the API

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_translation_api.py -v
```

### 5. API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🧪 Testing

### Test Image Translation

```bash
curl -X POST "http://localhost:8000/api/v1/translate/image" \
  -H "Content-Type: multipart/form-data" \
  -F "target_language=Spanish" \
  -F "image=@/path/to/your/image.jpg"
```

### Test Text Translation

```bash
curl -X POST "http://localhost:8000/api/v1/translate/text" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "target_language": "Spanish",
    "source_language": "English"
  }'
```

### Test Form Analysis

```bash
curl -X POST "http://localhost:8000/api/v1/forms/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "target_language=English" \
  -F "country=US" \
  -F "document=@/path/to/your/form.pdf"
```

## 📁 Project Structure

```
app/
├── api/
│   └── v1/
│       ├── endpoints/
│       │   ├── translation.py    # Translation endpoints
│       │   ├── forms.py          # Form analysis endpoints
│       │   └── health.py         # Health check endpoints
│       └── router.py             # Main API router
├── core/
│   └── config.py                 # Configuration settings
├── models/
│   ├── translation.py            # Translation schemas
│   └── forms.py                  # Form analysis schemas
└── services/
    └── ai_service.py             # AI/ML service integration

tests/
├── conftest.py                   # Test configuration
├── test_translation_api.py       # Translation tests
├── test_forms_api.py             # Forms tests
└── test_health_api.py            # Health check tests
```

## 🔧 Development

### Adding New Endpoints

1. Create new endpoint file in `app/api/v1/endpoints/`
2. Add router to `app/api/v1/router.py`
3. Create corresponding Pydantic models in `app/models/`
4. Add service logic in `app/services/`
5. Write tests in `tests/`

### AI Model Configuration

Currently configured to use Google Gemma via OpenRouter. To change models:

```python
# In .env file
VISION_MODEL=anthropic/claude-3-haiku
TEXT_MODEL=openai/gpt-4-turbo
```

Available models depend on your OpenRouter subscription.

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Make sure you're in the project root and dependencies are installed
2. **Missing Environment Variables**: Check `.env` file exists and has required variables
3. **API Key Issues**: Verify your OpenRouter API key is valid and has sufficient credits
4. **Port Conflicts**: Change port in `.env` if 8000 is in use

### Debug Mode

Set `DEBUG=true` in `.env` to enable:
- Detailed error messages
- Auto-reload on code changes
- API documentation at /docs

## 📊 Monitoring

Health check endpoints:
- `/health` - Basic health status
- `/api/v1/health/status` - Detailed status with configuration
- `/api/v1/health/readiness` - Readiness for traffic
- `/api/v1/health/liveness` - Application alive check

## 🚀 Next Steps

1. Set up database (PostgreSQL)
2. Implement user authentication
3. Add more AI models/providers
4. Set up logging and monitoring
5. Deploy to production environment 