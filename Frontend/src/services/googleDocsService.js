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

    // Prompt user to create the document and paste the URL
    const docUrl = prompt(
      `Click OK, then:\n\n1. Go to your Google Drive folder\n2. Create a new Google Doc\n3. Name it: "${docTitle}"\n4. Copy the document URL from your browser\n5. Paste it below\n\nOr click Cancel to skip.`,
      'https://docs.google.com/document/d/YOUR_DOC_ID/edit'
    );

    if (!docUrl || docUrl === 'https://docs.google.com/document/d/YOUR_DOC_ID/edit') {
      throw new Error('No Google Doc URL provided');
    }

    if (!docUrl.includes('docs.google.com')) {
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
