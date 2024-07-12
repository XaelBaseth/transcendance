import React, { useState, useEffect, useRef } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import { useParams } from "react-router-dom";
import '../../styles/GameChat.css';

const PongChat = () => {
	const params = useParams();
	const socketRef = useRef<WebSocket | null>(null);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<{ text: any; role: any; }[]>([]);

	useEffect(() => {
		try {
			const token = localStorage.getItem(ACCESS_TOKEN);
			socketRef.current = new WebSocket('wss://localhost:8000/ws/chat/' + params.roomCode + '/?token=' + token);

			// socketRef.current.onopen = () => {
			// 	if (socketRef.current) {
			// 		socketRef.current.send(JSON.stringify({ message: '' }));
			// 	}
			// };

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
		if (socketRef.current) {
			socketRef.current.onmessage = (e) => {
				const data = JSON.parse(e.data);
				// Ensure data.message is the structure you expect
				if (data != null && typeof data.message === 'string' && typeof data.role === 'string') {
					setMessages(prevMessages => [...prevMessages, { text: data.message, role: data.role }]);
				} else {
					console.error('Received data has an unexpected structure:', data);
				}
			}
		}
	}, []);

	const sendMessage = () => {
		if (socketRef.current) {
			socketRef.current.send(JSON.stringify({ message: message }));
			setMessage('');
		}
	}

	return (<>
		<div id="chat-log" style={{ maxHeight: '300px', overflowY: 'scroll', backgroundColor: 'white' }}>
			{messages.map((msg, index) => (
				<div
					key={index}
					className={msg.role === 'player' ? 'message-player' : 'message-spectator'}
				>
					{msg.text}
				</div>
			))}
		</div>
		<br />
		<input
			id="chat-message-input"
			type="text"
			size={100}
			value={message}
			onChange={e => setMessage(e.target.value)}
		/><br />
		<button onClick={sendMessage}>Send</button>
	</>
	);
};

export default PongChat;