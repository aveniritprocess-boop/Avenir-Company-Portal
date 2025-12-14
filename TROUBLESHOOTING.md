# Troubleshooting Guide

Common issues and their solutions.

## Development Issues

### 1. "Cannot find module 'script.js'"

**Symptom:**
```
ERROR in ./index.html
Module not found: Error: Can't resolve 'script.js' in '...'
```

**Solutions:**
```bash
# Check file exists
ls -la script.js

# Rebuild webpack
npx webpack

# Clear webpack cache
rm -rf node_modules/.cache
npx webpack
```

### 2. "Module 'babel-loader' not found"

**Symptom:**
```
ERROR in ./webpack.config.js
Cannot find module 'babel-loader'
```

**Solutions:**
```bash
# Install webpack dependencies
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-env

# Rebuild
npx webpack
```

### 3. "EACCES: permission denied"

**Symptom:**
```
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules
```

**Solutions (Windows):**
```bash
# Run PowerShell as Administrator, then:
npm install -g npm
```

**Solutions (Mac/Linux):**
```bash
# Option 1: Use sudo
sudo npm install

# Option 2: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### 4. "Port 5000 already in use"

**Symptom:**
```
Error: listen EADDRINUSE :::5000
```

**Solutions:**

**Windows (PowerShell):**
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill process (get PID from above)
Stop-Process -Id <PID> -Force

# Or change port
set PORT=5001
npm start
```

**Mac/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port
PORT=5001 npm start
```

### 5. "Cannot find MongoDB"

**Symptom:**
```
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# For MongoDB Atlas (cloud):
# 1. Ensure connection string in .env is correct
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# 2. Check IP whitelist in MongoDB Atlas
# 3. Verify username/password doesn't have special chars that need encoding

# For local MongoDB:
# 1. Start MongoDB service
# Windows: mongo (if installed locally)
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 2. Test connection
mongosh "mongodb://localhost:27017"
```

### 6. Webpack keeps rebuilding on changes

**Issue:** Webpack watch mode loops infinitely

**Solutions:**
```bash
# Kill watch process
Ctrl+C

# Clear webpack cache
rm -rf node_modules/.cache

# Restart with watch
npx webpack --watch
```

### 7. "Cannot GET /api/employees"

**Symptom:** API endpoint returns 404

**Causes & Solutions:**

```bash
# 1. Backend not running
# Start backend in separate terminal:
cd backend
npm start

# 2. Wrong API URL in frontend
# Check script.js line 1:
const API_BASE = 'http://localhost:5000/api';

# 3. Route not defined
# Check backend/routes/employees.js exists
ls backend/routes/

# 4. Server not initializing routes
# Check backend/server.js includes:
app.use('/api/employees', require('./routes/employees'));
```

### 8. "Token is not valid"

**Symptom:** Login succeeds but other requests fail with 401

**Solutions:**
```javascript
// In browser console, check token:
localStorage.getItem('authToken')

// Should output long JWT string starting with "eyJ..."
// If empty or "undefined", token not stored

// 1. Check login response has token
// 2. Verify token is stored in localStorage
// 3. Verify Authorization header is sent:
// Should be: Authorization: Bearer <token>

// Test in console:
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  }
}).then(r => r.json()).then(console.log)
```

### 9. Images not uploading to Cloudinary

**Symptom:** Upload button doesn't work or shows error

**Causes & Solutions:**

```bash
# 1. Check Cloudinary credentials
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET

# 2. Verify environment variables are set in .env
cat backend/.env | grep CLOUDINARY

# 3. Test Cloudinary connection
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@test.jpg" \
  -F "api_key=YOUR_API_KEY" \
  -F "signature=..." \
  -F "timestamp=..." \

# 4. Check file size < 10MB
ls -lh test.jpg

# 5. Check file type is allowed (jpg, png, pdf, docx)
file test.jpg
```

### 10. CORS errors in browser console

**Symptom:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' 
from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Solutions:**

```bash
# 1. Verify backend has CORS enabled
# Check backend/server.js contains:
const cors = require('cors');
app.use(cors());

# 2. If custom CORS needed, update backend/server.js:
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

# 3. Restart backend
cd backend
npm start

# 4. In frontend script.js, ensure requests include:
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + authToken
}
```

---

## Frontend Issues

### 1. Page doesn't load

**Solutions:**
```bash
# 1. Check frontend is running
npx http-server . -p 8080

# 2. Check webpack build
npx webpack

# 3. Verify bundle.js exists
ls dist/bundle.js

# 4. Check browser console for errors
# F12 → Console tab

# 5. Check HTML file exists
ls index.html
```

### 2. Sidebar navigation doesn't work

**Solutions:**
```javascript
// Check in browser console:
document.getElementById('nav-dashboard')  // Should exist
navigateToPage('dashboard')  // Should work

// Verify script.js includes navigateToPage function
// Check script.js line 100+

// Clear localStorage
localStorage.clear()
// Reload page
location.reload()
```

### 3. Charts don't display

**Solutions:**
```javascript
// Check in console:
Chart  // Should be defined (Chart.js loaded)

// Verify Chart.js is loaded in index.html:
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// Check data is loading:
fetch('http://localhost:5000/api/tasks')
  .then(r => r.json())
  .then(d => console.log('Tasks:', d))

// If no tasks, create some in Tasks page

// Check canvas elements exist:
document.getElementById('taskChart')  // Should not be null
```

### 4. Login form doesn't submit

**Solutions:**
```javascript
// Check form has correct ID:
document.getElementById('login-form')

// Verify handler is attached:
document.getElementById('login-form').onsubmit

// Check API endpoint is correct in script.js:
fetch('http://localhost:5000/api/auth/login', ...)

// Test API directly:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 5. Dropdown menus don't work

**Solutions:**
```javascript
// Check toggleMenu function exists in script.js

// Verify click handlers are attached:
document.querySelectorAll('[onclick*="toggleMenu"]')

// Test manually in console:
document.getElementById('taskMenu').style.display = 
  document.getElementById('taskMenu').style.display === 'none' ? 'block' : 'none'

// Check CSS for display:none by default
// In style.css, .dropdown-menu should have display: none
```

---

## Backend Issues

### 1. "Cannot find module 'express'"

**Solutions:**
```bash
# Install backend dependencies
cd backend
npm install

# Verify packages installed
ls node_modules | grep express
```

### 2. "Error: ENOENT: no such file or directory, open '.env'"

**Solutions:**
```bash
# Create .env file from example
cd backend
cp .env.example .env

# Add your credentials to .env
# Edit with your text editor

# Verify
cat .env
```

### 3. Database connection timeout

**Solutions:**
```bash
# 1. Check connection string format:
# mongodb+srv://username:password@cluster.mongodb.net/dbname

# 2. Verify IP is whitelisted in MongoDB Atlas
# 3. Check username/password in .env

# 4. Test with mongosh:
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# 5. Check network connectivity
ping cluster0.abc123.mongodb.net

# 6. Enable connection retry in server.js:
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  retryWrites: true,
  w: 'majority'
})
```

### 4. "ReferenceError: require is not defined"

**Symptom:**
```
require is not defined
```

**Cause:** Using ES6 import in backend

**Solution:**
```bash
# Use CommonJS require in backend:
// WRONG:
import express from 'express'

// RIGHT:
const express = require('express')

# Check all files use require, not import
grep -r "^import " backend/
```

### 5. Authentication middleware error

**Solutions:**
```bash
# 1. Verify token is being sent
# In browser console:
localStorage.getItem('authToken')

# 2. Check middleware is applied to routes
# backend/routes/employees.js should have:
const auth = require('../middleware/auth');
router.get('/', auth, ...)

# 3. Verify JWT_SECRET matches:
# backend/.env:
JWT_SECRET=your_secret

# 4. Test auth endpoint:
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Multer upload errors

**Solutions:**
```bash
# 1. Check upload middleware exists
ls backend/middleware/upload.js

# 2. Verify file size limit in upload.js
# Default is 10MB

# 3. Check accepted file types
# Should include jpg, png, pdf, docx

# 4. Test upload endpoint:
curl -F "file=@test.jpg" \
  -F "name=test" \
  http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Salary calculation incorrect

**Solutions:**
```javascript
// Verify calculation formula in backend/controllers/salaryController.js:
// Fixed = BaseSalary × 0.7
// Variable = BaseSalary × 0.3 × 
//   (teamPerf×0.4 + indivPerf×0.4 + companyPerf×0.2) / 100

// Test with known values in console:
const baseSalary = 50000;
const fixed = baseSalary * 0.7;  // 35000
const perfWeight = (85*0.4 + 90*0.4 + 80*0.2) / 100;  // 0.86
const variable = baseSalary * 0.3 * perfWeight;  // 12900
const total = fixed + variable;  // 47900

console.log('Fixed:', fixed, 'Variable:', variable, 'Total:', total);

// Check database values:
db.salarysli ps.findOne({})
```

---

## Deployment Issues

### 1. "Application error" on Heroku

**Solutions:**
```bash
# Check logs
heroku logs --tail --app your-app

# Common causes:
# - Missing environment variable
# - Database not connecting
# - Port not specified

# Fix PORT environment variable
heroku config:set PORT=5000

# Restart
heroku restart
```

### 2. Frontend can't reach backend on production

**Symptom:** Works locally, fails on production

**Solutions:**

1. **Update API URL in script.js:**
```javascript
// Before:
const API_BASE = 'http://localhost:5000/api';

// After:
const API_BASE = 'https://your-backend.herokuapp.com/api';
```

2. **Rebuild and redeploy:**
```bash
npx webpack
git add .
git commit -m "Update backend URL"
git push  # If using Netlify auto-deploy
```

3. **Check CORS on backend:**
```bash
heroku config:set CORS_ORIGIN="https://your-site.netlify.app"
heroku restart
```

### 3. Database backups failing

**Solutions:**
```bash
# Check backup logs
heroku pg:backups --app your-app

# Create manual backup
heroku pg:backups:capture --app your-app

# Download backup
heroku pg:backups:download --app your-app
```

### 4. Cloudinary not working on production

**Solutions:**
```bash
# Verify all Cloudinary vars are set
heroku config | grep CLOUDINARY

# If missing, add them:
heroku config:set CLOUDINARY_CLOUD_NAME="your_name"
heroku config:set CLOUDINARY_API_KEY="your_key"
heroku config:set CLOUDINARY_API_SECRET="your_secret"

# Restart
heroku restart

# Test upload
curl -X POST https://your-app.herokuapp.com/api/policies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf"
```

---

## Performance Issues

### 1. Slow page load

**Solutions:**
```bash
# Check bundle size
ls -lh dist/bundle.js

# If > 100KB, optimize:
# 1. Use webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# 2. Identify large dependencies
npx webpack --profile --json > stats.json
npx webpack-bundle-analyzer stats.json

# 3. Remove unused dependencies
npm prune

# 4. Enable gzip in backend
npm install compression

# 5. Add to server.js:
const compression = require('compression');
app.use(compression());
```

### 2. Slow API responses

**Solutions:**
```bash
# 1. Check database query performance
# Enable MongoDB logging:
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000

# 2. Add database indexes
# In models/User.js:
userSchema.index({ email: 1 });

# 3. Use pagination
// In routes, add pagination:
app.get('/employees?page=1&limit=20', ...)

# 4. Monitor backend
heroku logs --tail
```

### 3. Browser freeze/lag

**Solutions:**
```javascript
// Check for memory leaks in script.js
// Use Chrome DevTools → Memory tab

// 1. Remove global variables
// 2. Clean up event listeners on page change
// 3. Limit chart redraws
// 4. Use requestAnimationFrame for animations

// In script.js, optimize:
// Before:
function loadDashboard() {
  setInterval(() => {
    // Heavy operation
  }, 1000);
}

// After:
function loadDashboard() {
  // Load once, not repeatedly
  loadDashboardData();
}
```

---

## General Debugging Tips

### 1. Enable Debug Mode
```javascript
// Add to script.js top:
const DEBUG = true;

function log(msg, data) {
  if (DEBUG) console.log(`[DEBUG] ${msg}`, data);
}

// Use it:
log('Loading employees', response);
```

### 2. Use Browser DevTools
```
F12 → Console → Check for errors
F12 → Network → Check API calls
F12 → Storage → Check localStorage
F12 → Application → Check cookies
```

### 3. Test API with cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","password":"test"}'

# Save token from response
TOKEN="eyJ..."

# Use token
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Check Logs
```bash
# Frontend (browser console)
F12 → Console

# Backend
heroku logs --tail  # Production
npm start  # Development

# Database
MongoDB Atlas → Logs
```

### 5. Test Locally First
```bash
# Before deploying, test locally:
npm install
npm start  # backend
npx http-server  # frontend
# Test all features locally

# Then deploy
```

---

## Getting Help

**Resources:**
- [Node.js Docs](https://nodejs.org/docs/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

**Community:**
- Stack Overflow (tag: nodejs, express, mongodb)
- GitHub Issues
- Reddit r/node, r/learnprogramming

**Support Contacts:**
- Heroku Support: https://help.heroku.com
- MongoDB Atlas Support: https://docs.mongodb.com/
- Netlify Support: https://support.netlify.com

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED` | Port/service not running | Start server, check port |
| `EADDRINUSE` | Port already in use | Kill process, change port |
| `Cannot find module` | Dependency not installed | `npm install` |
| `SyntaxError` | Code typo | Check line number in error |
| `401 Unauthorized` | Invalid/missing token | Login again, check token |
| `403 Forbidden` | Permission denied | Check user role |
| `404 Not Found` | Route doesn't exist | Check endpoint URL |
| `500 Internal Server Error` | Backend crash | Check server logs |
| `CORS error` | CORS not configured | Add CORS middleware |
| `Cannot read property` | Variable is undefined | Check variable initialization |

---

Still having issues? Check the logs first! 95% of problems are visible in logs. 🔍
