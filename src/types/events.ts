import { Message } from "./messages";

export enum ClientEvents {
    INIT_USER = 'init_user',
    FIND_PARTNER = 'find_partner',
    SEND_MESSAGE = 'send_message',
    READ_MESSAGE = 'read_message',
    TYPING_START = 'typing_start',
    TYPING_STOP = 'typing_stop',
    DISCONNECT_PARTNER = 'disconnect_partner'
}

export enum ServerEvents {
    WAITING = 'waiting',
    MATCHED = 'matched',
    RECEIVE_MESSAGE = 'receive_message',
    MARK_AS_READ = 'mark_as_read',
    SHOW_TYPING = 'show_typing',
    HIDE_TYPING = 'hide_typing',
    PARTNER_DISCONNECTED = 'partner_disconnected',
    ERROR = 'error'
}

export interface ClientToServerEvents {
    [ClientEvents.INIT_USER]: (data: { name: string }) => void;
    [ClientEvents.FIND_PARTNER]: () => void;
    [ClientEvents.SEND_MESSAGE]: (data: { message: string|null, image: string|null }) => void;
    [ClientEvents.READ_MESSAGE]: (data: { messageId: number }) => void;
    [ClientEvents.TYPING_START]: () => void;
    [ClientEvents.TYPING_STOP]: () => void;
    [ClientEvents.DISCONNECT_PARTNER]: () => void;
}

export interface ServerToClientEvents {
    [ServerEvents.WAITING]: () => void;
    [ServerEvents.MATCHED]: (data: { partnerName: string }) => void;
    [ServerEvents.RECEIVE_MESSAGE]: (data: Message) => void;
    [ServerEvents.MARK_AS_READ]: (data: {messageId: number}) => void;
    [ServerEvents.SHOW_TYPING]: () => void;
    [ServerEvents.HIDE_TYPING]: () => void;
    [ServerEvents.PARTNER_DISCONNECTED]: () => void;
    [ServerEvents.ERROR]: (data: { message: string }) => void;
}

export type ChatEvents = ClientToServerEvents & ServerToClientEvents;
