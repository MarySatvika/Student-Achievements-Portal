import axios from 'axios';

// Create an axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include auth token
API.interceptors.request.use(
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

// Add a response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only clear localStorage and redirect for specific 401 errors
    // This prevents clearing auth on network issues or other 401 scenarios
    if (error.response?.status === 401 && 
        error.response?.data?.message && 
        (error.response.data.message.includes('Token invalid') || 
         error.response.data.message.includes('access denied'))) {
      // Unauthorized, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (emailOrUsername, password) => API.post('/api/auth/login', { emailOrUsername, password }),
  register: (userData) => API.post('/api/auth/register', userData),
  getProfile: () => API.get('/api/auth/profile'),
  // Email verification endpoints removed
  forgotPassword: (email) => API.post('/api/auth/forgot-password', { email }),
  resetPassword: (email, otp, newPassword) => API.post('/api/auth/reset-password', { email, otp, newPassword }),
};

// Achievement API
export const achievementAPI = {
  create: (achievementData) => API.post('/api/achievements', achievementData),
  getMyAchievements: () => API.get('/api/achievements/my'),
  getAll: (params) => API.get('/api/achievements', { params }),
  updateStatus: (id, statusData) => API.put(`/api/achievements/${id}/status`, statusData),
  getStats: (params) => API.get('/api/achievements/stats', { params }),
  getUserStats: () => API.get('/api/achievements/user-stats'),
};

// User API
export const userAPI = {
  getAll: () => API.get('/api/users'),
  getById: (id) => API.get(`/api/users/${id}`),
  update: (id, userData) => API.put(`/api/users/${id}`, userData),
};

export default API;