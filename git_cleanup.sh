#!/bin/bash

# Git Cleanup Script
# Removes Claude-generated and temporary files from git tracking
# while preserving important production documentation

set -e

echo "======================================"
echo "  Git Repository Cleanup"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}This script will remove the following files from git tracking:${NC}"
echo ""
echo "Temporary Guide Files:"
echo "  - FAKE_DATA_GUIDE.md"
echo "  - FRONTEND_MIGRATION_GUIDE.md"
echo "  - LOCAL_TESTING_GUIDE.md"
echo "  - PRODUCTION_DEPLOYMENT_GUIDE.md (duplicate)"
echo "  - PRODUCTION_READY_CHANGES.md (old version)"
echo "  - QUICK_FIX_GUIDE.md"
echo "  - SIGNUP_LOGIN_TEST_REPORT.md"
echo "  - TYPESCRIPT_FIXES.md"
echo "  - VERIFICATION_CODE_FIX.md"
echo "  - new-user-flow-summary.md"
echo ""
echo "Temporary Files:"
echo "  - .gitignore_updates.txt"
echo "  - AboutusUI.jsx"
echo "  - EXAMPLE_HostSignup_Updated.tsx"
echo ""
echo -e "${GREEN}Files that will be KEPT:${NC}"
echo "  ✓ README.md"
echo "  ✓ DEPLOYMENT_GUIDE.md"
echo "  ✓ PRODUCTION_READY_CHECKLIST.md"
echo "  ✓ QUICK_DEPLOY.md"
echo "  ✓ PRODUCTION_UPDATES.md"
echo "  ✓ All deployment scripts"
echo "  ✓ All .env.example files"
echo ""

read -p "Continue with cleanup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cleanup cancelled."
    exit 1
fi

echo -e "${YELLOW}Starting cleanup...${NC}"

# Remove temporary guide files from git tracking
echo "Removing temporary guide files..."
git rm --cached -f FAKE_DATA_GUIDE.md 2>/dev/null || true
git rm --cached -f FRONTEND_MIGRATION_GUIDE.md 2>/dev/null || true
git rm --cached -f LOCAL_TESTING_GUIDE.md 2>/dev/null || true
git rm --cached -f PRODUCTION_DEPLOYMENT_GUIDE.md 2>/dev/null || true
git rm --cached -f PRODUCTION_READY_CHANGES.md 2>/dev/null || true
git rm --cached -f QUICK_FIX_GUIDE.md 2>/dev/null || true
git rm --cached -f SIGNUP_LOGIN_TEST_REPORT.md 2>/dev/null || true
git rm --cached -f TYPESCRIPT_FIXES.md 2>/dev/null || true
git rm --cached -f VERIFICATION_CODE_FIX.md 2>/dev/null || true
git rm --cached -f new-user-flow-summary.md 2>/dev/null || true

# Remove temporary example files
echo "Removing temporary example files..."
git rm --cached -f AboutusUI.jsx 2>/dev/null || true
git rm --cached -f EXAMPLE_HostSignup_Updated.tsx 2>/dev/null || true
git rm --cached -f .gitignore_updates.txt 2>/dev/null || true

# Remove node_modules if tracked (should never be tracked)
echo "Checking for node_modules..."
if git ls-files | grep -q "node_modules/"; then
    echo "Removing node_modules from git tracking..."
    git rm -r --cached node_modules/ 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}======================================"
echo "  Cleanup Complete!"
echo "======================================${NC}"
echo ""
echo "Next steps:"
echo "1. Review changes: git status"
echo "2. Commit changes: git add .gitignore && git commit -m 'Clean up repository and update .gitignore'"
echo "3. Push to remote: git push origin main"
echo ""
echo "Important files preserved:"
echo "  ✓ All production documentation"
echo "  ✓ All deployment scripts"
echo "  ✓ All source code"
echo "  ✓ All environment examples"
echo ""
