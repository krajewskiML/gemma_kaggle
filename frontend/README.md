# RefugeeAssist Frontend

A modern React TypeScript application for helping refugees navigate their new environment with AI-powered translation and form assistance.

## Features

- **Text Translation**: Real-time translation with cultural context and pronunciation guides
- **Image Translation**: OCR and translation of text from photos and documents  
- **Form Assistance**: Step-by-step guidance for government forms and official documents
- **Multi-language Support**: 100+ languages with native script display
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: Built with accessibility in mind for all users

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form handling
- **React Dropzone** for file uploads
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

### Environment Variables

Create a `.env.local` file in the root directory:

```
REACT_APP_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout components
│   ├── translation/     # Translation-specific components
│   ├── forms/          # Form assistance components
│   └── ui/             # Reusable UI components
├── pages/              # Main application pages
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

## API Integration

The frontend integrates with the FastAPI backend through:

- **Translation API**: Text and image translation endpoints
- **Forms API**: Document analysis and form template endpoints  
- **Health API**: Backend status monitoring

## Styling

The application uses:

- **Tailwind CSS** for utility-first styling
- **Custom color palette** optimized for accessibility
- **Responsive design** with mobile-first approach
- **Dark mode support** (coming soon)

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new interfaces
3. Include proper error handling and loading states
4. Test on mobile devices and different screen sizes
5. Ensure accessibility standards are met

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - Lint code
- `npm run eject` - Eject from Create React App (irreversible)

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `build/` directory to your web server

3. Configure environment variables for production

## Browser Support

- Chrome 80+
- Firefox 75+ 
- Safari 13+
- Edge 80+

## License

This project is part of the RefugeeAssist platform dedicated to helping refugees navigate their new countries with dignity and confidence.
