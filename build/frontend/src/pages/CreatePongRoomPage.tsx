import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CreatePongRoomPage = () => {
	const defaultProps = {
		player_limit: 1,
	};
	const [playerLimit, setPlayerLimit] = useState(defaultProps.player_limit);
	const navigate = useNavigate();

	const createRoomButtonPressed = async () => {
		const requestData = {
			player_limit: playerLimit,
		};

		try {
			const res = await api.post('/pong-api/create-room', requestData);
			if (res.status >= 200 && res.status < 300) {
				console.log("Room creation successful.");
				navigate('/pong/' + res.data.code);
			} else {
				console.log("Room creation failed.");
			}
		} catch (error) {
			console.error("Error during room creation:", error);
		}
	};

	return (
		<div id="play-screen2">
			<h1>Create Pong Room</h1>
			<p>Set the number of players :</p>
			<input type="number" placeholder="Player limit" value={playerLimit} onChange={(e) => setPlayerLimit(parseInt(e.target.value))} />
			<button onClick={createRoomButtonPressed}>Create</button>
			<button onClick={() => navigate('/pong')}>Back</button>
		</div>
	);
}

export default CreatePongRoomPage;