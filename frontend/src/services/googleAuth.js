/**
 * Google OAuth Service
 * Handles Google authentication (login/signup)
 */

import api from './api';

// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
  scope: 'profile email',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
  ]
};

/**
 * Handle Google OAuth response (credential token)
 * @param {string} credentialToken - JWT token from Google
 * @returns {Promise} Response with user and auth token
 */
export const handleGoogleAuth = async (credentialToken) => {
  try {
    const response = await api.post('/auth/google', {
      token: credentialToken
    });
    
    return response.data;
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to authenticate with Google. Please try again.'
    );
  }
};

/**
 * Decode JWT token from Google to get user info
 * @param {string} token - JWT token from Google
 * @returns {object} Decoded user information
 */
export const decodeGoogleToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
