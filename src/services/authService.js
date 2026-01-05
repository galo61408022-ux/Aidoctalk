/**
 * Authentication Service with Firebase
 * Handles user login, signup, and token management using Firebase Auth
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  /**
   * Login user with email and password using Firebase
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth response with user data
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email,
        photoURL: user.photoURL,
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return {
        token: await user.getIdToken(),
        user: userData,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Sign up new user with Firebase
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth response with user data
   */
  async signup(name, email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: name,
      });

      const userData = {
        id: user.uid,
        name: name,
        email: user.email,
        photoURL: user.photoURL,
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return {
        token: await user.getIdToken(),
        user: userData,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  },

  /**
   * Get current stored token from Firebase
   * @returns {Promise<string|null>} JWT token or null
   */
  async getToken() {
    if (!auth.currentUser) {
      return null;
    }
    try {
      return await auth.currentUser.getIdToken(true);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  /**
   * Get current user data
   * @returns {Object|null} User data or null
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get current Firebase user
   * @returns {Object|null} Firebase user or null
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Logout user from Firebase
   */
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} updates - Profile updates (name, photoURL, etc)
   * @returns {Promise<void>}
   */
  async updateUserProfile(updates) {
    try {
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }
      
      await updateProfile(auth.currentUser, updates);
      
      // Update localStorage
      const user = this.getUser();
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  },

  /**
   * Subscribe user (mark as subscribed)
   * @param {Object} subscriptionData - Subscription details
   * @returns {Promise<Object>} Updated user data
   */
  async subscribeUser(subscriptionData) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be logged in to subscribe');
      }

      const user = this.getUser();
      const updatedUser = {
        ...user,
        subscribed: true,
        subscriptionDate: new Date().toISOString(),
        ...subscriptionData,
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Subscription error:', error);
      throw new Error(error.message || 'Failed to subscribe');
    }
  },

  /**
   * Check if user is subscribed
   * @returns {boolean} Whether user is subscribed
   */
  isSubscribed() {
    const user = this.getUser();
    return user?.subscribed || false;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Whether user is authenticated
   */
  isAuthenticated() {
    return !!auth.currentUser;
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback function that receives user data
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        callback(userData);
      } else {
        localStorage.removeItem('user');
        callback(null);
      }
    });
  },

  /**
   * Handle Paystack subscription
   * @param {string} email - User email
   * @param {number} amount - Amount in naira
   * @returns {Promise<Object>} Paystack response
   */
  async initiatePaystackPayment(email, amount) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/paystack/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ email, amount }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment initiation error:', error);
      throw error;
    }
  },

  /**
   * Verify Paystack payment
   * @param {string} reference - Paystack payment reference
   * @returns {Promise<Object>} Payment verification result
   */
  async verifyPaystackPayment(reference) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/paystack/verify/${reference}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  },
};
