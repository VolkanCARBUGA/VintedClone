import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await api.post('/users/register', { username, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Product services
export const productService = {
  getProducts: async (filters = {}) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  addToFavorites: async (id) => {
    try {
      const response = await api.post(`/products/${id}/favorite`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  removeFromFavorites: async (id) => {
    try {
      const response = await api.delete(`/products/${id}/favorite`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getFavoriteProducts: async () => {
    try {
      const response = await api.get('/products/favorites');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getUserProducts: async (userId, status) => {
    try {
      const response = await api.get(`/products/user/${userId}`, { params: { status } });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

// User services
export const userService = {
  getUserProfile: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateProfile: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  followUser: async (id) => {
    try {
      const response = await api.post(`/users/follow/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  unfollowUser: async (id) => {
    try {
      const response = await api.delete(`/users/follow/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getFollowers: async (id) => {
    try {
      const response = await api.get(`/users/${id}/followers`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getFollowing: async (id) => {
    try {
      const response = await api.get(`/users/${id}/following`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

// Message services
export const messageService = {
  getConversations: async () => {
    try {
      const response = await api.get('/conversations');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createConversation: async (receiverId, productId, initialMessage) => {
    try {
      const response = await api.post('/conversations', { receiverId, productId, initialMessage });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getConversationById: async (id) => {
    try {
      const response = await api.get(`/conversations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getConversationMessages: async (id, page = 1, limit = 50) => {
    try {
      const response = await api.get(`/conversations/${id}/messages`, { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  sendMessage: async (conversationId, content, images = []) => {
    try {
      const response = await api.post('/messages', { conversationId, content, images });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  markMessageAsRead: async (id) => {
    try {
      const response = await api.put(`/messages/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

export default {
  authService,
  productService,
  userService,
  messageService,
};
