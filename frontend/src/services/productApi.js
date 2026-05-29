// API service helper methods for interacting with the backend endpoints
const API_URL = 'http://localhost:5000/api/products';

/**
 * Fetch all products from the backend database
 */
export const getProducts = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

/**
 * Add a new product to the database
 * @param {Object} productData - { name, price, category }
 */
export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return await response.json();
};

/**
 * Update an existing product details by its ID
 * @param {String} id - Database ObjectId
 * @param {Object} productData - { name, price, category }
 */
export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return await response.json();
};

/**
 * Delete a product by its ID
 * @param {String} id - Database ObjectId
 */
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};
