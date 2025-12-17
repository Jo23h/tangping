import { useState } from 'react';
import TaskList from '../TaskInputBar/TaskList';
import './CompletedSection.css';

function CompletedSection({ tasks, onToggle, onDelete, formatDueDate, onItemClick }) {
  const [showCompleted, setShowCompleted] = useState(true);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className='completed-section'>
      <div
        className='completed-section-header'
        onClick={() => setShowCompleted(!showCompleted)}
      >
        <span className='text-section-arrow'>
          {showCompleted ? 'v' : '>'}
        </span>
        <h3 className='completed-section-title'>Completed</h3>
        <span className='completed-count'>{tasks.length}</span>
      </div>

      {showCompleted && (
        <TaskList
          tasks={tasks}
          onToggle={onToggle}
          onDelete={onDelete}
          formatDueDate={formatDueDate}
          onItemClick={onItemClick}
        />
      )}
    </div>
  );
}

export default CompletedSection;
