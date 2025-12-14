# Deployment Guide

Complete guide to deploy the Company Portal to production.

## Table of Contents
1. [Backend Deployment (Heroku)](#backend-deployment-heroku)
2. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
3. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
4. [File Storage Setup (Cloudinary)](#file-storage-setup-cloudinary)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Backend Deployment (Heroku)

### Prerequisites
- Heroku account (free)
- Heroku CLI installed
- Git repository initialized

### Step 1: Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or using npm:
npm install -g heroku
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
# From project root
heroku create your-app-name-backend

# Verify
heroku apps
```

### Step 4: Set Environment Variables
```bash
# Set each variable
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your_strong_secret_key"
heroku config:set CLOUDINARY_CLOUD_NAME="your_name"
heroku config:set CLOUDINARY_API_KEY="your_key"
heroku config:set CLOUDINARY_API_SECRET="your_secret"
heroku config:set NODE_ENV="production"

# Verify
heroku config
```

### Step 5: Deploy
```bash
# Make sure you're in root directory
git add .
git commit -m "Prepare for deployment"

# Deploy backend folder
git push heroku HEAD:main

# View logs
heroku logs --tail
```

### Step 6: Verify Deployment
```bash
# Check if running
heroku apps:info your-app-name-backend

# Test health check
curl https://your-app-name-backend.herokuapp.com/api/health

# Expected response:
# {"message":"Server is running"}
```

### Backend URL
```
https://your-app-name-backend.herokuapp.com
```

---

## Frontend Deployment (Netlify)

### Prerequisites
- Netlify account (free)
- Frontend built with `npx webpack`

### Step 1: Build Frontend
```bash
# Ensure bundle is built
npx webpack

# This creates dist/bundle.js
```

### Step 2: Prepare Files for Deployment

Create `.netlify/redirects` file:
```
/*  /index.html   200
```

This enables client-side routing for the SPA.

### Step 3: Connect to Git (Recommended)

```bash
# Push to GitHub
git add .
git commit -m "Frontend ready for deployment"
git push origin main
```

### Step 4: Deploy via Netlify

**Option A: Automatic Deployment (Recommended)**
1. Go to https://netlify.com
2. Click "New site from Git"
3. Select GitHub repository
4. Configure build settings:
   - **Build command:** `npx webpack`
   - **Publish directory:** `.` (root)
5. Click "Deploy"

**Option B: Manual Deployment**
1. Visit https://netlify.com
2. Drag and drop your project folder
3. Netlify auto-deploys

### Step 5: Update API Base URL

Edit `script.js` to use production backend URL:

```javascript
// Before (line 1):
const API_BASE = 'http://localhost:5000/api';

// After:
const API_BASE = 'https://your-app-name-backend.herokuapp.com/api';
```

Rebuild: `npx webpack`

### Step 6: Redeploy
```bash
# Commit changes
git add .
git commit -m "Update API URL to production"
git push
```

Netlify automatically redeploys on git push.

### Frontend URL
```
https://your-site-name.netlify.app
```

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Account
1. Visit https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account

### Step 2: Create Cluster
1. Click "Create Deployment"
2. Choose "Shared" (free tier)
3. Select region closest to you
4. Click "Create Deployment"

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and password
4. Set permissions: "Atlas Admin"
5. Click "Add User"

### Step 4: Whitelist IP
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

**Security Note:** For production, whitelist only your server's IP.

### Step 5: Get Connection String
1. Click "Clusters"
2. Click "Connect"
3. Choose "Connect Your Application"
4. Copy connection string
5. Replace `<username>` and `<password>`

### Example Connection String:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/companyportal?retryWrites=true&w=majority
```

### Step 6: Set in Environment
Add to `.env` or Heroku config:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/companyportal
```

---

## File Storage Setup (Cloudinary)

### Step 1: Create Cloudinary Account
1. Visit https://cloudinary.com
2. Click "Sign up for free"
3. Complete registration

### Step 2: Get API Credentials
1. Go to Dashboard
2. Copy "Cloud Name"
3. Go to "Settings" → "API Keys"
4. Copy "API Key" and "API Secret"

**Important:** Keep API Secret secure!

### Step 3: Configure Upload Settings
1. Go to Settings → "Upload"
2. Add Unsigned Upload Preset:
   - Click "Add upload preset"
   - Name: "companyportal_unsigned"
   - Unsigned: Yes
   - Save

### Step 4: Set Environment Variables
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 5: Test Upload
```bash
curl -F "file=@test.jpg" \
  -F "upload_preset=companyportal_unsigned" \
  https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
```

---

## Environment Configuration

### Production .env
```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=super_secret_key_min_32_characters_long

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=https://your-site-name.netlify.app

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Security Best Practices
1. **Never commit .env to git**
2. **Use strong JWT_SECRET** (32+ characters)
3. **Rotate secrets regularly**
4. **Use environment-specific configs**
5. **Enable HTTPS everywhere**
6. **Whitelist CORS origins**
7. **Use Cloudinary private mode**

---

## Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend.herokuapp.com/api/health
```

Expected: `{"message":"Server is running"}`

### 2. User Registration
```bash
curl -X POST https://your-backend.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123!"}'
```

### 3. User Login
```bash
curl -X POST https://your-backend.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

### 4. Frontend Access
Visit: `https://your-site-name.netlify.app`

1. Register new account
2. Login
3. Navigate all pages
4. Test employee upload (requires Cloudinary configured)

### 5. Database Connection
```javascript
// In browser console on frontend
fetch('https://your-backend.herokuapp.com/api/employees', {
  headers: {'Authorization': 'Bearer YOUR_TOKEN'}
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## Monitoring & Troubleshooting

### View Logs

**Backend (Heroku):**
```bash
# Real-time logs
heroku logs --tail --app your-app-name

# Last 100 lines
heroku logs -n 100 --app your-app-name
```

### Common Issues

#### 1. "Application Error" on Heroku
```bash
# Check logs
heroku logs --tail

# Likely causes:
# - Missing environment variables
# - Database connection error
# - Port not set correctly
```

**Solution:**
```bash
heroku config  # Verify all variables set
heroku restart  # Restart dyno
```

#### 2. CORS Error on Frontend
**Symptom:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
1. Check backend is responding
2. Verify CORS_ORIGIN in .env
3. Restart backend service
4. Clear browser cache

```bash
# Backend CORS config in server.js should have:
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

#### 3. Database Connection Error
**Symptom:** "MongoNetworkError: connect ECONNREFUSED"

**Solution:**
```bash
# 1. Check connection string format
mongodb+srv://user:pass@cluster.mongodb.net/dbname

# 2. Verify IP is whitelisted in MongoDB Atlas
# 3. Check username/password has special chars escaped
# Special chars need URL encoding: 
# @ = %40, : = %3A, etc.

# 4. Test connection locally first
heroku run node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(e => console.log('Error:', e.message))
"
```

#### 4. Image Upload Not Working
**Symptom:** Images not uploading to Cloudinary

**Solution:**
```bash
# 1. Verify Cloudinary credentials
heroku config | grep CLOUDINARY

# 2. Check upload preset exists
# 3. Test with curl
curl -F "file=@test.jpg" \
  -F "upload_preset=companyportal_unsigned" \
  https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload

# 4. Check file size < 10MB
# 5. Check file type is allowed
```

### Performance Optimization

#### 1. Enable Gzip Compression
```javascript
// In backend/server.js
const compression = require('compression');
app.use(compression());
```

#### 2. Database Indexing
```javascript
// In models, add indexes for frequently queried fields
userSchema.index({ email: 1 });
taskSchema.index({ userId: 1, status: 1 });
```

#### 3. Frontend Bundle Optimization
```bash
# Check bundle size
npx webpack --profile --json > stats.json

# Analyze
npx webpack-bundle-analyzer stats.json
```

#### 4. CDN Configuration
For Netlify, automatic CDN is enabled. For Cloudinary:
1. Go to Settings → CDN
2. Enable aggressive caching
3. Set cache expiry to 1 year for static assets

### Monitoring Services

**Heroku Metrics:**
```bash
heroku metrics --dyno web.1
```

**Netlify Analytics:**
Visit Netlify Dashboard → Analytics

### Backup & Recovery

**MongoDB Backup:**
1. In MongoDB Atlas Dashboard
2. Go to Backups
3. Create on-demand backup
4. Configure automated daily backups

**Heroku Database Backup:**
```bash
# Create backup
heroku pg:backups:capture --app your-app

# List backups
heroku pg:backups --app your-app

# Download backup
heroku pg:backups:download b001 --app your-app
```

---

## Production Checklist

Before going live, verify:

- [ ] Backend running on Heroku
- [ ] Frontend deployed to Netlify
- [ ] MongoDB Atlas cluster created and whitelisted
- [ ] Cloudinary account configured
- [ ] Environment variables set on Heroku
- [ ] CORS origin configured correctly
- [ ] Tested user registration and login
- [ ] Tested employee creation with image upload
- [ ] Tested task creation and updates
- [ ] Tested salary calculations
- [ ] Tested policy uploads
- [ ] SSL certificate configured (automatic on Netlify/Heroku)
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] Database backups enabled
- [ ] Admin account created

---

## Rollback Procedure

If deployment has issues:

**Heroku:**
```bash
# View releases
heroku releases

# Rollback to previous version
heroku releases:rollback v12

# Verify
heroku logs --tail
```

**Netlify:**
1. Go to Deploys
2. Click previous successful deploy
3. Click "Restore publish"

---

## Scaling Considerations

As users grow:

1. **Backend:** Upgrade Heroku dyno from free to standard
2. **Database:** Upgrade MongoDB Atlas from free to paid tier
3. **Frontend:** Netlify free tier scales automatically
4. **Storage:** Cloudinary free tier has generous limits
5. **API Rate Limiting:** Implement rate limiting on backend
6. **Caching:** Add Redis for session/data caching

---

## Support

For deployment issues:
- Heroku Support: https://help.heroku.com
- MongoDB Atlas Support: https://docs.mongodb.com/
- Netlify Support: https://support.netlify.com
- Cloudinary Support: https://support.cloudinary.com

---

## Next Steps

After successful deployment:
1. Monitor logs regularly
2. Set up automated backups
3. Configure monitoring/alerts
4. Plan for scaling
5. Implement additional security measures
6. Consider adding email notifications
7. Set up staging environment for testing

Your application is now live! 🚀
