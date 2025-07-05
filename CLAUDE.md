# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack web application with separate frontend and backend directories:

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4 mobile-first application
- **Backend**: Django REST API with SQLite database
- **Production**: Deployed with nginx + gunicorn on AWS/server infrastructure

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install           # Install dependencies
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (Django)
```bash
cd backend
python -m venv venv                    # Create virtual environment
source venv/bin/activate              # Activate virtual environment (Linux/Mac)
pip install -r requirements.txt       # Install dependencies
python manage.py runserver            # Start development server (localhost:8000)
python manage.py migrate              # Run database migrations
python manage.py createsuperuser      # Create admin user
python manage.py collectstatic        # Collect static files
```

## Architecture Overview

### Frontend Architecture
- **Modern UI/UX Design**: Professional, clean design with emphasis on modularity, responsiveness, maintainability, and performance
- **Mobile-first design** with responsive layouts using Tailwind CSS 4
- **Component structure**: Reusable UI components in `src/components/`, page components in `src/pages/`
- **UI Library**: ShadCN UI + Radix UI components
- **State Management**: React hooks and context
- **API Integration**: Centralized API configuration in `src/utils/api.ts`
- **Routing**: React Router DOM for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Performance Optimization**: Lazy loading, code splitting, and optimized rendering patterns
- **Scalable Architecture**: Modular component design with clear separation of concerns
- **Design System**: Clean, professional interface with consistent gradient backgrounds and glass morphism effects
- **Responsive Design**: Fully adaptive UI with proper breakpoints for mobile, tablet, and desktop
- **CSS Strategy**: Inline Tailwind CSS for consistency and maintainability

### Backend Architecture  
- **Django REST Framework** for API endpoints
- **JWT Authentication** via `djangorestframework_simplejwt`
- **CORS Configuration** for frontend integration
- **AWS S3 Integration** via `django-storages` for file uploads
- **PostgreSQL** for production, SQLite for development

### Key Integration Points
- **API Base URL**: `https://clearmyfile.com/api` (production), `http://localhost:8000/api` (development)
- **CORS Setup**: Frontend runs on port 5173, backend on port 8000
- **Authentication Flow**: OTP-based login with JWT tokens
- **File Uploads**: Profile photos and documents handled via S3

## Production Deployment

The application is deployed using:
- **nginx** as reverse proxy serving static files and routing API requests
- **gunicorn** as WSGI server for Django backend
- **SSL/TLS** certificates managed via certbot
- **Process management** via systemctl

Common production commands are documented in `backend_common_commands.txt`.

## Code Conventions

Frontend
Use functional components with hooks (no class components).

Follow Tailwind CSS v4 conventions with mobile-first design using inline classes only.

Typography:

Font: Use Roboto ('Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif) loaded via Google Fonts.

Weights:

Headings: font-black (900) to simulate Netflix Sans Black.

Body text: font-normal (400) for readability.

Buttons: font-medium (500) for emphasis.

Color Palette:

Background: #f7fafc (bg-[#f7fafc]) for main container and body.

Heading text: #121212

Body text: #23234c

Buttons:

Primary: #243c80 → hover #1a2b5d

Secondary: #0770E3 → hover #0665c0

UI Components:

Container: Rounded card (rounded-lg), padding (p-12), shadow (shadow-lg), max width (max-w-md).

Heading: Large (text-5xl), bold, proper color.

Body text: Medium size (text-xl), readable color.

Buttons:

Use px-8 py-3, rounded-lg, shadow, smooth transition (transition duration-200), hover states.

Text white on buttons for contrast.

Design Principles:

Clean, modern, minimal UI with strong visual hierarchy.

Responsive design: ensure proper scaling on mobile, tablet, and desktop.

Smooth hover and focus transitions for interactive elements.

Code Standards:

Use PascalCase for component names, camelCase for variables/functions.

TypeScript strict mode enabled.

Use inline Tailwind classes only; no external CSS except font and base resets.

Accessibility:

Ensure WCAG 2.1 AA compliance.

Maintain contrast ratios on text/buttons.

Buttons must be keyboard accessible with visible focus states.

Backend
Follow Django best practices: models, serializers, views properly separated.

RESTful API with consistent response structures.

Use environment-based configuration for dev, staging, production.

Implement meaningful error handling with correct HTTP status codes.

Important Notes
The UI style is designed for ClearMyFile India platform: clean, civic-focused, professional.

Design aims to empower users while keeping experience simple and direct.

No class components or external CSS frameworks beyond Tailwind + Roboto.

Maintain git flow: use dev and main branches with clear commit messages.

Use only inline tailwind css