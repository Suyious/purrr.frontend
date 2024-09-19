import { Socket } from "socket.io-client";

export interface User {
    id: string;
    name: string | null;
    socket: Socket;
    partner: string | null;
}