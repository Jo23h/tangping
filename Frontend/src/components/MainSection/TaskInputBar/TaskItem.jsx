import './TaskItem.css'

function TaskItem({ task, onToggle, onDelete, formatDueDate, onItemClick }) {
  const handleTaskClick = () => {
    if (onItemClick) {
      onItemClick(task);
    }
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
      <span className={`task-text ${task.completed ? 'task-completed' : ''}`}>
        {task.text}
      </span>
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
