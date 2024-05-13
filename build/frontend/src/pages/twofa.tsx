import React, { useState } from 'react';
import api from '../api';

interface OtpInputProps {
  onOtpSubmit: (otp: string) => void;
}

const TwoFA: React.FC = () => {
	const handleOtpSubmit = async (otp: string) => {
	  try {
		const response = await api.post('/api/verify-otp', {
		  otp,
		});
		console.log(response.data); // Handle the response
	  } catch (error) {
		console.error(error); // Handle errors
	  }
	};
  
	return (
	  <div>
		<h1>OTP Verification</h1>
		<OtpInput onOtpSubmit={handleOtpSubmit} />
	  </div>
	);
  };
  
  export default TwoFA;
  

const OtpInput: React.FC<OtpInputProps> = ({ onOtpSubmit }) => {
  const [otp, setOtp] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOtpSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={otp}
        onChange={handleChange}
        maxLength={6}
        placeholder="Enter OTP"
      />
      <button type="submit">Verify</button>
    </form>
  );
};