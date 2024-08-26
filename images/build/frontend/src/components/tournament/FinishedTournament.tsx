import React from 'react';
import { useTournamentContext } from './provider/TournamentContextProvider';
import TournamentBrackets from './TournamentBrackets';
import { useTranslation } from 'react-i18next';
import "../../styles/tournament.css";

const FinishedTournament = () => {
    const { winner, restartTournament, tournamentBracket } = useTournamentContext();
    const { t } = useTranslation();

    const handleRestart = () => {
        restartTournament();
    }

    return (
        <>
            <h1>{t('finishedTournament.title')}</h1>
            <p>{t('finishedTournament.congratulation', { winner })}</p>
            <button onClick={handleRestart}>{t('finishedTournament.restartButton')}</button>
            <TournamentBrackets tournamentBracket={tournamentBracket} />
        </>
    );
}

export default FinishedTournament;