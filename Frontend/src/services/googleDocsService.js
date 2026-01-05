import { API_URL } from '../config.js';

/**
 * Creates or retrieves a Google Doc for a task using backend API
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

    // Get the auth token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please sign in to create Google Docs.');
    }

    // Call backend API to create the Google Doc
    const response = await fetch(`${API_URL}/google-docs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        taskId,
        folderId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 401) {
        throw new Error('Google authentication required. Please sign in with Google to create docs automatically.');
      }

      throw new Error(errorData.error || 'Failed to create Google Doc');
    }

    const data = await response.json();
    return data.googleDocUrl;
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
