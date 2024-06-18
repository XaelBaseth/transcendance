import React, { useState } from 'react';
import { useAuth } from '../context';
import { useTranslation } from 'react-i18next';
import '../styles/SignUp.css';

export default function SignUp() {
	const { t } = useTranslation();

	const [username, setusername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const { signup, successMsg, errorMsg } = useAuth();

	const handleSignUp = async (e) => {
		e.preventDefault();
		try {
			await signup(email, username, password, confirmPassword);
		} catch (error) {
			console.error(error);
		}
	  };

	return (
		<div className="signUp">
			<div className="background" />
			<div className="SignUp_tittle">
                <h1 className="signUp__title">SignUp</h1>
				<form  className="signUp-form">

				
				<label className="signUp_label" htmlFor="email">{t('signup.email')}</label>
				<input onChange={(event) => {setEmail(event.target.value)}} type="text" placeholder={t('signup.email')} id="email" />

				<label className="signUp_label" htmlFor="username">{t('signup.username')}</label>
				<input onChange={(event) => {setusername(event.target.value)}} type="text" placeholder={t('signup.username')} id="username" />

				<label  className="signUp_label" htmlFor="password">{t('signup.password')}</label>
				<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder={t('signup.password')} id="password" />
				<label  className="signUp_label" htmlFor="password">{t('signup.confirmPassword')}</label>
				<input onChange={(event) => {setConfirmPassword(event.target.value)}} type="password" placeholder={t('signup.confirmPassword')} id="password_conf" />
			
				<>
				{
					successMsg && 
					<div className="signUp__alert_ok">
						<h6>{successMsg}</h6>
					</div>
				}
				</>
				<>
				{
					errorMsg && 
					<div className="signUp__alert_err">
						<h6>{errorMsg}</h6>
					</div>
				}
				</>
				<button  onClick={handleSignUp} id="signUp-btn">Sign Up</button>
				</form>
		    </div>
		</div>
  );
}