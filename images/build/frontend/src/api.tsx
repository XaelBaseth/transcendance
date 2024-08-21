import axios from "axios"
import { ACCESS_TOKEN } from "./constants";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.default.debug =  true;

const BASE_URL = import.meta.VITE_API_URL

/** Give the user a JWT to identify him and stores it into localStorage (check if cookies better or nah) */
const api = axios.create({
  baseURL: BASE_URL
});

// api.interceptors.request.use(
//     (config: axios.AxiosRequestConfig) => {
//       const token = localStorage.getItem(ACCESS_TOKEN);
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error: axios.AxiosError) => {
//       return Promise.reject(error);
//     }
// );

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

// api.updateUserProfile = async (userData) => {
// 	try {
// 		const response = await api.put('/api/update-profile/', userData);
// 		return response.data;
// 	} catch (error) {
// 		console.error('Error updating user profile:', error);
// 		throw error;
// 	}
// };

api.updateUserProfile = async (userData) => {
	try {
	  const response = await api.put('/api/update-profile/', userData, {
		headers: {
		  'Content-Type': 'application/json',
		},
	  });
	  return response.data;
	} catch (error) {
	  console.error('Error updating user profile:', error.response?.data || error.message);
	  throw error;
	}
  };
export default api;

