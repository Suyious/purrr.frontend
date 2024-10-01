"use client"
import { ClientEvents, ClientToServerEvents, ServerEvents, ServerToClientEvents } from "@/types/events";
import { Message } from "@/types/messages";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
    generateKeyPair,
    deriveSharedSecret,
    encryptMessage,
    decryptMessage,
    exportPublicKey,
    importPublicKey
} from '../utils/encryption';
import { getKey, KeyTransaction, storeKey } from "@/utils/keyTransaction";

export const useChatSocket = () => {

    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3007';

    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [partner, setPartner] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [readIndex, setReadIndex] = useState<number | null>(null);
    const [partnerTyping, setPartnerTyping] = useState(false);

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL) as Socket<ServerToClientEvents, ClientToServerEvents>;
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
        });

        newSocket.on('disconnect', async () => {
            setIsConnected(false);
            setUser(null);
            setPartner(null);
            setIsWaiting(false);

            await storeKey(KeyTransaction.SELF_PK, null);
            await storeKey(KeyTransaction.PARTNER_PK, null);

            console.log('Disconnected from server');
        });

        newSocket.on(ServerEvents.WAITING, () => {
            setIsWaiting(true);
            console.log("Waiting to connect");
        })

        newSocket.on(ServerEvents.MATCHED, async ({ partnerName, partnerPk }) => {
            setPartner(partnerName);

            const partnerPublicK = await importPublicKey(partnerPk);
            await storeKey(KeyTransaction.PARTNER_PK, partnerPublicK);

            setIsWaiting(false);
            console.log("Matched with a Partner");
            setMessages([]);
        });

        newSocket.on(ServerEvents.RECEIVE_MESSAGE, async (data) => {

            const partnerPk = await getKey(KeyTransaction.PARTNER_PK);
            const selfPk = await getKey(KeyTransaction.SELF_PK);
            const sharedSecret = await deriveSharedSecret(selfPk!, partnerPk!);
            const decryptedMsg = data.body ? await decryptMessage(data.body, sharedSecret) : null;
            const decryptedImg = data.image? await decryptMessage(data.image, sharedSecret): null;

            data.body = decryptedMsg;
            data.image = decryptedImg;
            setMessages(prevMessages => [...prevMessages, data]);
        });

        newSocket.on(ServerEvents.MARK_AS_READ, ({ messageId }) => {
            setReadIndex(messageId);
        })

        newSocket.on(ServerEvents.SHOW_TYPING, () => {
            setPartnerTyping(true);
        });

        newSocket.on(ServerEvents.HIDE_TYPING, () => {
            setPartnerTyping(false);
        });

        newSocket.on(ServerEvents.PARTNER_DISCONNECTED, async () => {
            setPartner(null);
            await storeKey(KeyTransaction.PARTNER_PK, null);
        })

        return () => {
            newSocket.disconnect();
        };

    }, [SOCKET_SERVER_URL])

    const setUserName = useCallback(async (name: string) => {

        const keyPair = await generateKeyPair();
        const publicKey = await exportPublicKey(keyPair.publicKey);
        await storeKey(KeyTransaction.SELF_PK, keyPair.privateKey);

        socket?.emit(ClientEvents.INIT_USER, { name, publicKey });
        setUser(name);
        if (typeof window != 'undefined' && window.localStorage) {
            localStorage.setItem("username", name);
        }
    }, [socket]);

    const findPartner = useCallback(() => {
        socket?.emit(ClientEvents.FIND_PARTNER);
    }, [socket]);

    const sendMessage = useCallback(async (message: string | null = null, image: string | null = null, reply: number | null = null) => {
        if (socket && partner) {
            setMessages(prevMessages => [...prevMessages, { from: 'You', body: message, image, reply }]);

            const partnerPk = await getKey(KeyTransaction.PARTNER_PK);
            const selfPk = await getKey(KeyTransaction.SELF_PK);
            const sharedSecret = await deriveSharedSecret(selfPk!, partnerPk!);
            const encryptedMsg = message ? await encryptMessage(message, sharedSecret) : null;
            const encryptedImg = image? await encryptMessage(image, sharedSecret, true): null;
            
            socket.emit(ClientEvents.SEND_MESSAGE, { message: encryptedMsg, image: encryptedImg, reply });
        }
    }, [socket, partner]);

    const readMessage = useCallback((messageId: number) => {
        if (socket && partner) {
            socket.emit(ClientEvents.READ_MESSAGE, { messageId });
        }
    }, [socket, partner])

    const startTyping = useCallback(() => {
        if (socket && partner) {
            socket.emit(ClientEvents.TYPING_START);
        }
    }, [socket, partner]);

    const stopTyping = useCallback(() => {
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
        partnerTyping,
        setUserName,
        findPartner,
        sendMessage,
        readMessage,
        startTyping,
        stopTyping,
        disconnect,
    }
}
