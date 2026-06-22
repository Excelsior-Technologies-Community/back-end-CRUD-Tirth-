// API service helper methods for interacting with the backend endpoints
const API_URL = 'http://localhost:5000/api/products';

/**
 * Helper function to generate authorization headers with JWT
 */
const getAuthHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Fetch all products from the backend database (Public route)
 */
export const getProducts = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

/**
 * Add a new product to the database (Protected route)
 * @param {Object} productData - { name, price, category }
 */
export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });
  return await response.json();
};

/**
 * Update an existing product details by its ID (Protected route)
 * @param {String} id - Database ObjectId
 * @param {Object} productData - { name, price, category }
 */
export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData)
  });
  return await response.json();
};

/**
 * Delete a product by its ID (Protected route)
 * @param {String} id - Database ObjectId
 */
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(null) // No content-type needed for DELETE
  });
  return await response.json();
};

/**
 * Fetch all available image filenames from the backend uploads directory (Public route)
 */
export const getImages = async () => {
  const response = await fetch('http://localhost:5000/api/images');
  return await response.json();
};

/**
 * Upload a new image file to the backend
 * @param {File} file - The file object from input type="file"
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: getAuthHeaders(null), // Browser sets multipart/form-data boundary
    body: formData
  });
  return await response.json();
};
