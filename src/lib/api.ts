import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Add this to handle credentials
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (userData: any) => api.post('/auth/login', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Announcements API
export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  getById: (id: string) => api.get(`/announcements/${id}`),
  create: (data: any) => api.post('/announcements', data),
  update: (id: string, data: any) => api.put(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
  addComment: (id: string, text: string) => api.post(`/announcements/${id}/comments`, { text }),
  toggleLike: (id: string) => api.post(`/announcements/${id}/like`)
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
  register: (id: string) => api.post(`/events/${id}/register`),
  cancelRegistration: (id: string) => api.post(`/events/${id}/cancel`),
  addComment: (id: string, text: string) => api.post(`/events/${id}/comments`, { text })
};

// Resources API
export const resourcesAPI = {
  getAll: () => api.get('/resources'),
  getById: (id: string) => api.get(`/resources/${id}`),
  create: (data: any) => api.post('/resources', data),
  update: (id: string, data: any) => api.put(`/resources/${id}`, data),
  delete: (id: string) => api.delete(`/resources/${id}`),
  addComment: (id: string, text: string) => api.post(`/resources/${id}/comments`, { text }),
  toggleLike: (id: string) => api.post(`/resources/${id}/like`)
};

export default api;