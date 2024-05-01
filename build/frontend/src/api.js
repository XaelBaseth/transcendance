import axios from "axios"
import { ACCESS_TOKEN } from "./constants";

/** Give the user a JWT to identify him and stores it into localStorage (check if cookies better or nah) */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  export default api;