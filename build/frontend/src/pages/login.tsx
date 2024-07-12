import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import '../styles/Login.css';

export default function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { login, successMsg, errorMsg } = useAuth();
	const navigate = useNavigate();

	const handleSignUp = () => {
		navigate("/signup");
	};

	const handleLogIn = async (e) => {
		e.preventDefault();
		try {
			await login(username, password);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="Login">
			<div className="background" />
			<form className="connection-form">

				<label className="login_label" htmlFor="username">Username</label>
				<input onChange={(event) => { setUsername(event.target.value) }} type="text" placeholder="Username" id="username" />

				<label className="login_label" htmlFor="password">Password</label>
				<input onChange={(event) => { setPassword(event.target.value) }} type="password" placeholder="Password" id="password" />
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