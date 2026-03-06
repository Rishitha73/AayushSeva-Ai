# Deployment Guide: Vercel (Frontend) + Netlify (Backend)

## Overview
- **Frontend**: Deployed to Vercel (recommended for React/Vite apps)
- **Backend**: Deployed to Netlify Functions (serverless)
- **Database**: MongoDB Atlas (recommended for both services)

---

## Part 1: Backend Deployment (Netlify Functions)

### Prerequisites
1. Netlify account (https://netlify.com)
2. MongoDB Atlas account with connection string
3. Git repository with your code

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Restructure Backend for Netlify Functions
Your Express app needs to be converted to Netlify Functions format:

#### Create `/netlify/functions/` directory structure:
```
backend/
  netlify/
    functions/
      api.js          <- Your Express app handler
  .env
  .env.example
  package.json
  server.js           <- Keep for local testing
```

#### Create the functions handler file
See: `NETLIFY_SETUP.md` for detailed code changes

### Step 3: Configure Environment Variables
Create `.env` file in backend root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Step 4: Create `netlify.toml` Configuration
See: `netlify.toml` file in backend root

### Step 5: Login and Deploy
```bash
cd backend
netlify login
netlify deploy
```

After the test deployment succeeds, deploy to production:
```bash
netlify deploy --prod
```

### Step 6: Configure Production Environment Variables
In Netlify Dashboard:
1. Go to Site Settings → Environment
2. Add all variables from your `.env` file
3. Add `NODE_VERSION=18` (or your Node version)

---

## Part 2: Frontend Deployment (Vercel)

### Prerequisites
1. Vercel account (https://vercel.com)
2. GitHub repository

### Step 1: Update API Configuration
In `frontend/src/api.js`, update the base URL:

```javascript
const API_BASE_URL = process.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-netlify-site.netlify.app' 
    : 'http://localhost:5000');
```

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-netlify-backend-url.netlify.app
```

### Step 2: Create `vercel.json` Configuration
See: `vercel.json` file in frontend root

### Step 3: Deploy via GitHub
1. Push your code to GitHub
2. Go to https://vercel.com and sign in
3. Click "New Project"
4. Select your GitHub repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### Step 4: Configure Environment Variables in Vercel
In Vercel Dashboard → Project Settings → Environment Variables:
```
VITE_API_URL = https://your-netlify-backend-url.netlify.app
```

---

## Part 3: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user
4. Get connection string

### Step 2: Configure Network Access
- Add `0.0.0.0/0` to allow connections from anywhere (Netlify)
- Or add Netlify IP ranges for better security

### Step 3: Use Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

---

## Part 4: Post-Deployment Testing

### Test Backend API
```bash
curl https://your-netlify-site.netlify.app/api/auth/health
```

### Test Frontend
Visit: `https://your-vercel-domain.vercel.app`

### Check Logs
- **Netlify**: Dashboard → Logs → Functions
- **Vercel**: Dashboard → Deployments → Logs

---

## Common Issues & Solutions

### 1. CORS Errors
**Problem**: Frontend can't access backend
**Solution**: 
- Update `CORS_ORIGIN` in backend environment
- Add `CLIENT_URL` in backend .env

### 2. Function Timeout
**Problem**: API requests timing out
**Solution**:
- Netlify Functions have 26s timeout (free tier)
- Upgrade to Pro for longer timeouts
- Optimize database queries

### 3. Cold Start Issues
**Problem**: First request is slow
**Solution**:
- This is normal for serverless
- Netlify will warm up functions gradually

### 4. Environment Variables Not Loading
**Solution**:
- Redeploy after adding variables
- Use `netlify env:list` to verify

---

## File Changes Required

The following files need to be created/modified:
1. `backend/netlify.toml` - Netlify configuration
2. `backend/netlify/functions/api.js` - Serverless handler
3. `backend/.env` - Local environment variables
4. `frontend/vercel.json` - Vercel configuration
5. `frontend/.env.production` - Production environment
6. [Optional] `backend/.env.example` - Template for env vars

See `NETLIFY_SETUP.md` and `VERCEL_SETUP.md` for detailed code examples.
