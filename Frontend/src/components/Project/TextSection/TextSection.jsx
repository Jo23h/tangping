import { useRef, useEffect, useState } from 'react';

function TextSection({ title, content, onContentChange }) {
  const textareaRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if there's any content
  const hasContent = () => {
    return content && content.trim() !== '';
  };

  // Auto-resize textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    }
  };

  // Adjust height when content changes
  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleKeyDown = (e) => {
    // Handle dash key for bullet points
    if (e.key === '-') {
      const textarea = e.target;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPosition);

      // Check if we're at the start of a line (beginning of text or after a newline)
      if (cursorPosition === 0 || textBeforeCursor.endsWith('\n')) {
        e.preventDefault();
        const textAfterCursor = content.substring(cursorPosition);
        // Adjust the number of spaces after '• ' to increase/decrease indent
        const bulletPoint = '   • ';  // 3 spaces before bullet - change this number to adjust indent
        const newContent = textBeforeCursor + bulletPoint + textAfterCursor;
        onContentChange(newContent);

        // Move cursor after the bullet point
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPosition + bulletPoint.length;
          adjustHeight();
        }, 0);
      }
    }
  };

  const handleChange = (e) => {
    onContentChange(e.target.value);
    adjustHeight();
  };

  return (
    <div className='text-section'>
      {/* Section header with collapse arrow */}
      <div
        className='text-section-header'
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

      {/* Free-form content area - only show when expanded */}
      {isExpanded && (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder='Start typing...'
          className='project-form-content-textarea'
          rows={1}
        />
      )}
    </div>
  );
}

export default TextSection;
