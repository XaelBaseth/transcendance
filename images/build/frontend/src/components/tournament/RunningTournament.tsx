import React from "react";
import TournamentBrackets from "./TournamentBrackets";
import { useTournamentContext } from "./provider/TournamentContextProvider";
import "../../styles/tournament.css";

const RunningTournament = () => {
    const { tournamentBracket, playNextGame, getCurrentPlayers } = useTournamentContext();

    const handlePlayNextGame = () => {
        playNextGame();
    }

    const players = getCurrentPlayers();

    return (
        <>
            <div>
                <p className='tournament_title'>Next game : {players[0].name} vs {players[1].name}</p>
            </div>
            <div>
                <button className="button_next_game" onClick={handlePlayNextGame}>Play Next Game</button>
            </div>
            
            <div className="scrollable-container">
                <TournamentBrackets tournamentBracket={tournamentBracket} />
            </div>
        </>
    );
}

export default RunningTournament;