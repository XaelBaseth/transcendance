import React, { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import '../../styles/PongGame.css';
import { ACCESS_TOKEN } from '../../constants';

const PongGame = () => {
	const BALL_SPEED = 5
	const TPS = 10
	const MAP_HEIGHT = 400
	const MAP_WIDTH = 600
	const BALL_DIAMETER = 20
	const params = useParams();
	const initialBallState = { x: 290, y: 190, x_direction: 0, y_direction: 0, last_collision: "" };
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
						// player_side === "left" ? setPaddles({ ...paddles, left: Math.max(paddles.left - 10, 0) }) : setPaddles({ ...paddles, right: Math.max(paddles.right - 10, 0) });
						break;
					case 'ArrowDown':
						socketRef.current.send(JSON.stringify({ type: 'update_paddle', side: player_side, direction: "down" }));
						// player_side === "left" ? setPaddles({ ...paddles, left: Math.min(paddles.left + 10, 300) }) : setPaddles({ ...paddles, right: Math.min(paddles.right + 10, 300) });
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
					if (Math.abs(ball.x - ball_position.x) > 5 || Math.abs(ball.y - ball_position.y) > 5) {
						setBall((prevBall) => ({
							...prevBall, x: ball_position.x, y: ball_position.y, x_direction: ball_direction.x, y_direction: ball_direction.y
						}));
					}
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

	// useEffect(() => {
	// 	if (gameRunning) {
	// 		const updateGame = () => {

	// 			// Check for collisions with paddles
	// 			if
	// 				(ball.x <= 20 &&
	// 				ball.x >= 0 &&
	// 				ball.y <= paddles.left + 100 &&
	// 				ball.y >= paddles.left && ball.last_collision !== "left") {
	// 				setBall((prevBall) => ({ ...prevBall, x_direction: -prevBall.x_direction, last_collision: "left" }));
	// 			}
	// 			else if
	// 				(ball.x >= 560 &&
	// 				ball.x < 580 &&
	// 				ball.y <= paddles.right + 100 &&
	// 				ball.y >= paddles.right && ball.last_collision !== "right") {
	// 				setBall((prevBall) => ({ ...prevBall, x_direction: -prevBall.x_direction, last_collision: "right" }));
	// 			}
	// 			// Check for collisions with top and bottom walls
	// 			if (ball.y <= 0 && ball.last_collision !== "top") {
	// 				setBall((prevBall) => ({ ...prevBall, y_direction: -prevBall.y_direction, last_collision: "top" }));
	// 			} else if (ball.y >= MAP_HEIGHT - BALL_DIAMETER && ball.last_collision !== "bottom") {
	// 				setBall((prevBall) => ({ ...prevBall, y_direction: -prevBall.y_direction, last_collision: "bottom" }));
	// 			}

	// 			setBall((prevBall) => ({
	// 				...prevBall,
	// 				x: prevBall.x + prevBall.x_direction * BALL_SPEED,
	// 				y: prevBall.y + prevBall.y_direction * BALL_SPEED,
	// 			}));
	// 		};
	// 		const intervalId = setInterval(updateGame, (1000 / TPS));

	// 		return () => {
	// 			clearInterval(intervalId);
	// 		};
	// 	}
	// }, [gameRunning, ball]);

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
		<p>ball x : {ball.x}</p>
		<p>ball y : {ball.y}</p>
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