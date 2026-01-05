# API Integration Setup Guide

## Overview
The AI DocTalk application is now ready to connect to a backend API. This guide explains the setup and what backend endpoints you need to create.

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000
REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
REACT_APP_ENV=development
```

## Backend API Endpoints Required

### Authentication Endpoints

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### POST `/api/auth/signup`
**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as login

#### POST `/api/auth/refresh`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "token": "new_jwt_token"
}
```

---

### Chat Endpoints

#### POST `/api/chat/send`
**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request:**
```json
{
  "message": "I have a headache",
  "conversationId": "conv_123"
}
```

**Response:**
```json
{
  "reply": "I understand you're experiencing a headache. Let me help you...",
  "conversationId": "conv_123"
}
```

#### POST `/api/chat/guest`
**No authentication required**

**Request:**
```json
{
  "message": "I have a question about health"
}
```

**Response:**
```json
{
  "reply": "I can provide general information, but for personalized advice, please sign up..."
}
```

#### GET `/api/conversations`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
[
  {
    "id": "conv_123",
    "title": "Health Discussion",
    "lastMessage": "How are you feeling today?",
    "timestamp": "2025-01-17T10:30:00Z"
  }
]
```

#### POST `/api/conversations`
**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request:**
```json
{
  "title": "New Conversation"
}
```

**Response:**
```json
{
  "id": "conv_456",
  "title": "New Conversation",
  "timestamp": "2025-01-17T10:30:00Z"
}
```

#### GET `/api/conversations/{id}`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "id": "conv_123",
  "title": "Health Discussion",
  "messages": [
    {
      "id": "msg_1",
      "sender": "user",
      "text": "I have a headache",
      "timestamp": "2025-01-17T10:00:00Z"
    },
    {
      "id": "msg_2",
      "sender": "ai",
      "text": "I understand...",
      "timestamp": "2025-01-17T10:01:00Z"
    }
  ]
}
```

#### DELETE `/api/conversations/{id}`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Conversation deleted"
}
```

---

### Hospital/Location Endpoints

#### GET `/api/hospitals/nearby?lat={latitude}&lng={longitude}&radius={km}`
**No authentication required**

**Response:**
```json
[
  {
    "id": 1,
    "name": "St. Mary's Hospital",
    "address": "123 Health Ave",
    "distance": "1.2 km",
    "rating": 4.8,
    "reviews": 1240,
    "isOpen": true,
    "specialties": ["Emergency", "Cardiology"],
    "phone": "+234123456789"
  }
]
```

#### GET `/api/hospitals/search?q={query}`
**No authentication required**

**Response:** Same format as nearby hospitals

#### GET `/api/hospitals/{id}`
**No authentication required**

**Response:**
```json
{
  "id": 1,
  "name": "St. Mary's Hospital",
  "address": "123 Health Ave",
  "phone": "+234123456789",
  "email": "contact@hospital.com",
  "website": "https://hospital.com",
  "rating": 4.8,
  "reviews": 1240,
  "isOpen": true,
  "hours": "24/7",
  "specialties": ["Emergency", "Cardiology", "Pediatrics"],
  "departments": [
    {
      "name": "Emergency",
      "phone": "+234123456789",
      "waitTime": "15 mins"
    }
  ]
}
```

---

### Payment Endpoints

#### POST `/api/payments/paystack/init`
**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request:**
```json
{
  "email": "user@example.com",
  "amount": 250000
}
```

**Response:**
```json
{
  "authorizationUrl": "https://checkout.paystack.com/...",
  "accessCode": "access_code_here",
  "reference": "payment_ref_123"
}
```

#### POST `/api/payments/paystack/verify/{reference}`
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "amount": 250000,
  "status": "success",
  "customer": { "email": "user@example.com" }
}
```

---

## Implementation Steps

1. **Set up Node/Express backend** with the endpoints above
2. **Database setup** (MongoDB/PostgreSQL) to store:
   - Users and auth tokens
   - Conversations and messages
   - Hospital data
   - Payment records

3. **Connect AI Service** (OpenAI, Anthropic Claude, Google Gemini, etc.)
   - Integrate in the `/chat/send` and `/chat/guest` endpoints

4. **Set environment variables** in `.env`

5. **Test endpoints** before deploying

## Using with Mock Data

While waiting for backend development, the app uses mock/fallback data:
- GuestChat: Shows generic AI responses
- LoggedInChat: Works with local state
- HospitalLocator: Uses mock hospital data

## Error Handling

The app automatically handles API errors with:
- Toast notifications for user feedback
- Graceful fallbacks to mock data
- Loading states for better UX
- Proper error logging to console

## Security Notes

- **JWT Tokens**: Store securely in localStorage (note: in production, consider using httpOnly cookies)
- **API Requests**: All authenticated endpoints include Authorization header
- **CORS**: Configure on backend to allow requests from frontend origin
- **Environment Variables**: Never commit `.env` with sensitive keys

## Testing Endpoints

Use Postman or similar tool to test:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Send chat message
curl -X POST http://localhost:5000/api/chat/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I have a headache","conversationId":"123"}'

# Find hospitals
curl 'http://localhost:5000/api/hospitals/nearby?lat=6.5244&lng=3.3792&radius=5'
```

## Next Steps

1. Create a Node.js/Express backend
2. Implement all endpoints above
3. Connect to real database
4. Integrate AI service for natural responses
5. Set up Paystack payment processing
6. Deploy both frontend and backend
7. Update `.env` with production URLs

---

**For questions or issues, refer to the service files in `/src/services/`**
