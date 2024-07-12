import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const JoinPongRoomPage = () => {
	const [roomCode, setRoomCode] = useState("");
	const navigate = useNavigate();

	const joinRoomButtonPressed = async () => {
		if (roomCode.length > 0) {
			const requestData = {
				code: roomCode,
			};
			try {
				const res = await api.post("/pong-api/join-room", requestData);
				if (res.status >= 200 && res.status < 300) {
					navigate('/pong/' + res.data.code);
				}
				else {
					console.error("join failed", res.data)
				}
			} catch (error) {
				console.error("Error during join:", error);
			}

		}
	};

	return (
		<div id="play-screen2">
			<h1>Join Pong Page</h1>
			<p>Enter a room code :</p>
			<input type="text" placeholder="Room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
			<button onClick={joinRoomButtonPressed}>Join</button>
			<button onClick={() => navigate('/pong')}>Back</button>
		</div>
	);
}

export default JoinPongRoomPage;