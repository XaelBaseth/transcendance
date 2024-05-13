import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/SignUp.css';
import { useAuth } from '../context';


export default function SignUp() {
	
	const [username, setusername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const { signup } = useAuth();
	const [twoFA, setTwoFA] = useState(false);
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
		try {
		  await signup(email, username, password, confirmPassword, twoFA); // Use the signup method from useAuth
		  // Optionally, handle success message or navigation here
		} catch (error) {
		  console.error("Signup error:", error);
		  // Handle error appropriately
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
				<label>
					<input type="checkbox" checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} />
					Enable 2FA
				</label>
				<button  onClick={handleSignUp} id="signUp-btn">Sign Up</button>
				</form>
		    </div>
		</div>
  );
}