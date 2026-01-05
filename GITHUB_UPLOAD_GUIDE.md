# ✅ Secure GitHub Upload - Pre-Deployment Checklist

Since you **haven't pushed to GitHub yet**, you're in a perfect position to set up security correctly from the start!

---

## 🛡️ STEP 1: Create .gitignore (DO THIS FIRST)

Create this file in your project root to prevent accidental credential uploads:

**File:** `.gitignore`
```bash
# Environment variables - NEVER commit these
.env
.env.local
.env.*.local
.env.production.local

# Node modules
node_modules/
npm-debug.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnp
.pnp.js

# Build files
build/
dist/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Private keys
serviceAccountKey.json
*.pem

# Testing
coverage/
.nyc_output/

# Misc
.env.test
.cache/
```

---

## 🔑 STEP 2: Separate Frontend & Backend Secrets

### Frontend `.env.local` (Git-ignored):
```env
# Local Development Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000

# Firebase Configuration (PUBLIC - safe to expose)
REACT_APP_FIREBASE_API_KEY=AIzaSyCeG4ZKmE2o3JO7Pv1XXDx72yM0uzpUgWQ
REACT_APP_FIREBASE_AUTH_DOMAIN=aidoctalk-d4a4b.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=aidoctalk-d4a4b
REACT_APP_FIREBASE_STORAGE_BUCKET=aidoctalk-d4a4b.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=370045783214
REACT_APP_FIREBASE_APP_ID=1:370045783214:web:ba157d12b30dd90f05b13f

# AI Service Configuration
REACT_APP_OPENAI_API_KEY=

# Payment Configuration - Paystack PUBLIC KEY ONLY (public, safe)
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_078418e9cc36da23751a6166bc8f1d785f4eb04e

# Environment
REACT_APP_ENV=development
```

### Backend `backend/.env.local` (Git-ignored):
```env
# Database
MONGODB_URI=mongodb+srv://galo61408022_db_user:tEystI6ZGHHPxj7I@cluster0.opk0yhl.mongodb.net/?appName=Cluster0

# Server
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# AI
OPENAI_API_KEY=your-openai-api-key

# Security
JWT_SECRET=your-jwt-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000

# Paystack - SECRET KEY (never commit)
PAYSTACK_SECRET_KEY=sk_test_e126eb5faf466d974fe4e01d694c41a05ffcb345
PAYSTACK_PUBLIC_KEY=pk_test_078418e9cc36da23751a6166bc8f1d785f4eb04e
```

---

## 📄 STEP 3: Create Template Files (CAN be committed)

### `.env.example` (Frontend - safe to commit):
```env
# Local Development Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# AI Service Configuration
REACT_APP_OPENAI_API_KEY=

# Payment Configuration
REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Environment
REACT_APP_ENV=development
```

### `backend/.env.example` (Backend - safe to commit):
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Server
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# AI
OPENAI_API_KEY=your-openai-api-key

# Security
JWT_SECRET=your-jwt-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

---

## 🚀 STEP 4: Prepare for GitHub Upload

### Commands to run:

```bash
# 1. Create .gitignore
echo "" > .gitignore
# (Add content from Step 1 above)

# 2. Create example files
cp .env .env.example              # Frontend
cp backend/.env backend/.env.example  # Backend

# 3. Remove real secrets from tracked files
# Edit .env and backend/.env to remove real values

# 4. Initialize git
git init
git add .gitignore .env.example backend/.env.example README.md package.json
git add src/ public/ backend/ --force   # Force add if needed
git commit -m "Initial commit: AI DocTalk telemedicine app"

# 5. Create GitHub repo (via web browser)
# Go to https://github.com/new
# Create repo: aidoctalk
# Copy the commands GitHub shows

# 6. Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/aidoctalk.git
git branch -M main
git push -u origin main
```

---

## ✅ SAFETY CHECKLIST BEFORE PUSHING

Before running `git push`:

- [ ] Created `.gitignore` in root
- [ ] `.env` is in `.gitignore`
- [ ] `backend/.env` is in `.gitignore`
- [ ] Created `.env.example` (safe, no real values)
- [ ] Created `backend/.env.example` (safe, no real values)
- [ ] Ran `git status` and confirmed `.env` files NOT listed
- [ ] Ran `git log -p` to verify no credentials in commits
- [ ] `.env.local` file exists with real credentials (local only)

**Command to verify:**
```bash
git status
# Should NOT show .env or backend/.env
```

---

## 📱 After GitHub Upload - Production Setup

For **Railway** (backend):
```
1. Go to railway.app
2. Create new project
3. Connect GitHub repo
4. Click "Add Variables" for each .env variable:
   - MONGODB_URI
   - PAYSTACK_SECRET_KEY
   - FIREBASE_PROJECT_ID
   - etc.
5. Deploy!
```

For **Vercel** (frontend):
```
1. Go to vercel.com
2. Create new project
3. Import from GitHub
4. Add environment variables:
   - REACT_APP_API_URL (use Railway backend URL)
   - REACT_APP_PAYSTACK_PUBLIC_KEY
   - etc.
5. Deploy!
```

---

## 🔐 What's Safe to Commit vs. Not Safe

### ✅ SAFE TO COMMIT:
- `.env.example` (template with dummy values)
- `package.json` (no secrets)
- Source code
- Configuration files
- Documentation

### ❌ NEVER COMMIT:
- `.env` (actual secrets)
- `.env.local` (actual secrets)
- `backend/.env` (actual secrets)
- Private API keys
- Database passwords
- Paystack secret key
- Firebase private key
- AWS keys
- Any authentication tokens

---

## 📋 File Structure After Setup

```
aidoctalk/
├── .gitignore              ✅ Commit this
├── .env.example            ✅ Commit this (safe template)
├── .env.local              ❌ DON'T commit (add to .gitignore)
├── README.md               ✅ Commit this
├── package.json            ✅ Commit this
├── src/                    ✅ Commit this
├── public/                 ✅ Commit this
│
└── backend/
    ├── .env.example        ✅ Commit this (safe template)
    ├── .env.local          ❌ DON'T commit (add to .gitignore)
    ├── package.json        ✅ Commit this
    ├── server.js           ✅ Commit this
    ├── models/             ✅ Commit this
    ├── routes/             ✅ Commit this
    └── middleware/         ✅ Commit this
```

---

## 🎯 Your Action Items (Right Now):

1. ✅ Create `.gitignore` with content above
2. ✅ Fix frontend `.env` - remove Paystack secret key (should be public key only)
3. ✅ Rename `.env` files to `.env.local`
4. ✅ Create `.env.example` templates
5. ✅ Run `git init` + first commit
6. ✅ Create GitHub repo
7. ✅ Push to GitHub

**Time needed:** ~15 minutes  
**Difficulty:** Easy  
**Risk if skipped:** Credentials exposed publicly 🚨

---

Need help with any of these steps? 🚀
