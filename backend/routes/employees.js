const express = require('express');
const upload = require('../middleware/upload');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updatePerformance,
} = require('../controllers/employeeController');

const router = express.Router();

// Routes
router.get('/', authenticateToken, getAllEmployees);
router.get('/:id', authenticateToken, getEmployee);
router.post('/', authenticateToken, authorizeRole(['admin', 'hr']), upload.single('profileImage'), createEmployee);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'hr']), upload.single('profileImage'), updateEmployee);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteEmployee);
router.put('/:id/performance', authenticateToken, authorizeRole(['admin', 'hr']), updatePerformance);

module.exports = router;
