const Task = require('../models/task.js');

async function createTask(req, res) {
    try {
        const taskData = {
            ...req.body,
            userId: req.user.userId
        };
        const newTask = await Task.create(taskData);
        return res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllTasks(req, res) {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        return res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getSpecificTask(req, res) {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        return res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateTask(req, res) {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        return res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteTask(req, res) {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createTask,
    getAllTasks,
    getSpecificTask,
    updateTask,
    deleteTask
};
