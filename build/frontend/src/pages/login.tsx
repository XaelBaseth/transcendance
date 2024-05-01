import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import '../styles/Login.css';

export default function Login({ setLoggedIn }: { 
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>}) {
	
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [successMsg, setSuccessMsg] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

    const handleSignUp = () => {
		navigate("/signup");
	};

	const handleLogIn = async (e) => {
		setLoading(true);
		e.preventDefault();

		try {
			console.log("Request Data:", { username, password });

			const res = await api.post("/api/token/", {username, password})
			if (res.status >= 200 && res.status < 300) {
				setSuccessMsg("Successfully signed up!")
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate("/");
			} else {
				setErrorMsg("Invalid username or password. Please try again.");
			}
		} catch (error) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log("Error Response:", error.response.data);
				console.log("Error Status:", error.response.status);
				console.log("Error Headers:", error.response.headers);
				alert("Error Message: " + error.response.data.error);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser 
				// and an instance of http.ClientRequest in node.js
				console.log("Error Request:", error.request);
				alert("No response received");
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', error.message);
				alert("Error Message: " + error.message);
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="Login">
			<div className="background" />
			<form  className="connection-form">

			<label className="login_label" htmlFor="username">Username</label>
			<input onChange={(event) => {setUsername(event.target.value)}} type="text" placeholder="Username" id="username" />

			<label  className="login_label" htmlFor="password">Password</label>
			<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password" id="password" />
			<>
			{
				successMsg && 
				<div className="login__alert_ok">
					<h6>{successMsg}</h6>
				</div>
			}
			</>
			<>
			{
				errorMsg && 
				<div className="login__alert_err">
					<h6>{errorMsg}</h6>
				</div>
			}
			</>
			{loading}
			<button onClick={handleLogIn} id="login-btn">Log In</button>
			<div className="social">
                <div className="_42auth">
					<button id='_42auth_btn'>Log In with 42</button>
				</div>
				<div className="signup">
					<button onClick={handleSignUp} id="signup_btn">Sign up</button>
				</div>
			</div>
			</form>
		</div>
  );
}