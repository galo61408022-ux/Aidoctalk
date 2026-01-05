# Firestore Implementation Guide

## Overview

This guide shows you how to convert the entire backend from MongoDB to Firestore. You have 3 options:

1. **Pure Firestore** - Convert everything to Firestore (simpler, integrated)
2. **Pure MongoDB** - Keep existing MongoDB setup (more query flexibility)
3. **Hybrid** - Use Firestore for users/conversations, MongoDB for hospitals (balanced)

---

## Option 1: Pure Firestore (Recommended)

### Step 1: Install Firestore Dependencies

```bash
npm install firebase-admin --save
```

Firestore comes built-in with Firebase Admin SDK (already installed).

### Step 2: Use Firestore Service

Replace the MongoDB-based services with Firestore versions:

```javascript
// In your route files, change from:
const userModel = require('../models/User');

// To:
const { firestoreUserService } = require('../services/firestoreService');
```

### Step 3: Update Routes

**Example: Auth Route (auth.js)**

```javascript
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { firestoreUserService } = require('../services/firestoreService');
const { validateFirebaseToken } = require('../middleware/auth');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Create Firebase user
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Create user in Firestore
    const user = await firestoreUserService.createOrUpdateUser(firebaseUser);

    // Get ID token
    const idToken = await admin.auth().createCustomToken(firebaseUser.uid);

    res.json({
      success: true,
      user,
      token: idToken
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// GET /auth/me
router.get('/me', validateFirebaseToken, async (req, res) => {
  try {
    const user = await firestoreUserService.getUserByFirebaseId(req.user.uid);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

**Example: Chat Route (chat.js)**

```javascript
const express = require('express');
const router = express.Router();
const { validateFirebaseToken } = require('../middleware/auth');
const { firestoreConversationService } = require('../services/firestoreService');
const { generateAIResponse } = require('../services/aiService');

// POST /chat/message
router.post('/message', validateFirebaseToken, async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.user.uid;

    // Add user message
    let conversation = await firestoreConversationService.addMessage(
      conversationId,
      userId,
      'user',
      message
    );

    // Generate AI response
    const aiResponse = await generateAIResponse(message);

    // Add AI message
    conversation = await firestoreConversationService.addMessage(
      conversationId,
      userId,
      'assistant',
      aiResponse
    );

    res.json({
      success: true,
      conversation
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

### Step 4: Firestore Database Structure

Your Firestore database should have these collections:

```
firestore/
├── users/
│   └── {firebaseUid}/
│       ├── name: string
│       ├── email: string
│       ├── photoURL: string
│       ├── phoneNumber: string
│       ├── medicalHistory: array
│       ├── allergies: array
│       ├── subscriptionPlan: string
│       ├── subscriptionExpiresAt: timestamp
│       ├── conversationCount: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── conversations/
│   └── {conversationId}/
│       ├── userId: string
│       ├── title: string
│       ├── messages: array
│       │   └── {0}/
│       │       ├── sender: "user" | "assistant"
│       │       ├── text: string
│       │       └── timestamp: timestamp
│       ├── lastMessage: string
│       ├── isActive: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── hospitals/
    └── {hospitalId}/
        ├── name: string
        ├── nameLower: string (for search)
        ├── address: string
        ├── city: string
        ├── state: string
        ├── phone: string
        ├── email: string
        ├── coordinates:
        │   ├── latitude: number
        │   └── longitude: number
        ├── specialties: array
        ├── specialtiesLower: array (for search)
        ├── operatingHours: object
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

### Step 5: Add Firestore Indexes (Important!)

For queries with multiple WHERE clauses, you need composite indexes:

**1. Conversations by User (with Active status)**
- Collection: `conversations`
- Fields: `userId` (Ascending), `isActive` (Ascending), `updatedAt` (Descending)

**2. Hospitals by Name**
- Collection: `hospitals`
- Fields: `nameLower` (Ascending)

**To create indexes:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database → Indexes
4. Create Composite Index with the fields listed above

OR use Firebase CLI:

```bash
firebase firestore:indexes create --document='firebase-index.json'
```

Create `firebase-index.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "conversations",
      "queryScope": "Collection",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "isActive",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "hospitals",
      "queryScope": "Collection",
      "fields": [
        {
          "fieldPath": "nameLower",
          "order": "ASCENDING"
        }
      ]
    }
  ]
}
```

### Step 6: Update Environment Variables (.env)

```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email

# API Keys
OPENAI_API_KEY=your-openai-api-key

# Server
PORT=5000
NODE_ENV=development
```

### Step 7: Test Firestore Connection

Create `test-firestore.js`:

```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (if not already done in config/firebase.js)
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
}

const db = admin.firestore();

async function testConnection() {
  try {
    // Test write
    const docRef = await db.collection('test').add({
      message: 'Hello Firestore',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Write successful:', docRef.id);

    // Test read
    const snapshot = await db.collection('test').limit(1).get();
    snapshot.forEach(doc => {
      console.log('✅ Read successful:', doc.data());
    });

    // Cleanup
    await db.collection('test').doc(docRef.id).delete();
    console.log('✅ Delete successful');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testConnection();
```

Run it:

```bash
node test-firestore.js
```

---

## Option 2: Keep MongoDB

If you prefer to keep MongoDB, no changes needed! The existing backend files work as-is.

Just ensure your `.env` has:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aidoctalk
```

---

## Option 3: Hybrid (Recommended for Scalability)

Use **Firestore for users/conversations** (real-time capable) and **MongoDB for hospitals** (complex queries).

### Implementation:

```javascript
// In route files, use both services:

const { firestoreUserService, firestoreConversationService } = require('../services/firestoreService');
const Hospital = require('../models/Hospital');

// Users & Conversations → Firestore
// Hospitals → MongoDB

router.get('/profile', validateFirebaseToken, async (req, res) => {
  // Use Firestore
  const user = await firestoreUserService.getUserByFirebaseId(req.user.uid);
  res.json(user);
});

router.get('/hospitals/nearby', async (req, res) => {
  // Use MongoDB
  const hospitals = await Hospital.find(/* MongoDB query */);
  res.json(hospitals);
});
```

---

## Comparison Summary

| Feature | MongoDB | Firestore | Hybrid |
|---------|---------|-----------|--------|
| **Real-time Updates** | ❌ | ✅ | ✅ |
| **Complex Queries** | ✅ | ⚠️ (Limited) | ✅ |
| **Geospatial Search** | ✅ | ❌ | ✅ |
| **Cost** | Medium | Pay-per-read | Medium |
| **Setup Complexity** | Medium | Low | Medium |
| **Integration** | External service | Built-in Firebase | Both |

---

## Migration Path

If you want to start with Firestore and add MongoDB for hotels later:

1. **Week 1:** Deploy with Pure Firestore (users, conversations)
2. **Week 2:** Add MongoDB for hospitals (geospatial queries)
3. **Week 3:** Add Algolia for advanced search (optional)

---

## Next Steps

1. Choose your option (Pure Firestore, MongoDB, or Hybrid)
2. Create Firestore indexes (if choosing Firestore)
3. Update routes to use appropriate services
4. Test with curl commands (see API_TESTING.md)
5. Deploy to production

---

## Troubleshooting

**Q: Firestore says "Missing or insufficient permissions"**
- A: Check Firebase rules. Set test mode first:

```firestore
match /{document=**} {
  allow read, write: if true;
}
```

(Update to proper rules before production)

**Q: Firestore queries are slow**
- A: Create composite indexes (Firestore will prompt you)

**Q: How do I do geospatial search in Firestore?**
- A: Use Algolia integration. See ALGOLIA_SETUP.md

---

## Support Files

- `services/firestoreService.js` - Ready-to-use Firestore service
- `services/aiService.js` - Works with both MongoDB and Firestore
- `middleware/auth.js` - Firebase token validation (works with both)

