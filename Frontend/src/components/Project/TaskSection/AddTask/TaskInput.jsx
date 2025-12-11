import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { filterTasks } from '../FilterLogic/TaskFilterLogic';
import DateSelector from './TaskOptions/DateSelector';
import TaskOtherOptions from '../TaskOption/TaskOtherOptions';

function TaskInput() {
  const [taskText, setTaskText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('none');
  const [tasks, setTasks] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && taskText.trim()) {
      e.preventDefault();
      // Create new task
      const newTask = {
        id: uuidv4(),
        text: taskText,
        dueDate: dueDate,
        priority: priority,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setTaskText('');
      setDueDate('');
      setPriority('none');
      setShowDatePicker(false);
    }
  };

  const handlePrioritySelect = (selectedPriority) => {
    setPriority(selectedPriority);
  };

  const handleDateSelect = (date) => {
    setDueDate(date);
    setShowDatePicker(false);
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Format date for display
  const formatDueDate = (dateString) => {
    if (!dateString) return null;

    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let displayText = '';
    let isOverdue = false;

    if (diffDays < -1) {
      // More than 1 day overdue - show date like "Dec 9"
      displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
      isOverdue = true;
    } else if (diffDays === -1) {
      // Yesterday
      displayText = 'Yesterday';
      isOverdue = true;
    } else if (diffDays === 0) {
      // Today
      displayText = 'Today';
      isOverdue = false;
    } else if (diffDays === 1) {
      // Tomorrow
      displayText = 'Tomorrow';
      isOverdue = false;
    } else if (diffDays <= 6) {
      // Within next week - show day name like "Next Wed"
      displayText = `Next ${dayNames[dueDate.getDay()]}`;
      isOverdue = false;
    } else {
      // Further in future - show date like "Dec 18"
      displayText = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
      isOverdue = false;
    }

    return { displayText, isOverdue };
  };

  // Sort tasks by date, then by priority
  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      // First, sort by date
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      if (dateA !== dateB) {
        return dateA - dateB; // Earlier dates first
      }

      // If dates are the same, sort by priority
      const priorityOrder = { high: 1, medium: 2, low: 3, none: 4 };
      const priorityA = priorityOrder[a.priority] || 4;
      const priorityB = priorityOrder[b.priority] || 4;

      return priorityA - priorityB; // Higher priority first
    });
  };

  // Use the filter logic from TaskFilterLogic
  const filteredTasks = sortTasks(filterTasks(tasks, activeFilter));

  return (
    <div className='task-input-section'>
      {/* Section header - non-collapsible */}
      <div className='task-input-header'>
        <h2 className='project-form-section-title'>All Tasks</h2>
      </div>

      {/* Task input box */}
      <div className='task-input-container'>
        <span className='task-plus-icon'>+</span>
        <input
          type='text'
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Add task'
          className='task-input'
        />
        <div className='task-input-actions'>
          <button
            className='task-calendar-btn'
            type='button'
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            📅
          </button>
          <div style={{ position: 'relative' }}>
            <button
              className='task-dropdown-btn'
              type='button'
              onClick={() => setShowOtherOptions(!showOtherOptions)}
            >
              ▼
            </button>
            {showOtherOptions && (
              <TaskOtherOptions
                onClose={() => setShowOtherOptions(false)}
                onPrioritySelect={handlePrioritySelect}
              />
            )}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className='task-filters'>
        <button
          className={`task-filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
          onClick={() => setActiveFilter('All')}
        >
          All
        </button>
        <button
          className={`task-filter-btn ${activeFilter === 'Overdue/due soon' ? 'active' : ''}`}
          onClick={() => setActiveFilter('Overdue/due soon')}
        >
          Overdue/due soon
        </button>
        <button
          className={`task-filter-btn ${activeFilter === 'Upcoming' ? 'active' : ''}`}
          onClick={() => setActiveFilter('Upcoming')}
        >
          Upcoming
        </button>
      </div>

      {/* Task list */}
      <div className='task-list'>
        {filteredTasks.map((task) => (
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
            {task.dueDate && formatDueDate(task.dueDate) && (
              <span className={`task-due-date ${formatDueDate(task.dueDate).isOverdue ? 'overdue' : ''}`}>
                {formatDueDate(task.dueDate).displayText}
              </span>
            )}
            <button
              onClick={() => handleDeleteTask(task.id)}
              className='task-delete-btn'
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Date selector modal */}
      {showDatePicker && (
        <DateSelector
          onDateSelect={handleDateSelect}
          onClose={() => setShowDatePicker(false)}
          initialDate={dueDate ? new Date(dueDate) : null}
        />
      )}
    </div>
  );
}

export default TaskInput;
