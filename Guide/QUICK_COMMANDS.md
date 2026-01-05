# Quick Commands Reference

## Getting Started (First Time)

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file (copy from .env.example)
# Edit with your MongoDB, Firebase, OpenAI keys

# 3. Add Firebase service account key
# Save as: backend/serviceAccountKey.json

# 4. Run backend
npm run dev

# 5. In another terminal, run frontend
npm start
```

## Development Commands

```bash
# Backend development (with auto-reload)
cd backend && npm run dev

# Backend production
cd backend && npm start

# Frontend development
npm start

# Run tests
cd backend && npm test
```

## Database

```bash
# Seed hospitals data
# (Create a script in backend/scripts/seed.js with:)
const Hospital = require('./models/Hospital');
const hospitals = require('./seeds/hospitals');
Hospital.insertMany(hospitals);
```

## Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test guest chat
curl -X POST http://localhost:5000/api/chat/guest \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Test with token (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/user \
  -H "Authorization: Bearer TOKEN"
```

## Debugging

```bash
# Check if MongoDB is running
# (Should see connection log on app start)

# Check if Firebase is initialized
# (Look for logs in console)

# View MongoDB data
# https://cloud.mongodb.com → Select cluster → Collections

# Check Firebase logs
# Firebase Console → Database → Logs

# View Node process
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows
```

## File Locations

```
Frontend: /src
Backend: /backend
Docs: /
  ├── PHASE_1_BACKEND_SUMMARY.md      ← You are here
  ├── TESTING_GUIDE.md                ← How to test
  ├── backend/SETUP.md                ← Setup details
  ├── backend/README.md               ← API reference
  └── API_INTEGRATION_GUIDE.md        ← Full specs
```

## Environment Setup

```bash
# Create .env in backend folder
cat > .env << EOF
MONGODB_URI=your_mongodb_uri
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:3000
EOF
```

## Common Issues

```bash
# Port 5000 already in use?
# Windows: netstat -ano | findstr :5000 && taskkill /PID <PID> /F
# Mac/Linux: lsof -i :5000 && kill -9 <PID>

# MongoDB connection failed?
# Check: Whitelist your IP in MongoDB Atlas

# Firebase error?
# Check: serviceAccountKey.json exists and is valid

# OpenAI error?
# Check: API key is valid and has credits

# CORS error?
# Check: CORS_ORIGIN in .env matches frontend URL
```

## API Endpoints Quick Reference

```bash
# Guest Chat (No Auth)
POST /api/chat/guest
{"message": "Hello"}

# Send Message (With Auth)
POST /api/chat/send
{"message": "Hello", "conversationId": null}

# Get Conversations (With Auth)
GET /api/conversations

# Find Hospitals
GET /api/hospitals/nearby?lat=6.5&lng=3.4

# Search Hospitals
GET /api/hospitals/search?q=cardiology

# Get User Profile (With Auth)
GET /api/users/profile

# Update Profile (With Auth)
PUT /api/users/profile
{"name": "New Name"}
```

## Documentation Links

```
Phase 1 Complete: PHASE_1_BACKEND_SUMMARY.md
Setup Instructions: backend/SETUP.md
API Reference: backend/README.md
Testing Guide: TESTING_GUIDE.md
API Specifications: API_INTEGRATION_GUIDE.md
```

## Status

```
Phase 1 Backend: ✅ COMPLETE
- All endpoints implemented
- All models created
- All services integrated
- Full documentation

Phase 2: In Planning
- Payment integration (Paystack)
- Real-time chat (WebSocket)
- Email notifications
```

## Verify Setup

```bash
# 1. MongoDB connected?
# Check logs: "✅ MongoDB connected"

# 2. Server running?
# Check logs: "🚀 Server running on port 5000"

# 3. Health check works?
curl http://localhost:5000/api/health
# Should return: {"status":"OK",...}

# 4. Frontend can reach backend?
# Check Network tab in DevTools
# POST/GET requests to localhost:5000

# 5. Conversations saving?
# Login, send message, check MongoDB
```

---

**You're all set! Start with: `npm run dev` in backend folder**
