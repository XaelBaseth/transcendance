import React, { createContext, useContext, useEffect, useState } from 'react';
import useChat  from './useChat';

export interface ChatMessage {
    text: string;
    role: string;
    username: string;
};

export interface RoomProps {
    id: String,
    name: String,
    wssConnection: WebSocket,
    messages: ChatMessage[],
};

interface ChatContextProps {
    rooms: RoomProps[],
    currentRoomId: String,
    setCurrentRoomId: (roomId: String) => void,
    connectToRoom: (roomId: String) => void,
    leaveRoom: (roomId: String) => void,
    sendMessage: (roomId: String, message: String) => void,
    listenForMessages: (roomId: String) => void,
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatContextProvider: React.FC = ({ children }) => {
    const {
        rooms,
        currentRoomId,
        setCurrentRoomId,
        connectToRoom,
        leaveRoom,
        sendMessage,
        listenForMessages,
    } = useChat();

    return  <ChatContext.Provider value={{
        rooms,
        currentRoomId,
        setCurrentRoomId,
        connectToRoom,
        leaveRoom,
        sendMessage,
        listenForMessages,
    }}>
        {children}</ChatContext.Provider>;
    };

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatContextProvider');
    }
    return context;
}