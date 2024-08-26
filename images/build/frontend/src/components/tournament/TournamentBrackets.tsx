import "../../styles/tournament.css";

import {
    SingleEliminationBracket,
    Match,
    SVGViewer,
    createTheme
  } from "@g-loot/react-tournament-brackets";
    import React from 'react';
    
  const TournamentBrackets = ({tournamentBracket}) => {
    console.log("render tournament brackets");
    return (<SingleEliminationBracket
      theme={GlootTheme}
      matches={tournamentBracket}
      matchComponent={Match}
    />);
  }
  
  const GlootTheme = createTheme({
    textColor: {
      main: "var(--pink)", 
      highlighted: "var(--light_pink)" 
    },
    matchBackground: {
      wonColor: "var(--ok)", 
      lostColor: "var(--error)",
      background: "var(--white)"
    },
    score: {
      background: {
        wonColor: "var(--ok)",
        lostColor: "var(--error)"
      },
      text: {
        highlightedWonColor: "var(--pink)",
        highlightedLostColor: "var(--light_pink)"
      }
    },
    border: {
      color: "var(--light_teal)",
      highlightedColor: "var(--olive_green)"
    },
    roundHeader: {
      backgroundColor: "var(--linen)",
      fontColor: "var(--pink)"
    },
    connectorColor: "var(--light_teal)",
    connectorColorHighlight: "var(--olive_green)",
    svgBackground: "var(--linen)"
  });
  
  export default TournamentBrackets;