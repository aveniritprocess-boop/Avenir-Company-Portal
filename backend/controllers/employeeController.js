const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single employee
const getEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create employee
const createEmployee = async (req, res) => {
    try {
        const { name, email, password, department, position, baseSalary } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        let profileImageUrl = null;

        // Upload image to Cloudinary if file is provided
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto',
                            folder: 'company-portal/employees',
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
                profileImageUrl = result.secure_url;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
            }
        }

        const employee = new User({
            name,
            email,
            password,
            role: 'employee',
            department,
            position,
            profileImage: profileImageUrl,
            salary: {
                baseSalary: baseSalary || 0,
                fixedSalary: (baseSalary || 0) * 0.7,
                variableSalary: (baseSalary || 0) * 0.3,
            },
        });

        await employee.save();

        res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const { name, email, department, position, baseSalary } = req.body;

        const employee = await User.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (name) employee.name = name;
        if (email) employee.email = email;
        if (department) employee.department = department;
        if (position) employee.position = position;

        if (baseSalary) {
            employee.salary.baseSalary = baseSalary;
            employee.salary.fixedSalary = baseSalary * 0.7;
            employee.salary.variableSalary = baseSalary * 0.3;
        }

        // Handle profile image update
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto',
                            folder: 'company-portal/employees',
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
                employee.profileImage = result.secure_url;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
            }
        }

        employee.updatedAt = new Date();
        await employee.save();

        res.json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update performance metrics
const updatePerformance = async (req, res) => {
    try {
        const { teamPerformance, individualPerformance, companyPerformance } = req.body;

        const employee = await User.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (teamPerformance !== undefined) employee.performance.teamPerformance = teamPerformance;
        if (individualPerformance !== undefined) employee.performance.individualPerformance = individualPerformance;
        if (companyPerformance !== undefined) employee.performance.companyPerformance = companyPerformance;

        await employee.save();

        res.json({ message: 'Performance updated successfully', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updatePerformance,
};
