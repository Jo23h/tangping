import { useState, useEffect } from 'react';
import './MemoSection.css';

function MemoSection() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    // Listen for task selection events
    const handleTaskSelected = (event) => {
      setSelectedTask(event.detail);
      setTaskTitle(event.detail.text);
    };

    // Listen for task update events
    const handleTaskUpdated = (event) => {
      if (selectedTask && selectedTask.id === event.detail.id) {
        setSelectedTask(event.detail);
        setTaskTitle(event.detail.text);
      }
    };

    window.addEventListener('taskSelected', handleTaskSelected);
    window.addEventListener('taskUpdated', handleTaskUpdated);

    // Cleanup
    return () => {
      window.removeEventListener('taskSelected', handleTaskSelected);
      window.removeEventListener('taskUpdated', handleTaskUpdated);
    };
  }, [selectedTask]);

  const handleTitleChange = (e) => {
    setTaskTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (taskTitle.trim() && taskTitle !== selectedTask.text) {
      const updatedTask = { ...selectedTask, text: taskTitle.trim() };
      // Emit event to update the task
      const event = new CustomEvent('taskUpdatedFromMemo', { detail: updatedTask });
      window.dispatchEvent(event);
    } else {
      setTaskTitle(selectedTask.text);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setTaskTitle(selectedTask.text);
      e.target.blur();
    }
  };

  if (!selectedTask) {
    return (
      <div className='memo-section'>
        <div className='memo-blank'>
          <p className='memo-placeholder'>Select a task to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className='memo-section'>
      <div className='memo-header'>
        <input
          type='text'
          className='memo-task-title-input'
          value={taskTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          placeholder='Task name...'
        />
        <button
          className='memo-close-btn'
          onClick={() => setSelectedTask(null)}
        >
          ×
        </button>
      </div>
      <div
        className='memo-content'
        contentEditable
        suppressContentEditableWarning
        data-placeholder='Start writing...'
      />
    </div>
  );
}

export default MemoSection;
