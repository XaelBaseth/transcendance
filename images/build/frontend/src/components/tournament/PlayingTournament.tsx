import React from 'react';
import PongLocal from '../PongGame/PongLocal';
import { useTournamentContext } from './provider/TournamentContextProvider';

const PlayingTournament = () => {
    const { manageGameResult, pointsToWin,getCurrentPlayers } = useTournamentContext();

    return (
        <div>
			{/* Fond d'arrière-plan */}
			<div className="background" />

			{/* Terrain de football */}
			<div className="football-field">
				<PongLocal isInTournament={true} manageGameResult={manageGameResult} pointsToWin={pointsToWin} players={getCurrentPlayers()} />
			</div>
			{/* Contenu du jeu (texte, etc.) */}
		</div>
    );
}

export default PlayingTournament;