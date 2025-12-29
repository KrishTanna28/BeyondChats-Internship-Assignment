import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all articles from the backend
 */
export const fetchArticles = async () => {
  try {
    const response = await api.get('/articles');
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * Fetch a single article by ID
 */
export const fetchArticleById = async (id) => {
  try {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

/**
 * Update an article
 */
export const updateArticle = async (id, data) => {
  try {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

/**
 * Delete an article
 */
export const deleteArticle = async (id) => {
  try {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

export default api;
