const Project = require('../models/project');
const Task = require('../models/task');

// Get all projects for a user (excluding deleted)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.userId,
      isDeleted: false
    }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get a single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, priority } = req.body;

    const project = new Project({
      name,
      priority: priority || 'none',
      userId: req.user.userId
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { name, priority } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { name, priority },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Soft delete a project (move to trash)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      { isDeleted: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Also soft delete all tasks in this project
    await Task.updateMany(
      { projectId: req.params.id, userId: req.user.userId },
      { isDeleted: true }
    );

    res.json({ message: 'Project deleted successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Archive a project
exports.archiveProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      { isArchived: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Also archive all tasks in this project
    await Task.updateMany(
      { projectId: req.params.id, userId: req.user.userId },
      { isArchived: true }
    );

    res.json({ message: 'Project archived successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive project' });
  }
};

// Get deleted projects (trash)
exports.getDeletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.userId,
      isDeleted: true
    }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deleted projects' });
  }
};

// Get or create inbox project
exports.getOrCreateInbox = async (req, res) => {
  try {
    let inbox = await Project.findOne({
      userId: req.user.userId,
      isInbox: true
    });

    if (!inbox) {
      inbox = new Project({
        name: 'Inbox',
        priority: 'none',
        userId: req.user.userId,
        isInbox: true
      });
      await inbox.save();
    }

    res.json(inbox);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get inbox' });
  }
};

// Permanently delete all deleted projects
exports.clearAllDeletedProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({
      userId: req.user.userId,
      isDeleted: true
    });

    res.json({
      message: 'All deleted projects cleared successfully',
      count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear deleted projects' });
  }
};
