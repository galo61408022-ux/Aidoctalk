# MongoDB + Backend Deployment Guide

## Option 1: Deploy to Railway (Recommended - Easiest)

Railway is the easiest option. Free tier gives you $5/month credit, which covers hosting.

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Authorize Railway

### Step 2: Create New Project

1. Click **"Create New"**
2. Select **"GitHub Repo"** (or upload manually)
3. Choose your aidoctalk repo
4. Authorize GitHub access

### Step 3: Deploy Backend

1. Click **"Add Service"**
2. Select **"GitHub Repository"**
3. Choose your repo with backend folder
4. Railway auto-detects Node.js ✅

### Step 4: Configure Environment Variables

1. Go to **Variables** tab
2. Add all variables from your `.env`:

```
MONGODB_URI=mongodb+srv://aidoctalk_user:PASSWORD@cluster0.abc123.mongodb.net/aidoctalk
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email
OPENAI_API_KEY=sk-proj-...
PORT=3000
NODE_ENV=production
```

3. Click **"Save"**

### Step 5: Deploy

1. Railway auto-deploys on push
2. Watch logs in **Deployments** tab
3. Get your production URL (looks like `https://your-project-prod.railway.app`)

### Step 6: Test Production

```bash
# Replace with your Railway URL
curl -X POST https://your-project-prod.railway.app/api/chat/guest \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

✅ **Done! Backend is live!**

---

## Option 2: Deploy to Heroku

**Note:** Heroku free tier ended November 2022. Now starts at $7/month.

### Step 1: Create Heroku Account

1. Go to https://www.heroku.com
2. Sign up
3. Verify email

### Step 2: Create New App

1. Dashboard → **"Create New App"**
2. Name: `aidoctalk-api`
3. Region: Europe (or your region)
4. Click **"Create"**

### Step 3: Connect GitHub

1. Go to **Deploy** tab
2. Click **"GitHub"**
3. Authorize Heroku access
4. Search for your repo
5. Click **"Connect"**

### Step 4: Add Environment Variables

1. Go to **Settings** tab
2. Click **"Reveal Config Vars"**
3. Add each variable from your `.env`
4. Click **"Add"** for each

### Step 5: Deploy

1. Go back to **Deploy** tab
2. Scroll to **"Manual Deploy"**
3. Select branch `main`
4. Click **"Deploy Branch"**
5. Wait for build to complete

### Step 6: Get Production URL

1. Click **"Open App"**
2. URL is `https://aidoctalk-api.herokuapp.com`

### Step 7: Test

```bash
curl -X POST https://aidoctalk-api.herokuapp.com/api/chat/guest \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

✅ **Done!**

---

## Option 3: Deploy to Render

Similar to Railway, good alternative.

### Step 1: Create Account

1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create Web Service

1. Dashboard → **"New +"** → **"Web Service"**
2. Connect GitHub repository
3. Select repo and branch

### Step 3: Configure

1. Name: `aidoctalk-api`
2. Runtime: `Node`
3. Build Command: `npm install`
4. Start Command: `npm start`

### Step 4: Set Environment Variables

1. Scroll to **"Environment"**
2. Add all variables from `.env`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Get URL from dashboard

✅ **Done!**

---

## Update Frontend to Use Production Backend

Once backend is deployed, update your frontend:

### In `src/services/aiService.js`

```javascript
// OLD (local)
const API_URL = 'http://localhost:5000/api';

// NEW (production)
const API_URL = 'https://your-production-url/api';
```

### In `src/context/AuthContext.jsx`

```javascript
// OLD (local)
const API_URL = 'http://localhost:5000/api';

// NEW (production)
const API_URL = 'https://your-production-url/api';
```

### Rebuild Frontend

```bash
npm run build
npm run deploy
```

---

## Verify Everything Works

### Test 1: Guest Chat

```bash
curl -X POST https://your-backend-url/api/chat/guest \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

### Test 2: Login Through Frontend

1. Go to your frontend URL
2. Click "Login/Register"
3. Create test account
4. Send a message
5. Verify message appears in app

### Test 3: Check MongoDB

1. Go to MongoDB Atlas
2. Collections → View data
3. Verify `conversations` has messages
4. Verify `users` has new user

✅ **Everything working!**

---

## Monitoring & Maintenance

### Check Logs

**Railway:**
- Go to **Deployments**
- Click on active deployment
- View logs in real-time

**Heroku:**
```bash
heroku logs --tail --app aidoctalk-api
```

**Render:**
- Go to your service
- View logs in **Logs** tab

### Monitor Database

1. Go to MongoDB Atlas
2. **Monitoring** tab
3. Watch:
   - Operations per second
   - Network bytes
   - Storage used

### Auto-scaling

**Railway:**
- Under construction, but planned

**Heroku:**
- Dynos → Configure auto-scaling

**Render:**
- Native auto-scaling based on CPU/memory

---

## Common Issues & Solutions

### "502 Bad Gateway"

**Problem:** Backend crashed or not starting

**Solutions:**
1. Check logs (see Monitoring above)
2. Verify all environment variables are set
3. Verify MongoDB connection string is correct
4. Restart service

**Restart:**

**Railway:**
- Deployments → Click service → "Redeploy"

**Heroku:**
```bash
heroku dyno:restart --app aidoctalk-api
```

**Render:**
- Manual Deploys → Click "Deploy" again

### "Cannot Connect to MongoDB"

**Problem:** Connection string issue

**Solutions:**
1. Verify `MONGODB_URI` in environment variables
2. Check MongoDB Atlas IP whitelist includes server IP
   - Go to **Security** → **Network Access**
   - Click **"Allow All"** (or add specific IP)
3. Verify database user still exists
4. Test connection string locally first

### "Timeout Error"

**Problem:** Requests taking too long

**Common causes:**
1. MongoDB Atlas cluster overloaded
2. OpenAI API slow
3. Network latency

**Solutions:**
1. Upgrade MongoDB tier (M2)
2. Upgrade server tier (more RAM/CPU)
3. Check Network tab in browser for slow requests

---

## Cost Summary

**Monthly Costs (estimated):**

| Service | Cost |
|---------|------|
| MongoDB Atlas | FREE (M0 tier) |
| Railway | FREE (with $5 credit) |
| Firebase | FREE (auth only) |
| OpenAI | $5-20 (depends on usage) |
| **TOTAL** | **$5-20/month** |

---

## Security Checklist

Before production:

```
MongoDB:
□ Database user has strong password
□ IP whitelist is restrictive (not 0.0.0.0/0)
□ Automatic backups enabled

Firebase:
□ Service account key is private
□ Security rules are configured
□ Only backend can access

OpenAI:
□ API key is secret
□ Usage limits set
□ API key rotated every 90 days

Backend:
□ HTTPS/SSL enabled
□ Environment variables are secret
□ No hardcoded secrets
□ CORS configured correctly
□ Rate limiting enabled

Frontend:
□ HTTPS/SSL enabled
□ Backend URL uses HTTPS
□ Sensitive data not logged
□ Tokens stored securely
```

---

## Next Phase: Connect Frontend

Once backend is deployed:

1. **Update Frontend URLs**
   - All API calls point to production backend
   - Update config files

2. **Build Frontend**
   - `npm run build`

3. **Deploy Frontend**
   - Deploy to Vercel (recommended)
   - Deploy to Netlify
   - Deploy to your hosting

4. **Test Full Stack**
   - Frontend → Backend → MongoDB
   - All features working

---

## Deployment Checklist

```
Pre-Deployment:
□ All tests pass locally
□ No console errors
□ .env variables correct
□ MongoDB Atlas is running
□ Firebase project active
□ OpenAI API has credits

During Deployment:
□ Environment variables set
□ Build completes successfully
□ App starts without errors
□ Logs show "Connected to MongoDB"

Post-Deployment:
□ Guest chat endpoint works
□ Can register new user
□ Can login and create conversation
□ Can send messages
□ Hospitals search returns results
□ Database saving data correctly

Monitoring:
□ Set up log monitoring
□ Set up error tracking
□ Set up uptime monitoring
□ Plan backup strategy
```

---

## You're Ready! 🚀

Your backend is now:
- ✅ Running in production
- ✅ Connected to MongoDB
- ✅ Ready for users
- ✅ Monitoring enabled
- ✅ Secure and scalable

**Next:** Deploy frontend and connect it to production backend!
