import { useRef, useEffect } from 'react';

function MemoSection({ selectedItem, onMemoChange, onTitleChange }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Adjust height when content changes
  useEffect(() => {
    adjustHeight();
  }, [selectedItem?.memo]);

  const handleMemoChange = (e) => {
    if (selectedItem && onMemoChange) {
      onMemoChange(selectedItem.id, e.target.value);
    }
  };

  const handleTitleChange = (e) => {
    if (selectedItem && onTitleChange) {
      let newValue = e.target.value;

      // If this is a principle (has a tag property), enforce # at the beginning
      if (selectedItem.tag !== undefined) {
        if (!newValue.startsWith('#')) {
          newValue = '#' + newValue;
        }
      }

      onTitleChange(selectedItem.id, newValue);
    }
  };

  // If nothing is selected, show blank
  if (!selectedItem) {
    return (
      <div className='memo-section'>
        <div className='memo-blank'></div>
      </div>
    );
  }

  // Get the display title - use tag if it exists (for principles), otherwise text
  const displayTitle = selectedItem.tag || selectedItem.text;

  // Format the memo date
  const formatMemoDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (itemDate.getTime() === today.getTime()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (itemDate.getTime() === yesterday.getTime()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
             ` at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
  };

  const memoDate = selectedItem.memoLastModified ? formatMemoDate(selectedItem.memoLastModified) : '';

  // Handle key down to prevent deleting # for principles
  const handleTitleKeyDown = (e) => {
    if (selectedItem?.tag !== undefined) {
      const input = e.target;
      const value = input.value;
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      // Prevent deleting the # character
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectionStart <= 1) {
        e.preventDefault();
      }

      // If trying to select and delete text that includes the #
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectionStart === 0) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className='memo-section'>
      <div className='memo-header'>
        <input
          type='text'
          value={displayTitle}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          className='memo-title-input'
          placeholder='Untitled'
        />
        {memoDate && (
          <span className='memo-date' style={{ fontSize: '0.75rem', color: '#888', marginTop: '8px' }}>
            {memoDate}
          </span>
        )}
      </div>
      <div className='memo-content'>
        <textarea
          ref={textareaRef}
          value={selectedItem.memo || ''}
          onChange={handleMemoChange}
          placeholder='Add notes...'
          className='memo-textarea'
          rows={1}
        />
      </div>
    </div>
  );
}

export default MemoSection;
