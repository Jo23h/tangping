const API_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getAllProjects = async () => {
  const response = await fetch(`${API_URL}/projects`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
};

export const getProject = async (id) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }

  return response.json();
};

export const createProject = async (projectData) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  return response.json();
};

export const updateProject = async (id, projectData) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    throw new Error('Failed to update project');
  }

  return response.json();
};

export const deleteProject = async (id) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  return response.json();
};

export const getOrCreateInbox = async () => {
  const response = await fetch(`${API_URL}/projects/inbox`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to get inbox');
  }

  return response.json();
};

export const archiveProject = async (id) => {
  const response = await fetch(`${API_URL}/projects/${id}/archive`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to archive project');
  }

  return response.json();
};

export const getDeletedProjects = async () => {
  const response = await fetch(`${API_URL}/projects/deleted`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch deleted projects');
  }

  return response.json();
};
