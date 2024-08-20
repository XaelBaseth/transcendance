import axios from "axios"
import { ACCESS_TOKEN } from "./constants";


axios.default.debug =  true;

const BASE_URL = import.meta.VITE_API_URL


/** Give the user a JWT to identify him and stores it into localStorage */
const api = axios.create({
  baseURL: BASE_URL
});

const token = localStorage.getItem(ACCESS_TOKEN);
const config = { headers: {} };
if (token) {
  config.headers = {
    Authorization: `Bearer ${token}`
  };
}

api.interceptors.response.use(
  (response: axios.AxiosResponse) => {
    return response;
  },
  (error: axios.AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN);
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

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

const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/api/user/', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};



export default 
{
  api,
  updateUserProfile
};