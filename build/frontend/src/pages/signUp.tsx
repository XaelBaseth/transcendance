import React, { useState } from 'react';
import { useAuth } from '../context';
import OTPVerificationForm from './twofa';
import '../styles/SignUp.css';

export default function SignUp() {
	const [username, setusername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [twoFA, setTwoFA] = useState(false);
	const { signup, successMsg, errorMsg, showOtpForm } = useAuth();

	const handleSignUp = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			errorMsg("Passwords do not match.");
			return;
		}
		try {
			await signup(email, username, password, confirmPassword, twoFA);
		} catch (error) {
			console.error(error);
		}
	  };

	return (
		<div className="signUp">
			<div className="background" />
			<div className="signUp_label">
				<h1 className="title">SignUp</h1>
				<form  className="signUp-form">		
				<label className="signUp_label" htmlFor="email">Email</label>
				<input onChange={(event) => {setEmail(event.target.value)}} type="text" placeholder="email" id="email" />

				<label className="signUp_label" htmlFor="username">Username</label>
				<input onChange={(event) => {setusername(event.target.value)}} type="text" placeholder="username" id="username" />

				<label  className="signUp_label" htmlFor="password">Password</label>
				<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password" id="password" />
				<label  className="signUp_label" htmlFor="password">Confirm new password</label>
				<input onChange={(event) => {setConfirmPassword(event.target.value)}} type="password" placeholder="Password" id="password_conf" />
			
				<label className="signUp_label" htmlFor="two_fa">Enable 2FA</label>
				<input type="checkbox" checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} id="two_fa" />
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
				{showOtpForm && <OTPVerificationForm email={email} />}
				</form>
		    </div>
		</div>
  );
}