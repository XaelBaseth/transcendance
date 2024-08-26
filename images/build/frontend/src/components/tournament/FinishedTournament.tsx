import React from 'react';
import { useTournamentContext } from './provider/TournamentContextProvider';
import TournamentBrackets from './TournamentBrackets';
import "../../styles/tournament.css";

const FinishedTournament = () => {
    const { winner, restartTournament, tournamentBracket } = useTournamentContext();

    const handleRestart = () => {
        restartTournament();
    }

    return (
        <>
            <h1>Finished Tournament</h1>
            <p>Congratulation {winner}</p>
            <button onClick={handleRestart}>Restart</button>
            <TournamentBrackets tournamentBracket={tournamentBracket} />
        </>
    );
}

export default FinishedTournament;