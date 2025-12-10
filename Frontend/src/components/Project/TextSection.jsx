import { useState } from 'react';

function TextSection({ title, content, onContentChange }) {
  const handleKeyDown = (e) => {
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
        }, 0);
      }
    }
  };

  return (
    <div className='text-section'>
      {/* Section header */}
      <h2 className='project-form-section-title'>{title}</h2>

      {/* Free-form content area */}
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Start typing...'
        className='project-form-content-textarea'
      />
    </div>
  );
}

export default TextSection;
