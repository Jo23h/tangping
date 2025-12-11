import { useRef, useEffect } from 'react';

function PrincipleInputBar({
  tag,
  description,
  onTagChange,
  onDescriptionChange,
  onKeyDown
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Adjust height when description changes
  useEffect(() => {
    adjustHeight();
  }, [description]);

  const handleDescriptionChange = (e) => {
    onDescriptionChange(e);
    adjustHeight();
  };

  return (
    <div className='principle-input-container'>
      <span className='principle-plus-icon'>+</span>
      <div className='principle-input-fields'>
        <input
          type='text'
          value={tag}
          onChange={onTagChange}
          onKeyDown={onKeyDown}
          placeholder='#tag'
          className='principle-tag-input'
        />
        <textarea
          ref={textareaRef}
          value={description}
          onChange={handleDescriptionChange}
          onKeyDown={onKeyDown}
          placeholder='Description'
          className='principle-description-input'
          rows={1}
        />
      </div>
    </div>
  );
}

export default PrincipleInputBar;
