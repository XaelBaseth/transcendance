import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from './types/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import api from './api';
import { useTranslation } from 'react-i18next';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider: React.FC = ({ children }) => {
	const { t } = useTranslation();
	const [user, setUser] = useState<User | null>(null);
	const [successMsg, setSuccessMsg] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const navigate = useNavigate();
	const location = useLocation();

	// Check if the user already has a JWT to stay connected.
	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			const decodedToken = jwtDecode(token) as User;
			setUser({ ...decodedToken });
		}
	}, []);

	// Clear the message for login and signup.
	useEffect(() => {
		if (location.pathname === '/login' || location.pathname === '/signup') {
			setErrorMsg("");
			setSuccessMsg("");
		}
	}, [location]);


	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Login
	const login = async (email: string, password: string) => {
		if (email === "" || password === "") {
			setErrorMsg(t('login.notEmpty'));
			return;
		}
		if (!emailRegex.test(email)) {
			setErrorMsg(t('login.invalidCredentials'));
			return;
		}
		try {
			const response = await api.login(email, password);
			const decodedToken = jwtDecode(response.access) as User;
			setUser({ ...decodedToken });
			setSuccessMsg(t('login.successMsg'));
			navigate("/");
		} catch (error: any) {
			console.error('Login error:', error);
			if (error.response && error.response.status === 401) {
				setErrorMsg(t('login.invalidCredentials'));
			} else {
				setErrorMsg(t('login.unknownMsg'));
			}
		}
	};

	// Sign up
	const signup = async (email: string, username: string, password: string) => {
		try {
		  await api.register(email, username, password);
		  setSuccessMsg(t('signup.successMsg'));
		  navigate('/login');
		} catch (error: any) {
		  console.error("Error during registration:", error);
		  if (error.response) {
			if (error.response.status === 404) {
			  setErrorMsg(t('signup.endpointNotFound'));
			} else if (error.response.data) {
			  setErrorMsg(JSON.stringify(error.response.data));
			} else {
			  setErrorMsg(t('signup.unknownError'));
			}
		  } else {
			setErrorMsg(t('signup.networkError'));
		  }
		}
	  };


	// Logout
	const logout = () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);
		setUser(null);
		navigate('/login');
	};

	// Update profile
	const updateProfile = async (username: string, email: string, currentPassword: string, newPassword: string, confirmNewPassword: string) => {
		if (newPassword !== confirmNewPassword) {
			setErrorMsg(t('updateProfile.passwordMatch'));
			return;
		}
		try {
			const res = await api.post("/api/user/update", { username, email, currentPassword, newPassword });
			if (res.status >= 200 && res.status < 300) {
				const updatedUser = { ...user, username, email } as User;
				setUser(updatedUser);
				setSuccessMsg(t('updateProfile.successMsg'));
				setErrorMsg("");
			} else {
				setErrorMsg(t('updateProfile.errorMsg'));
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			setErrorMsg(t('updateProfile.unknownMsg'));
		}
	};

	const value = {
		user,
		setUser,
		successMsg,
		errorMsg,
		login,
		signup,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};
