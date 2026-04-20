# Google OAuth Implementation - Quick Start Guide

## Summary of Changes

### Frontend Changes
1. **Updated `public/index.html`**
   - Added Google Sign-In script: `<script src="https://accounts.google.com/gsi/client" async defer></script>`

2. **Updated `src/pages/Login/Login.jsx`**
   - Added `useEffect` to initialize Google Sign-In
   - Added `handleGoogleSignIn` callback
   - Added Google Sign-In button container
   - Integrated with existing authentication flow

3. **Updated `src/pages/Signup/Signup.jsx`**
   - Added `useEffect` to initialize Google Sign-In
   - Added `handleGoogleSignUp` callback
   - Added Google Sign-In button container
   - Integrated with existing authentication flow

4. **Updated `src/context/AuthContext.jsx`**
   - Imported Google OAuth service
   - Added `googleAuth` method to handle Google token authentication
   - Exported `googleAuth` in context value

5. **Created `src/services/googleAuth.js`**
   - Google OAuth configuration
   - `handleGoogleAuth` function to send token to backend
   - `decodeGoogleToken` utility function

### Backend Changes
1. **Updated `routes/authRoutes.js`**
   - Added `POST /auth/google` endpoint

2. **Updated `controllers/authController.js`**
   - Added `googleAuth` function to handle Google token
   - Added `decodeGoogleToken` helper function
   - Automatically creates user if doesn't exist
   - Returns JWT token for authentication

### Configuration Files
1. **Updated `frontend/.env.sample`**
   - Added `REACT_APP_GOOGLE_CLIENT_ID` configuration option

## Required Setup Steps

### 1. Get Google OAuth Credentials
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable Google+ API
- Create OAuth 2.0 credentials (Web application)
- Copy the Client ID

### 2. Configure Frontend Environment
Create `.env` file in frontend directory:
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm start
```

### 4. Test Google OAuth
1. Navigate to `https://aaoms-test.onrender.com/login`
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be logged in and redirected

## File Locations

### Modified Files:
- `frontend/public/index.html`
- `frontend/src/pages/Login/Login.jsx`
- `frontend/src/pages/Signup/Signup.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/.env.sample`
- `backend/routes/authRoutes.js`
- `backend/controllers/authController.js`

### New Files:
- `frontend/src/services/googleAuth.js`
- `GOOGLE_OAUTH_SETUP.md` (detailed setup guide)

## Features Implemented

✅ Google Sign-In button on Login page
✅ Google Sign-Up on Signup page
✅ Token-based authentication
✅ Automatic user account creation
✅ Profile picture integration
✅ Toast notifications for success/error
✅ Role-based redirects (customer/admin/super_admin)
✅ Google Sign-In SDK integration

## Testing Checklist

- [ ] Google Client ID obtained from Google Cloud Console
- [ ] `.env` file created with `REACT_APP_GOOGLE_CLIENT_ID`
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] Login page loads with Google Sign-In button
- [ ] Signup page loads with Google Sign-In button
- [ ] Can sign in with Google account
- [ ] Can sign up with Google account
- [ ] User is redirected correctly after login
- [ ] User data is saved correctly

## Troubleshooting Tips

1. **Google button not showing:**
   - Check browser console for errors
   - Verify `REACT_APP_GOOGLE_CLIENT_ID` is set in `.env`
   - Ensure Google script loaded: `https://accounts.google.com/gsi/client`

2. **"Invalid Client ID" error:**
   - Double-check Client ID in `.env`
   - Verify localhost:3000 is in authorized redirect URIs

3. **Backend connection error:**
   - Ensure backend is running on port 5000
   - Check `REACT_APP_API_URL` in `.env`

4. **Token verification error:**
   - Backend uses simple token decoding
   - For production, implement proper verification using `google-auth-library`

## Production Deployment Notes

1. **Update Google Cloud Console:**
   - Add your production domain to authorized redirect URIs
   - Update `REACT_APP_GOOGLE_CLIENT_ID` for production

2. **Use HTTPS:**
   - Google OAuth requires HTTPS in production
   - Update redirect URLs to use HTTPS

3. **Implement Token Verification:**
   - Install `google-auth-library`: `npm install google-auth-library`
   - Use proper token verification instead of simple decoding
   - See `GOOGLE_OAUTH_SETUP.md` for details

4. **Secure Environment Variables:**
   - Use proper secrets management
   - Never commit `.env` file to git
   - Use `.env.sample` for examples

## API Documentation

### POST /auth/google
Authenticates user with Google token

**Request:**
```json
{
  "token": "google_jwt_token_from_frontend"
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
    "profilePicture": "https://..."
  }
}
```

## Next Steps

1. Complete Google Cloud Console setup (see GOOGLE_OAUTH_SETUP.md)
2. Add `REACT_APP_GOOGLE_CLIENT_ID` to `.env`
3. Test login/signup functionality
4. Deploy to production with HTTPS
5. Implement token verification for production (optional but recommended)
