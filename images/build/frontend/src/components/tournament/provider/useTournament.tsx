import { useState } from "react";
import { Participant }  from "./TournamentContextProvider";

export type TournamentState = "initial" | "running" | "playing" | "finished";

const useTournament = () => {
  const [tournamentBracket, setTournamentBracket] = useState<any[]>([]);
  const [currentMatchId, setCurrentMatchId] = useState<number | null>(null);
  const [tournamentState, setTournamentState] = useState<TournamentState>("initial");
  const [winner, setWinner] = useState<string | null>(null);
  const [pointsToWin, setPointsToWin] = useState<number>(3);
  
  const buildBracket = (players: string[]) => {
    if (players.length < 3) {
      return;
    }

    const TBDParticipant : Participant = {
      id: Math.random(),
      resultText: null,
      isWinner: false,
      status: null,
      name: null,
      picture: null
    };

    const participants : Participant[] = players.map((player) => ({
      id: player,
      resultText: null,
      isWinner: false,
      status: null,
      name: player,
      picture: "teamlogos/client_team_default_logo"
    }));

    participants.sort(() => Math.random() - 0.5);

    var index = participants.length;

    while ((participants.length & (participants.length - 1)) !== 0) {
      const newElement = {
          id: Math.random(),
          resultText: "Bye",
          isWinner: false,
          status: "PLAYED",
          name: "Bye",
          picture: "teamlogos/client_team_default_logo"
        };
      participants.splice(index, 0, newElement);
      index > 0 ? index -=1 : index = 0;
    }

    var matchId = 1;
    var lastNextMatchId = 0;
    var incrementLastNextMatchId = true;
    var maxRoundSize = participants.length / 2;
    var roundSize = 1;
    var roundText = Math.log2(maxRoundSize) + 1;
    var tournament: any[]= [];

    const getLastNextMatchId = (matchId: number) => {
      if (matchId === 1) {
        return null;
      }
      if (incrementLastNextMatchId) {
        lastNextMatchId++;
        incrementLastNextMatchId = false;
        return lastNextMatchId;
      } else {
        incrementLastNextMatchId = true;
        return lastNextMatchId;
      }
    }

    const checkByeMatch = (participant1: Participant, participant2: Participant) => {
      if (participant1.name === "Bye") {
        participant2.isWinner = true;
        participant2.resultText = "Won";
        participant2.status = "PLAYED";
        return [participant1, participant2];
      } else if (participant2.name === "Bye") {
        participant1.isWinner = true;
        participant1.resultText = "Won";
        participant1.status = "PLAYED";
        return [participant1, participant2];
      }
      return [];
    }

    var nextMatchToPlay : number | null = null;

    while (roundSize <= maxRoundSize) {
      for (let i = 0; i < roundSize; i++) {
        if (roundSize === maxRoundSize && nextMatchToPlay === null) {
          nextMatchToPlay = matchId;
        }
        const match = {
          id: matchId,
          nextMatchId: getLastNextMatchId(matchId),
          tournamentRoundText: roundText.toString(),
          startTime: null,
          state: "SCHEDULED",
          participants: roundSize === maxRoundSize && participants.length >= 2 ? [participants.shift(), participants.shift()] : [TBDParticipant, TBDParticipant],
        };
        matchId++;
        tournament.push(match);
      }
      roundText--;
      roundSize *= 2;
    }

    setCurrentMatchId(nextMatchToPlay);

    tournament.forEach((match) => {
      if (match.participants.length === 2) {
        const checkRes = checkByeMatch(match.participants[0], match.participants[1]);
        if (checkRes.length > 0)
        {
          match.participants = checkRes;
          match.state = "SCORE_DONE";
          const matchToUpdate = tournament.find((m) => m.id === match.nextMatchId);
          if (matchToUpdate) {
            const nextRoundPlayer = {...checkRes.find((p) => p.isWinner)};
            if (nextRoundPlayer) {
              nextRoundPlayer.isWinner = false;
              nextRoundPlayer.resultText = null;
              nextRoundPlayer.status = null;
            }
            match.id % 2 === 0 ? matchToUpdate.participants[0] = nextRoundPlayer : matchToUpdate.participants[1] = nextRoundPlayer;
          }
        }
      }
    });

    setTournamentBracket(tournament);
    setTournamentState("running");
  };

  const playNextGame = () => {
    setTournamentState("playing");
  }

  const manageGameResult = (winnerSide: string, score: {left: number, right: number}) => {
    const match = tournamentBracket.find((m) => m.id === currentMatchId);
    console.log("winnerSide: ", winnerSide, "score: ", score);
    console.log("played game : ", currentMatchId);

    match.participants[0].isWinner = winnerSide == "left" ? true : false;
    match.participants[1].isWinner = winnerSide == "left" ? false: true;
    match.participants[0].resultText = score.left.toString();
    match.participants[1].resultText = score.right.toString();
    match.participants[0].status = "PLAYED";
    match.participants[1].status = "PLAYED";
    match.state = "SCORE_DONE";

    const matchToUpdate = tournamentBracket.find((m) => m.id === match.nextMatchId);
    console.log("match to update : ", matchToUpdate);
    if (matchToUpdate) {
      const nextRoundPlayer = {...match.participants.find((p) => p.isWinner)};
      if (nextRoundPlayer) {
        nextRoundPlayer.isWinner = false;
        nextRoundPlayer.resultText = null;
        nextRoundPlayer.status = null;
      }
      match.id % 2 === 0 ? matchToUpdate.participants[0] = nextRoundPlayer : matchToUpdate.participants[1] = nextRoundPlayer;
    }
    console.log("match to update : ", matchToUpdate);
    setTournamentState("running");

    let nextMatchToPlay:number = Infinity;
    let round = parseInt(match.tournamentRoundText);
    let maxRound = 0;

    for (let i = 0; i < tournamentBracket.length; i++) {
      const match = tournamentBracket[i];
      if (parseInt(match.tournamentRoundText) > maxRound) {
        maxRound = parseInt(match.tournamentRoundText);
      }
    }

    console.log("match.tournamentRoundText : ", match.tournamentRoundText);
    while (round <= maxRound) {
      const roundMatches = tournamentBracket.filter((m) => m.tournamentRoundText === round.toString());
      const scheduledMatches = roundMatches.filter((m) => m.state === "SCHEDULED");
      console.log("Pour le round", round,  " scheduledMatches : ", scheduledMatches);
      for (let i = 0; i < scheduledMatches.length; i++) {
        if (scheduledMatches[i].id < nextMatchToPlay) {
          console.log("je selectionne : ", scheduledMatches[i].id);
          nextMatchToPlay = scheduledMatches[i].id;
        }
      }
      if (nextMatchToPlay !== Infinity) {
        break;
      }
      round++;
    }
    console.log("next match to play : ", nextMatchToPlay);
    if (nextMatchToPlay === Infinity) {
      setTournamentState("finished");
      setWinner(winnerSide == "left" ? match.participants[0].name :  match.participants[1].name);
    } else {
      setCurrentMatchId(nextMatchToPlay);
    }
  }

  const restartTournament = () => {
    setTournamentBracket([]);
    setCurrentMatchId(null);
    setTournamentState("initial");
    setWinner(null);
  }

  const getCurrentPlayers = () => {
    const currentMatch  = tournamentBracket.find((m) => m.id === currentMatchId);
    return currentMatch ? currentMatch.participants : [];
  }

  return {
    tournamentBracket,
    tournamentState,
    winner,
    pointsToWin,
    currentMatchId,
    setPointsToWin,
    buildBracket,
    playNextGame,
    manageGameResult,
    restartTournament,
    getCurrentPlayers,
  };
};

export default useTournament;