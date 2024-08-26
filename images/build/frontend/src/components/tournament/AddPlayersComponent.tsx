import React from "react";
import { useState } from "react";
import { useTournamentContext } from "./provider/TournamentContextProvider";
import { useTranslation } from "react-i18next"; // Importation de useTranslation
import "../../styles/tournament.css";

const AddPlayerComponent = () => {
    const { t } = useTranslation(); // Initialisation de useTranslation
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
            // check if playerName already exists
            if (players.includes(trimmedName)) {
                setAddPlayerError(t("tournament.playerExistsError")); // Utilisation de la clé de traduction
            } else {
                setPlayers([...players, trimmedName]);
                setPlayerName("");
                setBuildBracketError("");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={playerName}
                onChange={(e) => handleSetPlayerName(e.target.value)}
                placeholder={t("tournament.enterPlayerName")} // Utilisation de la clé de traduction
            />
            {addPlayerError !== "" && <p style={{ color: 'red' }}>{addPlayerError}</p>}
            <button onClick={addPlayer}>{t("tournament.addPlayerButton")}</button> {/* Utilisation de la clé de traduction */}
            <div>
                <h2>{t("tournament.playersTitle")}</h2>
                <ul>
                    {players.map((player) => (
                        <li key={player.toString()}>{player}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>{t("tournament.pointsPerGameTitle")}</h2>
                <button onClick={() => setPointsToWin(1)} style={pointsToWin === 1 ? { backgroundColor: 'blue', color: 'white' } : {}}>{t("tournament.pointsOption", { count: 1 })}</button> {/* Utilisation de la clé de traduction */}
                <button onClick={() => setPointsToWin(3)} style={pointsToWin === 3 ? { backgroundColor: 'blue', color: 'white' } : {}}>{t("tournament.pointsOption", { count: 3 })}</button> {/* Utilisation de la clé de traduction */}
                <button onClick={() => setPointsToWin(5)} style={pointsToWin === 5 ? { backgroundColor: 'blue', color: 'white' } : {}}>{t("tournament.pointsOption", { count: 5 })}</button> {/* Utilisation de la clé de traduction */}
            </div>
            <br />
            <button onClick={handleBuildBracket}>{t("tournament.startTournamentButton")}</button> {/* Utilisation de la clé de traduction */}
            {buildBracketError !== "" && <p style={{ color: 'red' }}>{buildBracketError}</p>}
        </div>
    );
}

export default AddPlayerComponent;
