# Railway Deployment Guide for Tangping

This project uses a monorepo structure with separate Frontend and Backend services.

## Architecture

- **Frontend**: React + Vite application (served with `serve` package)
- **Backend**: Node.js + Express API with MongoDB

## Deployment Steps

### 1. Create Two Railway Services

You need to deploy the Frontend and Backend as **separate Railway services** from the same repository.

#### Service 1: Backend API

1. Create a new service in Railway
2. Connect to your GitHub repository
3. Configure the service:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm ci --omit=dev` (configured in nixpacks.toml)
   - **Start Command**: `npm start` (automatically detected)

4. Set Environment Variables:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   BACKEND_URL=<your-backend-railway-url>
   FRONTEND_URL=<your-frontend-railway-url>
   GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
   ```
   Note:
   - `PORT` is automatically set by Railway
   - `BACKEND_URL` should be your backend Railway URL (e.g., `https://tangping-backend.railway.app`)

5. Deploy the service

#### Service 2: Frontend

1. Create another new service in Railway
2. Connect to the same GitHub repository
3. Configure the service:
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`

4. Set Environment Variables:
   ```
   VITE_API_URL=<your-backend-railway-url>
   ```
   Note: `PORT` is automatically set by Railway

5. Deploy the service

### 2. Configure Google OAuth Console

**CRITICAL:** You must add the Railway callback URL to your Google OAuth configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   https://<your-backend-railway-url>/auth/google/callback
   ```
   Example: `https://tangping-backend.railway.app/auth/google/callback`
4. Save the changes

**Without this step, Google OAuth will fail with a 502 error!**

### 3. Update Environment Variables

After both services are deployed:

1. Get the Backend service URL from Railway
2. Update Backend's `BACKEND_URL` to the Backend Railway URL (e.g., `https://tangping-backend.railway.app`)
3. Update Frontend's `VITE_API_URL` to point to the Backend URL
4. Get the Frontend service URL from Railway
5. Update Backend's `FRONTEND_URL` to point to the Frontend URL
6. Redeploy both services to apply changes

### 3. Configure Custom Domain (Optional)

If you want to use a custom domain:
1. Add your domain in Railway settings for each service
2. Update the environment variables accordingly
3. Update Vite config if needed

## Configuration Files

### Root Level
- `package.json` - Monorepo orchestration
- `railway.toml` - Railway configuration documentation

### Frontend
- `Frontend/nixpacks.toml` - Nixpacks build configuration
- `Frontend/.env.example` - Environment variables template
- `Frontend/vite.config.js` - Vite configuration with Railway preview settings

### Backend
- `Backend/nixpacks.toml` - Nixpacks build configuration
- `Backend/.env.example` - Environment variables template
- `Backend/server.js` - Server with CORS configured for production

## Important Notes

1. **Build Order**: Frontend must be built before starting (handled by nixpacks.toml)
2. **CORS**: Backend is configured to accept requests from `FRONTEND_URL` environment variable
3. **Port Binding**: Both services use `process.env.PORT` which Railway sets automatically
4. **MongoDB**: Make sure your MongoDB cluster allows connections from Railway's IP addresses
5. **Google OAuth**: Update your Google OAuth settings to include the production callback URL

## Troubleshooting

### Frontend shows blank page
- Check that `VITE_API_URL` is set correctly
- Verify the build completed successfully
- Check browser console for errors

### Backend connection errors
- Verify `MONGODB_URI` is correct
- Check that MongoDB allows Railway IP addresses
- Verify `FRONTEND_URL` is set for CORS

### OAuth shows 502 gateway error
- **MOST COMMON**: Check Google Console has the correct callback URL added:
  - Go to Google Cloud Console → Credentials → Your OAuth Client
  - Verify `https://<backend-url>/auth/google/callback` is in "Authorized redirect URIs"
- Verify `BACKEND_URL` environment variable is set correctly on Railway
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Ensure `FRONTEND_URL` is set for the redirect after authentication
- Check Railway logs for any backend errors during OAuth flow

## Local Development

```bash
# Install all dependencies
npm run install:all

# Run frontend (in one terminal)
npm run dev:frontend

# Run backend (in another terminal)
npm run dev:backend
```

Make sure to create `.env` files in both Frontend and Backend directories based on the `.env.example` files.
