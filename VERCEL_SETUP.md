# Vercel Frontend Setup (Detailed)

## Changes Required for Vercel Deployment

### File 1: Update `frontend/src/api.js`
Configure the API base URL for both development and production.

**If your `api.js` doesn't exist, create it in `frontend/src/api.js`:**

```javascript
import axios from 'axios';

// Determine API base URL based on environment
const API_BASE_URL = process.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://your-netlify-backend.netlify.app');

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Update any existing API calls in your components:**

```javascript
// Old way
// const response = await fetch('http://localhost:5000/api/auth/login', {...})

// New way
import api from '../api';
const response = await api.post('/auth/login', {...});
```

### File 2: `frontend/vercel.json`
Vercel configuration file for build and routing settings.

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token,X-Requested-With,Content-Type,Authorization" }
      ]
    }
  ]
}
```

### File 3: `frontend/.env.production`
Environment variables for production build.

```
VITE_API_URL=https://your-netlify-backend.netlify.app
VITE_APP_NAME=Aayush Seva AI
```

### File 4: `frontend/.env.development` (Optional)
For local development.

```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Aayush Seva AI (Dev)
```

---

## Deployment Steps

### Step 1: Push code to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub account
3. Click "Add New" → "Project"
4. Select your repository
5. Accept default settings or customize:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - Key: `VITE_API_URL`
     - Value: `https://your-netlify-backend.netlify.app`

### Step 3: Deploy
Click "Deploy" and wait for build to complete.

### Step 4: Custom Domain (Optional)
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

---

## After Deployment

### Update Backend CORS
Once you have your Vercel URL, update your backend:

1. Get your Vercel domain: `https://your-project.vercel.app`
2. Update Netlify environment variable:
   - Key: `CLIENT_URL`
   - Value: `https://your-project.vercel.app`
3. Redeploy backend

### Testing
1. Visit your Vercel domain
2. Try logging in
3. Make API calls
4. Check browser console for errors

---

## Vercel Deployment Checklist

- [ ] API calls updated to use `api.js`
- [ ] `vercel.json` created in frontend root
- [ ] `.env.production` created with correct backend URL
- [ ] Code pushed to GitHub
- [ ] Project created in Vercel dashboard
- [ ] Root directory set to `frontend`
- [ ] Environment variables added to Vercel
- [ ] Deployment successful
- [ ] Backend `CLIENT_URL` updated to match Vercel domain
- [ ] CORS errors resolved

---

## Common Issues

### Build fails with "Cannot find module"
- Check all imports are correct
- Verify package.json has all required dependencies
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Blank page after deployment
- Check browser console for errors
- Verify API_BASE_URL is correct in api.js
- Check network tab for failed requests

### API requests return 404
- Verify backend is deployed successfully
- Check VITE_API_URL matches Netlify backend URL
- Ensure CORS is enabled in backend

### Vercel build times out
- Reduce dependencies
- Optimize build process
- Check for large assets

---

## Environment Variables Reference

| Variable | Where | Value |
|----------|-------|-------|
| VITE_API_URL | Vercel dashboard | https://your-netlify-site.netlify.app |
| CLIENT_URL | Netlify dashboard | https://your-vercel-site.vercel.app |
| MONGODB_URI | Netlify dashboard | Your MongoDB connection string |
| JWT_SECRET | Netlify dashboard | Your JWT secret key |
| GEMINI_API_KEY | Netlify dashboard | Your Google Gemini API key |

---

## Monitoring & Debugging

### View Vercel Logs
1. Dashboard → Deployments
2. Click on latest deployment
3. View build logs or runtime logs

### View Frontend Errors
- Browser DevTools (F12)
- Check Network tab for failed requests
- Check Console for JavaScript errors

### Check API Connectivity
In browser console:
```javascript
fetch('https://your-netlify-site.netlify.app/').then(r => r.text()).then(console.log)
```
