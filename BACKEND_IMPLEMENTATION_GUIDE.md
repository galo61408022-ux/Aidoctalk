# Backend Implementation Guide - Authentication Features

## Overview
This guide provides instructions for implementing backend endpoints and Firebase configuration to support the new authentication features in the frontend.

---

## 1. Forgot Password Implementation

### Frontend Trigger
**File:** `src/AuthScreen.jsx`  
**Handler:** `handleForgotPassword()`  
**Flow:**
```
1. User enters email in modal
2. Clicks "Send Link"
3. Frontend calls `/api/auth/forgot-password`
4. Toast shows "Password reset link sent"
```

### Backend Endpoint: POST `/api/auth/forgot-password`

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Password reset link sent to your email",
  "resetTokenExpires": "2024-01-15T10:30:00Z"
}
```

#### Response (Error)
```json
{
  "success": false,
  "message": "User with this email not found"
}
```

### Implementation (Node.js/Express)
```javascript
// In routes/auth.js
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists
      return res.status(200).json({ 
        message: 'Password reset link sent to your email' 
      });
    }

    // 3. Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.resetToken = resetTokenHash;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 4. Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Using sendgrid, nodemailer, etc.
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
      `
    });

    res.status(200).json({ 
      message: 'Password reset link sent to your email' 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```

### Required User Model Fields
```javascript
{
  resetToken: String,           // Hashed token
  resetTokenExpires: Date       // Expiry timestamp
}
```

### Email Service Setup
```javascript
// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  return transporter.sendMail(mailOptions);
};
```

---

## 2. Reset Password Implementation

### Frontend Component (To Create)
**File:** `src/ResetPassword.jsx` (NEW)

```javascript
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');
    
    // Call backend endpoint
    // POST /api/auth/reset-password
    // Body: { token, password, confirmPassword }
  };

  return (
    // Password reset form UI
  );
}
```

### Backend Endpoint: POST `/api/auth/reset-password`

#### Request Body
```json
{
  "token": "reset_token_from_email",
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

#### Response (Error)
```json
{
  "success": false,
  "message": "Reset token expired or invalid"
}
```

### Implementation
```javascript
// In routes/auth.js
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    // 1. Validate inputs
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // 2. Hash the token
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 3. Find user with valid token
    const user = await User.findOne({
      resetToken: resetTokenHash,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // 4. Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    // 5. Invalidate all existing tokens
    // (Optional: force re-login on all devices)

    res.status(200).json({ 
      message: 'Password updated successfully' 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```

---

## 3. Google Sign Up Implementation

### Frontend Trigger
**File:** `src/AuthScreen.jsx`  
**Handler:** `handleGoogleSignUp()`

### Firebase Google Provider Setup

#### 1. Enable Google Provider in Firebase Console
```
Firebase Console > Authentication > Sign-in method
1. Click "Sign-in providers"
2. Enable "Google"
3. Add your app to Google Cloud Project
4. Copy Client ID
```

#### 2. Update Frontend Service
```javascript
// In src/services/authService.js
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    
    // Get token and send to backend for user creation
    const token = await result.user.getIdToken();
    
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      token
    };
  } catch (error) {
    throw error;
  }
};
```

#### 3. Update Auth Handler
```javascript
// In src/AuthScreen.jsx
const handleGoogleSignUp = async () => {
  try {
    addToast('Redirecting to Google...', 'info');
    const googleUser = await loginWithGoogle();
    
    // Send to backend to create/update user
    const response = await fetch('/api/auth/google-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: googleUser.uid,
        email: googleUser.email,
        name: googleUser.displayName,
        photoURL: googleUser.photoURL
      })
    });

    const data = await response.json();
    addToast('Account created successfully!', 'success');
    onLogin();
  } catch (err) {
    addToast(err.message, 'error');
  }
};
```

### Backend Endpoint: POST `/api/auth/google-signup`

#### Request Body
```json
{
  "uid": "firebase_uid",
  "email": "user@gmail.com",
  "name": "John Doe",
  "photoURL": "https://..."
}
```

#### Response
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@gmail.com",
    "name": "John Doe",
    "firebaseUid": "firebase_uid"
  },
  "token": "jwt_token"
}
```

### Implementation
```javascript
// In routes/auth.js
router.post('/google-signup', async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;

    // 1. Validate Firebase UID with Admin SDK
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUser(uid);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid Firebase UID' });
    }

    // 2. Find or create user
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      user = new User({
        firebaseUid: uid,
        email: email,
        name: name,
        photoURL: photoURL,
        isSubscribed: false,
        subscriptionPlan: 'free',
        createdAt: new Date()
      });
      await user.save();
    } else {
      // Update existing user
      user.photoURL = photoURL;
      await user.save();
    }

    // 3. Generate JWT token
    const jwtToken = jwt.sign(
      { 
        userId: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firebaseUid: user.firebaseUid,
        photoURL: user.photoURL
      },
      token: jwtToken
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```

---

## 4. Profile Picture Upload Implementation

### Frontend Trigger
**File:** `src/LoggedInChat.jsx`  
**Component:** Profile section

### Backend Endpoint: POST `/api/users/:id/profile-picture`

#### Request Format
```
Content-Type: multipart/form-data
Body:
  - file: [image file]
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Profile picture updated successfully",
  "photoURL": "https://storage.googleapis.com/..."
}
```

### Implementation
```javascript
// In routes/users.js
const multer = require('multer');
const admin = require('firebase-admin');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

router.post('//:id/profile-picture', 
  verifyToken, 
  upload.single('file'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Upload to Firebase Storage
      const bucket = admin.storage().bucket();
      const fileName = `profile-pictures/${user.firebaseUid}/${Date.now()}.jpg`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype
        }
      });

      // Generate download URL
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15778800000 // 6 months
      });

      // Update user document
      user.photoURL = url;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        photoURL: url
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
```

### Frontend Service
```javascript
// In src/services/aiService.js
export const uploadProfilePicture = async (userId, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/profile-picture`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload profile picture');
  }

  return response.json();
};
```

---

## 5. Change Password Implementation

### Frontend Trigger
**File:** `src/LoggedInChat.jsx`  
**Component:** Profile section → Security

### Backend Endpoint: POST `/api/auth/change-password`

#### Request Body
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

#### Response (Success)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Response (Error)
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

### Implementation
```javascript
// In routes/auth.js
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // 1. Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        message: 'New passwords do not match' 
      });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ 
        message: 'New password must be different' 
      });
    }

    // 2. Find user
    const user = await User.findById(userId);
    if (!user || !user.password) {
      return res.status(400).json({ 
        message: 'User not found or uses social login' 
      });
    }

    // 3. Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword, 
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: 'Current password is incorrect' 
      });
    }

    // 4. Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ 
      message: 'Password changed successfully' 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```

---

## Environment Variables Required

Add these to your `.env` file:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_ADMIN_SDK_KEY=path/to/serviceAccountKey.json

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@aidoctalk.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
# or production
FRONTEND_URL=https://aidoctalk.com

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

---

## Testing Checklist

- [ ] Forgot password email sends correctly
- [ ] Reset password token expires after 1 hour
- [ ] Reset password with invalid token shows error
- [ ] Google sign up creates user in database
- [ ] Google sign up generates JWT token
- [ ] Profile picture upload to Firebase Storage
- [ ] Profile picture URL stored in user document
- [ ] Change password validates current password
- [ ] Change password updates in database
- [ ] All endpoints return proper error responses
- [ ] Authorization headers checked for all endpoints

---

## Security Considerations

1. **Password Reset Tokens**
   - Hashed in database
   - Time-limited (1 hour)
   - One-time use only
   - Deleted after use

2. **Google OAuth**
   - Verify Firebase UID
   - Validate email from Google
   - Store Firebase UID in database

3. **Profile Pictures**
   - Validate file type
   - Limit file size (5MB)
   - Use Firebase Storage security rules
   - Generate time-limited signed URLs

4. **Password Storage**
   - Hash with bcrypt (10+ rounds)
   - Never store plain text
   - Never log passwords

5. **Rate Limiting**
   - Limit password reset attempts
   - Limit login attempts
   - Limit profile picture uploads

---

## Deployment Notes

1. **Before Production**
   - Update all URLs to use HTTPS
   - Set strong JWT_SECRET
   - Configure Firebase in production
   - Set up email service provider
   - Enable CORS for your domain

2. **Database Migrations**
   - Add resetToken field to User model
   - Add resetTokenExpires field
   - Add photoURL field
   - Add firebaseUid field (if not exists)

3. **Firebase Setup**
   - Download service account key
   - Enable Google OAuth provider
   - Configure Storage bucket rules
   - Set up CORS for Storage

---

## File Changes Summary

| File | Type | Status |
|------|------|--------|
| routes/auth.js | Modify | Add 3 new endpoints |
| routes/users.js | Modify | Add profile picture endpoint |
| models/User.js | Modify | Add reset token fields |
| services/emailService.js | Create | Email sending |
| .env | Modify | Add email & Firebase config |

---

## Support & Questions

For questions about implementation, refer to:
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Docs](https://expressjs.com)
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
