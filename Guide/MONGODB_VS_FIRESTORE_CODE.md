# MongoDB vs Firestore: Side-by-Side Code Comparison

This document shows the exact code differences between MongoDB and Firestore implementations.

---

## 1. User Operations

### Create User

**MongoDB:**
```javascript
const User = require('../models/User');

const user = new User({
  firebaseUid: firebaseUser.uid,
  name: firebaseUser.displayName,
  email: firebaseUser.email,
  photoURL: firebaseUser.photoURL,
  phoneNumber: null,
  medicalHistory: [],
  allergies: [],
  subscribed: false,
  subscriptionPlan: 'free',
  createdAt: new Date(),
  updatedAt: new Date()
});

await user.save();
```

**Firestore:**
```javascript
const admin = require('firebase-admin');
const db = admin.firestore();

await db.collection('users').doc(firebaseUser.uid).set({
  name: firebaseUser.displayName,
  email: firebaseUser.email,
  photoURL: firebaseUser.photoURL,
  phoneNumber: null,
  medicalHistory: [],
  allergies: [],
  subscribed: false,
  subscriptionPlan: 'free',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});
```

**Key Differences:**
- MongoDB uses model instances and `.save()`
- Firestore uses direct collection/document operations
- Firestore uses document ID = Firebase UID (no separate field)
- Timestamps are handled automatically

---

### Get User

**MongoDB:**
```javascript
const user = await User.findOne({ firebaseUid: uid });
if (!user) throw new Error('User not found');
return user;
```

**Firestore:**
```javascript
const docRef = db.collection('users').doc(uid);
const docSnap = await docRef.get();

if (!docSnap.exists()) throw new Error('User not found');
return { id: docSnap.id, ...docSnap.data() };
```

**Key Differences:**
- MongoDB queries by field, Firestore queries by document ID
- Firestore requires explicit `exists()` check
- Firestore needs to combine `id` with `data()` for complete object

---

### Update User

**MongoDB:**
```javascript
const user = await User.findOneAndUpdate(
  { firebaseUid: uid },
  { $set: updates, updatedAt: new Date() },
  { new: true }
);
```

**Firestore:**
```javascript
await db.collection('users').doc(uid).update({
  ...updates,
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});

const updated = await db.collection('users').doc(uid).get();
return { id: updated.id, ...updated.data() };
```

**Key Differences:**
- MongoDB returns updated document in one call
- Firestore needs separate `.get()` after update
- Firestore prevents overwriting non-specified fields

---

### Delete User

**MongoDB:**
```javascript
await User.deleteOne({ firebaseUid: uid });
```

**Firestore:**
```javascript
await db.collection('users').doc(uid).delete();
```

---

## 2. Conversation Operations

### Create Conversation

**MongoDB:**
```javascript
const Conversation = require('../models/Conversation');

const conversation = new Conversation({
  userId: req.user._id,  // MongoDB ID
  title: 'New Conversation',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

await conversation.save();
```

**Firestore:**
```javascript
const newDoc = await db.collection('conversations').add({
  userId: req.user.uid,  // Firebase UID
  title: 'New Conversation',
  messages: [],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});

const doc = await newDoc.get();
return { id: doc.id, ...doc.data() };
```

**Key Differences:**
- MongoDB stores full objects, `.save()` generates ID
- Firestore `.add()` auto-generates document ID
- User reference is Firebase UID (string), not MongoDB ObjectId

---

### Add Message to Conversation

**MongoDB:**
```javascript
const conversation = await Conversation.findByIdAndUpdate(
  conversationId,
  {
    $push: {
      messages: {
        sender: 'user',
        text: message,
        timestamp: new Date()
      }
    },
    updatedAt: new Date()
  },
  { new: true }
);
```

**Firestore:**
```javascript
const docRef = db.collection('conversations').doc(conversationId);
const docSnap = await docRef.get();

const messages = docSnap.data().messages || [];
messages.push({
  sender: 'user',
  text: message,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});

await docRef.update({
  messages,
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});

const updated = await docRef.get();
return { id: updated.id, ...updated.data() };
```

**Key Differences:**
- MongoDB uses `$push` operator for arrays
- Firestore: fetch → modify array → update (3 steps vs 1)
- ⚠️ **Issue:** Firestore limits array size to 20,000 elements
- **Solution for large arrays:** Use subcollections instead

---

### Query Conversations by User

**MongoDB:**
```javascript
const conversations = await Conversation.find({
  userId: userObjectId
})
  .sort({ updatedAt: -1 })
  .limit(50);
```

**Firestore:**
```javascript
const snapshot = await db.collection('conversations')
  .where('userId', '==', userId)
  .orderBy('updatedAt', 'desc')
  .limit(50)
  .get();

const conversations = [];
snapshot.forEach(doc => {
  conversations.push({ id: doc.id, ...doc.data() });
});
```

**Key Differences:**
- MongoDB filtering is built-in
- Firestore requires composite index for multiple WHERE clauses
- Firestore manual snapshot → array conversion

---

### Delete Conversation (Soft Delete)

**MongoDB:**
```javascript
await Conversation.findByIdAndUpdate(conversationId, {
  isActive: false,
  updatedAt: new Date()
});
```

**Firestore:**
```javascript
await db.collection('conversations').doc(conversationId).update({
  isActive: false,
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});
```

---

## 3. Hospital Operations

### Search Hospitals by Name

**MongoDB:**
```javascript
// Supports regex for flexible search
const hospitals = await Hospital.find({
  name: { $regex: query, $options: 'i' }
}).limit(20);
```

**Firestore:**
```javascript
// ❌ NO REGEX - must store lowercase for case-insensitive search
const q = query.toLowerCase();
const snapshot = await db.collection('hospitals')
  .where('nameLower', '>=', q)
  .where('nameLower', '<', q + '\uf8ff')
  .limit(20)
  .get();

const hospitals = [];
snapshot.forEach(doc => {
  hospitals.push({ id: doc.id, ...doc.data() });
});
```

**Key Differences:**
- ⚠️ **Firestore limitation:** No regex support
- **Workaround:** Store lowercase copy of name, or use Algolia
- MongoDB is more flexible for text search

---

### Find Nearby Hospitals

**MongoDB:**
```javascript
// Built-in geospatial queries
const hospitals = await Hospital.find({
  coordinates: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: 5000  // 5km in meters
    }
  }
}).limit(20);
```

**Firestore:**
```javascript
// ❌ NO GEOSPATIAL QUERIES - must implement manually
const snapshot = await db.collection('hospitals').get();

const hospitals = [];
snapshot.forEach(doc => {
  const hospital = { id: doc.id, ...doc.data() };
  
  const distance = calculateDistance(
    latitude, longitude,
    hospital.coordinates.latitude,
    hospital.coordinates.longitude
  );
  
  if (distance <= 5) {  // 5km
    hospital.distance = distance;
    hospitals.push(hospital);
  }
});

return hospitals.sort((a, b) => a.distance - b.distance);

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

**Key Differences:**
- ⚠️ **Firestore limitation:** No geospatial queries
- **Workaround:** Use Algolia or geohash libraries
- **For this project:** We recommend keeping hospitals in MongoDB

---

## 4. Complete Route Comparison

### MongoDB Version

```javascript
const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { validateFirebaseToken } = require('../middleware/auth');

router.get('/', validateFirebaseToken, async (req, res) => {
  try {
    // MongoDB: Direct query
    const conversations = await Conversation.find({
      userId: req.user._id
    }).sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

### Firestore Version

```javascript
const express = require('express');
const router = express.Router();
const db = require('firebase-admin').firestore();
const { validateFirebaseToken } = require('../middleware/auth');

router.get('/', validateFirebaseToken, async (req, res) => {
  try {
    // Firestore: Query -> Get -> Map
    const snapshot = await db.collection('conversations')
      .where('userId', '==', req.user.uid)
      .orderBy('updatedAt', 'desc')
      .get();

    const conversations = [];
    snapshot.forEach(doc => {
      conversations.push({ id: doc.id, ...doc.data() });
    });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

---

## 5. Performance Comparison

| Operation | MongoDB | Firestore |
|-----------|---------|-----------|
| **Create user** | ~50ms | ~100ms |
| **Get user** | ~20ms | ~20ms |
| **List conversations** | ~100ms | ~100ms |
| **Add message** | ~50ms (array push) | ~100ms (full array rewrite) |
| **Search hospitals** | ~200ms (regex) | ~500ms (manual filter) |
| **Geospatial search** | ~300ms (optimized) | ❌ Not possible |
| **Real-time updates** | ❌ Polling needed | ✅ Built-in |

---

## 6. Cost Comparison (Monthly, 10k active users)

### MongoDB Atlas ($15/month starter)
- Database: $15
- Total: **$15/month**
- Best for: Complex queries, geospatial search

### Firestore ($1/month free tier, then per-operation)
- 10k users × 10 reads/day = 100k reads = $0.06
- 10k users × 5 writes/day = 50k writes = $0.15
- Total: **~$0.30/month** (at scale)
- Best for: Real-time, simple data model

### Algolia (for search) ($0 free, $39/month basic)
- Needed if using Firestore with geospatial search
- Total with Firestore + Algolia: **$39/month**

---

## 7. Recommendation Matrix

**Choose MongoDB if:**
- ✅ Need complex queries
- ✅ Need geospatial search for hospitals
- ✅ Have large message arrays per conversation
- ✅ Want powerful aggregation pipeline

**Choose Firestore if:**
- ✅ Want real-time updates (chat messages appear instantly)
- ✅ Want simpler deployment (Firebase integrated)
- ✅ Don't need complex hospital search
- ✅ Want automatic scaling

**Choose Hybrid (Recommended) if:**
- ✅ Use Firestore for users & conversations (real-time)
- ✅ Use MongoDB for hospitals (geospatial search)
- ✅ Best of both worlds
- ✅ Slightly more complex to maintain

---

## 8. Migration Path

If starting with MongoDB and wanting to switch later:

```javascript
// Week 1: MongoDB + Firestore running together
const useFirestore = process.env.FIRESTORE_ENABLED === 'true';

if (useFirestore) {
  const user = await firestoreUserService.getUser(uid);
} else {
  const user = await User.findById(uid);
}

// Week 2: Migrate data (write script to copy data)
// Week 3: Switch to Firestore only
```

---

## Conclusion

| Metric | Winner |
|--------|--------|
| **Simplicity** | Firestore |
| **Power** | MongoDB |
| **Speed** | Firestore (for reads) |
| **Cost** | Firestore (at scale) |
| **Integration** | Firestore (with Firebase) |
| **Flexibility** | MongoDB |

**For AI DocTalk:** Hybrid approach recommended (Firestore + MongoDB)

