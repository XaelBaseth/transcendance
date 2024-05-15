import axios from "axios"
import { ACCESS_TOKEN } from "./constants";

axios.default.debug =  true;

const BASE_URL = import.meta.VITE_API_URL

/** Give the user a JWT to identify him and stores it into localStorage (check if cookies better or nah) */
const api = axios.create({
  baseURL: BASE_URL
});

api.interceptors.request.use(
    (config: axios.AxiosRequestConfig) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: axios.AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  export default api;