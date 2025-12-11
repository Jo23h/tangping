import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { filterTasks } from '../FilterLogic/TaskFilterLogic';
import DateSelector from './DateSelector';

function TaskInput() {
  const [taskText, setTaskText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && taskText.trim()) {
      e.preventDefault();
      // Create new task
      const newTask = {
        id: uuidv4(),
        text: taskText,
        dueDate: dueDate,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setTaskText('');
      setDueDate('');
      setShowDatePicker(false);
    }
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

  // Use the filter logic from TaskFilterLogic
  const filteredTasks = filterTasks(tasks, activeFilter);

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
          <button className='task-dropdown-btn' type='button'>
            ▼
          </button>
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
            <div className='task-content'>
              <span className={`task-text ${task.completed ? 'task-completed' : ''}`}>
                {task.text}
              </span>
              {task.dueDate && (
                <span className='task-due-date'>📅 {task.dueDate}</span>
              )}
            </div>
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
