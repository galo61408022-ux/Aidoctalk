# API Testing Guide - Phase 1

Quick reference for testing all endpoints using curl.

## Prerequisites
- Backend running on `http://localhost:5000`
- Firebase token (get from frontend console after login)

## Setup Variables

```bash
# Save your token
TOKEN="your_firebase_token_here"
API="http://localhost:5000/api"
```

---

## 1. Health Check (No Auth Required)

```bash
curl -X GET $API/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-17T..."
}
```

---

## 2. Authentication Endpoints

### Register User
```bash
curl -X POST $API/auth/register \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "firebaseUid": "uid",
    "name": "John Doe",
    "email": "john@example.com",
    "subscribed": false
  }
}
```

### Get Current User
```bash
curl -X GET $API/auth/user \
  -H "Authorization: Bearer $TOKEN"
```

### Update User Profile
```bash
curl -X PUT $API/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "+234701234567",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "medicalHistory": ["Diabetes"],
    "allergies": ["Penicillin"]
  }'
```

---

## 3. Chat Endpoints

### Send Guest Message (No Auth)
```bash
curl -X POST $API/chat/guest \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the symptoms of flu?"
  }'
```

Response:
```json
{
  "userMessage": "What are the symptoms of flu?",
  "aiMessage": "That's an interesting question...",
  "type": "guest"
}
```

### Send Authenticated Message
```bash
curl -X POST $API/chat/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache and fever",
    "conversationId": null
  }'
```

Response:
```json
{
  "conversationId": "507f1f77bcf86cd799439011",
  "aiMessage": {
    "sender": "ai",
    "text": "A headache and fever...",
    "timestamp": "2024-01-17T..."
  },
  "fullConversation": { ... }
}
```

### Send Follow-up Message (Same Conversation)
```bash
curl -X POST $API/chat/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What medicine should I take?",
    "conversationId": "507f1f77bcf86cd799439011"
  }'
```

---

## 4. Conversation Endpoints

### List All Conversations
```bash
curl -X GET $API/conversations \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "I have a headache...",
    "lastMessage": "A headache and fever...",
    "createdAt": "2024-01-17T...",
    "updatedAt": "2024-01-17T...",
    "messageCount": 4
  }
]
```

### Get Specific Conversation
```bash
curl -X GET $API/conversations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Conversation (Change Title)
```bash
curl -X PUT $API/conversations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Headache and Fever Consultation"
  }'
```

### Delete Conversation
```bash
curl -X DELETE $API/conversations/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Hospital Endpoints

### Find Nearby Hospitals
```bash
# Lagos coordinates: latitude=6.5244, longitude=3.3792
curl -X GET "$API/hospitals/nearby?lat=6.5244&lng=3.3792&radius=5"
```

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "St. Mary's General Hospital",
    "address": "123 Health Avenue",
    "rating": 4.8,
    "reviews": 1240,
    "distance": "1.2",
    "specialties": ["Cardiology", "Emergency"],
    "isOpen": true,
    "phone": "+234701234567"
  }
]
```

### Search Hospitals by Name
```bash
curl -X GET "$API/hospitals/search?q=cardiology"
```

### Get Hospital Details
```bash
curl -X GET $API/hospitals/507f1f77bcf86cd799439011
```

---

## 6. User Profile Endpoints

### Get User Profile
```bash
curl -X GET $API/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Update User Profile
```bash
curl -X PUT $API/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phoneNumber": "+234702345678",
    "medicalHistory": ["Asthma", "Diabetes"],
    "allergies": ["Shellfish"]
  }'
```

### Update Subscription
```bash
curl -X POST $API/users/subscription \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "premium",
    "expiresAt": "2024-12-31"
  }'
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (access denied) |
| 404 | Not Found |
| 500 | Server Error |

---

## Common Errors

### Missing Authorization Header
```json
{
  "error": "Missing or invalid authorization header"
}
```

### Invalid Token
```json
{
  "error": "Invalid token",
  "details": "..."
}
```

### Validation Error
```json
{
  "error": "Validation error",
  "details": ["Field is required", ...]
}
```

---

## Using Postman

1. Import this collection: [Link to Postman collection]
2. Set variables:
   - `base_url`: http://localhost:5000/api
   - `token`: Your Firebase token
3. Test each endpoint

---

## Using JavaScript/Fetch

```javascript
const API = 'http://localhost:5000/api';
const token = 'your_firebase_token';

// Send message
fetch(`${API}/chat/send`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'I feel sick',
    conversationId: null
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## Debugging Tips

1. **Check Backend Logs**: Look for error messages in terminal
2. **Check Frontend Console**: Browser DevTools → Console
3. **Check Network Tab**: See request/response details
4. **Check MongoDB**: Verify data is being saved
5. **Check Firebase**: Verify token is valid

---

## Performance Tips

- Use conversation IDs to continue existing conversations
- Don't create new conversation for every message
- Batch hospital queries with radius parameter
- Cache hospital results on frontend
- Use pagination for long conversation lists

---

## Security Reminders

⚠️ **Never share your Firebase token publicly**  
⚠️ **Never commit API keys to version control**  
⚠️ **Always use HTTPS in production**  
⚠️ **Validate all user inputs on backend**  
⚠️ **Keep dependencies updated**

---

**Need more examples? Check the README.md in the backend folder.**
