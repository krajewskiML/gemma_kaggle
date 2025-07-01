# RefugeeAssist - AI-Powered Multilingual Assistance Platform

> **Empowering refugees with AI-powered translation and form assistance to navigate their new environment with confidence and dignity.**

## 🌟 Features

- **🌍 AI Translation**: Real-time text translation with cultural context for 100+ languages
- **📄 Form Assistance**: Step-by-step guidance for government forms and official documents
- **🎯 Refugee-Focused**: Specifically designed for refugee and immigrant communities
- **🔒 Privacy-First**: Secure processing with no sensitive data storage
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

- **Backend**: FastAPI (Python) - REST API with AI integration
- **Frontend**: React + TypeScript + Material-UI
- **AI Provider**: OpenRouter API for translation services
- **Database**: SQLite (development) / PostgreSQL (production)

## 📋 Prerequisites

- **Python 3.8+** (preferably 3.10 or higher)
- **Node.js 16+** and **npm**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gemma_kaggle
```

### 2. Backend Setup

```bash
# Activate the virtual environment
source .venv/bin/activate  # On macOS/Linux
# OR
.venv\Scripts\activate     # On Windows

# Install Python dependencies (if not already installed)
pip install -r requirements.txt
# OR if using uv
uv sync
```

### 3. Environment Configuration

The application will work with default settings, but for full functionality:

```bash
# Copy and edit environment variables (optional)
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Required for AI translation (get from https://openrouter.ai/)
OPENROUTER_API_KEY=your_api_key_here

# Optional - defaults provided
SECRET_KEY=your-secret-key-change-in-production
DATABASE_URL=sqlite:///./app.db
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

### 5. Run the Application

**Option A: Run Both Services Separately (Recommended)**

Terminal 1 - Backend:
```bash
# Make sure you're in the project root and virtual environment is activated
source .venv/bin/activate
python main.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

**Option B: Run with Background Processes**

```bash
# From project root with activated virtual environment
python main.py &
cd frontend && npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Troubleshooting

### Common Issues

#### ❌ "command not found: python"

**Solution**: Activate the virtual environment first:
```bash
source .venv/bin/activate
python main.py
```

#### ❌ "Something is already running on port 3000"

**Solution**: Kill existing processes and restart:
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Or choose a different port
PORT=3001 npm start
```

#### ❌ "Port 8000 already in use"

**Solution**: Kill existing processes or change port:
```bash
# Kill processes on port 8000
lsof -ti:8000 | xargs kill -9

# Or set different port in .env
PORT=8001
```

#### ❌ Backend validation errors

**Solution**: The app includes sensible defaults. For full functionality, ensure `.env` has:
```env
OPENROUTER_API_KEY=your_actual_api_key
```

#### ❌ Frontend compilation errors

**Solution**: Clear cache and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Checking Service Status

```bash
# Check if backend is running
curl http://localhost:8000/health

# Check if frontend is running
curl -I http://localhost:3000
```

## 📚 API Endpoints

### Backend API (Port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/translate/languages` | GET | Get supported languages |
| `/api/v1/translate/text` | POST | Translate text with context |
| `/api/v1/forms/categories` | GET | Get form categories |
| `/api/v1/forms/analyze` | POST | Analyze uploaded forms |

### Example API Usage

```bash
# Get supported languages
curl http://localhost:8000/api/v1/translate/languages

# Translate text
curl -X POST http://localhost:8000/api/v1/translate/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "source_language": "English",
    "target_language": "Spanish",
    "context": "casual greeting"
  }'
```

## 🛠️ Development

### Project Structure

```
gemma_kaggle/
├── app/                     # Backend application
│   ├── api/v1/             # API routes
│   ├── core/               # Configuration
│   ├── models/             # Pydantic models
│   └── services/           # Business logic
├── frontend/               # React application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── types/          # TypeScript types
├── tests/                  # Backend tests
├── main.py                 # Backend entry point
└── .env                    # Environment variables
```

### Running Tests

```bash
# Backend tests
pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Backend
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm run build
```

## 🌐 Deployment

### Environment Variables for Production

```env
DEBUG=False
SECRET_KEY=your-strong-production-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/refugeeassist
OPENROUTER_API_KEY=your_production_api_key
ALLOWED_HOSTS=["your-domain.com"]
```

### Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the logs in your terminal
3. Ensure all prerequisites are installed
4. Verify environment variables are set correctly

For additional help, please open an issue with:
- Your operating system
- Python and Node.js versions
- Complete error messages
- Steps to reproduce the issue

---

**Built with ❤️ for humanity** - Helping refugees navigate their new beginning with dignity and confidence.
