import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

interface DecodedToken {
  exp: number;
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
    const { access } = response.data;
    localStorage.setItem(ACCESS_TOKEN, access);
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem(ACCESS_TOKEN);
    const csrfToken = getCookie('csrftoken');

    if (token && isTokenExpired(token)) {
      try {
        token = await refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
      }
    }

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error in response:', error.response?.data || error.message);
    throw error;
  }
);

api.register = async (email: string, username: string, password: string) => {
	try {
	  const response = await api.post('/api/user/register', { email, username, password });
	  return response.data;
	} catch (error: any) {
	  console.error('Registration error:', error.response?.data || error.message);
	  throw error;
	}
  };
  

api.login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/user/login/', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

api.logout = async () => {
  try {
    const response = await api.post('/api/user/logout/');
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    return response.data;
  } catch (error: any) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

api.getUserProfile = async () => {
  try {
    const response = await api.get('/api/user/profile/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

api.updateUserProfile = async (userData: any) => {
  try {
    const response = await api.put('/api/user/profile/update/', userData, {
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

api.deleteAccount = async () => {
  try {
    const response = await api.delete('/api/user/profile/delete/');
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting account:', error.response?.data || error.message);
    throw error;
  }
};

api.sendFriendRequest = async (friendId: string) => {
  try {
    const response = await api.post('/api/user/friends/request/', { friend_id: friendId });
    return response.data;
  } catch (error: any) {
    console.error('Error sending friend request:', error.response?.data || error.message);
    throw error;
  }
};

api.getFriendList = async () => {
  try {
    const response = await api.get('/api/user/friends/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching friend list:', error.response?.data || error.message);
    throw error;
  }
};

api.getMatchHistory = async () => {
  try {
    const response = await api.get('/api/user/match-history/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching match history:', error.response?.data || error.message);
    throw error;
  }
};

api.changeAvatar = async (avatarFile: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    const response = await api.put('/api/user/change-avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error changing avatar:', error.response?.data || error.message);
    throw error;
  }
};

export default api;