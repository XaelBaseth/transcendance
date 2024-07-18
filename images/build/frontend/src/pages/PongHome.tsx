import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const PongHomePage = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();


	const createRoomButtonPressed = () => {
		navigate("/pong-create");
	};

	const joinRoomButtonPressed = () => {
		navigate("/pong-join");
	};

	return (
		<div id="play-screen2">
			<h1>{t('pong.pongHome')}</h1>
			<button onClick={joinRoomButtonPressed}>{t('pong.joinRoom')}</button>
			<br /> <br />
			<button onClick={createRoomButtonPressed}>{t('pong.createRoom')}</button>
		</div>
	);
}

export default PongHomePage;