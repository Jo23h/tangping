function TaskInputBar({
  value,
  onChange,
  onKeyDown,
  onCalendarClick,
  onOptionsClick,
  showOtherOptions,
  TaskOtherOptionsComponent,
  dueDate,
  formatDueDate
}) {
  const dueDateDisplay = dueDate && formatDueDate ? formatDueDate(dueDate) : null;

  return (
    <div className='task-input-container'>
      <span className='task-plus-icon'>+</span>
      <input
        type='text'
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder='Add task'
        className='task-input'
      />
      <div className='task-input-actions'>
        <button
          className={`task-calendar-btn ${dueDate ? 'has-date' : ''}`}
          type='button'
          onClick={onCalendarClick}
        >
          {dueDateDisplay ? dueDateDisplay.displayText : '📅'}
        </button>
        <div style={{ position: 'relative' }}>
          <button
            className='task-dropdown-btn'
            type='button'
            onClick={onOptionsClick}
          >
            ▼
          </button>
          {showOtherOptions && TaskOtherOptionsComponent}
        </div>
      </div>
    </div>
  );
}

export default TaskInputBar;
