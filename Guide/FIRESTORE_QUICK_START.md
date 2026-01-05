# Firestore Quick Start (15 minutes)

**Goal:** Get Firestore working with your backend TODAY without touching any code.

---

## Step 1: Enable Firestore in Firebase Console (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **AI DocTalk** project
3. On the left sidebar, click **Firestore Database**
4. Click **Create database**
5. Choose **Production mode** (you can adjust permissions later)
6. Select region closest to you (or `us-central1`)
7. Click **Create**

**Status:** Firestore is now active ✅

---

## Step 2: Create Sample Data (3 minutes)

Still in Firestore console:

### Create a user

1. Click **Start collection** → Name: `users`
2. Click **Auto ID** (Firestore generates the ID)
3. Add these fields:
   ```
   Field: name → String: "Test User"
   Field: email → String: "test@example.com"
   Field: subscriptionPlan → String: "free"
   Field: createdAt → Server timestamp
   ```
4. Click **Save**

### Create a hospital

1. Click **+ Start collection** → Name: `hospitals`
2. Click **Auto ID**
3. Add these fields:
   ```
   Field: name → String: "Clinic Lagos"
   Field: nameLower → String: "clinic lagos"
   Field: city → String: "Lagos"
   Field: phone → String: "+234-800-000-0000"
   Field: coordinates → Map:
     - latitude → Number: 6.5244
     - longitude → Number: 3.3792
   ```
4. Click **Save**

**Status:** Sample data is ready ✅

---

## Step 3: Update Your Backend Code (10 minutes)

### Option A: Minimal Changes (Just for Testing)

Create a new file: `backend/routes/test-firestore.js`

```javascript
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Make sure Firebase is initialized in config/firebase.js

const db = admin.firestore();

// Test read
router.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test write
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const docRef = await db.collection('users').add({
      name,
      email,
      subscriptionPlan: 'free',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: docRef.id, message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
```

### Register this route in `backend/server.js`:

```javascript
// Add this line with other routes
app.use('/api/test', require('./routes/test-firestore'));
```

---

## Step 4: Test It Works (2 minutes)

```bash
# Start your server
npm start

# Test read
curl http://localhost:5000/api/test/users

# You should see:
# [{"id":"...","name":"Test User","email":"test@example.com",...}]

# Test write
curl -X POST http://localhost:5000/api/test/users \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'

# You should see:
# {"id":"...","message":"User created"}
```

**Status:** Firestore is working! ✅

---

## Step 5: [OPTIONAL] Set Firestore Security Rules

⚠️ **Important:** Your database is currently open to the world!

In Firebase Console → Firestore → Rules, replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Authenticated users can read conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }

    // Anyone can read hospitals
    match /hospitals/{hospitalId} {
      allow read: if true;
    }
  }
}
```

Click **Publish**.

**Status:** Database is now secure ✅

---

## Step 6: [OPTIONAL] Create Firestore Indexes

If you see an error like *"Please create a composite index"*, go to Firestore Console:

1. Click the error link, OR
2. Go to **Indexes** tab
3. Click **Create Index**
4. Select collection: `conversations`
5. Add fields:
   - `userId` (Ascending)
   - `isActive` (Ascending)
   - `updatedAt` (Descending)
6. Click **Create**

Wait 5 minutes for index to build.

---

## Next: Full Migration (When You're Ready)

Once you verify Firestore works, you can:

1. **Replace all MongoDB routes** with Firestore versions (see FIRESTORE_CONVERSION_CHECKLIST.md)
2. **Remove MongoDB** from your dependencies and `.env`
3. **Keep Firestore** as your only database

---

## Troubleshooting

**Q: Getting "Permission denied" error?**
- A: Check Firestore Rules (Step 5). Use test mode rules for development:
  ```firestore
  match /{document=**} {
    allow read, write: if true;
  }
  ```

**Q: Firestore says "Missing index"?**
- A: Create the index (Step 6). Firestore will tell you exactly which one.

**Q: Not seeing data in console?**
- A: Make sure you created it in the same collection name (`users`, `conversations`, etc.)

**Q: Still need MongoDB?**
- A: You can keep both! Just switch between them per collection.

---

## File Summary

✅ **What's already created for you:**
- `backend/services/firestoreService.js` - Ready to use
- `FIRESTORE_IMPLEMENTATION.md` - Complete guide
- `FIRESTORE_CONVERSION_CHECKLIST.md` - Step-by-step conversion
- `MONGODB_VS_FIRESTORE_CODE.md` - Code comparisons

📝 **What you just created:**
- Test route in `backend/routes/test-firestore.js`
- Sample data in Firebase Console

✏️ **What's next (optional):**
- Replace auth.js, conversations.js, chat.js routes (see checklist)
- Create Firestore indexes
- Delete MongoDB connection

---

## Decision Time

**Do you want to:**

1. ✅ Keep using MongoDB (no changes needed) → Jump to Phase 2
2. 🔄 Fully convert to Firestore → Follow FIRESTORE_CONVERSION_CHECKLIST.md
3. ⚖️ Use Hybrid (Firestore + MongoDB) → Update specific routes only

Let me know your choice and I'll help with the next steps!

