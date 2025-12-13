import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PrincipleList from './PrincipleList';
import './PrincipleInput.css';

function PrincipleSection({ title, onItemClick, selectedItem }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [principles, setPrinciples] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Update principle when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      setPrinciples(prevPrinciples =>
        prevPrinciples.map(principle =>
          principle.id === selectedItem.id
            ? {
                ...principle,
                tag: selectedItem.tag !== undefined ? selectedItem.tag : principle.tag,
                memo: selectedItem.memo !== undefined ? selectedItem.memo : principle.memo,
                memoLastModified: selectedItem.memoLastModified
              }
            : principle
        )
      );
    }
  }, [selectedItem]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const invalidChars = /[\\/"#:*?<>|\s]/;

  // Filter principles based on search input
  const filteredPrinciples = principles.filter(p =>
    p.tag.toLowerCase().includes(searchInput.toLowerCase()) &&
    !selectedPrinciples.some(sp => sp.id === p.id)
  );

  // Check if exact match exists
  const exactMatch = principles.find(p =>
    p.tag.toLowerCase() === ('#' + searchInput.toLowerCase())
  );

  const hasContent = () => {
    return selectedPrinciples.length > 0;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleSelectPrinciple = (principle) => {
    if (!selectedPrinciples.some(p => p.id === principle.id)) {
      setSelectedPrinciples([...selectedPrinciples, principle]);
    }
    setSearchInput('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleCreatePrinciple = () => {
    const trimmedValue = searchInput.trim();

    if (!trimmedValue || invalidChars.test(trimmedValue)) {
      return;
    }

    const tag = '#' + trimmedValue;

    // Check for duplicate
    const isDuplicate = principles.some(p => p.tag.toLowerCase() === tag.toLowerCase());
    if (isDuplicate) {
      return;
    }

    const newPrinciple = {
      id: uuidv4(),
      tag: tag,
      description: ''
    };

    setPrinciples([...principles, newPrinciple]);
    setSelectedPrinciples([...selectedPrinciples, newPrinciple]);
    setSearchInput('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemovePrinciple = (principleId) => {
    setSelectedPrinciples(selectedPrinciples.filter(p => p.id !== principleId));
  };

  const handleDeletePrinciple = (principleId) => {
    const updatedPrinciples = principles.filter(principle => principle.id !== principleId);
    setPrinciples(updatedPrinciples);
    setSelectedPrinciples(selectedPrinciples.filter(p => p.id !== principleId));
  };

  return (
    <div className='principle-section'>
      {/* Section header with collapse arrow */}
      <div className='text-section-header'>
        <div
          className='text-section-header-left'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className='text-section-arrow'>
            {isExpanded ? 'v' : '>'}
          </span>
          <h2 className='project-form-section-title'>{title}</h2>
          {!isExpanded && hasContent() && (
            <span className='text-section-ellipsis'>...</span>
          )}
        </div>
      </div>

      {/* Principle input and selection - only show when expanded */}
      {isExpanded && (
        <>
          {/* Selected principles as chips */}
          {selectedPrinciples.length > 0 && (
            <div className='principle-chips-container'>
              {selectedPrinciples.map(principle => (
                <div key={principle.id} className='principle-chip'>
                  <span className='principle-chip-tag'>{principle.tag}</span>
                  <button
                    className='principle-chip-remove'
                    onClick={() => handleRemovePrinciple(principle.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input with dropdown */}
          <div className='principle-input-wrapper'>
            <div className='principle-input-container'>
              <span className='principle-hash'>#</span>
              <input
                ref={inputRef}
                type='text'
                value={searchInput}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className='principle-input'
                placeholder='Add principle...'
              />
            </div>

            {/* Dropdown menu */}
            {showDropdown && (searchInput.trim() || filteredPrinciples.length > 0) && (
              <div ref={dropdownRef} className='principle-dropdown'>
                {/* Existing matching principles */}
                {filteredPrinciples.map(principle => (
                  <div
                    key={principle.id}
                    className='principle-dropdown-item'
                    onClick={() => handleSelectPrinciple(principle)}
                  >
                    <span className='principle-dropdown-tag'>{principle.tag}</span>
                    {principle.description && (
                      <span className='principle-dropdown-description'>{principle.description}</span>
                    )}
                  </div>
                ))}

                {/* Create new principle option */}
                {searchInput.trim() && !exactMatch && !invalidChars.test(searchInput.trim()) && (
                  <div
                    className='principle-dropdown-item principle-dropdown-create'
                    onClick={handleCreatePrinciple}
                  >
                    <span className='principle-dropdown-create-text'>
                      Create principle "#{searchInput.trim()}"
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All principles list */}
          <PrincipleList
            principles={principles}
            onDelete={handleDeletePrinciple}
            onItemClick={onItemClick}
          />
        </>
      )}
    </div>
  );
}

export default PrincipleSection;
