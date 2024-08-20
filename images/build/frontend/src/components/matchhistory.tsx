import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';

export function MatchHistory() {
    const { t } = useTranslation();
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchMatchHistory();
    }, []);

    const fetchMatchHistory = async () => {
        try {
            const response = await api.get('/api/user/match-history');
            setMatches(response.data);
        } catch (error) {
            console.error("Failed to fetch match history", error);
        }
    };

    return (
        <div className="match-history">
            <h2>{t('matchHistory.title')}</h2>
            <ul>
                {matches.map(match => (
                    <li key={match.id}>
                        {match.player1.username} vs {match.player2.username} - 
                        {t('matchHistory.winner')}: {match.winner.username} - 
                        {t('matchHistory.score')}: {match.score} - 
                        {t('matchHistory.date')}: {new Date(match.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}