import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to restore user from localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to Firebase auth state changes on mount
  useEffect(() => {
    let mounted = true;
    
    // Set a timeout to ensure loading doesn't hang forever
    const timeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auth loading timeout - setting to false');
        setIsLoading(false);
      }
    }, 3000);

    try {
      const unsubscribe = authService.onAuthStateChanged((userData) => {
        if (mounted) {
          setUser(userData);
          setIsLoading(false);
          clearTimeout(timeout);
        }
      });

      return () => {
        mounted = false;
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (err) {
      console.warn('Firebase auth error, falling back to guest mode:', err);
      if (mounted) {
        setIsLoading(false);
        clearTimeout(timeout);
      }
      return () => {
        mounted = false;
        clearTimeout(timeout);
      };
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.signup(name, email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Signup failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      setIsLoading(true);
      const updatedUser = await authService.updateUserProfile(updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update profile';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async (subscriptionData = {}) => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!authService.isAuthenticated()) {
        throw new Error('You must be logged in to subscribe');
      }

      const updatedUser = await authService.subscribeUser(subscriptionData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMsg = err.message || 'Subscription failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        subscribe,
        clearError,
        isAuthenticated: !!user,
        isSubscribed: user?.subscribed || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
