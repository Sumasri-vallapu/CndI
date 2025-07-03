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
- **Mobile-first design** with responsive layouts using Tailwind CSS 4
- **Component structure**: Reusable UI components in `src/components/`, page components in `src/pages/`
- **UI Library**: ShadCN UI + Radix UI components
- **State Management**: React hooks and context
- **API Integration**: Centralized API configuration in `src/utils/api.ts`
- **Routing**: React Router DOM for client-side routing
- **Form Handling**: React Hook Form with Zod validation

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

### Frontend
- Use **functional components with hooks** (no class components)
- Follow **Tailwind CSS v4 conventions** with mobile-first responsive design
- **PascalCase** for components, **camelCase** for variables/functions
- **TypeScript strict mode** enabled
- API calls centralized in utils/api.ts with typed endpoints

### Backend
- Follow **Django best practices** with proper model-view-serializer structure
- **RESTful API design** with consistent response formats
- **Environment-based configuration** for different deployment stages
- **Proper error handling** with meaningful HTTP status codes

## Important Notes

- The project name references "clearmyfile" in various places but the codebase is for a different application
- Frontend uses comprehensive API endpoint definitions for a social/educational platform
- Backend has minimal API implementation compared to frontend expectations
- Development workflow follows git flow with dev/main branch structure