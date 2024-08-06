import React, { useState, useEffect } from 'react';
import { RoomProps, useChatContext,ChatMessage } from './ChatProvider';
import { useTranslation } from 'react-i18next';

const ChatComponent = ({ roomId }: { roomId: String }) => {
    const [message, setMessage] = useState<String>('');
    const [messages, setMessages] = useState<{ text: string; role: string; username: string; }[]>([]);
    const {rooms, sendMessage, connectToRoom, listenForMessages} = useChatContext();

    useEffect(() => {
        const room = rooms.find((room: RoomProps) => room.id === roomId);
		if (!room) {
			 connectToRoom(roomId, null);		 
		} else {
			listenForMessages(roomId);
		}
	}, [roomId, rooms]);

    useEffect(() => {
        const room = rooms.find((room: RoomProps) => room.id === roomId);
        if (room) {
            setMessages(room.messages);
        }
    }, [roomId, rooms]);

    const onSendMessage = () => {
        sendMessage(roomId, message);
        setMessage('');
    };

	const { t } = useTranslation();

    return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				<div id="chat-log" style={{ overflowY: 'scroll', backgroundColor: 'white', flexGrow: 1 }}>
					{messages?.map((msg:ChatMessage, index:number) => {
						// Define color based on msg.role
						let  messageColor: string;
						switch (msg.role) {
							case 'player':
								messageColor = 'blue';
								break;
							case 'system':
								messageColor = 'red';
								break;
							case 'spectator':
								messageColor = 'green';
								break;
							default:
								messageColor = 'black'; // Default color
						}

						return (
							<div
								key={index}
								style={{ color: messageColor }}
							>
								{msg.role !== 'system' ? <a href={`/profile/${msg.username}`} style={{ color: messageColor, fontWeight: 'bold' }}>
									{msg.username + " :"}
								</a> : null}

								{" " + msg.text}
							</div>
						);
					})}
				</div>
				<div style={{ marginTop: 'auto' }}>
					<input
						id="chat-message-input"
						type="text"
						value={message}
						onChange={e => setMessage(e.target.value)}
					/><br />
					<button onClick={onSendMessage}>{t('chat.send')}</button>
				</div>
			</div>
		</>
	);
};

export default ChatComponent;