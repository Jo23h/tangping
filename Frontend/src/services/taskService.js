const API_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getAllTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch tasks');
  }

  return await response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create task');
  }

  return await response.json();
};

export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update task');
  }

  return await response.json();
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete task');
  }

  return await response.json();
};
