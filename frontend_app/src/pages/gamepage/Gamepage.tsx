import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

import './Gamepage.css'

export default function GamePage() {
	const navigate = useNavigate();

	toast.success("Match found! Redirectiong to game ")

	const leaveQueueButton = (
		<button className="button3"	onClick={() => {toast.success("Left queue.", {});}}>Cancel</button>
	);

	const handleCustom = () => {
		{/** Handle custom matches/tournaments heres */} 
		toast.loading(<span>Looking for a custom match {leaveQueueButton}</span>);
	};

	const handleClassic = () => {
		{/**Handle classic matches */}
		toast.loading(<span>Looking for a classic match {leaveQueueButton}</span>);
	};

	return (
		<div id="play-screen2">
			<div className="button1" onClick={handleClassic} data-text="CLASSIC MODE" title="Use the keyboard to play">
				CLASSIC MODE
			</div>
			<div className="button2" onClick={handleCustom} data-text="CUSTOM MODE" title="Ready for a tournament">
				CUSTOM MODE
			</div>
		</div>
	);
}