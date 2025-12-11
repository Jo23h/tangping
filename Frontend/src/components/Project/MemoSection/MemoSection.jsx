import { useRef, useEffect } from 'react';

function MemoSection({ selectedItem, onMemoChange }) {
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

  const handleChange = (e) => {
    if (selectedItem && onMemoChange) {
      onMemoChange(selectedItem.id, e.target.value);
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

  return (
    <div className='memo-section'>
      <div className='memo-header'>
        <h3 className='memo-title'>{selectedItem.text}</h3>
      </div>
      <div className='memo-content'>
        <textarea
          ref={textareaRef}
          value={selectedItem.memo || ''}
          onChange={handleChange}
          placeholder='Add notes...'
          className='memo-textarea'
          rows={1}
        />
      </div>
    </div>
  );
}

export default MemoSection;
