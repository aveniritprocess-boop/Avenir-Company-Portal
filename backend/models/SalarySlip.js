const mongoose = require('mongoose');

const salarySlipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: String,
        required: true, // Format: YYYY-MM
    },
    baseSalary: Number,
    fixedSalary: Number,
    variableSalary: Number,
    totalSalary: Number,
    deductions: {
        type: Map,
        of: Number,
        default: {},
    },
    netSalary: Number,
    performanceMetrics: {
        teamPerformance: Number,
        individualPerformance: Number,
        companyPerformance: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SalarySlip', salarySlipSchema);
