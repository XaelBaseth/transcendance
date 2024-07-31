import React, { useState } from 'react';
import { RoomProps, useChatContext } from './ChatProvider';
import ChatComponent from './ChatComponent';
import { useTranslation } from 'react-i18next';

const FloatingChat = () => {
    const [open, setOpen] = useState<boolean>(false);
    const {rooms, currentRoomId, setCurrentRoomId} = useChatContext();

	const toggleOpen = () => setOpen(!open);

	const { t } = useTranslation();

    return (<>
    {!open && (
				<button
					style={{
						position: 'fixed',
						bottom: '30px',
						right: '10px',
						height: '60px',
						width: '160px',
						borderRadius: '10px',
						backgroundColor: '#007bff',
						color: '#ffffff',
						border: 'none',
						outline: 'none',
						boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
						fontSize: '24px',
						cursor: 'pointer',
						zIndex: 1000, // Ensure it's above other elements
					}}
					onClick={toggleOpen}
				>
					{"💬 chat " + "    ⬆️"}
				</button>
			)}
			{open && (
				<div style={{
					position: 'fixed',
					bottom: '30px',
					right: '10px', width: '400px', height: '600px', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden', zIndex: 1000,
				}}>
					<div style={{ position: 'absolute', top: '0', right: '0', padding: '10px', textAlign: 'center', zIndex: '1' }}>
						<button onClick={() => setOpen(false)}>{t('chat.close')}</button>
					</div>
					<div style={{ position: 'absolute', top: '0', left: '0', padding: '10px', textAlign: 'center', zIndex: '1' }}>
						{
						rooms?.map((room : RoomProps) => (
							<button key={"button" + room.id} onClick={() => setCurrentRoomId(room.id)}>
							{room.name}
							</button>
						))}
					</div>
					<div style={{ position: 'absolute', top: '50px', bottom: '0', left: '0', right: '0', overflowY: 'auto', padding: '10px' }}>
						<ChatComponent roomId={currentRoomId} />
					</div>
				</div>
			)}
    </>)
};

export default FloatingChat;