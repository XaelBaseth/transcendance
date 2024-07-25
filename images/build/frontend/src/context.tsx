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

	//check if the user already has a JWT to stay connected.
	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			const decodedToken = jwtDecode(token);
			setUser({ ...decodedToken.data });
		}
	}, []);

	//clear the message for login and signup.
	useEffect(() => {
		if (location.pathname === '/login' || location.pathname === '/signup'){
			setErrorMsg("");
			setSuccessMsg("");
		}
	}, [location]);

	//Print statement
	useEffect(() => {
		if (user) {
		  console.log("Updated User data: ", user.username);
		}
	  }, [user]);
	//end of print statement

	//login
	const login = async (username: string, password: string) => {
		if (username === "" || password === "") {
			setErrorMsg(t('login.notEmpty'));
			return;
		}
		try {
			const res = await api.post("/api/token/", {username, password});
			if (res.status >= 200 && res.status < 300) {
				setUser({...res.data });
				setSuccessMsg(t('login.successMsg'))
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate("/");	
			} else {	
				setErrorMsg(t('login.errorMsg'));
			}	
		} catch (error) {	
			console.error(error);
			setErrorMsg(t('login.unknownMsg'))
		}
	};

	//signUp
	const signup = async (email: string, username: string, password: string, confirmPassword: string)  => {
		if (password !== confirmPassword) {
			setErrorMsg(t('signup.passwordMatch'));
			return;
		}
		try {
			const res = await api.post("/api/user/register", { email, username, password });
			if (res.status >= 200 && res.status < 300) {
				setSuccessMsg(t('signup.succesMsg'));
				navigate('/login');
			} else {
				setErrorMsg(t('signup.errorMsg'));
			}
		} catch (error) {
			console.error("Error during registration:", error);
			setErrorMsg(t('signup.unknownMsg'));
		}
	};

	//logout
	const logout = () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);

		setUser(null);
		navigate('/login');
	};

	const login_with_42 = async () => {
		try {
			// Example payload, adjust according to your API's requirements
			const payload = { code: "your_authorization_code_here" };
			const res = await api.post("/api/user/url42", payload);
			if (res.status >= 200 && res.status < 300) {
				setUser({...res.data});
				setSuccessMsg(t('login.successMsg'));
				// Assuming the response contains tokens
				//localStorage.setItem(ACCESS_TOKEN, res.data.access);
				//localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				//navigate("/");
			} else {    
				setErrorMsg(t('login.errorMsg'));
			}   
		} catch (error) {    
			console.error(error);
			setErrorMsg(t('login.unknownMsg'));
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
	login_with_42,
	};
	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};