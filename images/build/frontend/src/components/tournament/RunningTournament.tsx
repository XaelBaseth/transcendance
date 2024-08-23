import React from "react";
import TournamentBrackets from "./TournamentBrackets";
import { useTournamentContext } from "./provider/TournamentContextProvider";

const RunningTournament = () => {
    const { tournamentBracket, playNextGame, getCurrentPlayers } = useTournamentContext();

    const handlePlayNextGame = () => {
        playNextGame();
    }

    const players = getCurrentPlayers();

    return (
        <>
            <p>Next game : {players[0].name} vs {players[1].name}</p>
            <button onClick={handlePlayNextGame}>Play Next Game</button>
            <TournamentBrackets tournamentBracket={tournamentBracket} />
        </>
    );
}

export default RunningTournament;