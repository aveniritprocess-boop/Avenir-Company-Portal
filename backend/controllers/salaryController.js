const SalarySlip = require('../models/SalarySlip');
const User = require('../models/User');

// Calculate salary
const calculateSalary = async (req, res) => {
    try {
        const { userId, month } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const baseSalary = user.salary.baseSalary;
        const fixedSalary = baseSalary * 0.7; // 70% fixed

        // 30% variable calculation
        const teamPerf = user.performance.teamPerformance || 0;
        const indPerf = user.performance.individualPerformance || 0;
        const compPerf = user.performance.companyPerformance || 0;

        const variableSalary = (baseSalary * 0.3) * (
            (teamPerf * 0.4 + indPerf * 0.4 + compPerf * 0.2) / 100
        );

        const totalSalary = fixedSalary + variableSalary;

        const salarySlip = new SalarySlip({
            userId,
            month,
            baseSalary,
            fixedSalary,
            variableSalary,
            totalSalary,
            performanceMetrics: {
                teamPerformance: teamPerf,
                individualPerformance: indPerf,
                companyPerformance: compPerf,
            },
        });

        await salarySlip.save();

        res.status(201).json({
            message: 'Salary calculated successfully',
            salarySlip,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get salary slip
const getSalarySlip = async (req, res) => {
    try {
        const salarySlip = await SalarySlip.findById(req.params.id).populate('userId', 'name email department');
        if (!salarySlip) {
            return res.status(404).json({ message: 'Salary slip not found' });
        }
        res.json(salarySlip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user salary slips
const getUserSalarySlips = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        const salarySlips = await SalarySlip.find({ userId }).sort({ month: -1 });
        res.json(salarySlips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all salary slips (for admin)
const getAllSalarySlips = async (req, res) => {
    try {
        const salarySlips = await SalarySlip.find()
            .populate('userId', 'name email department')
            .sort({ month: -1 });
        res.json(salarySlips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    calculateSalary,
    getSalarySlip,
    getUserSalarySlips,
    getAllSalarySlips,
};
