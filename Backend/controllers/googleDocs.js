const { google } = require('googleapis');
const User = require('../models/user');
const Task = require('../models/task');

/**
 * Create a Google Doc for a task
 */
const createGoogleDoc = async (req, res) => {
    try {
        const { taskId } = req.body;
        const userId = req.userId;

        // Get the user with Google tokens
        const user = await User.findById(userId);
        if (!user || !user.googleAccessToken) {
            return res.status(401).json({
                error: 'Google authentication required. Please sign in with Google.'
            });
        }

        // Get the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Check if task already has a Google Doc
        if (task.googleDocUrl) {
            return res.status(200).json({
                googleDocUrl: task.googleDocUrl,
                message: 'Document already exists'
            });
        }

        // Get folder ID from request (from localStorage on frontend)
        const { folderId } = req.body;
        if (!folderId) {
            return res.status(400).json({
                error: 'Google Drive folder ID required. Please configure it in Settings.'
            });
        }

        // Set up OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
            access_token: user.googleAccessToken,
            refresh_token: user.googleRefreshToken
        });

        // Initialize Google Drive API
        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Generate document title from task text
        const docTitle = `Task: ${task.text.substring(0, 50)}${task.text.length > 50 ? '...' : ''}`;

        // Create the Google Doc
        const fileMetadata = {
            name: docTitle,
            mimeType: 'application/vnd.google-apps.document',
            parents: [folderId]
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            fields: 'id, webViewLink'
        });

        const docUrl = file.data.webViewLink;

        // Update the task with the Google Doc URL
        task.googleDocUrl = docUrl;
        await task.save();

        res.status(200).json({
            googleDocUrl: docUrl,
            message: 'Google Doc created successfully'
        });

    } catch (error) {
        console.error('Error creating Google Doc:', error);

        // Handle token expiration
        if (error.code === 401 || error.message?.includes('invalid_grant')) {
            return res.status(401).json({
                error: 'Google authentication expired. Please sign in again with Google.'
            });
        }

        res.status(500).json({
            error: 'Failed to create Google Doc',
            details: error.message
        });
    }
};

module.exports = { createGoogleDoc };
