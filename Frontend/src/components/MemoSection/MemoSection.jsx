import { useState, useEffect } from 'react';
import './MemoSection.css';
import * as taskService from '../../services/taskService';

function MemoSection() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');

  useEffect(() => {
    // Listen for task selection events
    const handleTaskSelected = (event) => {
      setSelectedTask(event.detail);
      setTaskTitle(event.detail.text);
      setMemoContent(event.detail.memo || '');
    };

    // Listen for task update events
    const handleTaskUpdated = (event) => {
      if (selectedTask && selectedTask._id === event.detail._id) {
        setSelectedTask(event.detail);
        setTaskTitle(event.detail.text);
        setMemoContent(event.detail.memo || '');
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

  const handleTitleBlur = async () => {
    if (taskTitle.trim() && taskTitle !== selectedTask.text) {
      try {
        const updatedTask = await taskService.updateTask(selectedTask._id, { text: taskTitle.trim() });
        // Emit event to update the task
        const event = new CustomEvent('taskUpdatedFromMemo', { detail: updatedTask });
        window.dispatchEvent(event);
      } catch (err) {
        setTaskTitle(selectedTask.text);
      }
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

  const handleMemoBlur = async (e) => {
    const newMemo = e.target.textContent;
    if (newMemo !== selectedTask.memo) {
      try {
        const updatedTask = await taskService.updateTask(selectedTask._id, { memo: newMemo });
        setSelectedTask(updatedTask);
      } catch (err) {
      }
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
        onBlur={handleMemoBlur}
        dangerouslySetInnerHTML={{ __html: memoContent }}
      />
    </div>
  );
}

export default MemoSection;
