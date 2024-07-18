import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Gamepage.css'
import axios from 'axios';
import api from '../api';
import { useAuth } from "../context";
import { useTranslation } from 'react-i18next';

export default function GamePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const pongGameModeButtonPressed = async () => {
		// const requestData = {
		// 	player_limit: 1,
		// };

		// const requestOptions = {
		// 	headers: { 'Content-Type': 'application/json' },
		// };

		// api.post('pong-api/create-room', requestData, requestOptions)
		// 	.then((response) => {
		// 		console.log(response.data);
		// 		navigate('/pong/' + response.data.code);
		// 	})
		// 	.catch((error) => {
		// 		console.error('There was an error creating the room!', error);
		// 	});

		// try {
		// 	const res = await api.post('pong-api/create-room', requestData)

		// 	if (res.status >= 200 && res.status < 300) {
		// 		console.log("Registration successful.");
		// 		navigate('/login');
		// 	} else {
		// 		console.log("Registration failed.");
		// 	}
		// } catch (error) {
		// 	console.error("Error during registration:", error);
		// }

		// try {
		// 	const email = "vmalassi@gmmil.com"
		// 	const username = "vmalassi"
		// 	const password = "vmalassi"
		// 	const res = await api.post("/api/user/register", { email, username, password });
		// 	if (res.status >= 200 && res.status < 300) {
		// 		console.log("Registration successful.");
		// 		navigate('/login');
		// 	} else {
		// 		console.log("Registration failed.");
		// 	}
		// } catch (error) {
		// 	console.error("Error during registration:", error);
		// 	console.log('An error occurred during registration');

		// try {
		// 	const res = await api.post("/pong-api/create-room", requestData);
		// 	if (res.status >= 200 && res.status < 300) {
		// 		console.log("create r successful.");
		// 		navigate('/pong/' + res.data.code);
		// 	} else {
		// 		console.log("create r failed.");
		// 	}
		// } catch (error) {
		// 	console.error("Error during create r:", error);
		// 	console.log('An error occurred during create r');
		// }
		navigate('/pong');
	}


	return (
		<div id="play-screen2">
			<div className="button1" data-text="MODE PONG"
				title={t('gamepage.pongLower')}
				onClick={pongGameModeButtonPressed}>
				{t('gamepage.pong')}
			</div>
			<div className="button2" data-text="MODE OTHER"
				title={t('gamepage.otherGameLower')}>
				{t('gamepage.otherGame')}
			</div>
			<div className="button3" data-text="MODE TOURNAMENT"
				title={t('gamepage.tournamentLower')}>
				{t('gamepage.tournament')}
			</div>
		</div>
	);
};