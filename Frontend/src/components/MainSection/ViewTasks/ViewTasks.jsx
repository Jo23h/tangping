import { useState, useEffect } from 'react';
import './ViewTasks.css';
import TaskInput from '../TaskInputBar/TaskInput';
import TaskManager from '../TaskManager/TaskManager';
import { createTask } from '../TaskInputBar/TaskSchema';

function ViewTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Listen for task updates from MemoSection
    const handleTaskUpdatedFromMemo = (event) => {
      const updatedTask = event.detail;
      const updatedTasks = tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);

      // Re-emit to keep MemoSection in sync
      const syncEvent = new CustomEvent('taskUpdated', { detail: updatedTask });
      window.dispatchEvent(syncEvent);
    };

    window.addEventListener('taskUpdatedFromMemo', handleTaskUpdatedFromMemo);

    return () => {
      window.removeEventListener('taskUpdatedFromMemo', handleTaskUpdatedFromMemo);
    };
  }, [tasks]);

  const handleAddTask = (taskText, dueDate, priority) => {
    const newTask = createTask(taskText);
    newTask.dueDate = dueDate;
    newTask.priority = priority;
    setTasks([...tasks, newTask]);
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

  const handleTaskClick = (task) => {
    // Emit custom event for MemoSection to listen
    const event = new CustomEvent('taskSelected', { detail: task });
    window.dispatchEvent(event);
  };

  const handleTaskEdit = (taskId, newText) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);

    // Emit event to update MemoSection if this task is selected
    const updatedTask = updatedTasks.find(t => t.id === taskId);
    if (updatedTask) {
      const event = new CustomEvent('taskUpdated', { detail: updatedTask });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="view-task">
      <div className="view-task-header">
        <h1 className="view-task-title">View Task</h1>
        <button className="view-task-menu">...</button>
      </div>

      <div className="view-task-content">
        <TaskInput onAddTask={handleAddTask} />
        <TaskManager
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onItemClick={handleTaskClick}
          onTaskEdit={handleTaskEdit}
        />
      </div>
    </div>
  );
}

export default ViewTasks;
