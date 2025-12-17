import { useState, useEffect } from 'react'
import DatePicker from './DatePicker'
import PrioritySelection from './PrioritySelection'
import './TaskEditor.css'

function TaskEditor({ task, onSave, onClose }) {
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleTextChange = (e) => {
    setEditedTask({ ...editedTask, text: e.target.value });
  };

  const handleDateChange = (date) => {
    setEditedTask({ ...editedTask, dueDate: date });
  };

  const handlePriorityChange = (priority) => {
    setEditedTask({ ...editedTask, priority: priority });
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'task-editor-overlay') {
      onClose();
    }
  };

  return (
    <div className="task-editor-overlay" onClick={handleOverlayClick}>
      <div className="task-editor-modal">
        <div className="task-editor-header">
          <h3>Edit Task</h3>
          <button className="task-editor-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="task-editor-content">
          <div className="task-editor-field">
            <label>Task Name</label>
            <input
              type="text"
              value={editedTask.text}
              onChange={handleTextChange}
              className="task-editor-input"
              placeholder="Task name"
              autoFocus
            />
          </div>

          <div className="task-editor-field">
            <label>Due Date</label>
            <DatePicker
              selectedDate={editedTask.dueDate}
              onDateChange={handleDateChange}
            />
          </div>

          <div className="task-editor-field">
            <label>Priority</label>
            <PrioritySelection
              selectedPriority={editedTask.priority || 'none'}
              onPriorityChange={handlePriorityChange}
            />
          </div>

          <div className="task-editor-field">
            <label>Status</label>
            <div className="task-editor-status">
              <input
                type="checkbox"
                checked={editedTask.completed}
                onChange={(e) => setEditedTask({ ...editedTask, completed: e.target.checked })}
                id="task-completed-checkbox"
              />
              <label htmlFor="task-completed-checkbox">
                {editedTask.completed ? 'Completed' : 'Not completed'}
              </label>
            </div>
          </div>
        </div>

        <div className="task-editor-footer">
          <button className="task-editor-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="task-editor-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskEditor;
