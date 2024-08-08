import React from 'react';
import '../styles/Pong.css';
import PongGame from '../components/PongGame/PongGame';
import { useLocation } from 'react-router-dom';
import FourPlayersPongGame from '../components/PongGame/FourPlayersPongGame';


const Pong = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const player_limit = parseInt(queryParams.get('player_limit') || '0');

	return(
		<div>
			{/* Fond d'arrière-plan */}
			<div className="background" />

			{/* Terrain de football */}
			<div className="football-field">
				{player_limit < 3 ? <PongGame /> : <FourPlayersPongGame />}
			</div>
			{/* Contenu du jeu (texte, etc.) */}
		</div>
	);
}

export default Pong;