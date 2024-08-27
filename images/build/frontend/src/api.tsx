import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || ''
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export const deleteAccount = async () => {
	try {
		axios.get('/api/user/delete-account/');
	} catch (error) {
		console.error('Error deleting account:', error);
		throw error;
	}
};

export default api;