# Netlify Backend Setup (Detailed)

## Changes Required for Netlify Deployment

### File 1: `backend/netlify/functions/api.js`
This file converts your Express app to a Netlify Function handler.

```javascript
const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../../config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

// Route files
const authRoutes = require('../../routes/authRoutes');
const triageRoutes = require('../../routes/triageRoutes');
const familyRoutes = require('../../routes/familyRoutes');
const officerRoutes = require('../../routes/officerRoutes');
const reportRoutes = require('../../routes/reportRoutes');
const pregnancyRoutes = require('../../routes/pregnancyRoutes');
const alertRoutes = require('../../routes/alertRoutes');
const reminderRoutes = require('../../routes/reminderRoutes');
const migrationRoutes = require('../../routes/migrationRoutes');
const recoveryRoutes = require('../../routes/recoveryRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pregnancy', pregnancyRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/recovery', recoveryRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Aayush Seva AI API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// Export handler for Netlify
module.exports.handler = serverless(app);
```

### File 2: `backend/netlify.toml`
This file configures Netlify deployment settings.

```toml
[build]
  command = "npm install && npm run build"
  functions = "netlify/functions"
  publish = "dist"

[functions]
  node_bundler = "esbuild"
  included_files = [
    "config/**",
    "controllers/**",
    "middleware/**",
    "models/**",
    "routes/**",
    "services/**",
    "utils/**",
    ".env"
  ]

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[context.production.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[context.deploy-preview.environment]
  NODE_VERSION = "18"
```

### File 3: `backend/package.json` - Update scripts
Add this to your package.json:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "build": "echo 'Build complete'",
    "start": "node server.js"
  },
  "dependencies": {
    "serverless-http": "^3.2.0"
  }
}
```

### Step-by-Step Setup

#### 1. Install serverless-http
```bash
cd backend
npm install serverless-http
```

#### 2. Create directories
```bash
mkdir -p netlify/functions
```

#### 3. Copy the files above
- Create `netlify/functions/api.js` with the code above
- Create `netlify.toml` in backend root

#### 4. Create `.env` file in backend root
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

#### 5. Keep server.js for local testing
Your existing `server.js` can stay for local development with:
```bash
npm run dev
```

#### 6. Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to preview
netlify deploy

# Deploy to production (after testing preview)
netlify deploy --prod
```

---

## Troubleshooting

### Cannot find module errors
Make sure all required modules are in dependencies in package.json

### Function timeout
- Netlify Functions default timeout: 26 seconds (free) / 30 seconds (paid)
- Optimize your database queries
- Consider upgrading to Netlify Pro

### Database connection fails
- Check MongoDB Atlas whitelist includes `0.0.0.0/0`
- Verify MONGODB_URI is correct
- Check environment variables are set in Netlify dashboard

### CORS errors
- Update `CLIENT_URL` to match your Vercel domain
- Ensure CORS middleware is configured correctly

---

## Getting Your Netlify URL
After `netlify deploy --prod`, you'll get a URL like:
```
https://your-site-name.netlify.app
```

Use this URL as the `VITE_API_URL` in your frontend Vercel deployment.
