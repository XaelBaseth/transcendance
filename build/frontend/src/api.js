import axios from "axios"
import { ACCESS_TOKEN } from "./constants";

axios.default.debug =  true;

/** Give the user a JWT to identify him and stores it into localStorage (check if cookies better or nah) */
const api = axios.create({
  baseURL: 'https://localhost:8000'
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