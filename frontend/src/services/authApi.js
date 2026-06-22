// Auth API service helper methods for interacting with the backend authentication endpoints
const AUTH_URL = 'http://localhost:5000/api/auth';

/**
 * Register a new user in the system
 * @param {Object} userData - { username, email, password }
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

/**
 * Login a user and retrieve a JWT token
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return await response.json();
};

/**
 * Fetch the current database connection status from the backend
 */
export const getDbStatus = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/db-status');
    return await response.json();
  } catch (error) {
    console.error('Error fetching database status:', error);
    return { success: false, dbType: 'Disconnected' };
  }
};

/**
 * Change the user's password (Protected route)
 * @param {Object} passwords - { currentPassword, newPassword, confirmPassword }
 */
export const changePassword = async (passwords) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${AUTH_URL}/change-password`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwords)
  });
  return await response.json();
};
