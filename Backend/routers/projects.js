const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projects');
const verifyToken = require('../middleware/verifyToken');

// All routes require authentication
router.use(verifyToken);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get or create inbox (MUST be before /:id route)
router.get('/inbox', projectController.getOrCreateInbox);

// Get deleted projects (trash)
router.get('/deleted', projectController.getDeletedProjects);

// Clear all deleted projects (permanently delete)
router.delete('/deleted/clear', projectController.clearAllDeletedProjects);

// Create a new project
router.post('/', projectController.createProject);

// Archive a project
router.put('/:id/archive', projectController.archiveProject);

// Get a specific project
router.get('/:id', projectController.getProject);

// Update a project
router.put('/:id', projectController.updateProject);

// Delete a project (soft delete)
router.delete('/:id', projectController.deleteProject);

module.exports = router;
