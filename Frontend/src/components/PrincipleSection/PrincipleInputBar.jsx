import { useRef, useEffect } from 'react';

function PrincipleInputBar({
  tag,
  description,
  onTagChange,
  onDescriptionChange,
  onKeyDown
}) {
  const textareaRef = useRef(null);
  const tagInputRef = useRef(null);

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Auto-resize tag input based on content
  const adjustTagWidth = () => {
    const input = tagInputRef.current;
    if (input) {
      // Create a temporary span to measure text width
      const span = document.createElement('span');
      span.style.font = window.getComputedStyle(input).font;
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.textContent = input.value || input.placeholder;
      document.body.appendChild(span);
      const width = span.offsetWidth + 8; // Add minimal padding
      input.style.width = Math.max(width, 20) + 'px'; // Minimum 20px
      document.body.removeChild(span);
    }
  };

  // Adjust height when description changes
  useEffect(() => {
    adjustHeight();
  }, [description]);

  // Adjust tag width when tag changes
  useEffect(() => {
    adjustTagWidth();
  }, [tag]);

  const handleDescriptionChange = (e) => {
    onDescriptionChange(e);
    adjustHeight();
  };

  return (
    <div className='principle-input-container'>
      <span className='principle-plus-icon'>+</span>
      <div className='principle-input-fields'>
        <input
          ref={tagInputRef}
          type='text'
          value={tag}
          onChange={onTagChange}
          onKeyDown={onKeyDown}
          placeholder='#addprinciple'
          className='principle-tag-input'
        />
        <span className='principle-separator'>:</span>
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
