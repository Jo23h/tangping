import { useState, useEffect } from 'react';
import './ViewTasks.css';
import TaskInput from '../TaskInputBar/TaskInput';
import TaskManager from '../TaskManager/TaskManager';
import * as taskService from '../../../services/taskService';
import { getCurrentUser } from '../../../services/authService';

function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = getCurrentUser();

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Task updates
    const handleTaskUpdatedFromMemo = (event) => {
      const updatedTask = event.detail;
      const updatedTasks = tasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      );
      setTasks(updatedTasks);

      const syncEvent = new CustomEvent('taskUpdated', { detail: updatedTask });
      window.dispatchEvent(syncEvent);
    };

    window.addEventListener('taskUpdatedFromMemo', handleTaskUpdatedFromMemo);

    return () => {
      window.removeEventListener('taskUpdatedFromMemo', handleTaskUpdatedFromMemo);
    };
  }, [tasks]);

  const handleAddTask = async (taskText, dueDate, priority) => {
    try {
      const taskData = {
        text: taskText,
        dueDate: dueDate || null,
        priority: priority || 'none',
        completed: false,
        memo: ''
      };
      const newTask = await taskService.createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const updatedTask = await taskService.updateTask(taskId, {
        completed: !task.completed
      });
      const updatedTasks = tasks.map(t =>
        t._id === taskId ? updatedTask : t
      );
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskClick = (task) => {
    // Emit custom event for MemoSection to listen
    const event = new CustomEvent('taskSelected', { detail: task });
    window.dispatchEvent(event);
  };

  const handleTaskEdit = async (taskId, newText) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { text: newText });
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);

      // Emit event to update MemoSection if this task is selected
      const event = new CustomEvent('taskUpdated', { detail: updatedTask });
      window.dispatchEvent(event);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="view-task">
        <div className="view-task-header">
          <h1 className="view-task-title">View Task</h1>
        </div>
        <div className="view-task-content">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-task">
      <div className="view-task-header">
        <h1 className="view-task-title">View Task</h1>
        <button className="view-task-menu">...</button>
      </div>

      {error && <div className="error-message" style={{ color: 'red', padding: '10px' }}>{error}</div>}

      <div className="view-task-content">
        {currentUser?.role !== 'guest' && <TaskInput onAddTask={handleAddTask} />}
        <TaskManager
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onItemClick={handleTaskClick}
          onTaskEdit={handleTaskEdit}
          isGuest={currentUser?.role === 'guest'}
        />
      </div>
    </div>
  );
}

export default ViewTasks;
