import React from 'react';
import Tournament from '../components/tournament/Tournament';
import { TournamentContextProvider } from '../components/tournament/provider/TournamentContextProvider';

const TournamentPage = () => {

	return(
		<>
			<TournamentContextProvider>
				 <div className="centered-div">
					<Tournament />
				</div>
			</TournamentContextProvider>
		</>
	);
}

export default TournamentPage;