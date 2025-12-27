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
   GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
   FRONTEND_URL=<your-frontend-railway-url>
   ```
   Note: `PORT` is automatically set by Railway

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

### 2. Update Environment Variables

After both services are deployed:

1. Get the Backend service URL from Railway
2. Update Frontend's `VITE_API_URL` to point to the Backend URL
3. Get the Frontend service URL from Railway
4. Update Backend's `FRONTEND_URL` to point to the Frontend URL
5. Redeploy both services if necessary

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

### OAuth not working
- Update Google OAuth redirect URIs to include production URLs
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
- Check callback URLs match your OAuth configuration

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
