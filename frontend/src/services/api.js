import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getProfile: () => axiosInstance.get('/auth/profile'),
};

export const achievementAPI = {
  createAchievement: (data) => axiosInstance.post('/achievements', data),
  getMyAchievements: () => axiosInstance.get('/achievements/my'),
  getAllAchievements: () => axiosInstance.get('/achievements'),
  getAchievementStats: () => axiosInstance.get('/achievements/stats'),
  getUserStats: () => axiosInstance.get('/achievements/user-stats'),
  updateAchievementStatus: (id, status) => axiosInstance.put(`/achievements/${id}/status`, { status }),
};

export const notificationAPI = {
  getNotifications: () => axiosInstance.get('/notifications'),
  getUnreadCount: () => axiosInstance.get('/notifications/unread-count'),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
};

export default axiosInstance;
