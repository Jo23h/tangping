const Activity = require('../models/activity');
const Project = require('../models/project');

// Get activities with pagination and filtering
const getActivities = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { category = 'all', limit = 20, skip = 0 } = req.query;

        // Calculate date 8 days ago
        const eightDaysAgo = new Date();
        eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

        let query = {
            userId,
            createdAt: { $gte: eightDaysAgo }
        };

        // Filter by category
        if (category === 'inbox') {
            query.projectId = null;
        } else if (category !== 'all') {
            // Assume it's a project ID
            query.projectId = category;
        }

        const activities = await Activity.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .lean();

        const totalCount = await Activity.countDocuments(query);

        res.json({
            activities,
            hasMore: (parseInt(skip) + activities.length) < totalCount,
            total: totalCount
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create a new activity log
const createActivity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { taskId, projectId, type, taskText, projectName, metadata } = req.body;

        const activity = new Activity({
            userId,
            taskId,
            projectId,
            type,
            taskText,
            projectName,
            metadata: metadata || {}
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: error.message });
    }
};

// Helper function to log activity (used by other controllers)
const logActivity = async (userId, type, data) => {
    try {
        const activity = new Activity({
            userId,
            type,
            taskId: data.taskId || null,
            projectId: data.projectId || null,
            taskText: data.taskText || '',
            projectName: data.projectName || '',
            metadata: data.metadata || {}
        });

        await activity.save();
        return activity;
    } catch (error) {
        console.error('Error logging activity:', error);
        // Don't throw - activity logging shouldn't break the main operation
        return null;
    }
};

module.exports = {
    getActivities,
    createActivity,
    logActivity
};
