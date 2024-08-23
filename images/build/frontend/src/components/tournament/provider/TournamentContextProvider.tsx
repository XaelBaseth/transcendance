import React, { createContext, ReactNode, useContext } from "react";
import useTournament, { TournamentState } from "./useTournament";

interface TournamentContextProps {
    tournamentBracket: any[];
    tournamentState: TournamentState,
    winner: string | null;
    pointsToWin : number;
    currentMatchId: number | null;
    setPointsToWin: (points: number) => void;
    manageGameResult: (winnerSide: string, score: {left: number, right: number}) => void;
    buildBracket: (players: string[]) => void;
    playNextGame: () => void;
    restartTournament: () => void;
    getCurrentPlayers: () => Participant[];
}

export interface Participant {
    id: any;
    resultText: string | null;
    isWinner: boolean | null;
    status: string | null;
    name: string | null;
    picture: string | null;
}

const TournamentContext = createContext<TournamentContextProps | undefined>(undefined);

export const TournamentContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const {
        tournamentBracket,
        tournamentState,
        winner,
        pointsToWin,
        currentMatchId,
        setPointsToWin,
        manageGameResult,
        buildBracket,
        playNextGame,
        restartTournament,
        getCurrentPlayers,
    } = useTournament();
    
    return <TournamentContext.Provider value={{
        tournamentBracket,
        tournamentState,
        winner,
        pointsToWin,
        currentMatchId,
        setPointsToWin,
        manageGameResult,
        buildBracket,
        playNextGame,
        restartTournament,
        getCurrentPlayers,
    }}>{children}</TournamentContext.Provider>;
};

export const useTournamentContext = () => {
    const context = useContext(TournamentContext);
    if (!context) {
        throw new Error("useTournamentContext must be used within a TournamentContextProvider");
    }
    return context;
};