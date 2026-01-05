# MongoDB → Firestore Conversion Checklist

## Quick Start (5 minutes)

If you want to convert to Firestore immediately, follow these steps:

### Phase 1: Setup (2 minutes)

- [ ] Open Firebase Console (same project you use for auth)
- [ ] Go to Firestore Database
- [ ] Create database in production mode (or test mode for development)
- [ ] Copy your Firebase config to verify it's correct

```javascript
// Verify your config/firebase.js has this:
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

### Phase 2: Code Changes (3 minutes)

Replace these files:

**File 1: backend/services/authService.js**

```javascript
// BEFORE: Uses Mongoose User model
const User = require('../models/User');

// AFTER: Uses Firestore
const { firestoreUserService } = require('./firestoreService');
```

**File 2: backend/services/index.js**

```javascript
// Change exports:
module.exports = {
  // OLD
  // aiService,
  // authService,
  
  // NEW
  firestoreUserService: require('./firestoreService').firestoreUserService,
  firestoreConversationService: require('./firestoreService').firestoreConversationService,
  firestoreHospitalService: require('./firestoreService').firestoreHospitalService,
  aiService: require('./aiService')
};
```

**File 3: Update each route file (5 seconds each)**

```javascript
// BEFORE
const { Conversation } = require('../models');

// AFTER
const { firestoreConversationService } = require('../services/firestoreService');
```

### Phase 3: Route Updates (Detailed)

**auth.js - Replace entire file content**

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

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    const user = await firestoreUserService.createOrUpdateUser(firebaseUser);

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /auth/me
router.get('/me', validateFirebaseToken, async (req, res) => {
  try {
    const user = await firestoreUserService.getUserByFirebaseId(req.user.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /auth/profile
router.put('/profile', validateFirebaseToken, async (req, res) => {
  try {
    const user = await firestoreUserService.updateUserProfile(req.user.uid, req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

**conversations.js - Replace entire file content**

```javascript
const express = require('express');
const router = express.Router();
const { validateFirebaseToken } = require('../middleware/auth');
const { firestoreConversationService } = require('../services/firestoreService');

// GET /conversations
router.get('/', validateFirebaseToken, async (req, res) => {
  try {
    const conversations = await firestoreConversationService.listConversations(req.user.uid);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /conversations/:id
router.get('/:id', validateFirebaseToken, async (req, res) => {
  try {
    const conversation = await firestoreConversationService.getConversation(
      req.params.id,
      req.user.uid
    );
    res.json(conversation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /conversations
router.post('/', validateFirebaseToken, async (req, res) => {
  try {
    const conversation = await firestoreConversationService.createConversation(
      req.user.uid,
      req.body.title
    );
    res.status(201).json(conversation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /conversations/:id
router.put('/:id', validateFirebaseToken, async (req, res) => {
  try {
    const conversation = await firestoreConversationService.updateConversation(
      req.params.id,
      req.user.uid,
      req.body
    );
    res.json({ success: true, conversation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /conversations/:id
router.delete('/:id', validateFirebaseToken, async (req, res) => {
  try {
    await firestoreConversationService.deleteConversation(req.params.id, req.user.uid);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

**chat.js - Replace entire file content**

```javascript
const express = require('express');
const router = express.Router();
const { validateFirebaseToken } = require('../middleware/auth');
const { firestoreConversationService } = require('../services/firestoreService');
const { generateAIResponse } = require('../services/aiService');

// POST /chat/message (authenticated)
router.post('/message', validateFirebaseToken, async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'conversationId and message required' });
    }

    // Add user message
    let conversation = await firestoreConversationService.addMessage(
      conversationId,
      req.user.uid,
      'user',
      message
    );

    // Generate AI response
    const aiResponse = await generateAIResponse(message);

    // Add AI message
    conversation = await firestoreConversationService.addMessage(
      conversationId,
      req.user.uid,
      'assistant',
      aiResponse
    );

    res.json({ success: true, conversation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /chat/guest (no authentication)
router.post('/guest', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message required' });
    }

    const aiResponse = await generateAIResponse(message);

    res.json({
      success: true,
      response: aiResponse
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

**users.js - Replace entire file content**

```javascript
const express = require('express');
const router = express.Router();
const { validateFirebaseToken } = require('../middleware/auth');
const { firestoreUserService } = require('../services/firestoreService');

// GET /users/profile
router.get('/profile', validateFirebaseToken, async (req, res) => {
  try {
    const user = await firestoreUserService.getUserByFirebaseId(req.user.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/profile
router.put('/profile', validateFirebaseToken, async (req, res) => {
  try {
    const user = await firestoreUserService.updateUserProfile(req.user.uid, req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /users/subscription
router.post('/subscription', validateFirebaseToken, async (req, res) => {
  try {
    const { plan, expiresAt } = req.body;

    const user = await firestoreUserService.updateSubscription(
      req.user.uid,
      plan,
      expiresAt
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

**hospitals.js - Can keep using MongoDB OR Firestore**

Option A: Keep MongoDB (for geospatial search)
```javascript
// No changes needed - use existing Hospital model
const Hospital = require('../models/Hospital');
```

Option B: Switch to Firestore
```javascript
const { firestoreHospitalService } = require('../services/firestoreService');
```

### Phase 4: Create Firestore Indexes (Important!)

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project → Firestore Database → Indexes
3. Create two composite indexes:

**Index 1:**
- Collection: `conversations`
- Field 1: `userId` (Ascending)
- Field 2: `isActive` (Ascending)  
- Field 3: `updatedAt` (Descending)

**Index 2:**
- Collection: `hospitals`
- Field 1: `nameLower` (Ascending)

This takes ~5 minutes. You'll know when they're ready (status changes to "Enabled").

### Phase 5: Test (1 minute)

```bash
# Start server
npm start

# Test creating conversation
curl -X POST http://localhost:5000/conversations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'
```

---

## Rollback Plan

If something goes wrong:

1. Keep MongoDB running alongside Firestore temporarily
2. Test with a few users first
3. Keep `services/mongoService.js` as backup
4. Can revert routes to use MongoDB in minutes

---

## File Checklist

Files you need to **change**:
- [ ] `backend/services/firestoreService.js` - Already created ✅
- [ ] `backend/routes/auth.js` - Convert to Firestore
- [ ] `backend/routes/conversations.js` - Convert to Firestore
- [ ] `backend/routes/chat.js` - Convert to Firestore
- [ ] `backend/routes/users.js` - Convert to Firestore
- [ ] `backend/routes/hospitals.js` - Keep MongoDB OR convert
- [ ] `backend/server.js` - Remove MongoDB connection, keep Firestore

Files you can **leave unchanged**:
- ✅ `backend/middleware/auth.js` - Works with both
- ✅ `backend/services/aiService.js` - Works with both
- ✅ `backend/config/firebase.js` - Already configured
- ✅ All frontend files - No changes needed

---

## Time Estimate

- **Phase 1 (Setup):** 2 minutes
- **Phase 2 (Service code):** 1 minute
- **Phase 3 (Route updates):** 10 minutes
- **Phase 4 (Indexes):** 5 minutes (auto-builds)
- **Phase 5 (Testing):** 5 minutes

**Total: ~25 minutes** for full conversion

---

## Recommendation

✅ **Go with Pure Firestore** - You're already using Firebase for auth, so this integrates seamlessly and is the fastest to implement.

Want me to update all the files for you?

