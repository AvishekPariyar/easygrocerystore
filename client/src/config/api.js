import axios from 'axios';

// Use the proxy URL in development
const API_URL = '/api';
const SERVER_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Transform image URLs in the response
    const data = response.data;
    
    // Handle array responses
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.imageUrl && item.imageUrl.startsWith('/uploads/')) {
          item.imageUrl = `${SERVER_URL}${item.imageUrl}`;
        }
      });
    }
    // Handle single object responses
    else if (data && typeof data === 'object') {
      if (data.imageUrl && data.imageUrl.startsWith('/uploads/')) {
        data.imageUrl = `${SERVER_URL}${data.imageUrl}`;
      }
    }
    
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('Unauthorized access, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};

// Admin API endpoints
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Orders
  getOrders: () => {
    console.log('Fetching admin orders...');
    return api.get('/admin/orders');
  },
  updateOrder: (orderId, status) => api.put(`/admin/orders/${orderId}`, { status }),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  
  // Products
  getAllProducts: () => api.get('/admin/products'),
  createProduct: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/admin/products', formData, config);
  },
  updateProduct: (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`/admin/products/${id}`, formData, config);
  },
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

// Product API endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  create: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/products', formData, config);
  },
  update: (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`/products/${id}`, formData, config);
  },
  delete: (id) => api.delete(`/products/${id}`),
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
};

export { api };
