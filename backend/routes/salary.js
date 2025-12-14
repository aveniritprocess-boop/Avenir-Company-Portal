const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    calculateSalary,
    getSalarySlip,
    getUserSalarySlips,
    getAllSalarySlips,
} = require('../controllers/salaryController');

const router = express.Router();

router.post('/calculate', authenticateToken, authorizeRole(['admin', 'hr']), calculateSalary);
router.get('/:id', authenticateToken, getSalarySlip);
router.get('/user/:userId', authenticateToken, getUserSalarySlips);
router.get('/all', authenticateToken, authorizeRole(['admin', 'hr']), getAllSalarySlips);

module.exports = router;
