import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Gamepage.css'
import axios from 'axios';
import api from '../api';
import { useAuth } from "../context";


export default function GamePage() {
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
				title="Use the up and down arrows of your keyboard to play !"
				onClick={pongGameModeButtonPressed}>
				PONG MODE
			</div>
			<div className="button2" data-text="MODE OTHER"
				title="Come try out our /!\/!\PUT A NEW GAME/!\/!\ !">
				OTHER GAME MODE
			</div>
			<div className="button3" data-text="MODE TOURNAMENT"
				title="Compet in a tournament to see who is the best (it's you!)!">
				TOURNAMENT MODE
			</div>
		</div>
	);
};