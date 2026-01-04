import { API_URL } from '../config.js';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getActivities = async (category = 'all', limit = 20, skip = 0) => {
  const response = await fetch(`${API_URL}/activities?category=${category}&limit=${limit}&skip=${skip}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch activities');
  }

  return await response.json();
};
