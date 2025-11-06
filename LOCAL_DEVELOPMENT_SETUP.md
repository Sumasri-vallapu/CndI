# 🛠️ Local Development Setup Guide

## Connect & Inspire Platform - Local Environment

This guide will help you set up the Connect & Inspire platform for local development and testing new features.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.9+** (Check: `python --version` or `python3 --version`)
- **pip** (Python package manager)
- **Node.js 18+** and **npm** (Check: `node --version` and `npm --version`)
- **Git** (for version control)
- **PostgreSQL** (optional - SQLite works for local development)
- **Code Editor** (VS Code, PyCharm, or your preference)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:Sumasri-vallapu/CndI.git
cd CndI
```

### 2. Backend Setup

#### A. Create Virtual Environment

```bash
cd backend
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\\Scripts\\activate
```

#### B. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### C. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your local settings:
```bash
# Basic Settings
DEBUG=True
SECRET_KEY=your-dev-secret-key-generate-a-new-one

# Database (SQLite for local dev)
DATABASE_URL=sqlite:///db.sqlite3

# Allowed Hosts
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Email Settings (for testing)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
# OR use a test email service:
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your-test-email@gmail.com
# EMAIL_HOST_PASSWORD=your-app-specific-password

# Security (Disable for local dev)
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

**Generate a SECRET_KEY:**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

#### D. Run Migrations

```bash
python manage.py migrate
```

#### E. Create Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

#### F. Generate Usernames for Existing Users (if applicable)

```bash
python manage.py generate_usernames
```

#### G. Run Development Server

```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`
Admin interface: `http://localhost:8000/admin`

---

### 3. Frontend Setup

#### A. Install Dependencies

Open a new terminal window/tab:

```bash
cd frontend
npm install
```

#### B. Configure Environment Variables

1. Copy the development environment file:
```bash
cp .env.example .env.development
```

2. Edit `.env.development`:
```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Connect & Inspire (Dev)
VITE_ENV=development
```

#### C. Run Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🧪 Testing the Setup

1. Open your browser and go to `http://localhost:5173`
2. Try to sign up for a new account
3. Check the backend terminal for email output (if using console backend)
4. Log in with your test account
5. Access admin panel at `http://localhost:8000/admin` with your superuser credentials

---

## 🗂️ Project Structure

```
CndI/
├── backend/              # Django REST API
│   ├── api/             # API endpoints and logic
│   ├── backend/         # Django project settings
│   ├── templates/       # Email templates
│   ├── manage.py        # Django management script
│   ├── requirements.txt # Python dependencies
│   └── .env            # Environment variables (create from .env.example)
├── frontend/            # React + Vite application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── package.json    # Node.js dependencies
│   └── .env.development # Frontend environment variables
├── .gitignore          # Git ignore rules
└── README.md           # Project overview
```

---

## 🔧 Common Development Tasks

### Backend Tasks

#### Create New Django App
```bash
cd backend
python manage.py startapp app_name
```

#### Make Migrations After Model Changes
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Run Tests
```bash
python manage.py test
```

#### Collect Static Files
```bash
python manage.py collectstatic
```

#### Check for Issues
```bash
python manage.py check
```

### Frontend Tasks

#### Install New Package
```bash
cd frontend
npm install package-name
```

#### Build for Production (Testing)
```bash
npm run build
```

#### Run Linter
```bash
npm run lint
```

---

## 🐛 Troubleshooting

### Backend Issues

#### Issue: Module Not Found
**Solution:**
```bash
pip install -r requirements.txt
```

#### Issue: Migration Conflicts
**Solution:**
```bash
python manage.py migrate --fake app_name migration_name
# OR reset database (WARNING: deletes all data)
rm db.sqlite3
python manage.py migrate
```

#### Issue: CORS Errors
**Solution:**
Check that `CORS_ALLOWED_ORIGINS` in `.env` includes `http://localhost:5173`

#### Issue: Port Already in Use
**Solution:**
```bash
# Run on different port
python manage.py runserver 8001
# Update VITE_API_URL in frontend/.env.development accordingly
```

### Frontend Issues

#### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Issue: API Connection Failed
**Solution:**
1. Ensure backend is running on `http://localhost:8000`
2. Check `VITE_API_URL` in `.env.development`
3. Check browser console for CORS errors

---

## 📝 Git Workflow for Development

### Creating a New Feature Branch

```bash
# Make sure you're on main branch and it's up to date
git checkout main
git pull origin main

# Create and switch to a new feature branch
git checkout -b feature/your-feature-name

# Make your changes...

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add: Brief description of your changes"

# Push to remote
git push origin feature/your-feature-name
```

### Best Practices

1. **Never commit to main directly** - Always use feature branches
2. **Keep commits atomic** - One logical change per commit
3. **Write clear commit messages** - Use prefixes:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for modifications
   - `Remove:` for deletions
   - `Refactor:` for code restructuring
4. **Test before committing** - Ensure your code works
5. **Pull before push** - Keep your branch up to date

---

## ⚠️ Important Notes

### Files to NEVER Commit

1. **Virtual Environments**: `.venv/`, `venv/`, `backend/.venv/`
2. **Dependencies**: `node_modules/`, `frontend/node_modules/`
3. **Environment Files**: `.env`, `.env.production` (keep .env.example)
4. **Database Files**: `db.sqlite3`, `*.db`
5. **Build Outputs**: `frontend/dist/`, `frontend/build/`
6. **IDE Files**: `.vscode/`, `.idea/`
7. **Log Files**: `*.log`

**Note:** The `.gitignore` file is already configured to exclude these, but always double-check before committing!

### Current Repository Issues to Fix

⚠️ **IMPORTANT**: The repository currently contains files that should NOT be there:

1. **`.venv/` folder** - This is a virtual environment and should be removed
2. **`node_modules/` folder** - These are dependencies and should be removed

**To clean up:**

```bash
# From the root of the repository

# Remove .venv folder (it's already in .gitignore)
rm -rf .venv/

# Remove node_modules (it's already in .gitignore)
rm -rf node_modules/

# Stage the deletions
git rm -r --cached .venv/ node_modules/

# Commit the cleanup
git commit -m "Remove: .venv and node_modules from repository"

# Push the changes
git push origin main
```

---

## 🚀 Adding New Features

### Backend (Adding New API Endpoint)

1. **Create/Update Models** in `backend/api/models.py`
2. **Make Migrations**: `python manage.py makemigrations`
3. **Apply Migrations**: `python manage.py migrate`
4. **Create Serializers** in `backend/api/serializers.py`
5. **Create Views** in `backend/api/views.py`
6. **Add URLs** in `backend/api/urls.py`
7. **Test** the endpoint using Postman or curl

### Frontend (Adding New Component)

1. **Create Component** in `frontend/src/components/`
2. **Add Routing** (if needed) in `frontend/src/App.jsx`
3. **Connect to API** using axios/fetch in your component
4. **Style** using Tailwind CSS classes
5. **Test** in browser

---

## 📚 Additional Resources

### Django Documentation
- Official Docs: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/

### React + Vite Documentation
- React Docs: https://react.dev/
- Vite Docs: https://vitejs.dev/

### Useful Tools
- **Postman**: For API testing - https://www.postman.com/
- **DB Browser for SQLite**: View your database - https://sqlitebrowser.org/
- **React DevTools**: Browser extension for debugging React

---

## 🎯 Next Steps After Setup

1. ✅ Explore the existing codebase
2. ✅ Run the application and test all features
3. ✅ Read through the API documentation in `API_ENDPOINTS_COMPLETE.md`
4. ✅ Check the deployment guide in `DEPLOYMENT_GUIDE.md`
5. ✅ Set up your development environment completely
6. ✅ Create a feature branch for your work
7. ✅ Start developing!

---

## 💡 Tips for Effective Development

1. **Use separate terminal windows**: One for backend, one for frontend
2. **Enable auto-reload**: Both Django and Vite support hot-reload
3. **Use the Django admin panel**: Great for testing data models
4. **Check browser console**: For frontend debugging
5. **Check terminal output**: For backend errors
6. **Keep dependencies updated**: Regularly update packages
7. **Write tests**: Test your code as you develop
8. **Document your changes**: Update README if you add new features

---

## 🤝 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the error messages carefully
3. Check Django/React documentation
4. Search for the error on Stack Overflow
5. Ask team members for help

---

## ✅ Development Checklist

Before starting development, ensure:

- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Database migrations completed
- [ ] Superuser account created
- [ ] Backend development server running
- [ ] Frontend dependencies installed
- [ ] Frontend .env.development configured
- [ ] Frontend development server running
- [ ] Can access frontend at http://localhost:5173
- [ ] Can access backend admin at http://localhost:8000/admin
- [ ] Tested signup/login flow

---

**Happy Coding! 🎉**

For production deployment, refer to `DEPLOYMENT_GUIDE.md`
