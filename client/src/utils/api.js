import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const poetryAPI = {
  getByCategory: (category) => api.get(`/poetry/${category}`),
  likePoetry: (id) => api.post(`/poetry/${id}/like`),
};

export const commentAPI = {
  addComment: (data) => api.post('/comments', data),
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
};

export default api;
