# Firebase Authentication Setup Guide

## Overview
AI DocTalk now uses **Firebase Authentication** for secure user login and signup. You can manage users, view analytics, and integrate other Firebase services.

## Prerequisites
- Firebase account (already created)
- Firebase project
- Web app registered in Firebase

## Getting Your Firebase Credentials

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project

### Step 2: Get Your Firebase Config
1. Click on **Project Settings** (gear icon)
2. Go to **Your apps** section
3. Find your Web app (or create one if needed)
4. Click on the config code button to reveal credentials

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789...",
  appId: "1:123456789...",
};
```

### Step 3: Add Credentials to `.env`
Copy the credentials into your `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyD...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789...
REACT_APP_FIREBASE_APP_ID=1:123456789...
```

### Step 4: Enable Authentication Methods
In Firebase Console:
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Toggle it to enabled

## Features

### Implemented
✅ **Email/Password Authentication**
- Login with email and password
- Sign up with name, email, and password
- Logout
- Session persistence

✅ **User Profile**
- Display name stored in Firebase
- User ID (UID) for database queries
- Email verification ready
- Photo URL support

✅ **Real-time Auth State**
- Listens to Firebase auth changes
- Auto-login on app reload if session exists
- Logout clears all user data

✅ **JWT Tokens**
- Automatic token generation
- Token refresh on demand
- Used for API requests

## Authentication Flow

```
User Signs Up/Logs In
        ↓
Firebase verifies credentials
        ↓
User profile created/updated
        ↓
JWT token generated
        ↓
User data stored in localStorage
        ↓
App updates UI with user info
```

## API Integration with Firebase Tokens

When making API requests, use the token:

```javascript
const token = await authService.getToken();
const response = await fetch(`${API_URL}/endpoint`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

Or use the existing services which handle this automatically:
```javascript
const { aiService } = require('./services');
// aiService will automatically add the token
await aiService.sendMessage(message, conversationId, token);
```

## User Data Storage

### Firebase
- Email
- Password (hashed)
- Display Name
- Photo URL
- Email Verified status
- Created date
- Last login date

### localStorage
- User ID
- Name
- Email
- Photo URL
(Used for quick access without Firebase call)

## Running the App

1. **Update `.env` with Firebase credentials**
```bash
cp .env.example .env
# Edit .env with your Firebase config
```

2. **Install dependencies** (if not done)
```bash
npm install
```

3. **Start the app**
```bash
npm start
```

## Testing Authentication

### Test Signup
1. Open app at `http://localhost:3000`
2. Click **Login / Subscribe**
3. Click "Don't have an account? Sign Up"
4. Enter:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "Test@123"
5. Click **Sign Up**
6. Should see success toast and redirect to chat

### Test Login
1. Click **Login / Subscribe**
2. Enter same email and password
3. Click **Sign In**
4. Should see success toast and redirect to chat

### Test Logout
1. Click menu icon in LoggedInChat
2. Click **Logout**
3. Should redirect to GuestChat

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check `.env` file exists with correct Firebase credentials
- Ensure REACT_APP_FIREBASE_API_KEY is not empty
- Restart app: `npm start`

### "Firebase: Error (auth/operation-not-allowed)"
- Go to Firebase Console
- Authentication → Sign-in method
- Make sure Email/Password provider is enabled

### "Firebase: Error (auth/user-not-found)"
- User doesn't exist
- Check email spelling
- Create account first if new user

### "Firebase: Error (auth/wrong-password)"
- Password is incorrect
- Reset password in Firebase Console if needed

### "Firebase: Error (auth/weak-password)"
- Password must be at least 6 characters
- Use stronger password (mix of letters, numbers, special chars)

### App keeps redirecting
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R

## Advanced Features

### Email Verification
To send verification email:
```javascript
import { sendEmailVerification } from 'firebase/auth';
const user = authService.getCurrentUser();
if (user && !user.emailVerified) {
  await sendEmailVerification(user);
}
```

### Password Reset
```javascript
import { sendPasswordResetEmail } from 'firebase/auth';
await sendPasswordResetEmail(auth, email);
```

### Update Profile
```javascript
import { updateProfile } from 'firebase/auth';
const user = authService.getCurrentUser();
await updateProfile(user, {
  displayName: "New Name",
  photoURL: "https://example.com/photo.jpg"
});
```

## Security Best Practices

✅ **What we do:**
- Passwords sent securely to Firebase
- Passwords never stored locally
- JWT tokens used for API requests
- User data encrypted in Firebase
- Email verification available

⚠️ **What to do:**
- Never share Firebase credentials
- Don't put API keys in comments
- Use `.env` file (gitignored)
- Keep Firebase SDK updated
- Enable 2FA on Firebase account

## Database Setup (Optional)

For storing conversations and other user data:

### Option 1: Firestore (Recommended)
```bash
npm install firebase
```

Already installed! You can now:
```javascript
import { db } from './config/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Add conversation
await addDoc(collection(db, 'conversations'), {
  userId: user.uid,
  messages: [],
  createdAt: new Date()
});
```

### Option 2: Realtime Database
Similar setup in Firebase config

### Option 3: Backend API
Use Node/Express backend with MongoDB/PostgreSQL
- Firebase handles auth
- Your backend handles data

## Next Steps

1. ✅ Add Firebase credentials to `.env`
2. ✅ Test login/signup
3. ⏳ (Optional) Set up Firestore for data
4. ⏳ (Optional) Add profile picture upload
5. ⏳ (Optional) Add email verification

## Helpful Resources

- [Firebase Docs](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Auth Best Practices](https://firebase.google.com/docs/auth/best-practices)

## Support

For issues:
1. Check Firebase Console status
2. Review browser console for errors
3. Verify `.env` configuration
4. Check Firebase security rules
5. Ensure Email/Password provider is enabled

---

**Firebase is now powering authentication! 🔐**

Add your Firebase config and start testing!
