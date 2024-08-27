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

	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			const decodedToken = jwtDecode(token) as User;
			setUser({ ...decodedToken });
		}
	}, []);

	useEffect(() => {
		if (location.pathname === '/login' || location.pathname === '/signup') {
			setErrorMsg("");
			setSuccessMsg("");
		}
	}, [location]);


	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
			const res = await api.post("/api/token/", { email, password });
			if (res.status >= 200 && res.status < 300) {
				const decodedToken = jwtDecode(res.data.access) as User;
				setUser({ ...decodedToken });
				setSuccessMsg(t('login.successMsg'));
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate("/");
			} else {
				setErrorMsg(t('login.errorMsg'));
			}
		} catch (error: any) {
			console.error(error);
			if (error.response && error.response.status === 401) {
				setErrorMsg(t('login.invalidCredentials')); 
			} else {
				setErrorMsg(t('login.unknownMsg'));
			}
		}
	};

	const signup = async (email: string, username: string, password: string, confirmPassword: string) => {
		if (email === "" || username === "" || password === "") {
			setErrorMsg(t('signup.fieldsNotEmpty'));
			return;
		}
		if (password !== confirmPassword) {
			setErrorMsg(t('signup.passwordMatch'));
			return;
		}
		if (password.length < 8) {
			setErrorMsg(t('signup.passwordTooShort'));
			return;
		}
	
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setErrorMsg(t('signup.invalidEmail'));
			return;
		}
	
		try {
			const res = await api.post("/api/user/register", { email, username, password });
			if (res.status >= 200 && res.status < 300) {
				setSuccessMsg(t('signup.successMsg'));
				navigate('/login');
			} else {
				const errorMessage = res.data.message || '';
	
				if (errorMessage.includes("already exists")) {
					setErrorMsg(t('signup.emailOrUsernameAlreadyUsed'));
				} else {
					setErrorMsg(t('signup.errorMsg'));
				}
			}
		} catch (error: any) {
			console.error("Error during registration:", error);
	
			if (error.response && error.response.status === 500) {
				const responseText = error.response.data;
	
				if (responseText && (responseText.includes("email") || responseText.includes("username"))) {
					setErrorMsg(t('signup.emailOrUsernameAlreadyUsed'));
				} else {
					setErrorMsg(t('signup.errorMsg'));
				}
			} else {
				setErrorMsg(t('signup.unknownMsg'));
			}
		}
	};
	
	const logout = () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);
		setUser(null);
		navigate('/login');
	};

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
