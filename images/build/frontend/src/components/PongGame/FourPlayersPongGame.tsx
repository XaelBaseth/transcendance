import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import '../../styles/FourPlayersPongGame.css';
import { ACCESS_TOKEN } from '../../constants';
import { useTranslation } from 'react-i18next';
import pokemon3 from '../../assets/Yukiwarashi.gif';
import pokemon4 from '../../assets/Shinx.gif';

const FourPlayersPongGame = () => {
	const { t } = useTranslation();
	const MAP_HEIGHT = 500;
	const MAP_WIDTH = 500;
	const BALL_DIAMETER = 20;
	const PADDLE_HEIGHT = 100;
	const PADDLE_WIDTH = 20;
	const TPS = 10;
	const params = useParams();
	const initialBallState = { x: MAP_WIDTH / 2 - BALL_DIAMETER / 2, y: MAP_HEIGHT / 2 - BALL_DIAMETER / 2 };
	const initialPaddleState = {
		left: (MAP_HEIGHT - PADDLE_HEIGHT) / 2,
		right: (MAP_HEIGHT - PADDLE_HEIGHT) / 2,
		top: (MAP_WIDTH - PADDLE_HEIGHT) / 2,
		bottom: (MAP_WIDTH - PADDLE_HEIGHT) / 2
	};
	const [ball, setBall] = useState(initialBallState);
	const [paddles, setPaddles] = useState(initialPaddleState);
	const [gameOver, setGameOver] = useState(false);
	const [gameState, setGameState] = useState("initial");
	const [pause, setPause] = useState(false);
	const [player_side, setPlayerSide] = useState("spectator"); // left, right, top, bottom or spectator
	const [score, setScore] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
	const [winner, setWinner] = useState("");
	const [remaining_time, setRemainingTime] = useState(0);
	const [players_disconnected, setPlayersDisconnected] = useState([]);
	const ballRef = useRef(null);
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		try {
			const hostname = window.location.hostname;
			const port = window.location.port;

			const token = localStorage.getItem(ACCESS_TOKEN);
			socketRef.current = new WebSocket(`wss://${hostname}:${port}/ws/pong/${params.roomCode}/?token=${token}`);

			socketRef.current.onopen = () => {
				if (socketRef.current) {
					socketRef.current.send(JSON.stringify({ type: 'join_game' }));
				}
			};

			socketRef.current.onerror = (error) => {
				console.error('WebSocket error', error);
			};
		} catch (error) {
			console.error("Error during websocket creation:", error);
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.close();
				console.log('WebSocket connection closed');
			}
		};
	}, [params.roomCode]);

	const pressedKeys = useRef(new Set());
	const pausePressed = useRef(false);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const key = e.key.toLowerCase();
			pressedKeys.current.add(key);
		};

		const handleKeyUp = (e) => {
			const key = e.key.toLowerCase();
			if (key === ' ') {
				pausePressed.current = false;
			}
			pressedKeys.current.delete(key);
		};

		const handleKeyPress = () => {
			if ((remaining_time != 0 || pause) && !pressedKeys.current.has(' ')) {
				return;
			}

			pressedKeys.current.forEach(key => {
				switch (key) {
					case 'arrowup':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "up" }));
						break;
					case 'arrowdown':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "down" }));
						break;
					case 'arrowleft':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "left" }));
						break;
					case 'arrowright':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "right" }));
						break;
					case ' ':
						if (pausePressed.current === false) {
							pauseGame();
							pausePressed.current = true;
						}
						break;
					default:
						break;
				}
			});
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		const interval = setInterval(handleKeyPress, 50);

		if (socketRef.current) {
			socketRef.current.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.type !== "game_state") {
					console.log('Received message', data);
				}
				switch (data.type) {
					case 'game_start':
						setGameState('running');
						setPause(false);
						setGameOver(false);
						setBall(initialBallState);
						setPaddles(initialPaddleState);
						break;
					case 'game_state':
						if (gameState !== 'running') {
							setGameState('running');
						}
						if (pause) {
							setPause(false);
						}
						const ball_position = data.ball_position;
						const rightPaddle = data.right_paddle_position;
						const leftPaddle = data.left_paddle_position;
						const topPaddle = data.top_paddle_position;
						const bottomPaddle = data.bottom_paddle_position;
						setBall((prevBall) => ({
							...prevBall, x: ball_position.x, y: ball_position.y,
						}));
						setPaddles({ right: rightPaddle, left: leftPaddle, top: topPaddle, bottom: bottomPaddle });
						break;
					case 'score':
						const score = data.score;
						setScore({ left: score.left, right: score.right, top: score.top, bottom: score.bottom });
						break;
					case 'game_over':
						setGameState('finished');
						setGameOver(true);
						setBall(initialBallState);
						setPaddles(initialPaddleState);
						setWinner(data.winner);
						break;
					case 'pause':
						setPause(data.pause);
						break;
					case 'remaining_time':
						setRemainingTime(data.remaining_time);
						break;
					case 'players_disconnected':
						setPlayersDisconnected(data.players);
						break;
					case 'join_game':
						const side = data.side;
						const state = data.state;
						setGameState(state);
						setPlayerSide(side);
						if (side === 'spectator') {
							window.removeEventListener('keydown', handleKeyPress);
						}
						break;
					default:
						console.log('Unknown message type', data);
						break;
				}
			};
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			clearInterval(interval);
		};
	}, [gameState, pause, player_side, pause, remaining_time]);

	const startGame = () => {
		if (gameState === "initial" && ['left', 'right', 'top', 'bottom'].includes(player_side)) {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'start_game' }));
			}
		}
	};

	const pauseGame = () => {
		if (['left', 'right', 'top', 'bottom'].includes(player_side)) {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'pause', pause: !pause }));
			}
		}
	};

	return (
		<>
			<div className="controls">
				{gameState === "initial" && <button className="button_start_multi" onClick={startGame}>{t('pong.start')}</button>}
				{gameState === "running" && <button className="button_start_multi" onClick={pauseGame}>{t('pong.pause')}</button>}
			</div>
			<img src={pokemon3} alt="Yuki" className="pokemon3" />
			<img src={pokemon4} alt="Shinx" className="pokemon4" />
			<div className="score-text_multi">
   				<p>{t('pong.left')} : {score.left} {t('pong.right')} : {score.right} {t('pong.top')} : {score.top} {t('pong.bottom')} : {score.bottom}</p>
			</div>
			<div className="four-player-ping-pong-container" tabIndex={0} style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
				<div
					className={`paddle-vertical paddle-left`}
					id="paddle-left"
					style={{ top: `${paddles.left}px`, width: `${PADDLE_WIDTH}px`, height: `${PADDLE_HEIGHT}px` }}
				/>
				<div
					className={`paddle-vertical paddle-right`}
					id="paddle-right"
					style={{ top: `${paddles.right}px`, left: `${MAP_WIDTH - PADDLE_WIDTH}px`, width: `${PADDLE_WIDTH}px`, height: `${PADDLE_HEIGHT}px` }}
				/>
				<div
					className={`paddle-horizontal paddle-top`}
					id="paddle-top"
					style={{ left: `${paddles.top}px`, height: `${PADDLE_WIDTH}px`, width: `${PADDLE_HEIGHT}px` }}
				/>
				<div
					className={`paddle-horizontal paddle-bottom`}
					id="paddle-bottom"
					style={{ left: `${paddles.bottom}px`, top: `${MAP_HEIGHT - PADDLE_WIDTH}px`, height: `${PADDLE_WIDTH}px`, width: `${PADDLE_HEIGHT}px` }}
				/>
				<div
					className={`ball`}
					ref={ballRef}
					style={{ top: `${ball.y}px`, left: `${ball.x}px`,
					width: `${BALL_DIAMETER}px`, height: `${BALL_DIAMETER}px`,
					transition: `top ${1 / TPS}s, left ${1 / TPS}s`,
					transitionTimingFunction: 'linear' }}
				/>
				{gameOver && <div className="game-win" style={{ left: `${winner === "left" ? 0 : MAP_WIDTH / 2}px`, width: MAP_WIDTH / 2, height: MAP_HEIGHT }}>{t('pong.youWin')}</div>}
				{gameOver && <div className="game-loose" style={{ left: `${winner === "left" ? MAP_WIDTH / 2 : 0}px`, width: MAP_WIDTH / 2, height: MAP_HEIGHT }}>{t('pong.gameOver')}</div>}
			</div>
		</>
	);
};

export default FourPlayersPongGame;