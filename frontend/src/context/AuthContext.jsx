import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { handleGoogleAuth, decodeGoogleToken } from '../services/googleAuth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        name
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return user;
    } catch (err) {
      let message = 'Signup failed';
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.status === 400) {
        message = 'Invalid input. Please check your details.';
      } else if (err.response?.status === 409) {
        message = 'Email already registered. Try logging in.';
      } else if (err.message === 'Network Error') {
        message = 'Network error. Please check your connection or ensure backend is running.';
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return user;
    } catch (err) {
      let message = 'Login failed';
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (err.response?.status === 400) {
        message = 'Please enter email and password';
      } else if (err.message === 'Network Error') {
        message = 'Cannot connect to server. Is backend running on port 5000?';
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const googleAuth = async (credentialToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await handleGoogleAuth(credentialToken);
      
      const { token, user } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return user;
    } catch (err) {
      let message = 'Google authentication failed';
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Exact role matching for admin / super_admin separation
    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }
    if (requiredRole === 'super_admin') {
      return user.role === 'super_admin';
    }
    
    // For other roles, use hierarchy
    const roleHierarchy = {
      'customer': 1,
      'admin': 2,
      'super_admin': 3
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  };

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    googleAuth,
    logout,
    updateUser,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
