import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../api/APIHandler';
import './signUp.css';

export default function SignUp() {
	
	const [username, setusername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [successMsg, setSuccessMsg] = useState<string>("");
	const navigate = useNavigate();

    const handleSignUp = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		
		try {
			await signUp(username, password);
			setSuccessMsg("Successfully signed up! ")
			setErrorMsg('');
			setTimeout(() => {
				navigate('/settings');
			}, 2000);
		} catch (error) {
			setSuccessMsg('');
			setErrorMsg("A user with this username already exists");
		}
	}
	return (
		<div className="signUp">
			<div className="background" />
			<div className="signUp_label">
                <h1 className="title">Titre de votre page</h1>
				<form  className="signUp-form" onSubmit={handleSignUp}>
				<label className="signUp_label" htmlFor="username">Username</label>
				<input onChange={(event) => {setusername(event.target.value)}} type="text" placeholder="username" id="username" />

				<label  className="signUp_label" htmlFor="password">Password</label>
				<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password" id="password" />
				<label  className="signUp_label" htmlFor="password">Confirm new password</label>
				<input onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="Password" id="password" />
			
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
				<button onClick={handleSignUp} id="signUp-btn">Log In</button>
				</form>
		</div>
		</div>
  );
}