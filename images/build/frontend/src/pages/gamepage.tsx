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