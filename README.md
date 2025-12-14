# 🚀 Avenir Company Portal

Avenir Company Portal is a **full-fledged internal employee management portal** built for a growing **IoT-focused organization**. It centralizes employee tasks, performance tracking, and internal operations into a single, secure platform.

The portal is designed to support **70+ employees** with a scalable, low-cost, and cloud-based architecture.

---

## ✨ Features

### 👨‍💼 Employee Features

* Secure Login & Logout
* Personal Dashboard
* Employee-wise To-Do List
* Task Priority (High / Medium / Low)
* Deadline Tracking
* Task Status (Pending / Completed)
* Performance Score & KPI View

### 🧑‍💻 Admin / Manager Features

* Role-Based Access Control
* Assign Tasks to Employees
* View Team & Individual Performance
* Monitor Task Progress
* Export Performance & Task Reports

---

## 🧱 System Architecture

```
Employee Browser
      ↓
Portal UI (HTML / CSS / JS)
      ↓
Firebase Authentication
      ↓
Google Apps Script API
      ↓
Google Sheets (Database)
```

✔ Secure
✔ Scalable
✔ Zero/Low Cost
✔ Easy to Maintain

---

## 🛠 Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| Frontend       | HTML, CSS, JavaScript |
| Authentication | Firebase Auth         |
| Backend API    | Google Apps Script    |
| Database       | Google Sheets         |
| Hosting        | Firebase / Netlify    |

---

## 📊 Performance Evaluation Model

Employee performance is calculated using the following KPIs:

* Team Performance – 40%
* Individual Performance – 40%
* Project Delivery / Manager Rating – 20%

Final Score is auto-calculated and displayed on the employee dashboard.

---

## 📂 Project Structure

```
avenir-company-portal/
│
├── index.html          # Login Page
├── dashboard.html      # Main Dashboard
├── admin.html          # Admin Panel
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── dashboard.js
│   ├── todo.js
│   └── performance.js
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-org/avenir-company-portal.git
```

### 2️⃣ Configure Firebase

* Create a Firebase project
* Enable Email/Password Authentication
* Add Firebase config to `auth.js`

### 3️⃣ Setup Google Sheets API

* Create a Google Sheet for performance data
* Deploy Google Apps Script as Web App
* Update API URL in `performance.js`

### 4️⃣ Deploy

* Use Firebase Hosting or Netlify
* Connect custom domain (optional)

---

## 🔐 Security

* Firebase Authentication for login
* Role-based UI rendering
* No direct access to Google Sheets
* Secure API endpoints

---

## 📌 Use Case

This portal is ideal for:

* IoT companies
* Engineering teams
* Small to mid-size organizations (50–100 employees)
* Companies needing low-cost internal tools

---

## 📈 Future Enhancements

* Attendance Management
* Payroll Integration
* Notification System
* Mobile App Version
* Advanced Analytics

---

## 📄 License

This project is developed for **internal company use** by **Avenir**.

---

## 👤 Maintained By

**Avenir Tech Team**

---

> Built with scalability, security, and simplicity in mind.
