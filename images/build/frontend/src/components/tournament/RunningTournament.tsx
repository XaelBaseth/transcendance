import React from "react";
import TournamentBrackets from "./TournamentBrackets";
import { useTournamentContext } from "./provider/TournamentContextProvider";
import { useTranslation } from 'react-i18next';
import "../../styles/tournament.css";

const RunningTournament = () => {
    const { tournamentBracket, playNextGame, getCurrentPlayers } = useTournamentContext();
    const { t } = useTranslation();

    const handlePlayNextGame = () => {
        playNextGame();
    }

    const players = getCurrentPlayers();

    return (
        <>
            <div>
                <p className='tournament_title'>
                    {t('runningTournament.nextGame', { player1: players[0].name, player2: players[1].name })}
                </p>
            </div>
            <div>
                <button className="button_next_game" onClick={handlePlayNextGame}>
                    {t('runningTournament.playNextGame')}
                </button>
            </div>
            
            <div className="scrollable-container">
                <TournamentBrackets tournamentBracket={tournamentBracket} />
            </div>
        </>
    );
}

export default RunningTournament;
