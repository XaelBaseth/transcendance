import React from 'react';
import '../styles/Pong.css';
import PongLocal from '../components/PongGame/PongLocal';


const LocalPong = () => {

	return(
		<div>
			{/* Fond d'arrière-plan */}
			<div className="background" />

			{/* Terrain de football */}
			<div className="football-field">
				<PongLocal />
			</div>
			{/* Contenu du jeu (texte, etc.) */}
		</div>
	);
}

export default LocalPong;