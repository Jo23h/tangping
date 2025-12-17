import { useState, useRef, useEffect } from 'react'
import './TaskItem.css'

function TaskItem({ task, onToggle, onDelete, formatDueDate, onItemClick, onTaskEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTaskClick = () => {
    // Open memo
    if (onItemClick) {
      onItemClick(task);
    }
  };

  const handleTextClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim() && editText !== task.text) {
      if (onTaskEdit) {
        onTaskEdit(task.id, editText.trim());
      }
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div className='task-item' onClick={handleTaskClick}>
      <input
        type='checkbox'
        checked={task.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
        className={`task-checkbox priority-${task.priority || 'none'}`}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type='text'
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onClick={(e) => e.stopPropagation()}
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
      {task.dueDate && formatDueDate(task.dueDate) && (
        <span className={`task-due-date ${formatDueDate(task.dueDate).isOverdue ? 'overdue' : ''}`}>
          {formatDueDate(task.dueDate).displayText}
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className='task-delete-btn'
      >
        ×
      </button>
    </div>
  );
}

export default TaskItem;
