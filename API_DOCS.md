# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "employee",
  "department": "IT",
  "position": "Developer",
  "baseSalary": 50000
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login User
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### Get Current User
```
GET /auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "employee",
  "department": "IT",
  "position": "Developer",
  "baseSalary": 50000,
  "performance": {
    "teamPerformance": 85,
    "individualPerformance": 90,
    "companyPerformance": 80
  },
  "profileImage": "https://res.cloudinary.com/...",
  "joinDate": "2024-01-15T10:30:00Z"
}
```

---

## Employee Endpoints

### Get All Employees
```
GET /employees
Authorization: Bearer {token}
```

**Query Parameters:**
- `department` - Filter by department
- `role` - Filter by role
- `search` - Search by name/email

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "department": "IT",
    "position": "Developer",
    "salary": {
      "baseSalary": 50000,
      "fixedSalary": 35000,
      "variableSalary": 15000
    },
    "performance": {
      "teamPerformance": 85,
      "individualPerformance": 90,
      "companyPerformance": 80
    },
    "profileImage": "https://res.cloudinary.com/...",
    "joinDate": "2024-01-15T10:30:00Z"
  }
]
```

---

### Get Employee by ID
```
GET /employees/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "department": "IT",
  "position": "Developer",
  "salary": {
    "baseSalary": 50000,
    "fixedSalary": 35000,
    "variableSalary": 15000
  },
  "performance": {
    "teamPerformance": 85,
    "individualPerformance": 90,
    "companyPerformance": 80
  },
  "profileImage": "https://res.cloudinary.com/...",
  "joinDate": "2024-01-15T10:30:00Z"
}
```

---

### Create Employee
```
POST /employees
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "department": "HR",
  "position": "HR Manager",
  "baseSalary": 60000,
  "profileImage": (file)
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "department": "HR",
  "position": "HR Manager",
  "profileImage": "https://res.cloudinary.com/...",
  "message": "Employee created successfully"
}
```

---

### Update Employee
```
PUT /employees/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "name": "John Updated",
  "department": "Finance",
  "position": "Senior Developer",
  "baseSalary": 65000,
  "profileImage": (file) // optional
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Updated",
  "department": "Finance",
  "position": "Senior Developer",
  "baseSalary": 65000,
  "message": "Employee updated successfully"
}
```

---

### Update Performance Metrics
```
PUT /employees/:id/performance
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "teamPerformance": 88,
  "individualPerformance": 92,
  "companyPerformance": 85
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "performance": {
    "teamPerformance": 88,
    "individualPerformance": 92,
    "companyPerformance": 85
  },
  "message": "Performance metrics updated"
}
```

---

### Delete Employee
```
DELETE /employees/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Employee deleted successfully"
}
```

---

## Task Endpoints

### Get User's Tasks
```
GET /tasks
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "title": "Complete Project",
    "description": "Finish the quarterly project",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-02-28T00:00:00Z",
    "completedDate": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Get All Tasks (Admin Only)
```
GET /tasks/all
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Complete Project",
    "description": "Finish the quarterly project",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-02-28T00:00:00Z",
    "completedDate": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Get Task Progress
```
GET /tasks/progress
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "total": 10,
  "completed": 6,
  "pending": 2,
  "inProgress": 2,
  "percentage": 60
}
```

---

### Create Task
```
POST /tasks
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2024-02-28T00:00:00Z"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "userId": "507f1f77bcf86cd799439011",
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-02-28T00:00:00Z",
  "message": "Task created successfully"
}
```

---

### Update Task
```
PUT /tasks/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Updated Task",
  "status": "completed",
  "priority": "medium"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "title": "Updated Task",
  "status": "completed",
  "priority": "medium",
  "completedDate": "2024-02-15T10:30:00Z",
  "message": "Task updated successfully"
}
```

---

### Delete Task
```
DELETE /tasks/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Salary Endpoints

### Calculate Salary
```
POST /salary/calculate
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "month": "2024-01"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "userId": "507f1f77bcf86cd799439011",
  "month": "2024-01",
  "baseSalary": 50000,
  "fixedSalary": 35000,
  "variableSalary": 15000,
  "totalSalary": 50000,
  "performanceMetrics": {
    "teamPerformance": 85,
    "individualPerformance": 90,
    "companyPerformance": 80
  },
  "message": "Salary calculated successfully"
}
```

**Calculation Details:**
```
Fixed Salary = Base Salary × 70% = 50000 × 0.7 = 35000

Variable Salary = Base Salary × 30% × Performance Weight
                = 50000 × 0.3 × 
                  (85×0.4 + 90×0.4 + 80×0.2) / 100
                = 15000 × (34+36+16)/100
                = 15000 × 86/100
                = 12,900

Total Salary = Fixed + Variable
             = 35000 + 12900
             = 47,900
```

---

### Get Salary Slip by ID
```
GET /salary/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "userId": "507f1f77bcf86cd799439011",
  "month": "2024-01",
  "baseSalary": 50000,
  "fixedSalary": 35000,
  "variableSalary": 12900,
  "totalSalary": 47900,
  "deductions": {
    "tax": 5000,
    "insurance": 500
  },
  "netSalary": 42400,
  "performanceMetrics": {
    "teamPerformance": 85,
    "individualPerformance": 90,
    "companyPerformance": 80
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Get User's Salary Slips
```
GET /salary/user/:userId
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439031",
    "month": "2024-01",
    "totalSalary": 47900,
    "netSalary": 42400
  },
  {
    "_id": "507f1f77bcf86cd799439032",
    "month": "2024-02",
    "totalSalary": 49500,
    "netSalary": 44200
  }
]
```

---

### Get All Salary Slips (Admin Only)
```
GET /salary/all
Authorization: Bearer {token}
```

**Query Parameters:**
- `month` - Filter by month (YYYY-MM)
- `userId` - Filter by user ID

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439031",
    "userId": "507f1f77bcf86cd799439011",
    "month": "2024-01",
    "totalSalary": 47900,
    "netSalary": 42400
  }
]
```

---

## Policy Endpoints

### Get All Policies
```
GET /policies
Authorization: Bearer {token}
```

**Query Parameters:**
- `type` - Filter by policy type

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439041",
    "title": "Leave Policy",
    "description": "Annual leave policy details",
    "policyType": "leave",
    "fileUrl": "https://res.cloudinary.com/.../policy.pdf",
    "fileName": "leave_policy.pdf",
    "uploadedBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### Get Policy by ID
```
GET /policies/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439041",
  "title": "Leave Policy",
  "description": "Annual leave policy details",
  "policyType": "leave",
  "fileUrl": "https://res.cloudinary.com/.../policy.pdf",
  "fileName": "leave_policy.pdf",
  "uploadedBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Search Policies
```
GET /policies/search?q=leave
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439041",
    "title": "Leave Policy",
    "description": "Annual leave policy details",
    "policyType": "leave",
    "fileUrl": "https://res.cloudinary.com/.../policy.pdf"
  }
]
```

---

### Create Policy
```
POST /policies
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "title": "New Policy",
  "description": "Policy description",
  "policyType": "conduct",
  "file": (PDF or Image file)
}
```

**Accepted File Types:**
- PDF (application/pdf)
- Images (jpeg, png, webp, gif)
- Word (docx)

**File Size:** Max 10 MB

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439041",
  "title": "New Policy",
  "description": "Policy description",
  "policyType": "conduct",
  "fileUrl": "https://res.cloudinary.com/.../policy.pdf",
  "message": "Policy created successfully"
}
```

---

### Update Policy
```
PUT /policies/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "title": "Updated Policy",
  "description": "Updated description",
  "policyType": "security",
  "file": (optional - new file)
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439041",
  "title": "Updated Policy",
  "description": "Updated description",
  "policyType": "security",
  "message": "Policy updated successfully"
}
```

---

### Delete Policy
```
DELETE /policies/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Policy deleted successfully"
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Validation error or missing required fields"
}
```

### 401 - Unauthorized
```json
{
  "message": "Authentication token missing or invalid"
}
```

### 403 - Forbidden
```json
{
  "message": "You don't have permission to perform this action"
}
```

### 404 - Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a valid JWT token.

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token obtained from login/register response.

---

## Rate Limiting

Currently not implemented. For production, consider adding:
- 100 requests per 15 minutes per IP
- 50 requests per 15 minutes per authenticated user

---

## Pagination

Currently not implemented. Future enhancement:
```
GET /employees?page=1&limit=20
```

---

## Sorting

Currently not implemented. Future enhancement:
```
GET /employees?sort=-createdAt,name
```

---

## Response Format

All responses follow standard JSON format with status codes:
- **2xx** - Success
- **4xx** - Client error
- **5xx** - Server error

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get employees (with token)
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Postman Collection

Import `companyportal.postman_collection.json` in Postman for easier API testing.

---

## API Versioning

Current version: **v1**

Future versions can be accessed via:
```
/api/v2/employees
/api/v2/tasks
```
