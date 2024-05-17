import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Gamepage.css'
import axios from 'axios';
import api from '../api';


export default function GamePage() {
	const navigate = useNavigate();

	const roomButtonPressed = () => {
		const requestOptions = {
			headers: { 'Content-Type': 'application/json' },
			data: {
				player_limit: 1,
			},
		};

		api.post('pong-api/create-room/', requestOptions)
			.then((response) => {
				console.log(response.data);
				navigate('/pong/' + response.data.code);
			});
	}

	return (
		<div id="play-screen2">
			<div className="button1" data-text="MODE PONG"
				title="Use the up and down arrows of your keyboard to play !"
				onClick={roomButtonPressed}>
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
}