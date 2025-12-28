# Deploy to Render.com - Step by Step

## Why Render > Railway
✅ More stable proxy/networking
✅ Better free tier
✅ Clearer error messages
✅ Works out of the box

---

## Quick Deploy (5 Minutes)

### Step 1: Sign Up
1. Go to https://render.com
2. Sign up with GitHub (easiest)
3. Authorize Render to access your repositories

### Step 2: Create Backend Service

1. Click **"New +"** → **"Web Service"**
2. Connect your `tangping` repository
3. Configure:
   - **Name**: `tangping-backend`
   - **Region**: Oregon (Free)
   - **Root Directory**: `Backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables** (click "Advanced"):
   ```
   MONGODB_URI = <your-mongodb-connection-string>
   JWT_SECRET = <any-random-secret>
   GOOGLE_CLIENT_ID = <from-google-console>
   GOOGLE_CLIENT_SECRET = <from-google-console>
   FRONTEND_URL = https://tangping-frontend.onrender.com
   BACKEND_URL = https://tangping-backend.onrender.com
   NODE_ENV = production
   ```

5. Click **"Create Web Service"**

### Step 3: Create Frontend Service

1. Click **"New +"** → **"Static Site"**
2. Connect your `tangping` repository
3. Configure:
   - **Name**: `tangping-frontend`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variables**:
   ```
   VITE_API_URL = https://tangping-backend.onrender.com
   ```

5. Click **"Create Static Site"**

### Step 4: Update URLs

After both deploy (5-10 minutes):

1. Get your actual Render URLs:
   - Backend: `https://tangping-backend.onrender.com` (or similar)
   - Frontend: `https://tangping-frontend.onrender.com`

2. Update Backend environment variables:
   - `FRONTEND_URL` → Your actual frontend URL
   - `BACKEND_URL` → Your actual backend URL

3. Update Frontend environment variables:
   - `VITE_API_URL` → Your actual backend URL

4. Both will auto-redeploy with new variables

### Step 5: Update Google Console

1. Go to Google Cloud Console → Credentials
2. Add to **Authorized redirect URIs**:
   ```
   https://tangping-backend.onrender.com/auth/google/callback
   ```
3. Add to **Authorized JavaScript origins**:
   ```
   https://tangping-frontend.onrender.com
   ```

---

## Test It

1. Visit: `https://tangping-backend.onrender.com/health`
   - Should return: `{"status":"ok"...}`

2. Visit your frontend URL
3. Click "Sign in with Google"
4. Should redirect to Google login!

---

## Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| Free tier | ✅ 750 hours/month | ✅ $5 credit |
| Stability | ✅ Very stable | ❌ Proxy issues |
| Setup | ✅ Simple | ⚠️ Complex |
| Logs | ✅ Clear | ⚠️ Mixed |
| Cold starts | ⚠️ ~30s | ✅ Fast |

**Note**: Render free tier services sleep after 15 min of inactivity. First request takes ~30s to wake up. Paid tier ($7/mo) has no sleep.

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Make sure MongoDB Atlas allows Render IPs (0.0.0.0/0)

### Frontend 404 errors
- Check that `Publish Directory` is set to `dist`
- Verify the build command ran successfully
- Check Render build logs

### OAuth fails
- Verify Google Console has correct callback URL
- Check `BACKEND_URL` and `FRONTEND_URL` match actual Render URLs
- Check backend logs for OAuth errors

---

## Alternative: Use Render Blueprint (Advanced)

Instead of manual setup, you can use the `render.yaml` file:

1. Push the `render.yaml` to your repo
2. In Render dashboard: New → Blueprint
3. Connect your repo
4. Render will auto-create both services
5. Just add environment variables

This is faster but requires understanding YAML syntax.
