const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    getUserTasks,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskProgress,
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', authenticateToken, getUserTasks);
router.get('/all', authenticateToken, authorizeRole(['admin', 'hr']), getAllTasks);
router.get('/progress', authenticateToken, getTaskProgress);
router.post('/', authenticateToken, createTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
