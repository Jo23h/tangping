import { useState } from 'react';

function TaskInput() {
  const [taskText, setTaskText] = useState('');
  const [activeFilter, setActiveFilter] = useState('Outcomes');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && taskText.trim()) {
      e.preventDefault();
      // Handle task creation here
      console.log('Task created:', taskText);
      setTaskText('');
    }
  };

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
          <button className='task-calendar-btn' type='button'>
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
          className={`task-filter-btn ${activeFilter === 'Outcomes' ? 'active' : ''}`}
          onClick={() => setActiveFilter('Outcomes')}
        >
          Outcomes
        </button>
        <button
          className={`task-filter-btn ${activeFilter === 'Courses' ? 'active' : ''}`}
          onClick={() => setActiveFilter('Courses')}
        >
          Courses
        </button>
      </div>
    </div>
  );
}

export default TaskInput;
