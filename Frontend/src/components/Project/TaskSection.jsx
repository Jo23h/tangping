import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function TaskSection({ title, tasks, onTasksChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      e.preventDefault();
      const newTask = {
        id: uuidv4(),
        text: newTaskText,
        completed: false
      };
      onTasksChange([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onTasksChange(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
  };

  return (
    <div className='task-section'>
      {/* Section header with collapse arrow */}
      <div
        className='task-section-header'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className='task-section-arrow'>
          {isExpanded ? '▼' : '>'}
        </span>
        <h2 className='project-form-section-title'>{title}</h2>
        {!isExpanded && <span className='task-section-ellipsis'>...</span>}
      </div>

      {/* Task list - only show when expanded */}
      {isExpanded && (
        <div className='task-list'>
          {/* Add task input */}
          <div className='task-input-container'>
            <span className='task-plus-icon'>+</span>
            <input
              type='text'
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleAddTask}
              placeholder='Add task'
              className='task-input'
            />
            <div className='task-input-actions'>
              <button className='task-calendar-btn' type='button'>
                📅
              </button>
              <button className='task-dropdown-btn' type='button'>
                ▼
              </button>
            </div>
          </div>

          {/* Task items */}
          {tasks.map((task) => (
            <div key={task.id} className='task-item'>
              <input
                type='checkbox'
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className='task-checkbox'
              />
              <span className={`task-text ${task.completed ? 'task-completed' : ''}`}>
                {task.text}
              </span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className='task-delete-btn'
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskSection;
