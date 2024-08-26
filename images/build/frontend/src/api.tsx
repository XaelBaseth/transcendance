import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // This is important for sending cookies
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const csrfToken = getCookie('csrftoken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    throw error;
  }
);

// Example of how to handle errors without using Promise
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error in response:', error.response?.data || error.message);
    throw error;
  }
);

// Example of how to make an API call without using Promise
api.login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/user/login', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem('refreshToken', refresh);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

api.updateUserProfile = async (userData: any) => {
	try {
	  const response = await api.put('/api/update-profile/', userData, {
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
	  return response.data;
	} catch (error: any) {
	  console.error('Error updating user profile:', error.response?.data || error.message);
	  throw error;
	}
};
export default api;
