import {useEffect, useState } from 'react';
import { RoomProps } from './ChatProvider';
import { ACCESS_TOKEN } from '../../constants';

const useChat = () => {
    const [rooms, setRooms] = useState<RoomProps[]>([]);
    const [currentRoomId, setCurrentRoomId] = useState<String>('global');

    //initialization
    useEffect(() => {
        const initChat = () => {
            try {
				const token = localStorage.getItem(ACCESS_TOKEN);
                const wssConnection = new WebSocket('wss://localhost:8000/ws/chat/global' + '/?token=' + token);
                // TODO c'est ici que ça crotte et qu'il faut le token

				if (wssConnection)
				{
					setRooms([{ id: "global", name: "global", messages: [{text: "Welcome to the chat", role: "system",username: "System"}], wssConnection: wssConnection }]);
				}
            } catch (error) {
				console.error("Error during websocket creation:", error);
			}
		}
		initChat();
    }, []);

    const connectToRoom = (roomId: String) => {
        try {
			// console.log("Creating websocket for room:", roomId);
			const token = localStorage.getItem(ACCESS_TOKEN);
			const wssConnection = new WebSocket('wss://localhost:8000/ws/chat/' + roomId + '/?token=' + token);

			setRooms([...rooms, { id: roomId, name: roomId, messages: [{text: "Welcome to the chat", role: "system",username: "useChat"}], wssConnection: wssConnection }]);
			setCurrentRoomId(roomId);
		}
		catch (error) {
			console.error("Error during websocket creation:", error);
		}
    }
    
    const listenForMessages = (roomId: String) => {
        const filteredRooms: RoomProps[] = rooms.filter( (room: RoomProps)  => room.id === roomId);
		if (filteredRooms.length !== 0) {
			const currentRoom = filteredRooms[0];
			currentRoom.wssConnection.onmessage = (e) => {
				const data = JSON.parse(e.data);
				if (data != null && data.type === 'command')
				{
					manageReceivedCommand(data)
				} else if (data != null && typeof data.text === 'string' && typeof data.role === 'string' && typeof data.username === 'string') {
					currentRoom.messages = [...(currentRoom.messages || []), { text: data.text, role: data.role, username: data.username }];
					
					// Find the index of the room to be replaced
					const roomIndex = rooms.findIndex(room => room.id === roomId);
					// If the room is found, replace it with currentRoom at the same index
					if (roomIndex !== -1) {
						setRooms([
							...rooms.slice(0, roomIndex),
							currentRoom,
							...rooms.slice(roomIndex + 1)
						]);
					}
					// setRooms( [...rooms.filter(room => room.id !== roomId), currentRoom]);
				} else {
					console.error('Received data has an unexpected structure:', data);
				}
			}
		}
    };

    const manageReceivedCommand = (data: any) => {
        if (typeof data.command === 'string')
        {
            switch (data.command) {
                case "open_private_room":
                    if (typeof data.arguments === "string")
                        connectToRoom(data.arguments)
                    break;
                default:
                    console.log("Command not recognized: ", data.command);
                    break;
            }
        }
    }

    const leaveRoom = (roomId: String) => {
        const newRooms :  RoomProps[] = rooms.filter((room: RoomProps) => room.id !== roomId);

		const oldRoom :  RoomProps[] = rooms.filter((room: RoomProps) => room.id === roomId);
		oldRoom[0].wssConnection.close();

		setRooms(newRooms);
    }

    const sendMessage = (roomId: String, message: String) => {
        const filteredRooms: RoomProps[] = rooms.filter( (room: RoomProps)  => room.id === roomId);
        //TODO intercept commands

		const room = filteredRooms[0];

		room.wssConnection.send(JSON.stringify({ message: message }));
	}

    return { rooms, currentRoomId, setCurrentRoomId, connectToRoom, leaveRoom, sendMessage, listenForMessages };
};

export default useChat;