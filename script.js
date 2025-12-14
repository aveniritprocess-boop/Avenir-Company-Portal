// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = true; // Set to false when backend is ready

// Global state
let currentUser = null;
let authToken = null;
let employees = [];
let tasks = [];
let policies = [];
let todos = [];
let currentSalaryData = null;

// Mock data for offline testing
const MOCK_USERS = {
    'admin@company.com': { id: '1', name: 'Admin User', email: 'admin@company.com', password: 'admin123', role: 'admin', department: 'Management', baseSalary: 100000 },
    'hr@company.com': { id: '2', name: 'HR Manager', email: 'hr@company.com', password: 'hr123', role: 'hr', department: 'HR', baseSalary: 80000 },
    'user@company.com': { id: '3', name: 'John Doe', email: 'user@company.com', password: 'user123', role: 'employee', department: 'IT', baseSalary: 60000 }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLoginPage();
    }
    
    attachEventListeners();
});

// Event Listeners
function attachEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage(link.dataset.page);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Employee search
    const empSearch = document.getElementById('employeeSearch');
    if (empSearch) {
        empSearch.addEventListener('input', (e) => {
            filterEmployees(e.target.value);
        });
    }

    // Task status filter
    const taskFilter = document.getElementById('taskStatusFilter');
    if (taskFilter) {
        taskFilter.addEventListener('change', (e) => {
            loadTasks(e.target.value);
        });
    }

    // Forms
    document.getElementById('employeeForm')?.addEventListener('submit', saveEmployee);
    document.getElementById('policyForm')?.addEventListener('submit', savePolicy);
    document.getElementById('taskForm')?.addEventListener('submit', saveTask);

    // Modal closing
    document.querySelectorAll('.modal').forEach(modal => {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (USE_MOCK_DATA) {
        // Offline mode - use mock data
        const user = MOCK_USERS[email];
        if (user && user.password === password) {
            authToken = 'mock_token_' + Date.now();
            currentUser = { ...user };
            delete currentUser.password;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
            loadMockData();
        } else {
            alert('Invalid email or password.\n\nTry:\n- admin@company.com / admin123\n- hr@company.com / hr123\n- user@company.com / user123');
        }
    } else {
        // API mode - connect to backend
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showDashboard();
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            alert('Error: Backend not running. Use demo credentials or start backend.');
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const department = document.getElementById('regDepartment').value;

    if (USE_MOCK_DATA) {
        // Offline mode - add to mock data
        const newUser = { id: Date.now().toString(), name, email, password, role: 'employee', department, baseSalary: 50000 };
        MOCK_USERS[email] = newUser;
        alert('Registration successful! You can now login.');
        toggleRegister();
        document.getElementById('registerForm').reset();
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').focus();
    } else {
        // API mode
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, department }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                toggleRegister();
                document.getElementById('registerForm').reset();
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            alert('Error: Backend not running.');
        }
    }
}

// Mock data loader
function loadMockData() {
    // Load sample employees
    employees = [
        { id: '101', name: 'Alice Johnson', email: 'alice@company.com', department: 'IT', position: 'Senior Developer', salary: { baseSalary: 75000, fixedSalary: 52500, variableSalary: 22500 }, performance: { teamPerformance: 85, individualPerformance: 90, companyPerformance: 80 } },
        { id: '102', name: 'Bob Smith', email: 'bob@company.com', department: 'HR', position: 'HR Specialist', salary: { baseSalary: 55000, fixedSalary: 38500, variableSalary: 16500 }, performance: { teamPerformance: 75, individualPerformance: 80, companyPerformance: 78 } },
        { id: '103', name: 'Carol White', email: 'carol@company.com', department: 'Finance', position: 'Accountant', salary: { baseSalary: 65000, fixedSalary: 45500, variableSalary: 19500 }, performance: { teamPerformance: 88, individualPerformance: 92, companyPerformance: 85 } }
    ];

    // Load sample tasks
    tasks = [
        { id: '201', title: 'Complete Q4 Report', description: 'Finish quarterly report', status: 'in-progress', priority: 'high', dueDate: '2025-12-31' },
        { id: '202', title: 'Code Review', description: 'Review pull requests', status: 'pending', priority: 'medium', dueDate: '2025-12-15' },
        { id: '203', title: 'Team Meeting', description: 'Weekly standup', status: 'completed', priority: 'low', dueDate: '2025-12-09' },
        { id: '204', title: 'Update Documentation', description: 'Update API docs', status: 'pending', priority: 'medium', dueDate: '2025-12-20' }
    ];

    // Load sample policies
    policies = [
        { id: '301', title: 'Leave Policy', description: 'Annual leave guidelines', policyType: 'leave', fileUrl: '#' },
        { id: '302', title: 'Code of Conduct', description: 'Company conduct rules', policyType: 'conduct', fileUrl: '#' },
        { id: '303', title: 'Security Policy', description: 'Data security guidelines', policyType: 'security', fileUrl: '#' }
    ];

    // Load sample to-dos
    todos = [
        { id: '401', title: 'Complete Q4 Reports', description: 'Finish quarterly reports', status: 'in-progress', priority: 'high', dueDate: '2025-12-15', createdAt: new Date() },
        { id: '402', title: 'Review Project Proposal', description: 'Review new project proposal', status: 'pending', priority: 'high', dueDate: '2025-12-12', createdAt: new Date() },
        { id: '403', title: 'Update Client Database', description: 'Add new clients to database', status: 'pending', priority: 'medium', dueDate: '2025-12-18', createdAt: new Date() },
        { id: '404', title: 'Schedule Team Lunch', description: 'Plan end of year team lunch', status: 'completed', priority: 'low', dueDate: '2025-12-10', createdAt: new Date() },
        { id: '405', title: 'Prepare Presentation', description: 'Create slides for annual meeting', status: 'in-progress', priority: 'high', dueDate: '2025-12-20', createdAt: new Date() }
    ];
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    showLoginPage();
}

function toggleRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

// Navigation
function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('dashboardPage').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    updateUserInfo();
    updateAccessLevel();
    loadDashboardData();
}

function updateUserInfo() {
    document.getElementById('currentUserName').textContent = currentUser.name || 'User';
    document.getElementById('currentUserRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
}

function updateAccessLevel() {
    const employeeNav = document.getElementById('employeeNav');
    const adminNav = document.getElementById('adminNav');

    if (currentUser.role === 'admin' || currentUser.role === 'hr') {
        employeeNav.parentElement.style.display = 'block';
        if (currentUser.role === 'admin') {
            adminNav.style.display = 'block';
        }
    } else {
        employeeNav.parentElement.style.display = 'none';
        adminNav.style.display = 'none';
    }
}

function navigateToPage(page) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Show selected content
    const content = document.getElementById(page + 'Content');
    if (content) {
        content.classList.add('active');
    }

    // Mark nav link as active
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Load page-specific data
    if (page === 'employees') loadEmployees();
    if (page === 'tasks') loadTasks();
    if (page === 'policies') loadPolicies();
    if (page === 'finance') loadFinance();
    if (page === 'todolist') loadTodos();
    if (page === 'admin') loadAdminData();
}

// Dashboard
async function loadDashboardData() {
    try {
        await loadTasks();
        const taskStats = calculateTaskStats();
        
        document.getElementById('totalTasks').textContent = taskStats.total;
        document.getElementById('completedTasks').textContent = taskStats.completed;
        document.getElementById('taskProgress').textContent = taskStats.percentage + '%';
        document.getElementById('mainProgress').style.width = taskStats.percentage + '%';
        document.getElementById('progressText').textContent = taskStats.percentage + '%';

        if (currentUser.role === 'admin' || currentUser.role === 'hr') {
            await loadEmployees();
            document.getElementById('totalEmployees').textContent = employees.length;
        }

        drawTaskChart(taskStats);
        drawPerformanceChart();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function calculateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, percentage };
}

function drawTaskChart(stats) {
    const ctx = document.getElementById('taskChart');
    if (!ctx) return;

    if (window.taskChart) window.taskChart.destroy();

    window.taskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending', 'In Progress'],
            datasets: [{
                data: [
                    tasks.filter(t => t.status === 'completed').length,
                    tasks.filter(t => t.status === 'pending').length,
                    tasks.filter(t => t.status === 'in-progress').length,
                ],
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
            }],
        },
        options: { responsive: true, maintainAspectRatio: true },
    });
}

function drawPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx || !currentUser) return;

    if (window.perfChart) window.perfChart.destroy();

    window.perfChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Team', 'Individual', 'Company'],
            datasets: [{
                label: 'Performance',
                data: [
                    currentUser.performance?.teamPerformance || 0,
                    currentUser.performance?.individualPerformance || 0,
                    currentUser.performance?.companyPerformance || 0,
                ],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                pointBackgroundColor: '#2563eb',
            }],
        },
        options: { responsive: true, maintainAspectRatio: true },
    });
}

// Employees
async function loadEmployees() {
    if (USE_MOCK_DATA) {
        displayEmployees(employees);
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            employees = await response.json();
            displayEmployees(employees);
        } catch (error) {
            console.error('Error loading employees:', error);
            // Fallback to mock data
            displayEmployees(employees);
        }
    }
}

function displayEmployees(list) {
    const container = document.getElementById('employeesList');
    if (!container) return;

    container.innerHTML = list.map(emp => `
        <div class="employee-card">
            <div class="employee-header">
                <h3>${emp.name}</h3>
                <div class="employee-detail">${emp.department || 'N/A'}</div>
                <div class="employee-detail">${emp.position || 'N/A'}</div>
                <div class="employee-detail">₹${emp.salary?.baseSalary || 0}</div>
            </div>
            <div class="employee-actions">
                <button onclick="editEmployee('${emp._id}')">Edit</button>
                <button onclick="deleteEmployee('${emp._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function filterEmployees(query) {
    const filtered = employees.filter(e => 
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.email.toLowerCase().includes(query.toLowerCase()) ||
        e.department.toLowerCase().includes(query.toLowerCase())
    );
    displayEmployees(filtered);
}

function openEmployeeModal() {
    document.getElementById('employeeModal').classList.add('active');
    document.getElementById('employeeForm').reset();
    document.getElementById('empPassword').required = true;
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.remove('active');
}

async function saveEmployee(e) {
    e.preventDefault();
    
    const name = document.getElementById('empName').value;
    const email = document.getElementById('empEmail').value;
    const password = document.getElementById('empPassword').value;
    const department = document.getElementById('empDepartment').value;
    const position = document.getElementById('empPosition').value;
    const baseSalary = parseFloat(document.getElementById('empSalary').value);

    if (USE_MOCK_DATA) {
        // Offline mode - add to mock employees
        const newEmployee = {
            id: Date.now().toString(),
            name, email, department, position,
            salary: { baseSalary, fixedSalary: baseSalary * 0.7, variableSalary: baseSalary * 0.3 },
            performance: { teamPerformance: 75, individualPerformance: 80, companyPerformance: 78 }
        };
        employees.push(newEmployee);
        alert('Employee added successfully');
        closeEmployeeModal();
        displayEmployees(employees);
    } else {
        // API mode
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('department', department);
        formData.append('position', position);
        formData.append('baseSalary', baseSalary);
        
        if (document.getElementById('empImage').files[0]) {
            formData.append('profileImage', document.getElementById('empImage').files[0]);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData,
            });

            if (response.ok) {
                alert('Employee added successfully');
                closeEmployeeModal();
                loadEmployees();
            } else {
                const data = await response.json();
                alert(data.message || 'Error saving employee');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure?')) return;

    if (USE_MOCK_DATA) {
        // Offline mode
        employees = employees.filter(e => e.id !== id);
        alert('Employee deleted');
        displayEmployees(employees);
    } else {
        // API mode
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.ok) {
                alert('Employee deleted');
                loadEmployees();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// Tasks
async function loadTasks(filter = '') {
    if (USE_MOCK_DATA) {
        let taskList = tasks;
        if (filter) {
            taskList = tasks.filter(t => t.status === filter);
        }
        displayTasks(taskList);
    } else {
        try {
            const response = await fetch(
                `${API_BASE_URL}/tasks${currentUser.role === 'admin' ? '/all' : ''}`,
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            tasks = await response.json();
            
            if (filter) {
                tasks = tasks.filter(t => t.status === filter);
            }
            
            displayTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            // Fallback to mock data
            displayTasks(tasks);
        }
    }
}

function displayTasks(list) {
    const container = document.getElementById('tasksList');
    if (!container) return;

    container.innerHTML = list.map(task => `
        <div class="task-card">
            <div class="task-header">
                <h3>${task.title}</h3>
                <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
            </div>
            <p>${task.description || ''}</p>
            <div class="task-status">
                <select onchange="updateTaskStatus('${task._id}', this.value)">
                    <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="btn-secondary" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function openTaskModal() {
    document.getElementById('taskModal').classList.add('active');
    document.getElementById('taskForm').reset();
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
}

async function saveTask(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (USE_MOCK_DATA) {
        // Offline mode
        const newTask = {
            id: Date.now().toString(),
            title, description, priority, dueDate,
            status: 'pending'
        };
        tasks.push(newTask);
        alert('Task created');
        closeTaskModal();
        loadTasks();
    } else {
        // API mode
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ title, description, priority, dueDate }),
            });

            if (response.ok) {
                alert('Task created');
                closeTaskModal();
                loadTasks();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function updateTaskStatus(id, status) {
    if (USE_MOCK_DATA) {
        // Offline mode
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = status;
            loadTasks();
        }
    } else {
        // API mode
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                loadTasks();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function deleteTask(id) {
    if (!confirm('Delete task?')) return;

    if (USE_MOCK_DATA) {
        // Offline mode
        tasks = tasks.filter(t => t.id !== id);
        loadTasks();
    } else {
        // API mode
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.ok) {
                loadTasks();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// Finance & Salary
async function loadFinance() {
    if (USE_MOCK_DATA) {
        const select = document.getElementById('employeeSelect');
        select.innerHTML = '<option value="">Select Employee</option>' +
            employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    } else {
        try {
            await loadEmployees();
            const select = document.getElementById('employeeSelect');
            select.innerHTML = '<option value="">Select Employee</option>' +
                employees.map(e => `<option value="${e._id}">${e.name}</option>`).join('');
        } catch (error) {
            console.error('Error loading finance:', error);
        }
    }
}

async function calculateSalary() {
    const empId = document.getElementById('employeeSelect').value;
    const month = document.getElementById('salaryMonth').value;

    if (!empId || !month) {
        alert('Please select employee and month');
        return;
    }

    if (USE_MOCK_DATA) {
        // Offline mode - calculate with mock data
        const emp = employees.find(e => e.id === empId);
        if (emp) {
            const baseSalary = emp.salary?.baseSalary || 50000;
            const fixedSalary = baseSalary * 0.7;
            const perf = emp.performance || { teamPerformance: 75, individualPerformance: 80, companyPerformance: 78 };
            const perfWeight = (perf.teamPerformance * 0.4 + perf.individualPerformance * 0.4 + perf.companyPerformance * 0.2) / 100;
            const variableSalary = baseSalary * 0.3 * perfWeight;
            
            currentSalaryData = {
                month,
                baseSalary,
                fixedSalary,
                variableSalary,
                totalSalary: fixedSalary + variableSalary,
                performanceMetrics: perf
            };
            displaySalaryInfo(currentSalaryData);
            document.getElementById('salaryInfo').style.display = 'grid';
        }
    } else {
        // API mode
        try {
            const response = await fetch(`${API_BASE_URL}/salary/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ userId: empId, month }),
            });

            const data = await response.json();

            if (response.ok) {
                currentSalaryData = data.salarySlip;
                displaySalaryInfo(data.salarySlip);
                document.getElementById('salaryInfo').style.display = 'grid';
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

function displaySalaryInfo(slip) {
    document.getElementById('baseSalaryDisplay').textContent = '₹' + slip.baseSalary;
    document.getElementById('fixedSalaryDisplay').textContent = '₹' + slip.fixedSalary;
    document.getElementById('variableSalaryDisplay').textContent = '₹' + slip.variableSalary;
    document.getElementById('totalSalaryDisplay').textContent = '₹' + slip.totalSalary;
    
    document.getElementById('teamPerfDisplay').textContent = slip.performanceMetrics.teamPerformance + '%';
    document.getElementById('indPerfDisplay').textContent = slip.performanceMetrics.individualPerformance + '%';
    document.getElementById('compPerfDisplay').textContent = slip.performanceMetrics.companyPerformance + '%';
}

function downloadSalarySlip() {
    if (!currentSalaryData) return;

    const slip = currentSalaryData;
    const content = `
        SALARY SLIP
        Month: ${slip.month}
        
        Base Salary: ₹${slip.baseSalary}
        Fixed (70%): ₹${slip.fixedSalary}
        Variable (30%): ₹${slip.variableSalary}
        
        Total Salary: ₹${slip.totalSalary}
        
        Performance Metrics:
        Team: ${slip.performanceMetrics.teamPerformance}%
        Individual: ${slip.performanceMetrics.individualPerformance}%
        Company: ${slip.performanceMetrics.companyPerformance}%
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `salary_slip_${slip.month}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Policies
async function loadPolicies() {
    if (USE_MOCK_DATA) {
        // Already loaded in loadMockData(), just display
        displayPolicies(policies);
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/policies`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            policies = await response.json();
            displayPolicies(policies);
        } catch (error) {
            console.error('Error loading policies:', error);
            // Fallback to mock data
            if (policies.length === 0) loadMockData();
            displayPolicies(policies);
        }
    }
}

function displayPolicies(list) {
    const container = document.getElementById('policiesList');
    if (!container) return;

    container.innerHTML = list.map(policy => `
        <div class="policy-card">
            <span class="policy-type">${policy.policyType}</span>
            <h3>${policy.title}</h3>
            <p class="policy-description">${policy.description || ''}</p>
            <p style="font-size: 12px; color: #64748b;">Uploaded: ${new Date(policy.createdAt).toLocaleDateString()}</p>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <a href="${policy.fileUrl}" target="_blank" class="btn-secondary" style="text-decoration: none;">View File</a>
                <button onclick="deletePolicy('${policy._id}')" class="btn-secondary">Delete</button>
            </div>
        </div>
    `).join('');
}

function openPolicyModal() {
    document.getElementById('policyModal').classList.add('active');
    document.getElementById('policyForm').reset();
}

function closePolicyModal() {
    document.getElementById('policyModal').classList.remove('active');
}

async function savePolicy(e) {
    e.preventDefault();

    if (!document.getElementById('policyFile').files[0]) {
        alert('Please select a file');
        return;
    }

    if (USE_MOCK_DATA) {
        // In offline mode, just add policy metadata (can't upload file to Cloudinary)
        const newPolicy = {
            _id: Date.now().toString(),
            title: document.getElementById('policyTitle').value,
            description: document.getElementById('policyDescription').value,
            policyType: document.getElementById('policyType').value,
            fileUrl: URL.createObjectURL(document.getElementById('policyFile').files[0]),
            createdAt: new Date(),
        };
        policies.push(newPolicy);
        alert('Policy saved to local storage (offline mode)');
        closePolicyModal();
        displayPolicies(policies);
    } else {
        // API mode - upload to Cloudinary
        const formData = new FormData();
        formData.append('title', document.getElementById('policyTitle').value);
        formData.append('description', document.getElementById('policyDescription').value);
        formData.append('policyType', document.getElementById('policyType').value);
        formData.append('file', document.getElementById('policyFile').files[0]);

        try {
            const response = await fetch(`${API_BASE_URL}/policies`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
                body: formData,
            });

            if (response.ok) {
                alert('Policy uploaded');
                closePolicyModal();
                loadPolicies();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function deletePolicy(id) {
    if (!confirm('Delete policy?')) return;

    if (USE_MOCK_DATA) {
        // Remove from mock data array
        policies = policies.filter(p => p._id !== id);
        displayPolicies(policies);
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/policies/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.ok) {
                loadPolicies();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// Admin
async function loadAdminData() {
    try {
        await loadEmployees();
        await loadTasks();
        await loadPolicies();

        const taskStats = calculateTaskStats();
        document.getElementById('adminTotalEmp').textContent = employees.length;
        document.getElementById('adminTotalTasks').textContent = tasks.length;
        document.getElementById('adminTotalPolicies').textContent = policies.length;
        document.getElementById('adminCompletedTasks').textContent = taskStats.completed;

        drawEmployeeChart();
        drawSalaryChart();
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

function drawEmployeeChart() {
    const ctx = document.getElementById('employeeChart');
    if (!ctx) return;

    if (window.empChart) window.empChart.destroy();

    window.empChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: employees.map(e => e.department),
            datasets: [{
                label: 'Employees by Department',
                data: employees.map((_, i) => employees.filter(e => e.department === employees[i].department).length),
                backgroundColor: '#2563eb',
            }],
        },
        options: { responsive: true, maintainAspectRatio: true },
    });
}

function drawSalaryChart() {
    const ctx = document.getElementById('salaryChart');
    if (!ctx) return;

    if (window.salChart) window.salChart.destroy();

    window.salChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: employees.map(e => e.name),
            datasets: [{
                label: 'Base Salary',
                data: employees.map(e => e.salary?.baseSalary || 0),
                borderColor: '#2563eb',
                tension: 0.1,
            }],
        },
        options: { responsive: true, maintainAspectRatio: true },
    });
}

// To-Do List Functions
async function loadTodos() {
    if (USE_MOCK_DATA) {
        displayTodos(todos);
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            todos = await response.json();
            displayTodos(todos);
        } catch (error) {
            console.error('Error loading todos:', error);
            if (todos.length === 0) loadMockData();
            displayTodos(todos);
        }
    }
    updateTodoStats();
}

function displayTodos(list) {
    const container = document.getElementById('todosList');
    if (!container) return;

    let filteredList = [...list];

    // Apply filters
    const searchTerm = document.getElementById('todoSearch')?.value || '';
    const statusFilter = document.getElementById('todoStatusFilter')?.value || '';
    const priorityFilter = document.getElementById('todoPriorityFilter')?.value || '';

    if (searchTerm) {
        filteredList = filteredList.filter(t => 
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    if (statusFilter) {
        filteredList = filteredList.filter(t => t.status === statusFilter);
    }
    if (priorityFilter) {
        filteredList = filteredList.filter(t => t.priority === priorityFilter);
    }

    const getPriorityColor = (priority) => {
        const colors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
        return colors[priority] || '#6b7280';
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: '<span class="status-badge pending">Pending</span>',
            'in-progress': '<span class="status-badge in-progress">In Progress</span>',
            completed: '<span class="status-badge completed">Completed</span>'
        };
        return badges[status] || '';
    };

    container.innerHTML = filteredList.length === 0 ? '<p style="text-align: center; color: #94a3b8; padding: 40px;">No to-dos found</p>' : 
        filteredList.map(todo => `
            <div class="todo-card" style="border-left: 4px solid ${getPriorityColor(todo.priority)}">
                <div class="todo-header">
                    <div>
                        <h3>${todo.title}</h3>
                        <p class="todo-description">${todo.description || 'No description'}</p>
                    </div>
                    <div style="display: flex; gap: 5px; align-items: flex-start;">
                        ${getStatusBadge(todo.status)}
                        <span class="priority-badge" style="background-color: ${getPriorityColor(todo.priority)}; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px;">${todo.priority.toUpperCase()}</span>
                    </div>
                </div>
                <div class="todo-details">
                    <p style="font-size: 12px; color: #64748b;">📅 ${new Date(todo.dueDate).toLocaleDateString()}</p>
                </div>
                <div class="todo-actions" style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <select class="form-control" style="flex: 1; min-width: 120px;" onchange="updateTodoStatus('${todo.id}', this.value)">
                        <option value="pending" ${todo.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${todo.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${todo.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button class="btn-secondary" onclick="editTodo('${todo.id}')">Edit</button>
                    <button class="btn-secondary" onclick="deleteTodo('${todo.id}')" style="background-color: #ef4444; color: white;">Delete</button>
                </div>
            </div>
        `).join('');
}

function updateTodoStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.status === 'completed').length;
    const inProgress = todos.filter(t => t.status === 'in-progress').length;

    document.getElementById('totalTodos').textContent = total;
    document.getElementById('completedTodos').textContent = completed;
    document.getElementById('inProgressTodos').textContent = inProgress;
}

function openTodoModal() {
    document.getElementById('todoModal').classList.add('active');
    document.getElementById('todoForm').reset();
    document.getElementById('todoForm').onsubmit = saveTodo;
}

function closeTodoModal() {
    document.getElementById('todoModal').classList.remove('active');
}

async function saveTodo(e) {
    e.preventDefault();

    const newTodo = {
        id: Date.now().toString(),
        title: document.getElementById('todoTitle').value,
        description: document.getElementById('todoDescription').value,
        priority: document.getElementById('todoPriority').value,
        dueDate: document.getElementById('todoDueDate').value,
        status: document.getElementById('todoStatus').value,
        createdAt: new Date()
    };

    if (USE_MOCK_DATA) {
        todos.push(newTodo);
        displayTodos(todos);
        alert('To-Do added successfully');
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            });

            if (response.ok) {
                alert('To-Do saved');
                loadTodos();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    closeTodoModal();
    updateTodoStats();
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    document.getElementById('todoTitle').value = todo.title;
    document.getElementById('todoDescription').value = todo.description;
    document.getElementById('todoPriority').value = todo.priority;
    document.getElementById('todoDueDate').value = todo.dueDate;
    document.getElementById('todoStatus').value = todo.status;

    document.getElementById('todoForm').onsubmit = (e) => updateTodo(e, id);
    openTodoModal();
}

async function updateTodo(e, id) {
    e.preventDefault();

    const updatedTodo = {
        title: document.getElementById('todoTitle').value,
        description: document.getElementById('todoDescription').value,
        priority: document.getElementById('todoPriority').value,
        dueDate: document.getElementById('todoDueDate').value,
        status: document.getElementById('todoStatus').value
    };

    if (USE_MOCK_DATA) {
        const todoIndex = todos.findIndex(t => t.id === id);
        if (todoIndex !== -1) {
            todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
            displayTodos(todos);
            alert('To-Do updated');
        }
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTodo)
            });

            if (response.ok) {
                alert('To-Do updated');
                loadTodos();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    closeTodoModal();
    updateTodoStats();
}

async function deleteTodo(id) {
    if (!confirm('Delete this to-do?')) return;

    if (USE_MOCK_DATA) {
        todos = todos.filter(t => t.id !== id);
        displayTodos(todos);
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (response.ok) {
                loadTodos();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
    updateTodoStats();
}

async function updateTodoStatus(id, status) {
    if (USE_MOCK_DATA) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.status = status;
            displayTodos(todos);
        }
    } else {
        try {
            await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            loadTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }
    updateTodoStats();
}

function openExcelImport() {
    document.getElementById('excelImportModal').classList.add('active');
}

function closeExcelImport() {
    document.getElementById('excelImportModal').classList.remove('active');
}

async function importExcelFile() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file');
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                alert('Excel file is empty');
                return;
            }

            // Import todos from Excel
            let importedCount = 0;
            jsonData.forEach(row => {
                if (row.Title && row.Description) {
                    const newTodo = {
                        id: Date.now().toString() + Math.random(),
                        title: row.Title || '',
                        description: row.Description || '',
                        priority: row.Priority?.toLowerCase() || 'medium',
                        dueDate: row['Due Date'] ? new Date(row['Due Date']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        status: row.Status?.toLowerCase() || 'pending',
                        createdAt: new Date()
                    };

                    // Validate priority
                    if (!['high', 'medium', 'low'].includes(newTodo.priority)) {
                        newTodo.priority = 'medium';
                    }

                    // Validate status
                    if (!['pending', 'in-progress', 'completed'].includes(newTodo.status)) {
                        newTodo.status = 'pending';
                    }

                    todos.push(newTodo);
                    importedCount++;
                }
            });

            if (importedCount > 0) {
                alert(`Successfully imported ${importedCount} to-dos from Excel`);
                displayTodos(todos);
                updateTodoStats();
                closeExcelImport();
            } else {
                alert('No valid to-dos found in Excel file. Make sure columns are named: Title, Description, Priority, Due Date, Status');
            }
        };

        reader.readAsArrayBuffer(file);
    } catch (error) {
        alert('Error reading Excel file: ' + error.message);
    }
}

// Add filter event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('todoSearch');
    const statusFilter = document.getElementById('todoStatusFilter');
    const priorityFilter = document.getElementById('todoPriorityFilter');

    if (searchInput) {
        searchInput.addEventListener('input', () => displayTodos(todos));
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', () => displayTodos(todos));
    }
    if (priorityFilter) {
        priorityFilter.addEventListener('change', () => displayTodos(todos));
    }
}, { once: true });

