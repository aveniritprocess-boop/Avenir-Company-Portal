# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 14+ installed
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

### Step 1: Clone & Install (1 min)
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Configure Environment (2 min)

1. Create `.env` file in `/backend` directory
2. Add these credentials:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/companyportal
JWT_SECRET=your_super_secret_key_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
```

### Step 3: Start Services (2 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npx webpack --watch
```

**Terminal 3 - Web Server:**
```bash
npx http-server . -p 8080
```
Frontend runs on: `http://localhost:8080`

### Step 4: Create First User (0 min)
1. Open http://localhost:8080
2. Click "Register"
3. Fill in details and submit
4. Login with your credentials

## How to Get Credentials

### MongoDB Atlas (Database)
1. Visit https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account and cluster
4. Click "Connect"
5. Copy connection string
6. Replace `<username>` and `<password>` in MONGODB_URI

### Cloudinary (File Storage)
1. Visit https://cloudinary.com
2. Click "Sign up for free"
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret (keep this private!)

## Testing the Application

### Login Flow
- Register → Login → See Dashboard

### Create Employee
1. Go to "Employees" page
2. Click "Add Employee"
3. Fill form with:
   - Name, Email, Department
   - Position, Base Salary
   - Upload photo
4. Click "Save"

### Check Salary Calculation
1. Go to "Finance" page
2. See salary breakdown with performance metrics
3. Download salary slip as text

### Create Task
1. Go to "Tasks" page
2. Click "Add Task"
3. Set title, priority, due date
4. Track progress as completed

### Upload Policy
1. Go to "Policies" page
2. Click "Add Policy"
3. Select PDF/Image file
4. Set policy type
5. View in policies list

## Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 8080 | http://localhost:8080 |
| Backend | 5000 | http://localhost:5000 |

## Common Issues & Fixes

### "Cannot find module"
```bash
# Delete and reinstall dependencies
rm -rf node_modules
npm install
```

### "MongoDB connection failed"
- Check MONGODB_URI is correct
- Ensure IP whitelist includes your current IP
- Verify database exists in MongoDB Atlas

### "Image upload not working"
- Check Cloudinary credentials are correct
- Verify file size < 10MB
- Check CORS is enabled in backend

### "CORS error in console"
- Restart backend server
- Ensure backend is running on port 5000
- Check frontend URL matches CORS config

## File Structure Reminder

```
companyportal/
├── index.html          → Main UI
├── style.css           → Styling
├── script.js           → Frontend logic
├── package.json        → Frontend dependencies
├── webpack.config.js   → Build config
├── dist/bundle.js      → Compiled JS
└── backend/
    ├── server.js       → Express app
    ├── .env            → Credentials
    └── [models, controllers, routes...]
```

## Next Steps

1. **Customize branding** - Edit color variables in `style.css`
2. **Add more features** - Extend controllers and models
3. **Deploy** - Use Heroku (backend), Netlify (frontend)
4. **Database seeding** - Create seed data for demo
5. **Email integration** - Add nodemailer for notifications

## Support Files

- `README.md` - Full documentation
- `SETUP.md` - Detailed installation guide (this file)
- `API.md` - API endpoint documentation
- `.env.example` - Environment variable template

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm start` | Start backend (production) |
| `npm run dev` | Start backend (development) |
| `npx webpack` | Build frontend bundle |
| `npx webpack --watch` | Build on file changes |
| `npx http-server` | Start web server |

## Tips & Tricks

✅ **Webpack Watch Mode** - Keep webpack watching for changes:
```bash
npx webpack --watch
```

✅ **Backend with Auto-reload** - Use nodemon:
```bash
# In backend/.env add
# NODE_ENV=development

npm run dev
```

✅ **Faster Testing** - Create test user:
```javascript
// In browser console
localStorage.setItem('authToken', 'test_token');
localStorage.setItem('currentUser', JSON.stringify({name: 'Test'}));
location.reload();
```

✅ **Clear Browser Data**:
```javascript
// In console
localStorage.clear();
sessionStorage.clear();
```

## Performance Notes

- Frontend bundle: ~43 KB (minified)
- Database queries optimized with indexes
- Images compressed via Cloudinary
- Charts rendered efficiently with Chart.js

## Security Checklist

Before production deployment:
- ✅ Change JWT_SECRET to strong random string
- ✅ Enable HTTPS on frontend
- ✅ Use environment-specific configs
- ✅ Enable MongoDB authentication
- ✅ Whitelist frontend domain in CORS
- ✅ Set Cloudinary to private mode
- ✅ Add rate limiting to API
- ✅ Enable HTTPS on backend

## You're Ready!

Now head to **http://localhost:8080** and start building! 🚀
