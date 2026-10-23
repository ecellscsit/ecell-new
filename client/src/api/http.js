import axios from 'axios';

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// attach the login token to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';

// upload one image and get back its URL
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await http.post('/upload', fd);
  return data.url;
}
export default http;
