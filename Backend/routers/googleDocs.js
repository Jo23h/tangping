const express = require('express');
const router = express.Router();
const { createGoogleDoc } = require('../controllers/googleDocs');
const verifyToken = require('../middleware/verifyToken');

// Create a Google Doc for a task
router.post('/create', verifyToken, createGoogleDoc);

module.exports = router;
