import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const MemoTextarea = forwardRef(({ memo, onChange, onKeyDown }, ref) => {
  const textareaRef = useRef(null);

  // Expose the textarea ref to parent
  useImperativeHandle(ref, () => ({
    get selectionStart() {
      return textareaRef.current?.selectionStart || 0;
    },
    set selectionStart(value) {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = value;
      }
    },
    set selectionEnd(value) {
      if (textareaRef.current) {
        textareaRef.current.selectionEnd = value;
      }
    },
    focus() {
      textareaRef.current?.focus();
    },
    getBoundingClientRect() {
      return textareaRef.current?.getBoundingClientRect();
    }
  }));

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
  }, [memo]);

  return (
    <textarea
      ref={textareaRef}
      value={memo || ''}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder='Add notes...'
      className='memo-textarea'
      style={{
        color: memo ? 'transparent' : 'inherit',
        caretColor: '#000'
      }}
      rows={1}
    />
  );
});

MemoTextarea.displayName = 'MemoTextarea';

export default MemoTextarea;
