import * as taskService from './taskService';

/**
 * Creates or retrieves a Google Doc for a task
 * @param {string} taskId - The task ID
 * @param {string} taskText - The task text to use as document title
 * @returns {Promise<string>} The Google Doc URL
 */
export const createOrGetGoogleDoc = async (taskId, taskText) => {
  try {
    // Get the folder ID from settings
    const folderId = localStorage.getItem('googleDriveFolderId');

    if (!folderId) {
      throw new Error('Please configure your Google Drive folder in Settings first.');
    }

    // Generate document title from task text
    const docTitle = `Task: ${taskText.substring(0, 50)}${taskText.length > 50 ? '...' : ''}`;

    // Create a URL to open a new Google Doc
    // This URL will create a new doc in the user's drive
    // Format: https://docs.google.com/document/create?title=TITLE&folder=FOLDER_ID
    const createUrl = `https://docs.google.com/document/create?folder=${folderId}&title=${encodeURIComponent(docTitle)}`;

    // Open the creation URL in a new window
    const newWindow = window.open(createUrl, '_blank', 'width=800,height=600');

    // Wait a moment for the doc to be created
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Prompt user for the created document URL
    const docUrl = await new Promise((resolve) => {
      // Use a simple approach: ask user to paste the URL
      setTimeout(() => {
        const url = prompt(
          'A new Google Doc has been created. Please copy the URL from the new tab and paste it here:',
          'https://docs.google.com/document/d/YOUR_DOC_ID/edit'
        );
        resolve(url);
      }, 2000);
    });

    if (!docUrl || !docUrl.includes('docs.google.com')) {
      throw new Error('Invalid Google Doc URL');
    }

    // Update the task with the Google Doc URL
    await taskService.updateTask(taskId, { googleDocUrl: docUrl });

    return docUrl;
  } catch (error) {
    console.error('Error creating Google Doc:', error);
    throw error;
  }
};

/**
 * Opens an existing Google Doc
 * @param {string} docUrl - The Google Doc URL
 */
export const openGoogleDoc = (docUrl) => {
  if (docUrl) {
    window.open(docUrl, '_blank');
  }
};

/**
 * Converts a Google Doc URL to an embeddable URL
 * @param {string} docUrl - The Google Doc URL
 * @returns {string} The embeddable URL
 */
export const getEmbedUrl = (docUrl) => {
  if (!docUrl) return null;

  // Extract document ID from URL
  const match = docUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;

  const docId = match[1];

  // Return embeddable URL
  return `https://docs.google.com/document/d/${docId}/edit?embedded=true`;
};

/**
 * Validates if a URL is a valid Google Doc URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid Google Doc URL
 */
export const isValidGoogleDocUrl = (url) => {
  if (!url) return false;
  return url.includes('docs.google.com/document/d/');
};
