import { useState } from 'react';
import './PrincipleModal.css';

function PrincipleModal({ onClose, onSave, existingPrinciples = [] }) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);

  const invalidChars = /[\\/"#:*?<>|\s]/;

  // Filter existing principles based on search
  const filteredPrinciples = existingPrinciples.filter(p =>
    p.tag.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Check if exact match exists
  const exactMatch = existingPrinciples.find(p =>
    p.tag.toLowerCase() === ('#' + searchInput.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleTogglePrinciple = (principle) => {
    if (selectedPrinciples.some(p => p.id === principle.id)) {
      setSelectedPrinciples(selectedPrinciples.filter(p => p.id !== principle.id));
    } else {
      setSelectedPrinciples([...selectedPrinciples, principle]);
    }
  };

  const handleCreateAndSelect = () => {
    const trimmedValue = searchInput.trim();

    if (!trimmedValue || invalidChars.test(trimmedValue)) {
      return;
    }

    const tag = '#' + trimmedValue;

    // Don't create if already exists
    if (exactMatch) {
      return;
    }

    // Create new principle object (will be saved on OK)
    const newPrinciple = {
      id: 'temp-' + Date.now(),
      tag: tag,
      description: '',
      isNew: true
    };

    setSelectedPrinciples([...selectedPrinciples, newPrinciple]);
    setSearchInput('');
  };

  const handleSave = () => {
    if (selectedPrinciples.length === 0) {
      return;
    }

    onSave(selectedPrinciples);
    onClose();
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
      <div className='principle-modal-search' onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className='principle-modal-search-input-container'>
          <span className='principle-modal-search-icon'>🔍</span>
          <input
            type='text'
            value={searchInput}
            onChange={handleSearchChange}
            className='principle-modal-search-input'
            placeholder='Search principles'
            autoFocus
          />
        </div>

        {/* Results List */}
        <div className='principle-modal-results'>
          {/* Create new option */}
          {searchInput.trim() && !exactMatch && !invalidChars.test(searchInput.trim()) && (
            <div
              className='principle-modal-result-item principle-modal-create-item'
              onClick={handleCreateAndSelect}
            >
              <span className='principle-modal-create-icon'>🏷️</span>
              <span className='principle-modal-create-text'>
                Create tag "#{searchInput.trim()}"
              </span>
            </div>
          )}

          {/* Filtered existing principles */}
          {filteredPrinciples.map(principle => {
            const isSelected = selectedPrinciples.some(p => p.id === principle.id);
            return (
              <div
                key={principle.id}
                className={`principle-modal-result-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTogglePrinciple(principle)}
              >
                <input
                  type='checkbox'
                  checked={isSelected}
                  onChange={() => {}}
                  className='principle-modal-checkbox'
                />
                <span className='principle-modal-result-tag'>{principle.tag}</span>
                {principle.description && (
                  <span className='principle-modal-result-description'>{principle.description}</span>
                )}
              </div>
            );
          })}

          {/* No results */}
          {filteredPrinciples.length === 0 && !searchInput.trim() && (
            <div className='principle-modal-no-results'>
              Start typing to search or create principles
            </div>
          )}
        </div>

        {/* Selected principles display */}
        {selectedPrinciples.length > 0 && (
          <div className='principle-modal-selected'>
            <div className='principle-modal-selected-label'>
              Selected ({selectedPrinciples.length}):
            </div>
            <div className='principle-modal-selected-chips'>
              {selectedPrinciples.map(principle => (
                <div key={principle.id} className='principle-modal-selected-chip'>
                  {principle.tag}
                  <button
                    className='principle-modal-chip-remove'
                    onClick={() => handleTogglePrinciple(principle)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer with buttons */}
        <div className='principle-modal-footer'>
          <button className='principle-modal-cancel' onClick={onClose}>
            Cancel
          </button>
          <button
            className='principle-modal-save'
            onClick={handleSave}
            disabled={selectedPrinciples.length === 0}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrincipleModal;
