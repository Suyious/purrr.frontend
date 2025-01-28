import { Message } from "./messages";

export enum ClientEvents {
    INIT_USER = 'init_user',
    FIND_PARTNER = 'find_partner',
    SEND_MESSAGE = 'send_message',
    READ_MESSAGE = 'read_message',
    TYPING_START = 'typing_start',
    TYPING_STOP = 'typing_stop',
    START_VIDEO_CALL = 'start_video_call',
    ACCEPT_VIDEO_CALL = "accept_video_call",
    REFUSE_VIDEO_CALL = 'refuse_video_call',
    HANG_VIDEO_CALL = "hang_video_call",
    DISCONNECT_PARTNER = 'disconnect_partner',
}

export enum ServerEvents {
    WAITING = 'waiting',
    MATCHED = 'matched',
    RECEIVE_MESSAGE = 'receive_message',
    MARK_AS_READ = 'mark_as_read',
    SHOW_TYPING = 'show_typing',
    HIDE_TYPING = 'hide_typing',
    RECIEVE_VIDEO_CALL = "recieve_video_call",
    ACCEPTED_VIDEO_CALL = "accepted_video_call",
    REFUSED_VIDEO_CALL = "refused_video_calL",
    HANGED_VIDEO_CALL = "hanged_video_call",
    PARTNER_DISCONNECTED = 'partner_disconnected',
    ERROR = 'error'
}

export interface ClientToServerEvents {
    [ClientEvents.INIT_USER]: (data: { name: string, publicKey: string }) => void;
    [ClientEvents.FIND_PARTNER]: () => void;
    [ClientEvents.SEND_MESSAGE]: (data: { message: string|null, image: string|null, reply: number | null }) => void;
    [ClientEvents.READ_MESSAGE]: (data: { messageId: number }) => void;
    [ClientEvents.TYPING_START]: () => void;
    [ClientEvents.TYPING_STOP]: () => void;
    [ClientEvents.START_VIDEO_CALL]: (data: { offer: string }) => void;
    [ClientEvents.ACCEPT_VIDEO_CALL]: (data: { answer: string }) => void;
    [ClientEvents.REFUSE_VIDEO_CALL]: () => void;
    [ClientEvents.HANG_VIDEO_CALL]: () => void;
    [ClientEvents.DISCONNECT_PARTNER]: () => void;
}

export interface ServerToClientEvents {
    [ServerEvents.WAITING]: () => void;
    [ServerEvents.MATCHED]: (data: { partnerName: string, partnerPk: string }) => void;
    [ServerEvents.RECEIVE_MESSAGE]: (data: Message) => void;
    [ServerEvents.MARK_AS_READ]: (data: {messageId: number}) => void;
    [ServerEvents.SHOW_TYPING]: () => void;
    [ServerEvents.HIDE_TYPING]: () => void;
    [ServerEvents.RECIEVE_VIDEO_CALL]: (data: { offer: string }) => void;
    [ServerEvents.ACCEPTED_VIDEO_CALL]: (data: { answer: string }) => void;
    [ServerEvents.REFUSED_VIDEO_CALL]: () => void;
    [ServerEvents.HANGED_VIDEO_CALL]: () => void;
    [ServerEvents.PARTNER_DISCONNECTED]: () => void;
    [ServerEvents.ERROR]: (data: { message: string }) => void;
}

export type ChatEvents = ClientToServerEvents & ServerToClientEvents;
