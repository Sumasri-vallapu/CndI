CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) and all developers working with code in this repository.

Project Structure
This is a full-stack web application with separate frontend and backend directories:

Frontend: React 19 + TypeScript + Vite + Tailwind CSS 4 (mobile-first)

Backend: Django REST API with SQLite database

Production: Deployed with nginx + gunicorn on AWS/server infrastructure

Development Commands
Frontend (React + Vite)
bash
cd frontend
npm install           # Install dependencies
npm run dev           # Start development server (localhost:5173)
npm run build         # Build for production
npm run lint          # Run ESLint
npm run preview       # Preview production build
Backend (Django)
bash
cd backend
python -m venv venv                    # Create virtual environment
source venv/bin/activate               # Activate virtual environment (Linux/Mac)
pip install -r requirements.txt        # Install dependencies
python manage.py runserver             # Start development server (localhost:8000)
python manage.py migrate               # Run database migrations
python manage.py createsuperuser       # Create admin user
python manage.py collectstatic         # Collect static files
Architecture Overview
Frontend Architecture
Modern UI/UX Design: Professional, clean, mobile-first, and responsive

Component structure: Reusable UI components in src/components/, page components in src/pages/

UI Library: ShadCN UI + Radix UI components

State Management: React hooks and context

API Integration: Centralized in src/utils/api.ts

Routing: React Router DOM

Form Handling: React Hook Form + Zod validation

Performance: Lazy loading, code splitting, optimized rendering

Design System: Consistent green palette, modern, accessible

CSS Strategy: Only inline Tailwind CSS. No custom CSS classes for UI (except for global resets).

Backend Architecture
Django REST Framework for APIs

JWT Authentication via djangorestframework_simplejwt

CORS: Frontend on 5173, backend on 8000

AWS S3 for file uploads (via django-storages)

PostgreSQL for production, SQLite for development

Color Palette
✅ Background: #27465C

✅ Button background: white (bg-white)

✅ Button text: black (text-black)

✅ Other text: white (text-white)

✅ Hover on button: optional — light gray on hover added
UI/UX Guidelines
General Principles
Desktop-First: All UI and forms must be designed for mobile by default, scaling up responsively.

Only inline Tailwind CSS: No custom CSS classes for UI, buttons, forms, or layout.

Adaptive Sizing: Use responsive Tailwind classes (sm:, md:, etc.) for widths, paddings, and font sizes.

Accessible: Use semantic HTML, proper labels, and visible focus states.

Consistent Spacing: Use space-y-*, mb-*, p-*, and responsive spacing utilities.

Typography
Font: Use Roboto ('Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif)

Headings: Use font-black (900) for headings.

Body text: Use font-normal (400).

Buttons: Use font-medium (500).

Responsive sizes: Use text-base sm:text-lg for inputs and body, text-2xl or larger for headings.

Accessibility
All inputs must have associated <label>.


Buttons must be keyboard accessible with visible focus.

Maintain sufficient color contrast.

Code Standards
Components: Use functional components with hooks.

Naming: PascalCase for components, camelCase for variables/functions.

TypeScript: Strict mode enabled.

Styling: Only inline Tailwind CSS. No custom CSS except for global resets.

No class components.

No external CSS frameworks beyond Tailwind and Roboto font.

Git & Workflow
Use dev and main branches.

Write clear, descriptive commit messages.

Maintain a clean, readable codebase.

Design Principles
Clean, modern, minimal UI.

Strong visual hierarchy.

Responsive design for mobile, tablet, and desktop.

Smooth hover and focus transitions for interactive elements.

Professional, civic-focused, empowering user experience.

Quick Checklist
 Use only inline Tailwind CSS for all UI.

 Use the green palette for all primary actions.

 Inputs and selects are always w-full and adaptive.

 Forms use max-w-md w-full mx-auto containers.

 No custom CSS classes for UI elements.

 All UI is mobile-first and responsive.

 Accessibility and contrast are always considered.

If any input, select, or button looks abnormal or is not adaptive, check for missing w-full, padding, or responsive classes. Always use the examples above as a reference for new UI work.