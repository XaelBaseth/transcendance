import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import '../../styles/PongGame.css';



const PongGame = () => {
	const params = useParams();
	const initialBallState = { x: 290, y: 190 };
	const initialPaddleState = { left: 150, right: 150 };
	const playerCount = 2;
	const [ball, setBall] = useState(initialBallState);
	const [paddles, setPaddles] = useState(initialPaddleState);
	const [gameOver, setGameOver] = useState(false);
	const [gameRunning, setGameRunning] = useState(false);
	const [player_side, setPlayerSide] = useState(); //left, right or spectator
	const ballRef = useRef(null);
	const socketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		try {
			socketRef.current = new WebSocket('wss://localhost:8000/ws/pong/' + params.roomCode + '/');
		}
		catch (error) {
			console.error("Error during websocket creation:", error);
		}

		socketRef.current.onopen = () => {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'join_game' }));
			}
		};

		socketRef.current.onerror = (error) => {
			console.error('WebSocket error', error);
			console.error('WebSocket error2', error.message, "code :", error.code, "type :", error.type, "target :", error.target, "current t:", error.currentTarget);
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
						player_side === "left" ? setPaddles({ ...paddles, left: Math.max(paddles.left - 10, 0) }) : setPaddles({ ...paddles, right: Math.max(paddles.right - 10, 0) });
						break;
					case 'ArrowDown':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "down" }));
						player_side === "left" ? setPaddles({ ...paddles, left: Math.min(paddles.left + 10, 300) }) : setPaddles({ ...paddles, right: Math.min(paddles.right + 10, 300) });
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
					const { x, y } = data.ball_position;
					const rightPaddle = data.right_paddle_position;
					const leftPaddle = data.left_paddle_position;
					setBall({ x, y });
					setPaddles({ right: rightPaddle, left: leftPaddle });
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
		if (!gameRunning && (player_side === 'left' || player_side === 'right')) {
			if (socketRef.current) {
				socketRef.current.send(JSON.stringify({ type: 'start_game' }));
			}
			setGameRunning(true);
			setGameOver(false);
		}
	};

	const restartGame = () => {
		if ((player_side === 'left' || player_side === 'right')) {
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
		if (player_side === 'left' || player_side === 'right') {
			if (socketRef.current) {

				socketRef.current.send(JSON.stringify({ type: 'pause' }));
			}
		}
	};

	return (<>
		<h2>Room code : {params.roomCode}</h2>
		<p>player side : {player_side}</p>
		<p>paddle right y : {paddles.right}</p>
		<p>paddle left y : {paddles.left}</p>
		<div className="controls">
			<button onClick={startGame}>Start</button>
			<button onClick={restartGame}>Restart</button>
			<button onClick={pauseGame}>Pause</button>
		</div>
		<div className="ping-pong-container" tabIndex={0}>
			<div
				className={`paddle paddle-left ${gameRunning ? '' : 'paused'}`}
				id="paddle-left"
				style={{ top: `${paddles.left}px` }}
			/>
			<div
				className={`paddle paddle-right ${gameRunning ? '' : 'paused'}`}
				id="paddle-right"
				style={{ top: `${paddles.right}px`, left: '580px' }}
			/>
			<div
				className={`ball ${gameRunning ? '' : 'paused'}`}
				ref={ballRef}
				style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
			/>
			{gameOver && <div className="game-over">Game Over</div>}
		</div>
	</>
	);
};
export default PongGame;