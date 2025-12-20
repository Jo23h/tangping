import { useState, useEffect } from 'react';
import './MemoSection.css';
import * as taskService from '../../services/taskService';

function MemoSection({ selectedTask, onTaskUpdate, onTaskSelect }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');

  useEffect(() => {
    if (selectedTask) {
      setTaskTitle(selectedTask.text);
      setMemoContent(selectedTask.memo || '');
    }
  }, [selectedTask]);

  const handleTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };

  const handleTitleBlur = async () => {
    if (taskTitle.trim() && taskTitle !== selectedTask.text) {
      try {
        const updatedTask = await taskService.updateTask(selectedTask._id, { text: taskTitle.trim() });
        onTaskUpdate(updatedTask);
      } catch (err) {
        setTaskTitle(selectedTask.text);
      }
    } else {
      setTaskTitle(selectedTask.text);
    }
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.target.blur();
    } else if (event.key === 'Escape') {
      setTaskTitle(selectedTask.text);
      event.target.blur();
    }
  };

  const handleMemoBlur = async (event) => {
    const newMemo = event.target.textContent;
    if (newMemo !== selectedTask.memo) {
      try {
        const updatedTask = await taskService.updateTask(selectedTask._id, { memo: newMemo });
        onTaskUpdate(updatedTask);
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
          onClick={() => onTaskSelect(null)}
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
