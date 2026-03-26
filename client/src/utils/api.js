import axios from 'axios';

// Dev (`npm run dev`): always `/api` → Vite proxy → localhost:5000 (vite.config.js).
// This ignores VITE_API_URL so a leftover Render URL in .env does not break local work.
// Production build: uses VITE_API_URL if set (e.g. on Render), else http://localhost:5000/api
const API_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) ||
    'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const isPublicAuth =
      url.startsWith('/auth/') ||
      url.startsWith('/user/login') ||
      url.startsWith('/user/register') ||
      url.startsWith('/categories') ||
      url.startsWith('/home-hero');

    if (isPublicAuth) {
      return config;
    }

    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');

    if (url.startsWith('/admin/') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const poetryAPI = {
  // Top-level /api/categories avoids /poetry/:category catching "categories" when a user JWT is sent
  getCategories: () => api.get('/categories'),
  getHomeHero: () => api.get('/home-hero'),
  getByCategory: (category) => api.get(`/poetry/${category}`),
  likePoetry: (id) => api.post(`/poetry/${id}/like`),
};

export const commentAPI = {
  addComment: (data) => api.post('/comments', data),
};

export const userAPI = {
  login: (credentials) => api.post('/user/login', credentials),
  register: (data) => api.post('/user/register', data),
};

export const adminAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  addPoetry: (data) => api.post('/admin/add-poetry', data),
  getAllPoetry: (params) => api.get('/admin/all-poetry', { params }),
  getPendingPoetry: () => api.get('/admin/pending-poetry'),
  editPoetry: (id, data) => api.put(`/admin/edit-poetry/${id}`, data),
  deletePoetry: (id) => api.delete(`/admin/delete-poetry/${id}`),
  approvePoetry: (id) => api.put(`/admin/approve-poetry/${id}`),
  rejectPoetry: (id) => api.put(`/admin/reject-poetry/${id}`),
  getComments: (poetryId) => api.get(`/admin/poetry/${poetryId}/comments`),
  deleteComment: (id) => api.delete(`/admin/comment/${id}`),
  getCategories: () => api.get('/admin/category'),
  addCategory: (data) => api.post('/admin/category', data),
  updateCategory: (id, data) => api.put(`/admin/category/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/category/${id}`),
  getAccessCodes: () => api.get('/admin/access-code'),
  addAccessCode: (data) => api.post('/admin/access-code', data),
  updateAccessCode: (id, data) => api.put(`/admin/access-code/${id}`, data),
  getViewers: () => api.get('/admin/viewers'),
  getHomeHero: () => api.get('/admin/home-hero'),
  updateHomeHero: (data) => api.put('/admin/home-hero', data),
};

export default api;
