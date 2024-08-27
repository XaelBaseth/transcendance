import React, { useState } from "react";
import { useTournamentContext } from "./provider/TournamentContextProvider";
import { useTranslation } from "react-i18next";
import "../../styles/tournament.css";

const AddPlayerComponent = () => {
    const { t } = useTranslation();
    const { buildBracket, setPointsToWin, pointsToWin } = useTournamentContext();
    const [players, setPlayers] = useState<string[]>([]);
    const [playerName, setPlayerName] = useState("");
    const [addPlayerError, setAddPlayerError] = useState("");
    const [buildBracketError, setBuildBracketError] = useState("");

    const handleBuildBracket = () => {
        if (players.length < 3) {
            setBuildBracketError(t("tournament.minPlayersError")); // Utilisation de la clé de traduction
            return;
        }
        buildBracket(players);
    };

    const handleSetPlayerName = (name: string) => {
        setPlayerName(name);
        if (!players.includes(name.trim())) {
            setAddPlayerError("");
        }
    };

    const addPlayer = () => {
        const trimmedName = playerName.trim();
        if (trimmedName) {
           if (players.length >= 4) {
                setAddPlayerError(t("tournament.maxPlayersError"));
            } 
            else if (players.includes(trimmedName)) {
                setAddPlayerError(t("tournament.playerExistsError"));
            } 
            else {
                setPlayers([...players, trimmedName]);
                setPlayerName("");
                setBuildBracketError("");
            }
        }
    };

    return (
        <div className="tournament_BG">
            <div className="content">
                <input className="input_tournament"
                    type="text"
                    value={playerName}
                    onChange={(e) => handleSetPlayerName(e.target.value)}
                    placeholder={t("tournament.enterPlayerName")}
                />
                {addPlayerError !== "" && <p style={{ color: 'red' }}>{addPlayerError}</p>}
                <button className="button_add" onClick={addPlayer}>{t("tournament.addPlayerButton")}</button>
                <div>
                    <h2 className="players_list_title">{t("tournament.playersTitle")}</h2>
                    <ul>
                        {players.map((player) => (
                            <li className="players_list" key={player.toString()}>{player}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="points_title">{t("tournament.pointsPerGameTitle")}</h2>
                    <button className="button_points" onClick={() => setPointsToWin(1)} style={pointsToWin === 1 ? { backgroundColor: 'var(--pink)', color: 'var(--white)' } : {}}>1</button>
                    <button className="button_points" onClick={() => setPointsToWin(3)} style={pointsToWin === 3 ? { backgroundColor: 'var(--pink)', color: 'var(--white)' } : {}}>3</button>
                    <button className="button_points" onClick={() => setPointsToWin(5)} style={pointsToWin === 5 ? { backgroundColor: 'var(--pink)', color: 'var(--white)' } : {}}>5</button>
                </div>
                <br/>
                <button className="button_start_tournament" onClick={handleBuildBracket}>{t("tournament.startTournamentButton")}</button>
                {buildBracketError !== "" && <p style={{ color: 'red' }}>{buildBracketError}</p>}
            </div>
        </div>
    );
}

export default AddPlayerComponent;
