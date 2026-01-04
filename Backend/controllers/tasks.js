const Task = require('../models/task.js');
const Project = require('../models/project.js');
const { logActivity } = require('./activities.js');

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

        // Get project name if task belongs to a project
        let projectName = '';
        if (newTask.projectId) {
            const project = await Project.findById(newTask.projectId);
            projectName = project ? project.name : '';

            await Project.findByIdAndUpdate(newTask.projectId, {
                lastModified: new Date()
            });
        }

        // Log activity
        await logActivity(req.user.userId, 'task_created', {
            taskId: newTask._id,
            projectId: newTask.projectId,
            taskText: newTask.text,
            projectName
        });

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

        // Get old task to check if completed status changed
        const oldTask = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!oldTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );

        // Get project name if task belongs to a project
        let projectName = '';
        if (task.projectId) {
            const project = await Project.findById(task.projectId);
            projectName = project ? project.name : '';

            await Project.findByIdAndUpdate(task.projectId, {
                lastModified: new Date()
            });
        }

        // Log activity based on what changed
        if (req.body.hasOwnProperty('completed') && oldTask.completed !== task.completed) {
            const activityType = task.completed ? 'task_completed' : 'task_uncompleted';
            await logActivity(req.user.userId, activityType, {
                taskId: task._id,
                projectId: task.projectId,
                taskText: task.text,
                projectName
            });
        } else {
            // General task update
            await logActivity(req.user.userId, 'task_updated', {
                taskId: task._id,
                projectId: task.projectId,
                taskText: task.text,
                projectName
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

        // Get project name if task belongs to a project
        let projectName = '';
        if (task.projectId) {
            const project = await Project.findById(task.projectId);
            projectName = project ? project.name : '';

            await Project.findByIdAndUpdate(task.projectId, {
                lastModified: new Date()
            });
        }

        // Log activity
        await logActivity(req.user.userId, 'task_deleted', {
            taskId: task._id,
            projectId: task.projectId,
            taskText: task.text,
            projectName
        });

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

async function clearAllDeletedTasks(req, res) {
    try {
        const result = await Task.deleteMany({
            userId: req.user.userId,
            isDeleted: true
        });

        res.json({
            message: 'All deleted tasks cleared successfully',
            count: result.deletedCount
        });
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
    getDeletedTasks,
    clearAllDeletedTasks
};
