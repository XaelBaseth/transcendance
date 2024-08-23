import React from 'react';
import Tournament from '../components/tournament/Tournament';
import { TournamentContextProvider } from '../components/tournament/provider/TournamentContextProvider';

const TournamentPage = () => {

	return(
		<>
			<TournamentContextProvider>
				<Tournament />
			</TournamentContextProvider>
		</>
	);
}

export default TournamentPage;