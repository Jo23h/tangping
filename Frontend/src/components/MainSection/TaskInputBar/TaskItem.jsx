import { useState, useRef, useEffect } from 'react'
import { PencilSimpleLine } from '@phosphor-icons/react'
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
      {task.dueDate && formatDueDate(task.dueDate) && (
        <span className={`task-due-date ${formatDueDate(task.dueDate).isOverdue ? 'overdue' : ''}`}>
          {formatDueDate(task.dueDate).displayText}
        </span>
      )}
      {task.memo && task.memo.trim() && (
        <PencilSimpleLine
          weight="light"
          size={16}
          className="task-memo-icon"
          color="#666"
        />
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
