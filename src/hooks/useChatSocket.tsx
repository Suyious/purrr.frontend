"use client"
import { ClientEvents, ClientToServerEvents, ServerEvents, ServerToClientEvents } from "@/types/events";
import { Message } from "@/types/messages";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useChatSocket = () => {

    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3007';

    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [partner, setPartner] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [readIndex, setReadIndex] = useState<number|null>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL) as Socket<ServerToClientEvents, ClientToServerEvents>;
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            setUser(null);
            setPartner(null);
            setIsWaiting(false);
            console.log('Disconnected from server');
        });

        newSocket.on(ServerEvents.WAITING, () => {
            setIsWaiting(true);
            console.log("Waiting to connect");
        })

        newSocket.on(ServerEvents.MATCHED, ({ partnerName }) => {
            setPartner(partnerName);
            setIsWaiting(false);
            console.log("Matched with a Partner");
            setMessages([]);
        });

        newSocket.on(ServerEvents.RECEIVE_MESSAGE, (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        newSocket.on(ServerEvents.MARK_AS_READ, ({ messageId }) => {
            setReadIndex(messageId);
        })

        newSocket.on(ServerEvents.PARTNER_DISCONNECTED, () => {
            setPartner(null);
        })

        return () => {
            newSocket.disconnect();
        };

    }, [SOCKET_SERVER_URL])

    const setUserName = useCallback((name: string) => {
        socket?.emit(ClientEvents.INIT_USER, { name });
        setUser(name);
        if (typeof window != 'undefined' && window.localStorage) {
          localStorage.setItem("username", name);
        }
    }, [socket]);

    const findPartner = useCallback(() => {
        socket?.emit(ClientEvents.FIND_PARTNER);
    }, [socket]);

    const sendMessage = useCallback((message: string | null = null, image: string | null = null) => {
        if (socket && partner) {
            socket.emit(ClientEvents.SEND_MESSAGE, { message, image });
            setMessages(prevMessages => [...prevMessages, { from: 'You', body: message, image }]);
        }
    }, [socket, partner]);

    const readMessage = useCallback((messageId: number) => {
        if(socket && partner) {
            socket.emit(ClientEvents.READ_MESSAGE, { messageId });
        }
    }, [socket, partner])

    const typingStart = useCallback(() => {
      if (socket && partner) {
        socket.emit(ClientEvents.TYPING_START);
      }
    }, [socket, partner]);

    const typingStop = useCallback(() => {
      if (socket && partner) {
        socket.emit(ClientEvents.TYPING_STOP);
      }
    }, [socket, partner]);

    const disconnect = useCallback(() => {
        socket?.emit(ClientEvents.DISCONNECT_PARTNER);
    }, [socket]);

    return {
        user,
        partner,
        messages,
        isConnected,
        isWaiting,
        readIndex,
        setUserName,
        findPartner,
        sendMessage,
        readMessage,
        disconnect,
    }
}
