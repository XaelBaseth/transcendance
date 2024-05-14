import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api';

interface OTPVerificationFormProps {
	email: string;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({ email }) => {
const [otp, setOtp] = useState('');
const [message, setMessage] = useState('');
const navigate = useNavigate();

const verifyOtp = async () => {
	try {
	const response = await api.post('/verify-otp/', { otp, email });
	if (response.data.status === 'success') {
		setMessage('OTP verified successfully!');
		navigate("/");
	} else {
		setMessage('Failed to verify OTP.');
	}
	} catch (error) {
	setMessage('An error occurred.');
	}
};

return (
	<div>
	<input
		type="text"
		value={otp}
		onChange={(e) => setOtp(e.target.value)}
		placeholder="Enter OTP"
	/>
	<button onClick={verifyOtp}>Verify OTP</button>
	{message && <p>{message}</p>}
	</div>
);
};

export default OTPVerificationForm;