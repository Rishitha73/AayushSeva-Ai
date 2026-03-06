# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Verify your email

## Step 2: Create a Cluster
1. After login, click "Create a Deployment"
2. Select "Shared" (Free tier)
3. Choose your provider (AWS, Google Cloud, Azure)
4. Select nearest region
5. Click "Create Deployment"
6. Wait 5-10 minutes for cluster to be created

## Step 3: Create Database User
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Choose "Password"
4. Enter username and password
   - **Username**: `dbuser`
   - **Password**: Generate a strong one
5. Click "Add User"

## Step 4: Set Network Access
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" → Add `0.0.0.0/0`
4. Or for security: Add specific IP addresses
5. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Databases"
2. Click "Connect" button on your cluster
3. Select "Drivers"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `myFirstDatabase` with your database name

**Example format:**
```
mongodb+srv://dbuser:password123@cluster0.mongodb.net/aayush-seva?retryWrites=true&w=majority
```

## Step 6: Create Database & Collections (Optional)
You can let your app create them, or manually:
1. Click "Collections" in your cluster
2. Click "Create Database"
3. Database name: `aayush-seva`
4. Click "Create"

Your app will automatically create collections when needed.

---

## Connection String Security

### Development (.env local)
```
MONGODB_URI=mongodb+srv://dbuser:password123@cluster0.mongodb.net/aayush-seva?retryWrites=true&w=majority
```

### Production (Netlify Env)
Same connection string

### Security Best Practices
1. Never commit `.env` to git
2. Use environment variables for all secrets
3. Use IP whitelist in production (if possible)
4. Use strong, unique passwords
5. Rotate credentials periodically

---

## Verify Connection

### From Local Terminal
```bash
# Install MongoDB CLI (optional)
npm install -g mongodb-cli

# Or test with Node.js
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected!'))
  .catch(err => console.log('Error:', err.message));
"
```

### From Backend
Check your `config/db.js` - it should connect automatically on startup.

---

## Common Issues

### "Authentication failed"
- Check username and password in connection string
- Verify database user exists in "Database Access"
- Check password contains no special chars (URL encode if needed)

### "IP not whitelisted"
- Go to "Network Access"
- Add `0.0.0.0/0` to allow all IPs
- Or add Netlify IP ranges

### "Cannot find database"
- Connection string format correct?
- Database name spelled correctly?
- Let MongoDB create it automatically on first write

---

## Free Tier Limits
- **Storage**: 512 MB
- **Data transfer**: Shared cluster
- **Connections**: Limited
- **Backup**: Not automated

**Upgrade to paid** if you exceed these limits.

---

## Next Steps
1. Get your connection string
2. Add to backend `.env` as `MONGODB_URI`
3. Add to Netlify dashboard environment variables
4. Test with `npm run dev` locally
5. Deploy to Netlify
