import React from 'react';

function MemoTitleInput({ id, text, tag, onTitleChange }) {
  // Get the display title - use tag if it exists (for principles), otherwise text
  const displayTitle = tag || text;

  const handleTitleChange = (e) => {
    let newValue = e.target.value;

    // If this is a principle (has a tag property), enforce # at the beginning
    if (tag !== undefined) {
      if (!newValue.startsWith('#')) {
        newValue = '#' + newValue;
      }
    }

    onTitleChange(id, newValue);
  };

  // Handle key down to prevent deleting # for principles
  const handleTitleKeyDown = (e) => {
    if (tag !== undefined) {
      const input = e.target;
      const selectionStart = input.selectionStart;

      // Prevent deleting the # character when the cursor is at the start
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectionStart <= 1) {
        e.preventDefault();
      }
    }
  };

  return (
    <input
      type='text'
      value={displayTitle}
      onChange={handleTitleChange}
      onKeyDown={handleTitleKeyDown}
      className='memo-title-input'
      placeholder='Untitled'
    />
  );
}

export default MemoTitleInput;