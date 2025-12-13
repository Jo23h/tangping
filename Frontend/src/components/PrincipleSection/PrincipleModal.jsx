import { useState } from 'react';
import './PrincipleModal.css';

function PrincipleModal({ onClose, onSave, existingPrinciples = [] }) {
  const [principleInput, setPrincipleInput] = useState('');
  const [error, setError] = useState('');

  const invalidChars = /[\\/"#:*?<>|\s]/;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPrincipleInput(value);

    // Check for invalid characters
    if (invalidChars.test(value)) {
      setError('Principle name can\'t contain \\/"#:*?<>|space');
    } else {
      setError('');
    }
  };

  const handleSave = () => {
    const trimmedValue = principleInput.trim();

    // Don't save if empty or has invalid characters
    if (!trimmedValue || invalidChars.test(trimmedValue)) {
      if (!error && invalidChars.test(trimmedValue)) {
        setError('Principle name can\'t contain \\/"#:*?<>|space');
      }
      return;
    }

    const tag = '#' + trimmedValue;

    // Check for duplicate
    const isDuplicate = existingPrinciples.some(p => p.tag.toLowerCase() === tag.toLowerCase());

    if (isDuplicate) {
      setError('This principle already exists');
      return;
    }

    onSave({ tag, description: '' });
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const isDisabled = !principleInput.trim() || !!error;

  return (
    <div className='principle-modal-overlay' onClick={onClose}>
      <div className='principle-modal' onClick={(e) => e.stopPropagation()}>
        <div className='principle-modal-header'>
          <h3>Input a principle</h3>
        </div>

        <div className='principle-modal-body'>
          <div className='principle-modal-input-container'>
            <span className='principle-modal-hash'>#</span>
            <input
              type='text'
              value={principleInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className='principle-modal-input-simple'
              placeholder='principle'
              autoFocus
            />
          </div>
          {error && <span className='principle-modal-error'>{error}</span>}
        </div>

        <div className='principle-modal-footer'>
          <button className='principle-modal-cancel' onClick={onClose}>
            Cancel
          </button>
          <button
            className='principle-modal-save'
            onClick={handleSave}
            disabled={isDisabled}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrincipleModal;
