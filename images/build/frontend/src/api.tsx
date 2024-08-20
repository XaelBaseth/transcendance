import axios from "axios"
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: 'https://localhost:8000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type here, let axios set it automatically for file uploads
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;