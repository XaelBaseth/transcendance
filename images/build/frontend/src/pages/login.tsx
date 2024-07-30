import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { useTranslation } from 'react-i18next';
import '../styles/Login.css';

export default function Login() {	
	const { t } = useTranslation();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [localError, setLocalError] = useState<string>("");
	const { login, successMsg, errorMsg } = useAuth();
	const navigate = useNavigate();

	const handleSignUp = () => {
		navigate("/signup");
	};

	const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email || !password) {
			setLocalError(t('login.fillAllFields'));
			return;
		}
		try {
			await login(email, password);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="Login">
			<div className="background" />
			<form className="connection-form" onSubmit={handleLogIn}>
				<label className="login_label" htmlFor="email">{t('login.email')}</label>
				<input 
					onChange={(event) => { setEmail(event.target.value); setLocalError(""); }} 
					type="email" 
					placeholder={t('login.email')} 
					id="email" 
					value={email}
				/>

				<label className="login_label" htmlFor="password">{t('login.password')}</label>
				<input 
					onChange={(event) => { setPassword(event.target.value); setLocalError(""); }} 
					type="password" 
					placeholder={t('login.password')} 
					id="password" 
					value={password}
				/>

				{successMsg && (
					<div className="login__alert_ok">
						<h6>{successMsg}</h6>
					</div>
				)}

				{(errorMsg || localError) && (
					<div className="login__alert_err">
						<h6>{errorMsg || localError}</h6>
					</div>
				)}

				<button type="submit" id="login-btn">{t('login.login')}</button>

				<div className="social">
					<div className="_42auth">
						<button id='_42auth_btn'>{t('login.login42')}</button>
					</div>
					<div className="signup">
						<button type="button" onClick={handleSignUp} id="signup_btn">{t('login.signup')}</button>
					</div>
				</div>
			</form>
		</div>
	);
}
