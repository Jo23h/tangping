import { useState, useRef, useEffect } from 'react'
import { PencilSimpleLine, Note } from '@phosphor-icons/react'
import './TaskItem.css'

function TaskItem({ task, onToggle, onDelete, formatDueDate, onItemClick, onTaskEdit, onCreateMemo, onDateChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [editText, setEditText] = useState(task.text);
  const [editDate, setEditDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const inputRef = useRef(null);
  const dateInputRef = useRef(null);
  const contextMenuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

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

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(true);
  };

  const setDueDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const dateString = date.toISOString().split('T')[0];

    if (onDateChange) {
      onDateChange(task._id, dateString);
    }
    setShowContextMenu(false);
  };

  const clearDueDate = () => {
    if (onDateChange) {
      onDateChange(task._id, null);
    }
    setShowContextMenu(false);
  };

  return (
    <div className='task-item' onClick={handleTaskClick} onContextMenu={handleContextMenu}>
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

      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="task-context-menu"
          style={{
            position: 'fixed',
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-section">
            <div className="context-menu-title">Set Due Date</div>
            <button className="context-menu-item" onClick={() => setDueDate(0)}>
              📅 Today
            </button>
            <button className="context-menu-item" onClick={() => setDueDate(1)}>
              📅 Tomorrow
            </button>
            <button className="context-menu-item" onClick={() => setDueDate(3)}>
              📅 In 3 days
            </button>
            <button className="context-menu-item" onClick={() => setDueDate(7)}>
              📅 In 1 week
            </button>
            {task.dueDate && (
              <>
                <div className="context-menu-divider"></div>
                <button className="context-menu-item context-menu-danger" onClick={clearDueDate}>
                  ✖️ Clear due date
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
