import axios from "axios"
import { ACCESS_TOKEN } from "./constants";
import { AxiosRequestConfig } from "axios";
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_API_URL || '';

/** Give the user a JWT to identify him and stores it into localStorage (check if cookies better or nah) */
const api = axios.create({
  baseURL: BASE_URL
});

api.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: any) => {
		console.error('Error with request:', error.response?.data || error.message);
		return console.error('Error with request:', error.response?.data || error.message);
	}
);

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
