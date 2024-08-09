import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import api from "../api";

const PongHomePage = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();


	const joinMatchMaking = async (player_limit: number) => {
		try {
			const requestData = {
				player_limit: player_limit,
			};

			const res = await api.post('/pong-api/join-matchmaking', requestData);
			if (res.status >= 200 && res.status < 300) {
				const params = new URLSearchParams({ player_limit: res.data.player_limit}).toString();
				navigate(`/pong/${res.data.code}?${params}`);
			} else {
				console.error("MatchMaking failed.", res.data);
			}
		} catch (error) {
			console.error("Error during MatchMaking:", error);
		}
	}
	

	return (
		<div id="play-screen2">
			<h1>{t('pong.pongHome')}</h1>
			<br /> <br />
			<button onClick={()=> joinMatchMaking(2)}>2 Players Pong</button>
			<br /> <br />
			<button onClick={()=> joinMatchMaking(4)}>4 Players Pong</button>
		</div>
	);
}

export default PongHomePage;