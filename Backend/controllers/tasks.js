const Task = require('../models/task.js');
const Project = require('../models/project.js');

async function createTask(req, res) {
    try {
        if (req.user.role === 'guest') {
            return res.status(403).json({ error: 'Guests cannot create tasks' });
        }
        const taskData = {
            ...req.body,
            userId: req.user.userId
        };
        const newTask = await Task.create(taskData);

        // Update project's lastModified if task belongs to a project
        if (newTask.projectId) {
            await Project.findByIdAndUpdate(newTask.projectId, {
                lastModified: new Date()
            });
        }

        return res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getAllTasks(req, res) {
    try {
        let tasks;
        if (req.user.role === 'guest') {
            tasks = await Task.find({ isDeleted: false, isArchived: false });
        } else {
            tasks = await Task.find({
                userId: req.user.userId,
                isDeleted: false,
                isArchived: false
            });
        }
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
        if (req.user.role === 'guest') {
            return res.status(403).json({ error: 'Guests cannot update tasks' });
        }
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update project's lastModified if task belongs to a project
        if (task.projectId) {
            await Project.findByIdAndUpdate(task.projectId, {
                lastModified: new Date()
            });
        }

        return res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteTask(req, res) {
    try {
        if (req.user.role === 'guest') {
            return res.status(403).json({ error: 'Guests cannot delete tasks' });
        }
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { isDeleted: true },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update project's lastModified if task belongs to a project
        if (task.projectId) {
            await Project.findByIdAndUpdate(task.projectId, {
                lastModified: new Date()
            });
        }

        res.status(200).json({ message: 'Task deleted successfully', task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getDeletedTasks(req, res) {
    try {
        const tasks = await Task.find({
            userId: req.user.userId,
            isDeleted: true
        }).sort({ updatedAt: -1 });
        return res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createTask,
    getAllTasks,
    getSpecificTask,
    updateTask,
    deleteTask,
    getDeletedTasks
};
