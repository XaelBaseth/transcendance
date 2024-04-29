import React from "react";
import { Socket } from 'socket.io-client';

/** a React context is a global value via through thwe the entire
    React app.*/

export const IsLoggedInContext = React.createContext<boolean>(false);
export const SocketContext = React.createContext<Socket | null>(null);
