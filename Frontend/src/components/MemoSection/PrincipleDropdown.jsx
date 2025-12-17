import React from 'react';

function PrincipleDropdown({ principles, filter, onSelect, onCreate, position }) {
  const getFilteredPrinciples = () => {
    if (!filter) return principles;
    return principles.filter(p =>
      p.tag.toLowerCase().includes('#' + filter.toLowerCase())
    );
  };

  const filtered = getFilteredPrinciples();

  return (
    // The position style will need to use 'fixed' or 'absolute' depending on your styling
    <div 
        className='memo-principle-dropdown' 
        style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 1000 }}
    >
      <div className='memo-principle-dropdown-list'>
        {/* Create new option */}
        {filter.trim() && (
          <div
            className='memo-principle-dropdown-item memo-principle-create'
            onClick={onCreate}
          >
            <span className='memo-principle-create-icon'>🏷️</span>
            <span className='memo-principle-create-text'>
              Create "#{filter.trim()}"
            </span>
          </div>
        )}

        {/* Filtered principles */}
        {filtered.map((principle) => (
          <div
            key={principle.id}
            className='memo-principle-dropdown-item'
            // Stop propagation to prevent potential issues with the document click handler
            onClick={(e) => { e.stopPropagation(); onSelect(principle); }} 
          >
            <span className='memo-principle-tag'>{principle.tag}</span>
          </div>
        ))}

        {/* No results */}
        {filtered.length === 0 && !filter.trim() && (
          <div className='memo-principle-dropdown-empty'>
            Start typing to search or create principles
          </div>
        )}
      </div>
    </div>
  );
}

export default PrincipleDropdown;