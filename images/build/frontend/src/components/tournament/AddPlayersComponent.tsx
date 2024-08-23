import React from "react";
import { useState } from "react";
import { useTournamentContext } from "./provider/TournamentContextProvider";

const AddPlayerComponent = () => 
{
    const { buildBracket, setPointsToWin, pointsToWin } = useTournamentContext();
    const [players, setPlayers] = useState<string[]>([]);
    const [playerName, setPlayerName] = useState("");
    const [addPlayerError, setAddPlayerError] = useState("");
    const [buildBracketError, setBuildBracketError] = useState("");

    const handleBuildBracket = () => {
        if (players.length < 3) {
            setBuildBracketError("Minimum 3 players required to build bracket");
            return;
        }
        buildBracket(players);
    };

    const handleSetPlayerName = (name:string) => {
        setPlayerName(name);
        if (!players.includes(name.trim())) {
            setAddPlayerError("");
        }
    } 
    
    const addPlayer = () => {
        const trimmedName = playerName.trim();
        if (trimmedName) {
            // check if playerName already exists
            if (players.includes(trimmedName)) {
                setAddPlayerError("Player already exists");
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
                placeholder="Enter player name"
            />
            {addPlayerError !== "" && <p style={{ color: 'red' }}>{addPlayerError}</p>}
            <button onClick={addPlayer}>Add Player</button>
            <div>
                <h2>Players</h2>
                <ul>
                {players.map((player) => (
                    <li key={player.toString()}>{player}</li>
                ))}
                </ul>
            </div>
            <div>
                <h2>Points per pong game</h2>
                <button onClick={() => setPointsToWin(1)} style={pointsToWin === 1 ? { backgroundColor: 'blue', color: 'white' } : {}} >1</button>
                <button onClick={() => setPointsToWin(3)} style={pointsToWin === 3 ? { backgroundColor: 'blue', color: 'white' } : {}}>3</button>
                <button onClick={() => setPointsToWin(5)} style={pointsToWin === 5 ? { backgroundColor: 'blue', color: 'white' } : {}}>5</button>
            </div>
            <br/>
            <button onClick={handleBuildBracket}>Start tournament</button>
            {buildBracketError !== "" && <p style={{ color: 'red' }}>{buildBracketError}</p>}
        </div>
    );
}

export default AddPlayerComponent;