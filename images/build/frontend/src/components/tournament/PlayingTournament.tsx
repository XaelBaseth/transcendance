import React from 'react';
import PongLocal from '../PongGame/PongLocal';
import { useTournamentContext } from './provider/TournamentContextProvider';
import "../../styles/tournament.css";
import "../../styles/Pong.css";

const PlayingTournament = () => {
    const { manageGameResult, pointsToWin,getCurrentPlayers } = useTournamentContext();

    return (
        <div>
			<div className="tournament" />

			<div className="football-field">
				<PongLocal isInTournament={true} manageGameResult={manageGameResult} pointsToWin={pointsToWin} players={getCurrentPlayers()} />
			</div>
		</div>
    );
}

export default PlayingTournament;