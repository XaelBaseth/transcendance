import React, { useState, useEffect, useRef } from 'react';
import '../../styles/PongGame.css';

const PongLocal = () => {
	const BALL_SPEED = 5
	const TPS = 5
	const MAP_HEIGHT = 400
	const MAP_WIDTH = 600
	const BALL_DIAMETER = 20
	const initialBallState = { x: 290, y: 190, x_direction: Math.random() < 0.5 ? 1 : -1, y_direction: Math.random() < 0.5 ? 0.5 : -0.5, last_collision: "" };
	const initialPaddleState = { left: 150, right: 150 };
	const [ball, setBall] = useState(initialBallState);
	const [paddles, setPaddles] = useState(initialPaddleState);
	const [gameOver, setGameOver] = useState(false);
	const [gameRunning, setGameRunning] = useState(false);
	const ballRef = useRef(null);

	useEffect(() => {
		const handleKeyPress = (e: { key: any; }) => {
			if (!gameRunning) {
				return;
			}
			switch (e.key) {
				case 'ArrowUp':
					setPaddles({ ...paddles, left: Math.max(paddles.left - 10, 0)});
					break;
				case 'ArrowDown':
					setPaddles({ ...paddles, left: Math.min(paddles.left + 10, 300)});
					break;
				case 'z':
					setPaddles({ ...paddles, right: Math.max(paddles.right - 10, 0)});
					break;
				case 's':
					setPaddles({ ...paddles, right: Math.min(paddles.right + 10, 300)});
					break;
				default:
					break;
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [paddles, gameRunning]);

	useEffect(() => {
		if (gameRunning) {
			const updateGame = () => {
				// Check for collisions with paddles
				if (ball.x <= 20 &&
					ball.x >= 0 &&
					ball.y <= paddles.left + 100 &&
					ball.y >= paddles.left && ball.last_collision !== "left") {
					setBall((prevBall) => ({ ...prevBall, x_direction: -prevBall.x_direction, last_collision: "left" }));
				}
				else if (ball.x >= 560 &&
					ball.x < 580 &&
					ball.y <= paddles.right + 100 &&
					ball.y >= paddles.right && ball.last_collision !== "right") {
					setBall((prevBall) => ({ ...prevBall, x_direction: -prevBall.x_direction, last_collision: "right" }));
				}
				// Check for collisions with top and bottom walls
				if (ball.y <= 0 && ball.last_collision !== "top") {
					setBall((prevBall) => ({ ...prevBall, y_direction: -prevBall.y_direction, last_collision: "top" }));
				} else if (ball.y >= MAP_HEIGHT - BALL_DIAMETER && ball.last_collision !== "bottom") {
					setBall((prevBall) => ({ ...prevBall, y_direction: -prevBall.y_direction, last_collision: "bottom" }));
				}
				// check for collisions with left and right walls
				if (ball.x <= 0) {
					setGameOver(true);
					setGameRunning(false);
				} else if (ball.x >= MAP_WIDTH - BALL_DIAMETER) {
					setGameOver(true);
					setGameRunning(false);
				} else {
					setBall((prevBall) => ({
						...prevBall,
						x: prevBall.x + prevBall.x_direction * BALL_SPEED,
						y: prevBall.y + prevBall.y_direction * BALL_SPEED,
					}));
				}
			};
			const intervalId = setInterval(updateGame, (1000 / TPS));

			return () => {
				clearInterval(intervalId);
			};
		}
	}, [gameRunning, ball]);

	const startGame = () => {
		if (!gameRunning) {
			setGameRunning(true);
			setGameOver(false);
		}
	};

	const restartGame = () => {
		setBall(initialBallState);
		setPaddles(initialPaddleState);
		setGameOver(false);
		setGameRunning(true);
	};

	const pauseGame = () => {
		setGameRunning(!gameRunning);
	};

	return (<>
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
export default PongLocal;