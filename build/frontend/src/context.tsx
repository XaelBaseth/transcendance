import React, { createContext, useContext, useState } from 'react';
import { User, AuthContextType } from './types/auth';
import { useNavigate } from 'react-router-dom';
import api from './api';
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
	console.log("This is the AuthProvider!");
	const [user, setUser] = useState<User | null>(null);
	const [successMsg, setSuccessMsg] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const navigate = useNavigate();

	const value = {	
	user,	
	setUser,	
	login: async (username: string, password: string) => {
		try {	
			const res = await api.post("/api/token/", {username, password});
			if (res.status >= 200 && res.status < 300) {
			setUser({...res.data });
			setSuccessMsg("Successfully logged in!")
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate("/");	
			} else {	
				throw new Error("Invalid username or password.");
			}	
		} catch (error) {	
			console.error(error);
			// Handle error appropriately
		}
		},
	signup: async (email: string, username: string, password: string, confirmPassword: string) => {
		if (password !== confirmPassword) {
			setErrorMsg("Passwords do not match.");
			return;
		}
		try {
			const res = await api.post("/api/user/register", { email, username, password });
			if (res.status >= 200 && res.status < 300) {
				setSuccessMsg("Registration successful.");
				navigate('/login');
			} else {
				setErrorMsg("Registration failed.");
			}
		} catch (error) {
			console.error("Error during registration:", error);
			setErrorMsg(`An error occurred during registration: ${error}`);
		}
		},
	logout: () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);

		setUser(null);
		navigate('/login');
		},
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};