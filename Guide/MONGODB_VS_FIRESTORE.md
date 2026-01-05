# MongoDB vs Firestore: Side-by-Side Comparison

## 🔄 Database Comparison

### Architecture

#### MongoDB Approach
```
Express Server
    ↓
Mongoose ODM
    ↓
MongoDB Atlas
    ↓
Collections (Users, Conversations, Hospitals)
```

#### Firestore Approach
```
Express Server
    ↓
Firebase Admin SDK
    ↓
Firestore
    ↓
Collections (users, conversations, hospitals)
```

---

## 📝 Data Model Comparison

### MongoDB: User Model
```javascript
// models/User.js (Mongoose)
const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  subscribed: {
    type: Boolean,
    default: false
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

### Firestore: User Document Structure
```javascript
// In Firestore, "users" collection
// Document ID: firebaseUid (e.g., "user123")
{
  name: "John Doe",
  email: "john@example.com",
  subscribed: false,
  subscriptionPlan: "free",  // "free" | "basic" | "premium"
  createdAt: Timestamp,      // Firebase timestamp
  updatedAt: Timestamp
}

// In code: db.collection('users').doc(firebaseUid)
```

---

## 🔍 Query Comparison

### Get User by Firebase UID

#### MongoDB Version
```javascript
// services/authService.js (MongoDB)
async getUserByFirebaseId(firebaseUid) {
  try {
    const user = await User.findOne({ firebaseUid });
    return user;
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
}
```

#### Firestore Version
```javascript
// services/authService.js (Firestore)
async getUserByFirebaseId(firebaseUid) {
  try {
    const docRef = db.collection('users').doc(firebaseUid);
    const docSnap = await docRef.get();
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
}
```

---

### Create User

#### MongoDB Version
```javascript
// services/authService.js (MongoDB)
async createOrUpdateUser(firebaseUser) {
  try {
    let user = await User.findOne({ firebaseUid: firebaseUser.uid });

    if (!user) {
      user = new User({
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null
      });
      await user.save();
    } else {
      user.lastActive = new Date();
      await user.save();
    }

    return user;
  } catch (err) {
    console.error('Error creating/updating user:', err);
    throw err;
  }
}
```

#### Firestore Version
```javascript
// services/authService.js (Firestore)
async createOrUpdateUser(firebaseUser) {
  try {
    const docRef = db.collection('users').doc(firebaseUser.uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists()) {
      await docRef.set({
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null,
        subscribed: false,
        subscriptionPlan: 'free',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await docRef.update({
        lastActive: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  } catch (err) {
    console.error('Error creating/updating user:', err);
    throw err;
  }
}
```

---

### Save Conversation

#### MongoDB Version
```javascript
// routes/chat.js (MongoDB)
// Add user message
conversation.messages.push({
  sender: 'user',
  text: message,
  timestamp: new Date()
});

// Get AI response
const aiResponse = await aiService.generateResponse(
  conversation.messages.slice(-10),
  conversation.title
);

// Add AI message
conversation.messages.push({
  sender: 'ai',
  text: aiResponse,
  timestamp: new Date()
});

// Save
await conversation.save();
```

#### Firestore Version
```javascript
// routes/chat.js (Firestore)
// Create conversation if new
if (!conversationId) {
  const newDoc = await db.collection('conversations').add({
    userId,
    title: message.substring(0, 50) + '...',
    messages: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  conversationId = newDoc.id;
}

const convRef = db.collection('conversations').doc(conversationId);

// Get existing conversation
const convSnap = await convRef.get();
const conversation = convSnap.data();

// Build messages array
const messages = [...conversation.messages];

// Add user message
messages.push({
  sender: 'user',
  text: message,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});

// Get AI response
const aiResponse = await aiService.generateResponse(messages.slice(-10));

// Add AI message
messages.push({
  sender: 'ai',
  text: aiResponse,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});

// Update conversation
await convRef.update({
  messages,
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});
```

---

### List Conversations

#### MongoDB Version
```javascript
// routes/conversations.js (MongoDB)
async handleListConversations(userId) {
  const conversations = await Conversation.find(
    { userId, isActive: true }
  )
    .sort({ updatedAt: -1 })
    .select('-messages')
    .limit(50);

  return conversations;
}
```

#### Firestore Version
```javascript
// routes/conversations.js (Firestore)
async handleListConversations(userId) {
  const snapshot = await db.collection('conversations')
    .where('userId', '==', userId)
    .where('isActive', '==', true)
    .orderBy('updatedAt', 'desc')
    .limit(50)
    .get();

  const conversations = [];
  snapshot.forEach(doc => {
    conversations.push({
      id: doc.id,
      ...doc.data(),
      messages: undefined  // Don't include messages array
    });
  });

  return conversations;
}
```

---

### Search Hospitals

#### MongoDB Version
```javascript
// routes/hospitals.js (MongoDB)
const hospitals = await Hospital.find({
  name: { $regex: q, $options: 'i' },
  address: { $regex: q, $options: 'i' },
  specialties: { $regex: q, $options: 'i' }
}).limit(20);
```

#### Firestore Version
```javascript
// routes/hospitals.js (Firestore)
// Note: Firestore doesn't have regex, need different approach

// Option 1: Multiple queries (recommended)
const byName = await db.collection('hospitals')
  .where('nameLower', '>=', q.toLowerCase())
  .where('nameLower', '<', q.toLowerCase() + '\uf8ff')
  .limit(10)
  .get();

const bySpecialty = await db.collection('hospitals')
  .where('specialties', 'array-contains', q.toLowerCase())
  .limit(10)
  .get();

// Combine results
const results = new Map();
[...byName.docs, ...bySpecialty.docs].forEach(doc => {
  results.set(doc.id, { id: doc.id, ...doc.data() });
});

const hospitals = Array.from(results.values()).slice(0, 20);

// Option 2: Use Algolia for full-text search (if needed)
// For production, Algolia is better for search
```

---

## 🔧 Setup Comparison

### MongoDB Setup
```bash
# 1. Create MongoDB Atlas account
# 2. Get connection string
# 3. Install mongoose
npm install mongoose

# 4. Set environment variable
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# 5. Connect in code
mongoose.connect(process.env.MONGODB_URI)
```

### Firestore Setup
```bash
# 1. Firebase project already created (you have it!)
# 2. Download service account key
# 3. Firebase Admin SDK already installed
npm install firebase-admin

# 4. Set environment variables
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=...

# 5. Initialize in code
const admin = require('firebase-admin');
const db = admin.firestore();
```

---

## 📊 Feature Comparison

| Feature | MongoDB | Firestore |
|---------|---------|-----------|
| **Setup Complexity** | Medium | Low |
| **Query Complexity** | High (flexible) | Low (limited) |
| **Real-time Support** | No (add separately) | Yes (built-in) |
| **Text Search** | Good (regex) | Limited (need Algolia) |
| **Scalability** | Manual | Automatic |
| **Cost** | Fixed | Pay-per-use |
| **Offline Support** | No | Yes (mobile) |
| **Data Validation** | Mongoose schema | Firestore rules |
| **Relationships** | Foreign keys | Document refs |
| **Transactions** | Basic | Advanced |

---

## ⚖️ Trade-offs

### MongoDB Advantages
✅ Complex queries (regex, aggregation)  
✅ Traditional SQL-like joins  
✅ More control over indexing  
✅ Better for relational data  

### MongoDB Disadvantages
❌ Requires separate database  
❌ Manual scaling  
❌ No real-time built-in  
❌ More infrastructure  

### Firestore Advantages
✅ Built into Firebase (you already use it!)  
✅ Automatic scaling  
✅ Real-time updates included  
✅ Offline support  
✅ Security rules built-in  

### Firestore Disadvantages
❌ Limited query flexibility  
❌ Text search needs external service  
❌ Subcollections can be awkward  
❌ Denormalized data (more storage)  

---

## 🎯 Recommendation for Your Project

### Use Firestore If:
✅ You want simplicity (you already use Firebase!)  
✅ You need real-time (Phase 2)  
✅ You want automatic scaling  
✅ You have fewer complex queries  

### Use MongoDB If:
✅ You need complex search (hospital search)  
✅ You have highly relational data  
✅ You prefer traditional database  
✅ You already know MongoDB  

---

## 🚀 For Your Specific Case

Your current needs:
- User profiles ✅ (Simple - Firestore works)
- Conversations ✅ (Simple - Firestore works)
- Hospital search ⚠️ (Complex search - MongoDB better)
- Real-time chat 🔄 (Phase 2 - Firestore much better)

### Solution: Hybrid Approach
**Keep hospitals in MongoDB, everything else in Firestore**

OR

**Use Firestore for all, add Algolia for hospital search (best option)**

---

## 📝 Summary

**Quick Decision Guide:**

```
Do you need complex text search?
  → MongoDB better
  
Do you need real-time features soon?
  → Firestore better
  
Want to keep it simple?
  → Firestore (it's already in your Firebase!)
  
Want maximum flexibility?
  → MongoDB

For your project? 
  → Firestore + Express + Algolia (for search)
```

---

## ✅ Next Steps

I can provide:

1. **Full Firestore version** of backend (ready to use)
2. **Firestore setup guide** (step-by-step)
3. **Migration guide** (if you want to switch)
4. **Both versions side-by-side** (compare directly)

Which would you prefer?

- [ ] Convert everything to Firestore
- [ ] Keep both MongoDB and Firestore versions
- [ ] Use Firestore + keep MongoDB for hospitals
- [ ] Show me a specific file comparison
