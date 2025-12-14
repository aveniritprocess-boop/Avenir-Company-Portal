# 📋 Quick Reference Card

Print this or bookmark it for quick access during development.

---

## 🚀 Quick Start Commands

```bash
# Install everything
npm install
cd backend && npm install && cd ..

# Create environment file
cp backend/.env.example backend/.env

# Run (3 terminals needed)

# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend Watch
npx webpack --watch

# Terminal 3: Web Server
npx http-server . -p 8080

# Visit
http://localhost:8080
```

---

## 🔑 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:8080 | Web app |
| Backend | http://localhost:5000 | API server |
| API Health | http://localhost:5000/api/health | Check if running |
| MongoDB Atlas | https://cloud.mongodb.com | Database |
| Cloudinary | https://cloudinary.com | File storage |

---

## 📁 Important Files

| File | Purpose | Location |
|------|---------|----------|
| index.html | Main UI | Root |
| style.css | Styling | Root |
| script.js | Frontend logic | Root |
| server.js | Backend server | backend/ |
| .env | Credentials | backend/.env |
| package.json | Dependencies | Root & backend/ |
| webpack.config.js | Build config | Root |

---

## 🔌 API Endpoints (Cheat Sheet)

### Auth
```
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
```

### Employees
```
GET    /api/employees              - Get all employees
GET    /api/employees/:id          - Get one employee
POST   /api/employees              - Create employee
PUT    /api/employees/:id          - Update employee
DELETE /api/employees/:id          - Delete employee
PUT    /api/employees/:id/performance - Update performance
```

### Tasks
```
GET    /api/tasks                  - Get my tasks
GET    /api/tasks/all              - Get all tasks (admin)
GET    /api/tasks/progress         - Get progress stats
POST   /api/tasks                  - Create task
PUT    /api/tasks/:id              - Update task
DELETE /api/tasks/:id              - Delete task
```

### Salary
```
POST   /api/salary/calculate       - Calculate salary
GET    /api/salary/:id             - Get salary slip
GET    /api/salary/user/:userId    - Get user slips
GET    /api/salary/all             - Get all slips (admin)
```

### Policies
```
GET    /api/policies               - Get all policies
GET    /api/policies/:id           - Get one policy
GET    /api/policies/search?q=...  - Search policies
POST   /api/policies               - Create policy
PUT    /api/policies/:id           - Update policy
DELETE /api/policies/:id           - Delete policy
```

---

## 🧬 Salary Formula Quick Reference

```
Salary Calculation:
═════════════════════════════════════════════════════

Fixed = Base × 70%
  Example: 50,000 × 0.7 = 35,000

Variable = Base × 30% × Performance Weight
  Where Performance Weight = 
    (Team_Perf × 40% + 
     Individual_Perf × 40% + 
     Company_Perf × 20%) / 100
  
  Example: 50,000 × 0.3 × 
    (85×0.4 + 90×0.4 + 80×0.2) / 100 = 12,900

Total = Fixed + Variable
  Example: 35,000 + 12,900 = 47,900
```

---

## 📊 Database Models Quick Reference

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "hr" | "employee",
  baseSalary: Number,
  performance: {
    teamPerformance: 0-100,
    individualPerformance: 0-100,
    companyPerformance: 0-100
  },
  profileImage: String (URL),
  createdAt: Date
}
```

### Task
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  status: "pending" | "in-progress" | "completed",
  priority: "low" | "medium" | "high",
  dueDate: Date,
  completedDate: Date (auto-filled),
  createdAt: Date
}
```

### Policy
```javascript
{
  title: String,
  description: String,
  policyType: String,
  fileUrl: String (Cloudinary URL),
  uploadedBy: ObjectId,
  createdAt: Date
}
```

### SalarySlip
```javascript
{
  userId: ObjectId,
  month: "YYYY-MM",
  baseSalary: Number,
  fixedSalary: Number,
  variableSalary: Number,
  totalSalary: Number,
  createdAt: Date
}
```

---

## 🔐 Environment Variables Template

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=super_secret_key_min_32_characters

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Port 5000 already in use` | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| `Cannot find module` | Run `npm install` |
| `MongoDB connection failed` | Check MONGODB_URI in .env |
| `CORS error` | Ensure backend is running on port 5000 |
| `Token invalid` | Clear localStorage: `localStorage.clear()` |
| `Image upload fails` | Check Cloudinary credentials |
| `Page doesn't load` | Run `npx webpack` to build |

---

## 📝 Testing API with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John",
    "email":"john@test.com",
    "password":"password123"
  }'

# Save token from response
TOKEN="eyJ..."

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@test.com",
    "password":"password123"
  }'

# Get employees (with token)
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN"

# Create employee
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "name=Jane" \
  -F "email=jane@test.com" \
  -F "department=HR" \
  -F "baseSalary=60000"

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Complete report",
    "priority":"high",
    "dueDate":"2024-02-28"
  }'
```

---

## 🎯 Frontend Functions Quick Reference

```javascript
// Navigate pages
navigateToPage('dashboard');
navigateToPage('employees');
navigateToPage('finance');
navigateToPage('policies');
navigateToPage('tasks');
navigateToPage('admin');

// Get current user
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log(user);

// Get auth token
const token = localStorage.getItem('authToken');

// API call template
fetch('http://localhost:5000/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
  },
  body: JSON.stringify({ /* data */ })
})
.then(r => r.json())
.then(data => console.log(data));

// Clear auth
localStorage.clear();
location.reload();
```

---

## 🗂️ File Structure Cheat Sheet

```
companyportal/
├── Root Level (Frontend)
│   ├── index.html           (700+ lines)
│   ├── style.css            (600+ lines)
│   ├── script.js            (600+ lines)
│   ├── webpack.config.js
│   └── package.json
│
└── backend/ (API Server)
    ├── server.js
    ├── .env.example
    ├── package.json
    ├── config/
    │   ├── db.js
    │   └── cloudinary.js
    ├── models/
    │   ├── User.js
    │   ├── Task.js
    │   ├── Policy.js
    │   └── SalarySlip.js
    ├── controllers/
    │   ├── authController.js
    │   ├── employeeController.js
    │   ├── taskController.js
    │   ├── salaryController.js
    │   └── policyController.js
    ├── middleware/
    │   ├── auth.js
    │   └── upload.js
    └── routes/
        ├── auth.js
        ├── employees.js
        ├── tasks.js
        ├── salary.js
        └── policies.js
```

---

## 🚀 Deployment Quick Commands

```bash
# Deploy backend (Heroku)
git push heroku HEAD:main

# Deploy frontend (Netlify)
git push origin main

# View backend logs
heroku logs --tail

# Set environment variable
heroku config:set VAR_NAME=value

# Restart backend
heroku restart
```

---

## 📚 Documentation Files Quick Links

| File | Content | Read Time |
|------|---------|-----------|
| QUICKSTART.md | 5-minute setup | 5 min |
| README.md | Full docs | 15 min |
| API_DOCS.md | API reference | 20 min |
| DEPLOYMENT.md | Production guide | 30 min |
| TROUBLESHOOTING.md | Problem solving | 5 min |
| INDEX.md | Navigation hub | 2 min |

---

## 🔧 npm Scripts

```bash
# Frontend
npm install              # Install dependencies
npx webpack              # Build once
npx webpack --watch      # Build on file changes
npx http-server . -p 8080 # Serve on port 8080

# Backend
cd backend
npm install              # Install dependencies
npm start                # Start production
npm run dev              # Start development (auto-reload)
```

---

## ✅ Before Deployment Checklist

- [ ] Backend running locally
- [ ] Frontend loads on localhost:8080
- [ ] Can login with test account
- [ ] Can create employee
- [ ] Can create task
- [ ] Can upload policy
- [ ] Dashboard loads correctly
- [ ] All charts display
- [ ] Responsive design works
- [ ] No console errors

---

## 🎓 Learning Order

1. **QUICKSTART.md** - Get running
2. **README.md** - Understand project
3. **API_DOCS.md** - Learn endpoints
4. **script.js** - Study frontend code
5. **backend/server.js** - Study backend code
6. **DEPLOYMENT.md** - Deploy to production
7. **TROUBLESHOOTING.md** - Solve issues

---

## 💾 Backup Commands

```bash
# Backup database
heroku pg:backups:capture --app your-app

# Download backup
heroku pg:backups:download --app your-app

# List backups
heroku pg:backups --app your-app
```

---

## 🆘 Emergency Quick Fixes

```bash
# Kill port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Clear npm cache
npm cache clean --force

# Reset node_modules
rm -rf node_modules && npm install

# Clear webpack cache
rm -rf node_modules/.cache

# Hard refresh browser
Ctrl+Shift+R

# Clear browser storage
localStorage.clear()
sessionStorage.clear()
```

---

## 📞 Support Quick Links

- [Node.js Docs](https://nodejs.org/docs/)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Stack Overflow](https://stackoverflow.com/)

---

## 🎉 You're Ready!

Print this card and keep it handy while developing! 📋

**Happy coding! 🚀**
