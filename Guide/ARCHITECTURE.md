# Phase 1: Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ GuestChat │ LoggedInChat │ HospitalLocator │ AuthScreen  │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │       AuthContext + Services Layer                       │   │
│  │  (aiService, authService, locationService)              │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
└───────────────────────┼───────────────────────────────────────────┘
                        │ HTTP/HTTPS
                        │ Firebase Token
                        │
        ┌───────────────▼──────────────────┐
        │   Express.js Backend API         │
        │   (localhost:5000)               │
        ├──────────────────────────────────┤
        │ Routes:                          │
        │  • /auth (register, profile)     │
        │  • /chat (send, guest)           │
        │  • /conversations (CRUD)         │
        │  • /hospitals (search)           │
        │  • /users (profile, subscription)│
        └────────┬──────────┬──────┬───────┘
                 │          │      │
        ┌────────▼──┐   ┌────▼──┐ │
        │ Middleware│   │Services│ │
        │  • Auth   │   │ • AI   │ │
        │  • Error  │   │ • Auth │ │
        └────────┬──┘   └────┬──┘ │
                 │           │    │
        ┌────────▼───────────▼────▼────────┐
        │    External Services             │
        ├─────────────────────────────────┤
        │ • Firebase Admin SDK             │
        │ • MongoDB Atlas                  │
        │ • OpenAI API (GPT-3.5)           │
        └─────────────────────────────────┘
```

## Data Flow

### Guest Chat Flow
```
User Input
    ↓
[Frontend] → POST /api/chat/guest
    ↓
[Backend] → OpenAI API
    ↓
OpenAI Response
    ↓
[Backend] → JSON Response
    ↓
[Frontend] → Display message
```

### Authenticated Chat Flow
```
User Input + Firebase Token
    ↓
[Frontend] → POST /api/chat/send
    ↓
[Backend] Verify Firebase Token
    ↓
Fetch Conversation from MongoDB
    ↓
Send Messages to OpenAI
    ↓
Save to MongoDB Conversation
    ↓
[Backend] → JSON Response
    ↓
[Frontend] → Display + Save locally
```

### Login Flow
```
User Credentials
    ↓
[Frontend] → Firebase signInWithEmailAndPassword()
    ↓
Firebase Auth ✓
    ↓
Get Firebase Token
    ↓
[Frontend] → POST /api/auth/register (with token)
    ↓
[Backend] Verify Token
    ↓
Create/Update User in MongoDB
    ↓
Response with User Data
    ↓
[Frontend] → Set AuthContext
    ↓
Redirect to LoggedInChat
```

## Database Schema Relationships

```
┌──────────────┐
│    Users     │
├──────────────┤
│ _id (MongoDB)│
│ firebaseUid  │ ◄──┐
│ name         │    │
│ email        │    │
│ subscribed   │    │
│ createdAt    │    │
└──────────────┘    │
                    │
                    │ References
                    │
┌──────────────────┐│
│ Conversations    ││
├──────────────────┤│
│ _id              ││
│ userId ──────────┘
│ title            │
│ messages[ ]      │ Array of messages
│ createdAt        │
│ updatedAt        │
└──────────────────┘

┌──────────────┐
│  Hospitals   │
├──────────────┤
│ _id          │
│ name         │
│ address      │
│ coordinates  │
│ rating       │
│ specialties[]│
│ phone        │
│ hours        │
└──────────────┘
```

## Request/Response Cycle

### Example: Send Message

```
FRONTEND
├─ Get Firebase token
└─ POST /api/chat/send
   Headers: {
     Authorization: "Bearer firebase_token",
     Content-Type: "application/json"
   }
   Body: {
     message: "I have a headache",
     conversationId: null
   }

BACKEND
├─ Middleware: Verify Firebase token
├─ Route: /api/chat/send
├─ Service: aiService.generateResponse()
│  └─ Call OpenAI API
│     Return: "A headache could be..."
├─ Save messages to MongoDB
└─ Response:
   {
     conversationId: "507f...",
     aiMessage: {
       sender: "ai",
       text: "A headache could be...",
       timestamp: "2024-01-17T..."
     },
     fullConversation: {...}
   }

FRONTEND
└─ Display message
```

## Service Dependencies

```
server.js (Entry Point)
    ↓
    ├─ Express App Setup
    ├─ MongoDB Connection
    ├─ Routes Registration
    │   ├─ auth.js
    │   │   └─ authService.js
    │   ├─ chat.js
    │   │   └─ aiService.js
    │   │       └─ OpenAI API
    │   ├─ conversations.js
    │   │   └─ MongoDB Conversation
    │   ├─ hospitals.js
    │   │   └─ MongoDB Hospital
    │   └─ users.js
    │       └─ MongoDB User
    └─ Error Handler
        └─ Global error middleware
```

## Authentication Flow

```
┌────────────────────────────────────────────┐
│ FRONTEND SIGNUP/LOGIN                      │
│ 1. User enters credentials                 │
│ 2. Firebase.signup() or Firebase.login()   │
│ 3. Get Firebase ID Token                   │
│ 4. Store token in localStorage             │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ API REQUESTS                               │
│ 1. Add token to Authorization header       │
│ 2. POST request with token                 │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│ BACKEND VERIFICATION                       │
│ 1. Middleware: Extract token               │
│ 2. Firebase.verifyIdToken(token)           │
│ 3. Get user.uid from decoded token         │
│ 4. Find/Create user in MongoDB             │
│ 5. Proceed with request or reject          │
└────────────────────────────────────────────┘
```

## Error Handling Flow

```
Request
   ↓
Route Handler
   ↓
   ├─ Success → Response with 200/201
   │
   └─ Error
      ├─ Validation Error
      │  └─ 400 + Error details
      │
      ├─ Auth Error
      │  └─ 401 + "Invalid token"
      │
      ├─ Not Found Error
      │  └─ 404 + "Resource not found"
      │
      └─ Server Error
         └─ 500 + Error message
            └─ Global Error Handler
               └─ Log to console
               └─ Hide stack in production
               └─ Send safe response
```

## Performance Architecture

```
┌─────────────────────┐
│ Request            │
└────────────┬────────┘
             ↓
┌─────────────────────┐
│ Express Middleware  │ ← CORS, JSON parsing
└────────────┬────────┘
             ↓
┌─────────────────────┐
│ Auth Verification   │ ← Firebase token check
└────────────┬────────┘
             ↓
┌─────────────────────┐
│ Business Logic      │ ← Service calls
└────────────┬────────┘
             ↓
┌─────────────────────┐
│ MongoDB Query       │ ← Indexed fields
└────────────┬────────┘
             ↓
┌─────────────────────┐
│ External API Call   │ ← OpenAI (cached ready)
└────────────┬────────┘
             ↓
┌─────────────────────┐
│ Response            │
└─────────────────────┘
```

## Deployment Architecture (When Ready)

```
                   INTERNET
                      ↓
        ┌─────────────────────────┐
        │  Load Balancer/CDN      │ ← Cloudflare/AWS
        └────────────┬────────────┘
                     ↓
        ┌─────────────────────────┐
        │  Frontend (React)       │ ← Vercel/Netlify
        │  Hosted as Static       │
        └────────────┬────────────┘
                     ↓
        ┌─────────────────────────┐
        │  Backend API            │ ← Heroku/AWS/DO
        │  Express.js Server      │
        │  Multiple instances     │
        └────────────┬────────────┘
                     ↓
        ┌─────────────────────────┐
        │  MongoDB Atlas          │ ← Managed DB
        │  Replicated x3          │
        └─────────────────────────┘
```

## Component Interaction

```
FRONTEND                          BACKEND
┌─────────────────┐          ┌────────────────┐
│  GuestChat      │◄────────►│ /api/chat/guest│
└─────────────────┘          └────────────────┘
                             (No auth needed)

┌─────────────────┐          ┌────────────────┐
│  LoggedInChat   │◄────────►│ /api/chat/send │
├─────────────────┤          ├────────────────┤
│ - Sends message │          │ - Verify token │
│ - Saves token   │          │ - Save to DB   │
│ - Gets history  │          │ - Call OpenAI  │
└─────────────────┘          └────────────────┘

┌─────────────────┐          ┌────────────────┐
│AuthScreen       │◄────────►│ /api/auth/*    │
├─────────────────┤          ├────────────────┤
│ - Login/Signup  │          │ - Create user  │
│ - Firebase auth │          │ - Save profile │
└─────────────────┘          └────────────────┘

┌─────────────────┐          ┌────────────────┐
│HospitalLocator  │◄────────►│ /api/hospitals │
├─────────────────┤          ├────────────────┤
│ - Get location  │          │ - Query nearby │
│ - Display map   │          │ - Geo search   │
└─────────────────┘          └────────────────┘
```

---

**This architecture scales from localhost to production with minimal changes!**

For detailed implementation, see:
- `backend/README.md` - Full API docs
- `backend/SETUP.md` - Setup instructions
- `TESTING_GUIDE.md` - Testing endpoints
