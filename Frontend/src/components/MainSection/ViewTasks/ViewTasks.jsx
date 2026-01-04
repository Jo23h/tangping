import { useState, useEffect } from 'react';
import './ViewTasks.css';
import TaskInput from '../TaskInputBar/TaskInput';
import TaskManager from '../TaskManager/TaskManager';
import * as taskService from '../../../services/taskService';
import * as projectService from '../../../services/projectService';
import { getCurrentUser } from '../../../services/authService';

function ViewTasks({ onTaskSelect, onTaskUpdate, onCreateMemo, projectId, filterMode }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inboxId, setInboxId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [defaultPriority, setDefaultPriority] = useState('none');
  const currentUser = getCurrentUser();

  // Fetch inbox and tasks on mount
  useEffect(() => {
    initializeData();
  }, [projectId, filterMode]);

  const initializeData = async () => {
    try {
      setLoading(true);
      // Get or create inbox
      const inbox = await projectService.getOrCreateInbox();
      setInboxId(inbox._id);

      // Fetch all projects
      const allProjects = await projectService.getAllProjects();
      setProjects(allProjects);

      // Set default category and priority based on context
      if (projectId) {
        // On a project page - set to that project
        const currentProject = allProjects.find(p => p._id === projectId);
        if (currentProject) {
          setSelectedCategoryId(projectId);
          setSelectedCategoryName(currentProject.name);
          // Inherit project's priority as default
          setDefaultPriority(currentProject.priority || 'none');
        }
      } else if (filterMode === 'inbox') {
        // On inbox page - set to inbox
        setSelectedCategoryId(inbox._id);
        setSelectedCategoryName('Inbox');
        setDefaultPriority('none');
      } else {
        // On View Task page - default to inbox
        setSelectedCategoryId(inbox._id);
        setSelectedCategoryName('Inbox');
        setDefaultPriority('none');
      }

      // Fetch tasks with inbox ID
      const fetchedTasks = await taskService.getAllTasks();

      // Filter tasks based on mode
      if (projectId) {
        // For specific project page: show only tasks for this project
        const filtered = fetchedTasks.filter(task => task.projectId === projectId);
        setTasks(filtered);
      } else if (filterMode === 'inbox') {
        // For Inbox page: show only tasks without projectId
        const filtered = fetchedTasks.filter(task => !task.projectId);
        setTasks(filtered);
      } else {
        // For View Task page: show ALL tasks
        setTasks(fetchedTasks);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks();

      // Filter tasks based on mode
      if (projectId) {
        // For specific project page: show only tasks for this project
        const filtered = fetchedTasks.filter(task => task.projectId === projectId);
        setTasks(filtered);
      } else if (filterMode === 'inbox') {
        // For Inbox page: show only tasks without projectId
        const filtered = fetchedTasks.filter(task => !task.projectId);
        setTasks(filtered);
      } else {
        // For View Task page: show ALL tasks
        setTasks(fetchedTasks);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTask = async (taskText, dueDate, priority, categoryId) => {
    try {
      const taskData = {
        text: taskText,
        dueDate: dueDate || null,
        priority: priority || 'none',
        completed: false,
        memo: ''
      };

      // Use the selected category (or passed categoryId)
      const targetCategoryId = categoryId || selectedCategoryId;

      // Only assign projectId if it's not the inbox (inbox tasks have no projectId)
      // Check if the category is inbox by comparing with inboxId
      if (targetCategoryId && targetCategoryId !== inboxId) {
        taskData.projectId = targetCategoryId;
      }
      // If targetCategoryId is inboxId or null, don't set projectId (keeps task in inbox)

      const newTask = await taskService.createTask(taskData);

      // Only add to current view if it belongs here
      if (projectId) {
        // On project page: only add if task belongs to this project
        if (newTask.projectId === projectId) {
          setTasks([...tasks, newTask]);
        }
      } else if (filterMode === 'inbox') {
        // On inbox page: only add if task has no project
        if (!newTask.projectId) {
          setTasks([...tasks, newTask]);
        }
      } else {
        // On View Task page: add all tasks
        setTasks([...tasks, newTask]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCategoryChange = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
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
    onTaskSelect(task);
  };

  const handleTaskEdit = async (taskId, newText) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { text: newText });
      const updatedTasks = tasks.map(task =>
        task._id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);
      onTaskUpdate(updatedTask);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="view-task">
        {!projectId && (
          <div className="view-task-header">
            <h1 className="view-task-title">All tasks</h1>
          </div>
        )}
        <div className="view-task-content">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  const getHeaderTitle = () => {
    if (filterMode === 'inbox') return 'Inbox';
    return 'All tasks';
  };

  return (
    <div className="view-task">
      {!projectId && (
        <div className="view-task-header">
          <h1 className="view-task-title">{getHeaderTitle()}</h1>
        </div>
      )}

      {error && <div className="error-message" style={{ color: 'red', padding: '10px' }}>{error}</div>}

      <div className="view-task-content">
        {currentUser?.role !== 'guest' && (
          <TaskInput
            onAddTask={handleAddTask}
            selectedCategoryId={selectedCategoryId}
            selectedCategoryName={selectedCategoryName}
            onCategoryChange={handleCategoryChange}
            projects={projects}
            defaultPriority={defaultPriority}
          />
        )}
        <TaskManager
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onItemClick={handleTaskClick}
          onTaskEdit={handleTaskEdit}
          onCreateMemo={onCreateMemo}
          isGuest={currentUser?.role === 'guest'}
        />
      </div>
    </div>
  );
}

export default ViewTasks;
