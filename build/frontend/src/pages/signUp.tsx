import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/SignUp.css';


export default function SignUp() {
	
	const [username, setusername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [successMsg, setSuccessMsg] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();


	const handleSignUp = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (password !== confirmPassword){
			setErrorMsg("Passwords do not match.");
			return;
		}
		setLoading(true);

        try {
            const res = await api.post("/api/user/register", { email, username, password });

			console.log("This is your object sent: ", { email, username, password })
            if (res.status >= 200 && res.status < 300) {
                setSuccessMsg("Registration successful.");
                navigate("/login");
            } else {
                setErrorMsg("Registration failed.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setErrorMsg("An error occurred during registration: ", error);
        } finally {
            setLoading(false);
        }
    };

	return (
		<div className="signUp">
			<div className="background" />
			<div className="SignUp_tittle">
                <h1 className="signUp__title">SignUp</h1>
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
				{loading}
				<button  onClick={handleSignUp} id="signUp-btn">Sign Up</button>
				</form>
		    </div>
		</div>
  );
}