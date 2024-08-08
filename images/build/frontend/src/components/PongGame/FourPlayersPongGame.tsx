import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import '../../styles/FourPlayersPongGame.css';
import { ACCESS_TOKEN } from '../../constants';

const FourPlayersPongGame = () => {
	const params = useParams();
	const initialBallState = { x: 240, y: 240, x_direction: 0, y_direction: 0, last_collision: "" };
	const initialPaddleState = { left: 200, right: 200, top: 200, bottom: 200 };
	const playerCount = 4;
	const [ball, setBall] = useState(initialBallState);
	const [paddles, setPaddles] = useState(initialPaddleState);
	const [gameOver, setGameOver] = useState(false);
	const [gameRunning, setGameRunning] = useState(false);
	const [player_side, setPlayerSide] = useState(); //left, right, top, bottom or spectator
	const ballRef = useRef(null);
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		try {
			const token = localStorage.getItem(ACCESS_TOKEN);
			socketRef.current = new WebSocket('wss://localhost:8000/ws/pong/' + params.roomCode + '/?token=' + token);

			socketRef.current.onopen = () => {
				if (socketRef.current) {
					socketRef.current.send(JSON.stringify({ type: 'join_game' }));
				}
			};

			socketRef.current.onerror = (error) => {
				console.error('WebSocket error', error);
			}
		}
		catch (error) {
			console.error("Error during websocket creation:", error);
		}

		return () => {
		};
	}, []);

	useEffect(() => {
		const handleKeyPress = (e: { key: any; }) => {
			if (player_side === 'spectator' || !gameRunning) {
				return;
			}
			if (socketRef.current) {
				switch (e.key) {
					case 'ArrowUp':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "up" }));
						break;
					case 'ArrowDown':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "down" }));
						break;
					case 'ArrowLeft':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "left" }));
						break;
					case 'ArrowRight':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "right" }));
						break;
					default:
						break;
				}
			}
		};

		//très import qu'il soit dans un useEffect qui dépend de paddles
		if (socketRef.current) {
			socketRef.current.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.type === 'game_start') {
					setGameRunning(true);
					setGameOver(false);
					setBall(initialBallState);
					setPaddles(initialPaddleState);
				} else if (data.type === 'game_state') {
					const ball_position = data.ball_position;
					const ball_direction = data.ball_direction;
					const rightPaddle = data.right_paddle_position;
					const leftPaddle = data.left_paddle_position;
					const topPaddle = data.top_paddle_position;
					const bottomPaddle = data.bottom_paddle_position;
					if (Math.abs(ball.x - ball_position.x) > 5 || Math.abs(ball.y - ball_position.y) > 5) {
						setBall((prevBall) => ({
							...prevBall, x: ball_position.x, y: ball_position.y, x_direction: ball_direction.x, y_direction: ball_direction.y
						}));
					}
					setPaddles({ right: rightPaddle, left: leftPaddle, top: topPaddle, bottom: bottomPaddle });
				} else if (data.type === 'game_over') {
					setGameRunning(false);
					setGameOver(true);
					setBall(initialBallState);
					setPaddles(initialPaddleState);
				} else if (data.type == "join_game") {
					setPlayerSide(data.side);
					if (data.side === 'spectator') {
						window.removeEventListener('keydown', handleKeyPress);
					}
				}
				else {
					console.log('Unknown message type', data);
				}
			};
		}

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [paddles, socketRef, player_side]);

	const startGame = () => {
		if (!gameRunning && (player_side === 'left' || player_side === 'right' || player_side === 'top' || player_side === 'bottom')) {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'start_game' }));
			}
			setGameRunning(true);
			setGameOver(false);
		}
	};

	const restartGame = () => {
		if ((player_side === 'left' || player_side === 'right' || player_side === 'top' || player_side === 'bottom')) {
			setBall(initialBallState);
			setPaddles(initialPaddleState);
			setGameOver(false);
			setGameRunning(true);
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'restart', nb_players: playerCount }));
			}
		}
	};

	const pauseGame = () => {
		if (player_side === 'left' || player_side === 'right' || player_side === 'top' || player_side === 'bottom') {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'pause' }));
			}
		}
	};

	return (<>
		<h2>Room code : {params.roomCode}</h2>
		<p>player side : {player_side}</p>
		<p>ball x : {ball.x}</p>
		<p>ball y : {ball.y}</p>
		<div className="controls">
			<button onClick={startGame}>Start</button>
			<button onClick={restartGame}>Restart</button>
			<button onClick={pauseGame}>Pause</button>
		</div>
		<div className="four-player-ping-pong-container" tabIndex={0}>
			<div
				className={`paddle-vertical paddle-left ${gameRunning ? '' : 'paused'}`}
				id="paddle-left"
				style={{ top: `${paddles.left}px` }}
			/>
			<div
				className={`paddle-vertical paddle-right ${gameRunning ? '' : 'paused'}`}
				id="paddle-right"
				style={{ top: `${paddles.right}px`, left: '480px' }}
			/>
			<div
				className={`paddle-horizontal paddle-top ${gameRunning ? '' : 'paused'}`}
				id="paddle-top"
				style={{ left: `${paddles.top}px` }}
			/>
			<div
				className={`paddle-horizontal paddle-bottom ${gameRunning ? '' : 'paused'}`}
				id="paddle-bottom"
				style={{ left: `${paddles.bottom}px`, top: '480px' }}
			/>
			<div
				className={`ball ${gameRunning ? '' : 'paused'}`}
				ref={ballRef}
				style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
			/>
			{gameOver && <div className="four-player-game-over">Game Over</div>}
		</div>
	</>
	);
};
export default FourPlayersPongGame;