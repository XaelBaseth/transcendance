	import { useNavigate } from "react-router-dom";
	import { SocketContext } from "../../context/context"; 
	import { toast } from 'react-hot-toast';
	import './Gamepage.css'
	import { useContext } from "react";

	export default function GamePage() {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();

	socket?.on("match ready", (mode: string) => {
		const duration = 2500;

		setTimeout(() => {
			socket.off("match ready");
			if (mode === "Custom") {
				navigate("/custompong");
			} else {
				navigate("/pong");
			}
		}, duration + 500);

		toast.success("Match found! Redirecting to game...",
			{
				id: "matchmaking",
				icon: "🎉",
				duration: duration,
			}
		);
	}
	);

	const leaveQueueButton = (
	<button
		className="button3"
		onClick={() => {
			socket?.emit("Leave Queue");
			toast.success("Left queue.", {
				id: "matchmaking",
				duration: 3000,
			});
		}}>
		Cancel
	</button>
	);

	const handleOther = () => {
	if (socket) {
		socket.emit("Join Queue", "Custom");
		toast.loading(<span>Looking for a match... {leaveQueueButton} </span>, {
			id: "matchmaking",
			icon: "🔍",
		
		});
	} else {
		console.log("Socket is null");
	}
	};

	const handlePong = () => {
	if (socket) {
		socket.emit("Join Queue", "Classic");
		toast.loading(<span>Looking for a match... {leaveQueueButton} </span>, {
			id: "matchmaking",
			icon: "🔍",
		});
	} else {
		console.log("Socket is null");
	}
	};

	const handleTournament = () => {
		/**handle the tournament implementation (create a room ?) */
		if (socket) {
			socket.emit("Join Queue", "Tournament");
			toast.loading(<span>Preparing the room... {leaveQueueButton} </span>, {
				id: "matchmaking",
				icon: "🔍",
			});
		} else {
			console.log("Socket is null");
		}
	};

	return (
	<div id="play-screen2">
			<div className="button1" onClick={handlePong} data-text="MODE PONG"
			title="Use the up and down arrows of your keyboard to play !">
				PONG MODE
			</div>
			<div className="button2" onClick={handleOther} data-text="MODE OTHER"
			title="Come try out our /!\/!\PUT A NEW GAME/!\/!\ !">
				OTHER GAME MODE
			</div>
			<div className="button3" onClick={handleTournament} data-text="MODE TOURNAMENT"
			title="Compet in a tournament to see who is the best (it's you!)!">
				TOURNAMENT MODE
			</div>
	</div>
	);
	}