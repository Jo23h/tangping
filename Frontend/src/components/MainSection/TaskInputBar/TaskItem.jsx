import { useState, useRef, useEffect } from 'react'
import { PencilSimpleLine, Note } from '@phosphor-icons/react'
import './TaskItem.css'

function TaskItem({ task, onToggle, onDelete, formatDueDate, onItemClick, onTaskEdit, onCreateMemo, onDateChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDate, setEditDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const inputRef = useRef(null);
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditingDate && dateInputRef.current) {
      dateInputRef.current.focus();
      dateInputRef.current.showPicker?.();
    }
  }, [isEditingDate]);

  const handleTaskClick = () => {
    // Open memo
    if (onItemClick) {
      onItemClick(task);
    }
  };

  const handleTextClick = (event) => {
    event.stopPropagation();
    // Only allow editing if onTaskEdit is provided
    if (onTaskEdit) {
      setIsEditing(true);
    }
    // Also open memo when clicking text
    if (onItemClick) {
      onItemClick(task);
    }
  };

  const handleSave = () => {
    if (editText.trim() && editText !== task.text) {
      if (onTaskEdit) {
        onTaskEdit(task._id, editText.trim());
      }
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleDateClick = (event) => {
    event.stopPropagation();
    if (onDateChange) {
      setIsEditingDate(true);
    }
  };

  const handleDateSave = () => {
    if (editDate && editDate !== (task.dueDate ? task.dueDate.split('T')[0] : '')) {
      if (onDateChange) {
        onDateChange(task._id, editDate);
      }
    }
    setIsEditingDate(false);
  };

  const handleDateBlur = () => {
    handleDateSave();
  };

  const handleDateKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDateSave();
    } else if (event.key === 'Escape') {
      setEditDate(task.dueDate ? task.dueDate.split('T')[0] : '');
      setIsEditingDate(false);
    }
  };

  return (
    <div className='task-item' onClick={handleTaskClick}>
      <input
        type='checkbox'
        checked={task.completed}
        onChange={(event) => {
          event.stopPropagation();
          if (onToggle) {
            onToggle(task._id);
          }
        }}
        disabled={!onToggle}
        className={`task-checkbox priority-${task.priority || 'none'}`}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type='text'
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onClick={(event) => event.stopPropagation()}
          className='task-text-input'
        />
      ) : (
        <span
          className={`task-text ${task.completed ? 'task-completed' : ''}`}
          onClick={handleTextClick}
        >
          {task.text}
        </span>
      )}
      {onCreateMemo && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onCreateMemo(task._id);
          }}
          className="task-memo-btn"
          title={task.googleDocUrl ? 'Open memo' : 'Create memo'}
        >
          <Note size={16} weight={task.googleDocUrl ? 'fill' : 'regular'} />
        </button>
      )}
      {isEditingDate ? (
        <input
          ref={dateInputRef}
          type="date"
          value={editDate}
          onChange={(event) => setEditDate(event.target.value)}
          onBlur={handleDateBlur}
          onKeyDown={handleDateKeyDown}
          onClick={(event) => event.stopPropagation()}
          className="task-date-input"
        />
      ) : (
        task.dueDate && formatDueDate(task.dueDate) && (
          <span
            className={`task-due-date ${formatDueDate(task.dueDate).isOverdue ? 'overdue' : ''}`}
            style={{ color: formatDueDate(task.dueDate).color, cursor: onDateChange ? 'pointer' : 'default' }}
            onClick={handleDateClick}
            title={onDateChange ? 'Click to edit due date' : ''}
          >
            {formatDueDate(task.dueDate).displayText}
          </span>
        )
      )}
      {onDelete && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(task._id);
          }}
          className='task-delete-btn'
        >
          ×
        </button>
      )}
    </div>
  );
}

export default TaskItem;
