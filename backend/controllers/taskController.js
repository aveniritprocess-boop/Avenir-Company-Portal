const Task = require('../models/Task');

// Get user tasks
const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all tasks (for admin)
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('userId', 'name email').sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create task
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        const userId = req.body.userId || req.user.id;

        const task = new Task({
            userId,
            title,
            description,
            priority: priority || 'medium',
            dueDate,
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check authorization
        if (task.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) {
            task.status = status;
            if (status === 'completed') {
                task.completedDate = new Date();
            }
        }
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;

        task.updatedAt = new Date();
        await task.save();

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check authorization
        if (task.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get task progress
const getTaskProgress = async (req, res) => {
    try {
        const userId = req.body.userId || req.user.id;
        const tasks = await Task.find({ userId });

        const completed = tasks.filter(t => t.status === 'completed').length;
        const total = tasks.length;
        const percentage = total === 0 ? 0 : (completed / total) * 100;

        res.json({
            total,
            completed,
            pending: total - completed,
            percentage: Math.round(percentage),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserTasks,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskProgress,
};
