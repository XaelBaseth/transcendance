import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ACCESS_TOKEN } from '../constants';

const PongHomePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [inQueue, setInQueue] = useState("0");
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		try {
			const hostname = window.location.hostname;
			const port = window.location.port;

			if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
				const token = localStorage.getItem(ACCESS_TOKEN);
				socketRef.current = new WebSocket('wss://'+hostname+':'+port+'/ws/matchmaking/' + '?token=' + token);
			}

			socketRef.current.onopen = () => {
				if (socketRef.current) {
					socketRef.current.send(JSON.stringify({ type: 'check_game'  }));
				}
			};

			if (socketRef.current) {
				socketRef.current.onmessage = (event) => {
					const data = JSON.parse(event.data);
					console.log("MatchMaking Received data:", data);
					if (data.type === 'queue') {
						setInQueue(data.in_queue);
					} else if (data.type === 'join_game') {
						const game_player_limit = data.player_limit;
						const params = new URLSearchParams({ player_limit: game_player_limit.toString()}).toString();
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

		return () => {
			if (socketRef.current) {
                socketRef.current.close();
                console.log('WebSocket connection closed');
            };
		};
	}, []);

	const joinMatchMaking = async (player_limit: number) => {
		if (socketRef.current) {
			socketRef.current.send(JSON.stringify({ type: player_limit === 2 ? 'queue_duel' : 'queue_quarrel' }));
		}
	}

	const leaveMatchMaking = () => {
		try {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'leave_queue' }));
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
					<h3>{t('pong.waiting')}</h3>
					<h3>{t('pong.playercounter')} {inQueue}</h3>
					<button onClick={leaveMatchMaking}>{t('pong.quit')}</button>
				</div>
			}
			{
				inQueue === "0" && 
				<div>
					<h1>{t('pong.pongHome')}</h1>
					<br /> <br />
					<button onClick={()=> joinMatchMaking(2)}>{t('pong.pongTwoPlayer')}</button>
					<br /> <br />
					<button onClick={()=> joinMatchMaking(4)}>{t('pong.pongFourPlayer')}</button>
				</div>

			}
			
		</div>
	);
}

export default PongHomePage;