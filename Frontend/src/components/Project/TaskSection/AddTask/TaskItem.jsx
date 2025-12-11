function TaskItem({ task, onToggle, onDelete, formatDueDate }) {
  return (
    <div className='task-item'>
      <input
        type='checkbox'
        checked={task.completed}
        onChange={() => onToggle(task.id)}
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
        onClick={() => onDelete(task.id)}
        className='task-delete-btn'
      >
        ×
      </button>
    </div>
  );
}

export default TaskItem;
