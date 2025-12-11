function NoteInputBar({
  value,
  onChange,
  onKeyDown,
  onCalendarClick,
  dueDate,
  formatDueDate
}) {
  const dueDateDisplay = dueDate && formatDueDate ? formatDueDate(dueDate) : null;

  return (
    <div className='note-input-container'>
      <span className='note-plus-icon'>+</span>
      <input
        type='text'
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder='Add note'
        className='note-input'
      />
      <div className='note-input-actions'>
        <button
          className={`note-calendar-btn ${dueDate ? 'has-date' : ''}`}
          type='button'
          onClick={onCalendarClick}
        >
          {dueDateDisplay ? dueDateDisplay.displayText : '📅'}
        </button>
      </div>
    </div>
  );
}

export default NoteInputBar;
