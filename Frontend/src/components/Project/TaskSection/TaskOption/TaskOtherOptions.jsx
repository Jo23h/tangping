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
          <div className='task-priority-options'>
            <button
              className={`task-priority-option ${selectedPriority === 'high' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('high')}
            >
              <span className='task-priority-flag high'>🚩</span>
              <span className='task-priority-label'>High</span>
            </button>
            <button
              className={`task-priority-option ${selectedPriority === 'medium' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('medium')}
            >
              <span className='task-priority-flag medium'>🚩</span>
              <span className='task-priority-label'>Medium</span>
            </button>
            <button
              className={`task-priority-option ${selectedPriority === 'low' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('low')}
            >
              <span className='task-priority-flag low'>🚩</span>
              <span className='task-priority-label'>Low</span>
            </button>
            <button
              className={`task-priority-option ${selectedPriority === 'none' ? 'selected' : ''}`}
              onClick={() => handlePriorityClick('none')}
            >
              <span className='task-priority-flag none'>🏳️</span>
              <span className='task-priority-label'>No priority</span>
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
