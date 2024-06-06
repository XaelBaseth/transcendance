import React, { useState, useEffect, useRef } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import { useParams } from "react-router-dom";

const PongChat = () => {
	const params = useParams();
	const socketRef = useRef<WebSocket | null>(null);
	const [message, setMessage] = useState('');

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
				const chatLog = document.getElementById('chat-log');
				if (chatLog) {
					chatLog.innerHTML += data.message + '\n';
				}
			}
		}
	}, []);

	const sendMessage = () => {
		if (socketRef.current) {
			socketRef.current.send(JSON.stringify({ message: message }));
		}
	}

	return (<>
		<textarea id="chat-log" cols={100} rows={20}></textarea><br />
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