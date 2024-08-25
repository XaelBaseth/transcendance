import React, { useState, useEffect, useRef } from 'react';
import '../../styles/PongGameLocal.css';
import { useTranslation } from 'react-i18next';
import { Participant } from '../tournament/provider/TournamentContextProvider';

interface LocalPongGameProps {
	isInTournament?: boolean;
	players?: Participant[];
	manageGameResult?: (winnerSide: string, score: {left: number, right: number}) => void;
	pointsToWin?: number;
}

const LocalPongGame: React.FC<LocalPongGameProps> = ({ isInTournament = false, manageGameResult, pointsToWin = 3, players }) => {
	const { t } = useTranslation();
	const BALL_SPEED = 10;
	const TPS = 10;
	const MAP_HEIGHT = 400;
	const MAP_WIDTH = 600;
	const BALL_DIAMETER = 20;
	const PADDLE_HEIGHT = 100;
	const PADDLE_WIDTH = 21;
	const WIN_SCORE = pointsToWin;
	const initialBallState = {
		x: MAP_WIDTH / 2 - BALL_DIAMETER / 2,
		y: MAP_HEIGHT / 2 - BALL_DIAMETER / 2,
		x_direction: Math.random() < 0.5 ? 1 : -1,
		y_direction: Math.random() < 0.5 ? 1 : -1,
		last_collision: "",
	};
	const initialPaddleState = {
		left: (MAP_HEIGHT - PADDLE_HEIGHT) / 2,
		right: (MAP_HEIGHT - PADDLE_HEIGHT) / 2,
	};
	const [ball, setBall] = useState(initialBallState);
	const [paddles, setPaddles] = useState(initialPaddleState);
	const [gameOver, setGameOver] = useState(false);
	const [gameRunning, setGameRunning] = useState(false);
	const [score, setScore] = useState({ left: 0, right: 0 });
	const ballRef = useRef(null);

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
			if (!gameRunning && !pressedKeys.current.has(' ')) {
				return;
			}

			pressedKeys.current.forEach(key => {
				switch (key) {
					case 'e':
						setPaddles(prev => ({
							...prev,
							left: Math.max(prev.left - 10, 0),
						}));
						break;
					case 'd':
						setPaddles(prev => ({
							...prev,
							left: Math.min(prev.left + 10, MAP_HEIGHT - PADDLE_HEIGHT),
						}));
						break;
					case 'arrowup':
						setPaddles(prev => ({
							...prev,
							right: Math.max(prev.right - 10, 0),
						}));
						break;
					case 'arrowdown':
						setPaddles(prev => ({
							...prev,
							right: Math.min(prev.right + 10, MAP_HEIGHT - PADDLE_HEIGHT),
						}));
						break;
					case ' ':
						if (pausePressed.current === false) {
							if (gameOver) {
								restartGame();
							} else {
								pauseGame();
							}
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

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			clearInterval(interval);
		};
	}, [paddles, gameRunning, gameOver]);

	useEffect(() => {
		if (gameRunning) {
			const updateGame = () => {
				if (ball.x <= PADDLE_WIDTH &&
					ball.x >= 0 &&
					ball.y <= paddles.left + PADDLE_HEIGHT &&
					ball.y + BALL_DIAMETER >= paddles.left && ball.last_collision !== "left") {
					setBall(prevBall => ({
						...prevBall,
						x_direction: -prevBall.x_direction,
						last_collision: "left",
					}));
				} else if (ball.x >= MAP_WIDTH - PADDLE_WIDTH - BALL_DIAMETER &&
					ball.x < MAP_WIDTH - PADDLE_WIDTH &&
					ball.y <= paddles.right + PADDLE_HEIGHT &&
					ball.y + BALL_DIAMETER >= paddles.right && ball.last_collision !== "right") {
					setBall(prevBall => ({
						...prevBall,
						x_direction: -prevBall.x_direction,
						last_collision: "right",
					}));
				}

				if (ball.y <= 0 && ball.last_collision !== "top") {
					setBall(prevBall => ({
						...prevBall,
						y_direction: -prevBall.y_direction,
						last_collision: "top",
					}));
				} else if (ball.y >= MAP_HEIGHT - BALL_DIAMETER && ball.last_collision !== "bottom") {
					setBall(prevBall => ({
						...prevBall,
						y_direction: -prevBall.y_direction,
						last_collision: "bottom",
					}));
				}

				if (ball.x <= 0) {
					const currentScore = score;
					currentScore.right += 1; 
					setScore(currentScore);
					if (currentScore.right >= WIN_SCORE) {
						if (isInTournament) {
							console.log("game over: right wins");
							if (manageGameResult) {
								manageGameResult("right", currentScore);
							}
						}
						setGameOver(true);
						setGameRunning(false);
					} else {
						setBall(initialBallState);
						setPaddles(initialPaddleState);
					}
				} else if (ball.x >= MAP_WIDTH - BALL_DIAMETER) {
					const currentScore = score;
					currentScore.left += 1; 
					setScore(currentScore);
					if (currentScore.left >= WIN_SCORE) {
						if (isInTournament) {
							console.log("game over: left wins");
							if (manageGameResult) {
								manageGameResult("left", currentScore);
							}
						}
						setGameOver(true);
						setGameRunning(false);
					} else {
						setBall(initialBallState);
						setPaddles(initialPaddleState);
					}
				} else {
					setBall(prevBall => ({
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

	const restartGame = () => {
		setBall(initialBallState);
		setPaddles(initialPaddleState);
		setGameOver(false);
		setGameRunning(true);
		setScore({ left: 0, right: 0 });
	};

	const pauseGame = () => {
		setGameRunning(!gameRunning);
	};

	return (
		<>
			<div className="controls">
				{!gameRunning && !gameOver && <button className="button_start" onClick={pauseGame}>{t('pong.start')}</button>}
				{gameRunning && <button className="button_start" onClick={pauseGame}>{t('pong.pause')}</button>}
				{gameOver && <button className="button_start" onClick={restartGame}>{t('pong.playAgain')}</button>}
			</div>
			<div className="controls score-text">
				{isInTournament && players && players.length > 1 && <p>Score : left {players[0].name} : {score.left} vs right : {players[1].name} : {score.right}</p>}
				{!isInTournament && <p>{score.left} - {score.right}</p>}
			</div>
			<div className="ping-pong-container" tabIndex={0} style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
				<div
					className={`paddle paddle-left ${gameRunning ? '' : 'paused'}`}
					style={{ top: `${paddles.left}px` }}
				/>
				<div
					className={`paddle paddle-right ${gameRunning ? '' : 'paused'}`}
					style={{ top: `${paddles.right}px` }}
				/>
				<div
					className={`ball ${gameRunning ? '' : 'paused'}`}
					ref={ballRef}
					style={{
						top: `${ball.y}px`,
						left: `${ball.x}px`,
						width: `${BALL_DIAMETER}px`,
						height: `${BALL_DIAMETER}px`,
						transition: `top ${1 / TPS}s, left ${1 / TPS}s`,
						transitionTimingFunction: 'linear',
					}}
				/>
				{gameOver && (
					<div
						className="game-win"
						style={{
							left: `${score.left >= WIN_SCORE ? 0 : MAP_WIDTH / 2}px`,
							width: MAP_WIDTH / 2,
							height: MAP_HEIGHT,
						}}
					>
						{t('pong.youWin')}
					</div>
				)}
				{gameOver && (
					<div
						className="game-loose"
						style={{
							left: `${score.left >= WIN_SCORE ? MAP_WIDTH / 2 : 0}px`,
							width: MAP_WIDTH / 2,
							height: MAP_HEIGHT,
						}}
					>
						{t('pong.gameOver')}
					</div>
					)}
			</div>
		</>
	);
};

export default LocalPongGame;
