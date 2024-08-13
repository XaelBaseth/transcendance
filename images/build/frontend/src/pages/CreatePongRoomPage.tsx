import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useTranslation } from 'react-i18next';

const CreatePongRoomPage = () => {
	const { t } = useTranslation();
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
				const params = new URLSearchParams({ player_limit: res.data.player_limit}).toString();
				navigate(`/pong/${res.data.code}?${params}`);
			} else {
				console.error("Room creation failed.", res.data);
			}
		} catch (error) {
			console.error("Error during room creation:", error);
		}
	};

	return (
		<div id="play-screen2">
			<h1>{t('pong.createRoom')}</h1>
			<p>{t('pong.numberPlayers')}</p>
			<input type="number" placeholder={t('pong.limitPlayer')} value={playerLimit} min={1} max={4} onChange={(e) => setPlayerLimit(parseInt(e.target.value))} />
			<button onClick={createRoomButtonPressed}>{t('pong.create')}</button>
			<button onClick={() => navigate('/pong')}>{t('pong.back')}</button>
		</div>
	);
}

export default CreatePongRoomPage;