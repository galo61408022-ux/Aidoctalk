#!/bin/bash
# GitHub & Deployment Setup Script
# Run this from the project root: bash deploy-setup.sh

echo "🚀 AI DocTalk - GitHub Setup Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Initialize Git
echo -e "${YELLOW}Step 1: Initializing Git Repository...${NC}"
git init
git add .
git commit -m "Initial commit: AI DocTalk - Telemedicine platform with AI chat"
echo -e "${GREEN}✅ Git initialized with initial commit${NC}"
echo ""

# Step 2: Create .gitignore (if not exists)
echo -e "${YELLOW}Step 2: Setting up .gitignore...${NC}"
if [ ! -f ".gitignore" ]; then
  cat > .gitignore << EOF
# Dependencies
node_modules/
/.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Build outputs
/build
/dist
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Firebase
serviceAccountKey.json

# Testing
coverage/
.nyc_output/

# Misc
*.pem
EOF
  echo -e "${GREEN}✅ .gitignore created${NC}"
else
  echo -e "${GREEN}✅ .gitignore already exists${NC}"
fi
echo ""

# Step 3: Show next steps
echo -e "${YELLOW}Step 3: Next Steps${NC}"
echo ""
echo "1️⃣  Go to: https://github.com/new"
echo "2️⃣  Create new repository named: aidoctalk"
echo "3️⃣  Do NOT initialize with README, .gitignore, or license"
echo "4️⃣  Click 'Create repository'"
echo ""
echo "5️⃣  Copy your repository URL and run:"
echo ""
echo -e "${YELLOW}git remote add origin https://github.com/YOUR-USERNAME/aidoctalk.git${NC}"
echo -e "${YELLOW}git branch -M main${NC}"
echo -e "${YELLOW}git push -u origin main${NC}"
echo ""
echo "6️⃣  Then go to: https://railway.app"
echo "   - Create new project"
echo "   - Select 'Deploy from GitHub repo'"
echo "   - Choose 'aidoctalk' repository"
echo "   - Set root directory to 'backend'"
echo "   - Add environment variables"
echo "   - Deploy!"
echo ""
echo "7️⃣  Then go to: https://vercel.com"
echo "   - Create new project"
echo "   - Import GitHub repository"
echo "   - Add environment variables"
echo "   - Deploy!"
echo ""
echo -e "${GREEN}✅ Setup complete! Follow the steps above to go live.${NC}"
