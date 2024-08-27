import React from 'react';
import '../styles/Pong.css';
import PongLocal from '../components/PongGame/PongLocal';


const LocalPongPage = () => {

	return(
		<div>
			<div className="background" />
			<div className="football-field">
				<PongLocal />
			</div>
		</div>
	);
}

export default LocalPongPage;