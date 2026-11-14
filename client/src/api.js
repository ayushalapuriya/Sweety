import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sweety_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function request(promise) {
  try { return (await promise).data; } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong. Please try again.');
  }
}
