import { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import './Settings.css';

function Settings({ isOpen, onClose }) {
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved Google Drive folder ID from localStorage
    const savedFolderId = localStorage.getItem('googleDriveFolderId');
    if (savedFolderId) {
      setGoogleDriveFolderId(savedFolderId);
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem('googleDriveFolderId', googleDriveFolderId);

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const extractFolderId = (url) => {
    // Extract folder ID from Google Drive URL
    // Format: https://drive.google.com/drive/folders/FOLDER_ID
    const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    const folderId = extractFolderId(value);
    setGoogleDriveFolderId(folderId);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close-btn" onClick={onClose}>
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Google Drive Integration</h3>
            <p className="settings-description">
              Enter the URL or ID of your Google Drive folder where task memos will be stored.
            </p>

            <label htmlFor="googleDriveFolder">Google Drive Folder URL or ID</label>
            <input
              type="text"
              id="googleDriveFolder"
              value={googleDriveFolderId}
              onChange={handleUrlChange}
              placeholder="https://drive.google.com/drive/folders/YOUR_FOLDER_ID or just the ID"
              className="settings-input"
            />

            <p className="settings-help">
              To find your folder ID:
              <br />
              1. Open Google Drive and navigate to the folder
              <br />
              2. Copy the URL from your browser
              <br />
              3. Paste it here (we'll extract the ID automatically)
            </p>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
