import axios from "axios"
import { ACCESS_TOKEN } from "./constants";
import { AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_API_URL || '';

/** Give the user a JWT to identify him and stores it into localStorage (check if cookies better or nah) */
const api = axios.create({
	baseURL: BASE_URL
});

interface DecodedToken {
	exp: number;
	// Add other properties from your token payload
}

function isTokenExpired(token: string): boolean {
	try {
		const decoded = jwtDecode<DecodedToken>(token);
		if (decoded.exp < Date.now() / 1000) {
			return true;
		}
		return false;
	} catch (error) {
		return true;
	}
}

api.login = async (email: string, password: string) => {
	try {
		const response = await api.post('/api/token/', { email, password });
		const { access, refresh } = response.data;
		localStorage.setItem('accessToken', access);
		localStorage.setItem('refreshToken', refresh);
		return response.data;
	} catch (error: any) {
		console.error('Login error:', error.response?.data || error.message);
		throw error;
	}
};

async function refreshToken() {
	try {
		const refreshToken = localStorage.getItem('refreshToken');
		const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
		const { access } = response.data;
		localStorage.setItem('accessToken', access);
		return access;
	} catch (error) {
		console.error('Error refreshing token:', error);
		// Handle refresh error (e.g., redirect to login)
		throw error;
	}
}

function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
	return null;
}

api.interceptors.request.use(
	async (config) => {
		if (!config.url?.includes('/api/token/')) { // Skip for login requests
			let token = localStorage.getItem('accessToken');
			if (token && isTokenExpired(token)) {
				try {
					token = await refreshToken();
				} catch (error) {
					// Handle refresh error (e.g., redirect to login)
					throw error;
				}
			}
			if (token) {
				config.headers['Authorization'] = `Bearer ${token}`;
			}
		}

		// Add CSRF token
		const csrftoken = getCookie('csrftoken');
		if (csrftoken) {
			config.headers['X-CSRFToken'] = csrftoken;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

api.updateUserProfile = async (userData: any) => {
	try {
		const response = await api.put('/api/user/update-profile', userData, {
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

api.register = async (email: string, username: string, password: string) => {
	try {
		const response = await api.post('/api/user/register', { email, username, password });
		return response.data;
	} catch (error: any) {
		console.error('Registration error:', error.response?.data || error.message);
		throw error;
	}
};

export default api;




