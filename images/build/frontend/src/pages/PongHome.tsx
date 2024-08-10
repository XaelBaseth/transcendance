import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const PongHomePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [inQueue, setInQueue] = useState("0");
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		return () => {
			if (socketRef.current) {
                socketRef.current.close();
                console.log('WebSocket connection closed');
            };
		};
	}, []);

	const joinMatchMaking = async (player_limit: number) => {
		try {
			if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
				socketRef.current = new WebSocket('wss://localhost:8000/ws/matchmaking/');
			}

			socketRef.current.onopen = () => {
				if (socketRef.current) {
					socketRef.current.send(JSON.stringify({ type: player_limit === 2 ? 'queue_duel' : 'queue_quarrel' }));
				}
			};

			if (socketRef.current) {
				socketRef.current.onmessage = (event) => {
					const data = JSON.parse(event.data);
					console.log("MatchMaking Received data:", data);
					if (data.type === 'queue') {
						setInQueue(data.in_queue);
					} else if (data.type === 'join_game') {
						const params = new URLSearchParams({ player_limit: player_limit.toString()}).toString();
						navigate(`/pong/${data.code}?${params}`);
					}
				};
			};

			socketRef.current.onerror = (error) => {
				console.error('WebSocket error', error);
			}
		}
		catch (error) {
			console.error("Error during websocket creation:", error);
		}
	}

	const leaveMatchMaking = () => {
		try {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'leave_queue' }));
				socketRef.current.close();
				socketRef.current = null;
			}
			setInQueue("0");
		}
		catch (error) {
			console.error("Error during websocket closure:", error);
		}
	}
	
	return (
		<div id="play-screen2">
			{
				inQueue !== "0" && 
				<div>
					<h3>Waiting for other players...</h3>
					<h3>Players in queue: {inQueue}</h3>
					<button onClick={leaveMatchMaking}>Leave</button>
				</div>
			}
			{
				inQueue === "0" && 
				<div>
					<h1>{t('pong.pongHome')}</h1>
					<br /> <br />
					<button onClick={()=> joinMatchMaking(2)}>2 Players Pong</button>
					<br /> <br />
					<button onClick={()=> joinMatchMaking(4)}>4 Players Pong</button>
				</div>

			}
			
		</div>
	);
}

export default PongHomePage;