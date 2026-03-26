import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('votewise_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

api.interceptors.request.use(
  (config) => {
    const savedToken = localStorage.getItem('votewise_token');
    if (savedToken) {
      if (config.headers) {
        config.headers['Authorization'] = `Token ${savedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const registerUser = (data: { username: string; email: string; password: string }) =>
  api.post('/api/register/', data);

const loginUser = (data: { username?: string; email?: string; password: string }) =>
  api.post('/api/login/', data);

const logoutUser = () => api.post('/api/logout/');

const getCurrentUser = () => api.get('/api/user/');

const setToken = (tokenValue: string) => {
  localStorage.setItem('votewise_token', tokenValue);
  api.defaults.headers.common['Authorization'] = `Token ${tokenValue}`;
};

const clearToken = () => {
  localStorage.removeItem('votewise_token');
  delete api.defaults.headers.common['Authorization'];
};

export { api, registerUser, loginUser, logoutUser, getCurrentUser, setToken, clearToken };
