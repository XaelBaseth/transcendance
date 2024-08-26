import React from "react";
import { useTournamentContext } from "./provider/TournamentContextProvider";
import AddPlayerComponent from "./AddPlayersComponent";
import RunningTournament from "./RunningTournament";
import PlayingTournament from "./PlayingTournament";
import FinishedTournament from "./FinishedTournament";

const Tournament = () => {
  const { tournamentState } = useTournamentContext();

  return (
    <div>
      {tournamentState === "initial" && <AddPlayerComponent />}
      {tournamentState === "running" && <RunningTournament />}
      {tournamentState === "playing" && <PlayingTournament />}
      {tournamentState === "finished" && <FinishedTournament />}
    </div>
  );
}

export default Tournament;