import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from './types/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
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
	const [user, setUser] = useState<User | null>(null);
	const [successMsg, setSuccessMsg] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [showOtpForm, setShowOtpForm] = useState(false);
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

	const login = async (username: string, password: string) => {
		try {
			const authRes = await api.post("/api/token/", { username, password });
			if (authRes.status >= 200 && authRes.status < 300) {
				// Check if 2FA is enabled for the user
				if (authRes.data.two_fa) {
					// 2FA is enabled, prompt for OTP
					const otp = window.prompt("Please enter the OTP sent to your email:");
					if (otp) {
						// Verify the OTP
						const otpVerifyRes = await api.post("/api/verify-otp", { otp, email: authRes.data.email });
						if (otpVerifyRes.status >= 200 && otpVerifyRes.status < 300) {
							// OTP verified successfully, proceed with login
							setUser({...authRes.data });
							setSuccessMsg("Successfully logged in!");
							localStorage.setItem(ACCESS_TOKEN, authRes.data.access);
							localStorage.setItem(REFRESH_TOKEN, authRes.data.refresh);
							navigate("/");
						} else {
							throw new Error("Invalid OTP.");
						}
					} else {
						throw new Error("No OTP entered.");
					}
				} else {
					// 2FA is not enabled, proceed with normal login
					setUser({...authRes.data });
					setSuccessMsg("Successfully logged in!");
					localStorage.setItem(ACCESS_TOKEN, authRes.data.access);
					localStorage.setItem(REFRESH_TOKEN, authRes.data.refresh);
					navigate("/");
				}
			} else {
				throw new Error("Invalid username or password.");
			}
		} catch (error) {
			console.error(error);
			// Handle error appropriately
		}
	};

	const signup = async (username: string, password: string, email: string, two_fa: boolean) => {
		try {
			const res = await api.post("/api/user/register", { email, username, password, two_fa });
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
	};

	const logout = () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);

		setUser(null);
		navigate('/login');
	};

	const value = {	
		user,	
		setUser,
		successMsg,
		errorMsg,	
		login,
		signup,
		logout,
		showOtpForm,
		setShowOtpForm,
		};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};
