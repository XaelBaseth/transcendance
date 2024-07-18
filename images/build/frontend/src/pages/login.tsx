import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { useTranslation } from 'react-i18next';
import '../styles/Login.css';

export default function Login() {	
	const { t } = useTranslation();

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
			<form  className="connection-form">

			<label className="login_label" htmlFor="username">{t('login.username')}</label>
			<input onChange={(event) => {setUsername(event.target.value)}} type="text" placeholder={t('login.username')} id="username" />

			<label  className="login_label" htmlFor="password">{t('login.password')}</label>
			<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder={t('login.password')} id="password" />
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
			<button onClick={handleLogIn} id="login-btn">{t('login.login')}</button>
			<div className="social">
                <div className="_42auth">
					<button id='_42auth_btn'>{t('login.login42')}</button>
				</div>
				<div className="signup">
					<button onClick={handleSignUp} id="signup_btn">{t('login.signup')}</button>
				</div>
			</div>
			</form>
		</div>
  );
}