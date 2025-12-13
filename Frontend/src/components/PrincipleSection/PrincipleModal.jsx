import { useState } from 'react';
import './PrincipleModal.css';

function PrincipleModal({ onClose, onSave, existingPrinciples = [] }) {
  const [tag, setTag] = useState('#');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleTagChange = (e) => {
    let value = e.target.value;

    // Always ensure it starts with #
    if (!value.startsWith('#')) {
      value = '#' + value;
    }

    // Remove spaces and special characters except # at the beginning
    const tagPart = value.substring(1); // Get everything after #
    const cleanedTagPart = tagPart.replace(/[^a-zA-Z0-9]/g, ''); // Only allow alphanumeric

    const newTag = '#' + cleanedTagPart;
    setTag(newTag);

    // Clear error when user types
    if (error) {
      setError('');
    }
  };

  const handleTagKeyDown = (e) => {
    const input = e.target;
    const selectionStart = input.selectionStart;

    // Prevent deleting the # character
    if ((e.key === 'Backspace' || e.key === 'Delete') && selectionStart <= 1) {
      e.preventDefault();
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSave = () => {
    if (tag.length > 1) {
      // Check for duplicate
      const isDuplicate = existingPrinciples.some(p => p.tag.toLowerCase() === tag.toLowerCase());

      if (isDuplicate) {
        setError('This principle already exists');
        return;
      }

      onSave({ tag, description });
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className='principle-modal-overlay' onClick={onClose}>
      <div className='principle-modal' onClick={(e) => e.stopPropagation()}>
        <div className='principle-modal-header'>
          <h3>Add Principle</h3>
          <button className='principle-modal-close' onClick={onClose}>×</button>
        </div>

        <div className='principle-modal-body'>
          <div className='principle-modal-field'>
            <label>Tag</label>
            <input
              type='text'
              value={tag}
              onChange={handleTagChange}
              onKeyDown={handleTagKeyDown}
              onKeyPress={handleKeyPress}
              className={`principle-modal-input ${error ? 'error' : ''}`}
              placeholder='#principle'
              autoFocus
            />
            <span className='principle-modal-hint'>Only alphanumeric characters, no spaces</span>
            {error && <span className='principle-modal-error'>{error}</span>}
          </div>

          <div className='principle-modal-field'>
            <label>Description (Optional)</label>
            <input
              type='text'
              value={description}
              onChange={handleDescriptionChange}
              onKeyPress={handleKeyPress}
              className='principle-modal-input'
              placeholder='Add a description'
            />
          </div>
        </div>

        <div className='principle-modal-footer'>
          <button className='principle-modal-cancel' onClick={onClose}>
            Cancel
          </button>
          <button
            className='principle-modal-save'
            onClick={handleSave}
            disabled={tag.length <= 1}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrincipleModal;
