import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const fixImageUrls = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string' && val.startsWith('/uploads/')) {
      obj[key] = `${BACKEND_URL}${val}`;
    } else if (Array.isArray(val)) {
      val.forEach(fixImageUrls);
    } else if (val && typeof val === 'object') {
      fixImageUrls(val);
    }
  }
};

api.interceptors.response.use(
  (res) => {
    if (res.data) fixImageUrls(res.data);
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
