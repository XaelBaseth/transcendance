import React from 'react';
import '../styles/Pong.css';
import PongGame from '../components/PongGame/PongGame';

const Pong = () => {
	return (
		<div>
			{/* Fond d'arrière-plan */}
			<div className="background" />

			{/* Terrain de football */}
			<div className="football-field">
				<PongGame />
			</div>


			{/* Contenu du jeu (texte, etc.) */}
		</div>
	);
}

export default Pong;