import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Gamepage.css';
import pokemon1 from '../assets/ronflex.gif';
import pokemon2 from '../assets/loklass.gif';

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
				socketRef.current = new WebSocket('wss://'+hostname+':'+port+'/ws/matchmaking/');
			}

			socketRef.current.onopen = () => {
				if (socketRef.current) {
					const token = localStorage.getItem(ACCESS_TOKEN);
					socketRef.current.send(JSON.stringify({ type: 'auth', token: token }));
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
			<div className="BGmutliplayers">
				<img src={pokemon1} alt="Ronflex" className="pokemon1" />
				<img src={pokemon2} alt="Loklass" className="pokemon2" />
				
				{inQueue !== "0" && (
					<>
						<div className="waiting_title">
							<h3>{t('pong.waiting')}</h3>
						</div>
						<div className="counter_title">
							<h3>{t('pong.playercounter')} {inQueue}</h3>
						</div>
						<div>
							<button className="button_quit" onClick={leaveMatchMaking}>{t('pong.quit')}</button>
						</div>
					</>
				)}
	
				{inQueue === "0" && (
					<div className="home_container">
						<h1 className="home_text">{t('pong.pongHome')}</h1>
						<br /> <br />
						<button className="button_2players" onClick={() => joinMatchMaking(2)}>{t('pong.pongTwoPlayer')}</button>
						<br /> <br />
						<button className="button_4players" onClick={() => joinMatchMaking(4)}>{t('pong.pongFourPlayer')}</button>
					</div>
				)}
			</div>
		</div>
	);
	
}

export default PongHomePage;