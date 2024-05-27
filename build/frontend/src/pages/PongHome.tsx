import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PongHomePage = () => {
	const navigate = useNavigate();


	const createRoomButtonPressed = () => {
		navigate("/pong-create");
	};

	const joinRoomButtonPressed = () => {
		navigate("/pong-join");
	};

	return (
		<div id="play-screen2">
			<h1>Pong Home</h1>
			<button onClick={joinRoomButtonPressed}>Join a Room</button>
			<br /> <br />
			<button onClick={createRoomButtonPressed}>Create A Room</button>
		</div>
	);
}

export default PongHomePage;