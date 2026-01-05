# MongoDB Implementation Guide

## ✅ Good News: Your Backend is Ready!

Your backend is **100% complete** and ready to use with MongoDB. No code changes needed!

---

## 🚀 Quick Start (30 minutes to production)

### Step 1: Create MongoDB Atlas Account (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Start Free"**
3. Sign up with email or Google
4. Create new project (name: "aidoctalk")

### Step 2: Create MongoDB Cluster (5 minutes)

1. Click **"Create"** under Deployments
2. Choose **"Free"** tier (M0)
3. Select region closest to you
4. Click **"Create Deployment"**
5. Wait for cluster to create (~2 minutes)

### Step 3: Create Database User (2 minutes)

1. Go to **Security** → **Database Access**
2. Click **"Add New Database User"**
3. Username: `aidoctalk_user`
4. Password: Generate secure password (copy it!)
5. Click **"Add User"**

### Step 4: Get Connection String (2 minutes)

1. Go to **Deployments** → Your cluster
2. Click **"Connect"**
3. Choose **"Drivers"**
4. Select **"Node.js"** → Version **4.x or later**
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `aidoctalk`

Should look like:
```
mongodb+srv://aidoctalk_user:PASSWORD@cluster0.abc123.mongodb.net/aidoctalk?retryWrites=true&w=majority
```

### Step 5: Configure Environment Variables (3 minutes)

Create/update `backend/.env`:

```env
# Database
MONGODB_URI=mongodb+srv://aidoctalk_user:PASSWORD@cluster0.abc123.mongodb.net/aidoctalk?retryWrites=true&w=majority

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Server
PORT=5000
NODE_ENV=development
```

### Step 6: Install & Test (5 minutes)

```bash
# Install dependencies
cd backend
npm install

# Test MongoDB connection
npm start
```

Should see:
```
✅ Connected to MongoDB
✅ Server running on port 5000
```

### Step 7: Test Endpoints (10 minutes)

```bash
# Test guest chat (no auth needed)
curl -X POST http://localhost:5000/api/chat/guest \
  -H "Content-Type: application/json" \
  -d '{"message":"What is your consultation fee?"}'

# Should return AI response
```

If you see an AI response, **you're done!** ✅

---

## 📋 Environment Variables Explained

Your `.env` file needs these keys:

### 1. **MongoDB URI**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```
Where:
- `username`: Database user you created
- `password`: Password you set
- `cluster`: From MongoDB Atlas connection string
- `dbname`: Database name (use `aidoctalk`)

### 2. **Firebase Credentials**
Get from Firebase Console → Settings → Service Accounts:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nABC...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@project.iam.gserviceaccount.com
```

### 3. **OpenAI API Key**
Get from https://platform.openai.com/api-keys:
```env
OPENAI_API_KEY=sk-proj-...
```

### 4. **Server Config**
```env
PORT=5000                    # Port to run on
NODE_ENV=development         # development or production
```

---

## 🧪 Complete Testing Guide

### Test 1: Guest Chat (No Authentication)

```bash
curl -X POST http://localhost:5000/api/chat/guest \
  -H "Content-Type: application/json" \
  -d '{"message":"I have a headache for 3 days"}'
```

**Expected Response:**
```json
{
  "success": true,
  "response": "Based on your symptoms..."
}
```

### Test 2: Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@123456",
    "name":"Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "name": "Test User",
    ...
  },
  "token": "eyJhbGc..."
}
```

**Save the `token`** - you'll need it for other tests.

### Test 3: Get User Profile

```bash
# Replace TOKEN with token from Test 2
curl http://localhost:5000/api/auth/user \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**
```json
{
  "_id": "...",
  "email": "test@example.com",
  "name": "Test User",
  "subscribed": false,
  "createdAt": "2025-12-21T..."
}
```

### Test 4: Find Nearby Hospitals

```bash
# Lagos coordinates
curl "http://localhost:5000/api/hospitals/nearby?latitude=6.5244&longitude=3.3792&radius=5"
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "Clinic Lagos",
    "address": "Ikoyi, Lagos",
    "distance": "2.34 km",
    "phone": "+234-800-000-0000",
    ...
  },
  ...
]
```

### Test 5: Create Conversation

```bash
# Replace TOKEN
curl -X POST http://localhost:5000/api/conversations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Initial Consultation"}'
```

**Expected Response:**
```json
{
  "success": true,
  "conversation": {
    "_id": "...",
    "userId": "...",
    "title": "Initial Consultation",
    "messages": [],
    "createdAt": "2025-12-21T..."
  }
}
```

**Save the `_id`** - you'll need it for next test.

### Test 6: Send Message in Conversation

```bash
# Replace TOKEN and CONV_ID
curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId":"CONV_ID",
    "message":"I have a persistent cough"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "conversation": {
    "_id": "...",
    "title": "Initial Consultation",
    "messages": [
      {
        "sender": "user",
        "text": "I have a persistent cough",
        "timestamp": "2025-12-21T..."
      },
      {
        "sender": "assistant",
        "text": "A persistent cough can have several causes...",
        "timestamp": "2025-12-21T..."
      }
    ]
  }
}
```

### Test 7: List All Conversations

```bash
# Replace TOKEN
curl http://localhost:5000/api/conversations \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "title": "Initial Consultation",
    "createdAt": "2025-12-21T..."
  }
]
```

### Test 8: Search Hospitals

```bash
curl "http://localhost:5000/api/hospitals/search?query=clinic"
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "Clinic Lagos",
    "city": "Lagos",
    "specialties": ["General Practice", "Emergency Care"],
    ...
  }
]
```

---

## ✅ Verification Checklist

After setup, verify everything works:

```
Database Connection:
□ npm start shows "Connected to MongoDB"
□ No connection errors in console

Guest Chat:
□ Guest message endpoint works
□ Receives AI response

User Authentication:
□ Can register new user
□ Can login and get token
□ Can fetch user profile

Conversations:
□ Can create conversation
□ Can list conversations
□ Can send/receive messages
□ Messages show AI responses

Hospital Search:
□ Can search by name
□ Can find nearby by location
□ Results show distance

All 17 Endpoints:
□ Test all routes (see API_TESTING.md)
□ All return expected responses
```

---

## 🚀 Deployment Checklist

When ready to deploy:

```
Before Deployment:
□ All tests pass locally
□ .env file configured correctly
□ MongoDB Atlas IP whitelist updated
□ Firebase service account key valid
□ OpenAI API key has credits
□ node_modules installed
□ package.json has all dependencies

Deployment:
□ Choose hosting (Heroku, Railway, Render, etc.)
□ Deploy backend repository
□ Set environment variables on hosting platform
□ Run npm install on server
□ Start server with npm start
□ Test production endpoints
□ Monitor logs for errors

Post-Deployment:
□ All endpoints work in production
□ Database saves data correctly
□ Can create accounts
□ Can chat with AI
□ Hospital search returns results
```

---

## 📦 MongoDB Best Practices

### 1. **Backup Strategy**
MongoDB Atlas includes automatic backups. Enable:
1. Go to **Atlas** → Your project
2. **Backup** tab
3. Enable **Automatic Backup** (free tier gets 7-day retention)

### 2. **Monitoring**
Monitor your database:
1. Go to **Monitoring** tab
2. Watch:
   - Database operations
   - Network traffic
   - Storage usage

### 3. **Scaling**
When you grow:
1. Upgrade cluster tier (M2, M5, M10, etc.)
2. Add read replicas for performance
3. Consider sharding for large datasets

### 4. **Security**
Already configured, but verify:
- ✅ Database user has password
- ✅ IP whitelist includes your server
- ✅ Connections use SSL/TLS
- ✅ Firebase keys stored securely

---

## 🔧 Troubleshooting

### "Cannot Connect to MongoDB"

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
1. Check MongoDB URI in `.env`
2. Verify password is correct (copy exactly from MongoDB Atlas)
3. Verify IP whitelist:
   - Go to **Security** → **Network Access**
   - Add your IP address (click "Add Current IP")
   - For development, you can use `0.0.0.0/0` (allow all - not for production)
4. Check database user exists and is active
5. Ensure cluster is running (check status in MongoDB Atlas)

### "Invalid API Key"

**Problem:** OpenAI API returns 401 error

**Solutions:**
1. Verify API key in `.env` starts with `sk-`
2. Check API key hasn't been revoked
3. Verify account has credits
4. Go to https://platform.openai.com/account/billing/limits to check

### "Firebase Token Invalid"

**Problem:** `Error: Invalid service account`

**Solutions:**
1. Verify Firebase credentials in `.env`
2. Download fresh service account JSON from Firebase Console
3. Copy ENTIRE private key including `-----BEGIN PRIVATE KEY-----`
4. Replace newlines with `\n` in `.env`

### "Conversation Not Found"

**Problem:** Error when sending message to conversation

**Solutions:**
1. Verify conversation ID is correct
2. Verify user owns the conversation
3. Create new conversation if deleted

---

## 📊 MongoDB Atlas Pricing

**Free Tier (M0):**
- 512 MB storage
- Shared RAM
- Perfect for development/testing
- Cost: **FREE**

**Upgrade Options:**
- M2: 2.5 GB, $9/month
- M5: 5 GB, $57/month
- M10: 10 GB, $81/month

**Your usage estimate (10k users):**
- ~500 MB storage
- Stays on FREE tier for months 1-6
- Then upgrade to M2 (~$9/month)

---

## 🎯 Next Steps After MongoDB Setup

1. ✅ **Backend running** - You're here!
2. **Connect Frontend:**
   - Update `src/services/aiService.js` with backend URL
   - Update `src/config/firebase.js` if needed
3. **Test Integration:**
   - Login through frontend
   - Send messages through app
   - Verify data saves to MongoDB
4. **Deploy:**
   - Deploy backend to production
   - Deploy frontend to production
   - Monitor logs

---

## 📚 Full API Reference

See `API_INTEGRATION_GUIDE.md` for complete API documentation with all endpoints.

---

## 💬 Quick Reference

```bash
# Start backend
npm start

# Test guest chat
curl -X POST http://localhost:5000/api/chat/guest \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# View MongoDB databases
# Login to https://cloud.mongodb.com and navigate to your cluster
```

---

## You're Ready! 🚀

Your MongoDB backend is complete and ready to go:
- ✅ 17 API endpoints
- ✅ MongoDB integration
- ✅ Firebase authentication
- ✅ OpenAI chat
- ✅ Hospital geospatial search
- ✅ Error handling

**Next:** Follow the testing guide above, then deploy!
