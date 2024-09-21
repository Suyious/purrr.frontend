import { Message } from "./messages";

export enum ClientEvents {
    INIT_USER = 'init_user',
    FIND_PARTNER = 'find_partner',
    SEND_MESSAGE = 'send_message',
    SHARE_IMAGE = 'share_image',
    DISCONNECT_PARTNER = 'disconnect_partner'
}

export enum ServerEvents {
    WAITING = 'waiting',
    MATCHED = 'matched',
    RECEIVE_MESSAGE = 'receive_message',
    RECEIVE_IMAGE = 'receive_image',
    PARTNER_DISCONNECTED = 'partner_disconnected',
    ERROR = 'error'
}

export interface ClientToServerEvents {
    [ClientEvents.INIT_USER]: (data: { name: string, gender: string }) => void;
    [ClientEvents.FIND_PARTNER]: () => void;
    [ClientEvents.SEND_MESSAGE]: (data: { message: string|null, image: string|null }) => void;
    [ClientEvents.SHARE_IMAGE]: (data: { image: string }) => void;
    [ClientEvents.DISCONNECT_PARTNER]: () => void;
}

export interface ServerToClientEvents {
    [ServerEvents.WAITING]: () => void;
    [ServerEvents.MATCHED]: (data: { partnerName: string, partnerGender: string }) => void;
    [ServerEvents.RECEIVE_MESSAGE]: (data: Message) => void;
    [ServerEvents.RECEIVE_IMAGE]: (data: { from: string; image: string }) => void;
    [ServerEvents.PARTNER_DISCONNECTED]: () => void;
    [ServerEvents.ERROR]: (data: { message: string }) => void;
}

export type ChatEvents = ClientToServerEvents & ServerToClientEvents;
