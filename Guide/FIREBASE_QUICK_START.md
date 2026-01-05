# Firebase Setup - Quick Start (5 minutes)

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on your project
3. Click ⚙️ **Project Settings** (top-left corner)
4. Scroll to "Your apps" section
5. Click on your Web app (or create one)
6. Copy all the values:

```
apiKey: _____________________
authDomain: _____________________
projectId: _____________________
storageBucket: _____________________
messagingSenderId: _____________________
appId: _____________________
```

## Step 2: Update `.env` File

Open `c:\Users\USER\Desktop\aidoctalk\.env` and replace with your values:

```env
# Local Development Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000

# Firebase Configuration - GET FROM CONSOLE
REACT_APP_FIREBASE_API_KEY=AIzaSyD1234567890...
REACT_APP_FIREBASE_AUTH_DOMAIN=aidoctalk-12345.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=aidoctalk-12345
REACT_APP_FIREBASE_STORAGE_BUCKET=aidoctalk-12345.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789123
REACT_APP_FIREBASE_APP_ID=1:123456789123:web:abcdef1234567

# Payment Configuration
REACT_APP_PAYSTACK_PUBLIC_KEY=

# Environment
REACT_APP_ENV=development
```

## Step 3: Enable Email/Password Auth

1. In Firebase Console, go to **Authentication**
2. Click **Sign-in method** tab
3. Find **Email/Password**
4. Click on it and toggle **Enable**
5. Click **Save**

## Step 4: Restart the App

```bash
# If running, press Ctrl+C to stop
npm start
```

The app will automatically reload with Firebase integrated!

## Step 5: Test It!

1. Click **Login / Subscribe**
2. Sign Up with:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123
3. Should see success message and be logged in!

## Done! ✅

Firebase authentication is now live. You can:
- ✅ Sign up with email/password
- ✅ Log in with your account
- ✅ Stay logged in across page refreshes
- ✅ View users in Firebase Console → Authentication → Users

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check `.env` file has all Firebase values
- Restart app: `npm start`
- Make sure keys don't have extra spaces

### "Firebase: Error (auth/operation-not-allowed)"
- Go to Firebase Console
- Authentication → Sign-in method
- Toggle **Email/Password** to ON

### "Firebase: Error (auth/weak-password)"
- Password must be 6+ characters
- Try: `Test@123`

### Nothing happens when I sign up
- Check browser console (F12)
- Verify all `.env` values are correct
- Make sure Email/Password is enabled in Firebase

## Next Steps

1. Add profile picture upload
2. Set up Firestore for conversations
3. Add email verification
4. Set up password reset

See `FIREBASE_SETUP.md` for detailed docs.

---

**Questions?** Check the browser console (F12 → Console tab) for error messages!
