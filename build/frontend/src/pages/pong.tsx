import React from 'react';
import '../styles/Pong.css';
import PongGame from '../components/PongGame/PongGame';
import PongChat from '../components/PongGame/GameChat';

const Pong = () => {
	return (
		<div>
			{/* Fond d'arrière-plan */}
			<div className="background" />

			{/* Terrain de football */}
			<div className="football-field">
				<PongGame />
				<PongChat />
			</div>


			{/* Contenu du jeu (texte, etc.) */}
		</div>
	);
}

export default Pong;