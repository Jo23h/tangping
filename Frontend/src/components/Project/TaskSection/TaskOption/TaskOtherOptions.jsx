import { useState } from 'react';
import './TaskOtherOptions.css';

function TaskOtherOptions({ onClose, onPrioritySelect }) {
  const [selectedPriority, setSelectedPriority] = useState(null);

  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
    if (onPrioritySelect) {
      onPrioritySelect(priority);
    }
  };

  return (
    <>
      <div className='task-options-overlay' onClick={onClose}></div>
      <div className='task-options-menu' onClick={(e) => e.stopPropagation()}>
        {/* Priority section */}
        <div className='task-options-section'>
          <div className='task-options-section-title'>Priority</div>
          <div className='task-priority-flags'>
            <button
              className={`task-priority-flag ${selectedPriority === 'high' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('high')}
              title='High priority'
            >
              🚩
            </button>
            <button
              className={`task-priority-flag ${selectedPriority === 'medium' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('medium')}
              title='Medium priority'
            >
              🚩
            </button>
            <button
              className={`task-priority-flag ${selectedPriority === 'low' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('low')}
              title='Low priority'
            >
              🚩
            </button>
            <button
              className={`task-priority-flag ${selectedPriority === 'none' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('none')}
              title='No priority'
            >
              🏳️
            </button>
          </div>
        </div>

        {/* Menu options */}
        <div className='task-options-list'>
          <button className='task-option-item'>
            <span className='task-option-icon'>📋</span>
            <span className='task-option-text'>Project</span>
            <span className='task-option-arrow'>›</span>
          </button>

          <button className='task-option-item'>
            <span className='task-option-icon'>🏷️</span>
            <span className='task-option-text'>Tags</span>
            <span className='task-option-arrow'>›</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default TaskOtherOptions;
