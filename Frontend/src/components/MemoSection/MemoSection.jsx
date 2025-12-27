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

  const handleMemoKeyDown = (event) => {
    if (event.key === ' ') {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const textBeforeCursor = range.startContainer.textContent.substring(0, range.startOffset);

      // Check if the last character before space is a dash
      if (textBeforeCursor.endsWith('-')) {
        event.preventDefault();

        // Insert a tab/indentation after the dash and space
        const indent = '\u00A0\u00A0\u00A0\u00A0'; // 4 non-breaking spaces for indentation
        const textNode = document.createTextNode(' ' + indent);
        range.insertNode(textNode);

        // Move cursor to end of inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
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
        onKeyDown={handleMemoKeyDown}
        dangerouslySetInnerHTML={{ __html: memoContent }}
      />
    </div>
  );
}

export default MemoSection;
