# Google OAuth Setup Guide

This guide will help you set up Google OAuth for the Tangping application.

## Prerequisites

- A Google Cloud Platform account
- Your application deployed on Railway (or know your backend URL)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name your project (e.g., "Tangping")
4. Click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields (App name, User support email, Developer email)
   - Add scopes: `email`, `profile`
   - Add test users if needed
   - Save and continue

### 4. Configure OAuth Client ID

1. Select "Web application" as the application type
2. Name it (e.g., "Tangping Web App")
3. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://<your-frontend-railway-url>
   ```
   Example: `https://tangping.railway.app`

4. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   https://<your-backend-railway-url>/auth/google/callback
   ```
   Example: `https://tangping-backend.railway.app/auth/google/callback`

5. Click "Create"

### 5. Save Your Credentials

1. Copy the **Client ID** and **Client Secret**
2. Add them to your Railway environment variables:
   - `GOOGLE_CLIENT_ID` = Your Client ID
   - `GOOGLE_CLIENT_SECRET` = Your Client Secret

### 6. Update Railway Environment Variables

Make sure these variables are set on your **Backend** Railway service:

```
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
BACKEND_URL=https://<your-backend-railway-url>
FRONTEND_URL=https://<your-frontend-railway-url>
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### 7. Redeploy

After setting all environment variables, redeploy your Backend service on Railway.

## Common Issues

### 502 Gateway Error

**Symptom:** Clicking "Sign in with Google" shows a 502 error.

**Solution:**
1. Verify `BACKEND_URL` is set correctly in Railway
2. Check that the Google Console callback URL matches exactly: `https://<backend-url>/auth/google/callback`
3. Make sure there are no trailing slashes
4. Redeploy after making changes

### Redirect URI Mismatch

**Symptom:** Google shows "Error 400: redirect_uri_mismatch"

**Solution:**
1. Copy the redirect URI from the error message
2. Go to Google Cloud Console → Credentials
3. Add the exact URI to "Authorized redirect URIs"
4. Save and try again

### Cannot Get User Profile

**Symptom:** Authentication succeeds but user data is missing

**Solution:**
1. Make sure you've enabled the Google+ API
2. Verify the scopes include `profile` and `email`
3. Check the passport configuration in `Backend/config/passport.js`

## Testing Locally

For local development:

1. Add to `Backend/.env`:
   ```
   BACKEND_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=<your-client-id>
   GOOGLE_CLIENT_SECRET=<your-client-secret>
   ```

2. Make sure Google Console has `http://localhost:3000/auth/google/callback` in redirect URIs

3. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm run dev

   # Terminal 2 - Frontend
   cd Frontend
   npm run dev
   ```

## Security Notes

- Never commit `.env` files to git
- Keep your `GOOGLE_CLIENT_SECRET` secure
- Use different OAuth clients for development and production if possible
- Regularly rotate your JWT_SECRET in production

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
