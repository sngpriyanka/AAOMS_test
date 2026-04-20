# Google OAuth Setup Guide

## Overview
This document provides instructions for setting up Google OAuth (Sign-In) functionality for your AAXOMS e-commerce platform.

## Step 1: Get Google OAuth Credentials

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "AAXOMS OAuth")
5. Click "CREATE"

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and then click "ENABLE"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the app name, user support email, and developer contact
   - Add scopes: `email` and `profile`
   - Add yourself as a test user (your email)
4. Return to creating credentials, select "Web application"
5. Add authorized redirect URIs:
   - `https://aaoms-test.onrender.com`
   - `http://localhost:5000`
   - Your production domain (e.g., `https://www.yourdomain.com`)
6. Click "CREATE"
7. Copy the **Client ID** (you'll need this)

## Step 2: Frontend Configuration

### 2.1 Set Environment Variables
Create or update `.env` file in the frontend directory:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Example:
```env
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### 2.2 Verify Frontend Setup
The following files have already been updated:
- ✅ `public/index.html` - Google Sign-In script added
- ✅ `src/pages/Login/Login.jsx` - Google Sign-In button integrated
- ✅ `src/pages/Signup/Signup.jsx` - Google Sign-Up button integrated
- ✅ `src/context/AuthContext.jsx` - Google authentication handler added
- ✅ `src/services/googleAuth.js` - Google OAuth service created

## Step 3: Backend Configuration

### 3.1 Verify Backend Setup
The following files have been updated:
- ✅ `routes/authRoutes.js` - Added `/auth/google` endpoint
- ✅ `controllers/authController.js` - Added Google authentication handler

### 3.2 Ensure Environment Variables
Make sure your backend has:
```env
JWT_SECRET=your_jwt_secret_here
```

## Step 4: Testing Google OAuth

### 4.1 Test Login Page
1. Start the frontend: `npm start` (in frontend directory)
2. Navigate to `/login`
3. You should see a "Continue with Google" button
4. Click it and sign in with a Google account
5. You should be redirected to the dashboard

### 4.2 Test Signup Page
1. Navigate to `/signup`
2. Click "Continue with Google"
3. Sign up with a Google account
4. You should be redirected to the dashboard

### 4.3 Expected Flow
1. User clicks "Continue with Google"
2. Google Sign-In dialog appears
3. User selects their Google account
4. Frontend receives credential token
5. Token is sent to backend (`POST /auth/google`)
6. Backend decodes token and creates/fetches user
7. JWT token is returned to frontend
8. User is logged in and redirected

## Troubleshooting

### Issue: "Google is not defined" error
**Solution:** The Google Sign-In script may not have loaded. Check:
- Network tab in browser console
- Script is loading from `https://accounts.google.com/gsi/client`
- Page is loaded over HTTPS in production

### Issue: "Invalid Client ID" error
**Solution:**
- Verify the Client ID is correct in `.env`
- Ensure the domain is whitelisted in Google Cloud Console
- Clear browser cache and localStorage

### Issue: CORS errors
**Solution:**
- Ensure backend is running on the correct port (default: 5000)
- Check that the redirect URIs include your local/production domains
- Verify browser console for exact error message

### Issue: Token verification fails
**Solution:**
- The current implementation uses token decoding without verification
- For production, install and use `google-auth-library`:
  ```bash
  npm install google-auth-library
  ```
- Update the backend to properly verify tokens with Google

## Production Deployment

### Important Security Notes
1. **Use HTTPS:** Google OAuth requires HTTPS in production
2. **Verify Tokens:** Implement proper token verification using `google-auth-library`
3. **Environment Variables:** Use secure environment variable management
4. **CORS:** Properly configure CORS for your production domain
5. **Redirect URLs:** Update all authorized redirect URIs in Google Cloud Console

### Verification Implementation (Recommended for Production)
Install the library:
```bash
npm install google-auth-library
```

Update `authController.js`:
```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  return ticket.getPayload();
}
```

## API Endpoints

### POST /auth/google
**Request:**
```json
{
  "token": "google_jwt_token"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Google authentication successful",
  "token": "jwt_auth_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "customer",
    "profilePicture": "url_to_picture"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid Google token"
}
```

## Features Implemented

✅ Google Sign-In button on Login page
✅ Google Sign-Up on Signup page
✅ Token-based authentication
✅ Automatic user creation from Google data
✅ Profile picture integration
✅ Role-based access control (defaults to 'customer')
✅ Toast notifications for success/error
✅ Automatic redirect based on user role

## Next Steps

1. Set up Google Cloud Project and get Client ID
2. Add `REACT_APP_GOOGLE_CLIENT_ID` to `.env` file
3. Test login/signup functionality
4. Deploy to production with HTTPS
5. Update Google Cloud Console with production redirect URIs
6. Implement token verification for production (optional but recommended)

## Support

For more information, visit:
- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [Google Cloud Console](https://console.cloud.google.com/)
