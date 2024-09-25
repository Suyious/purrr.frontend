export interface Message {
    from: string;
    body: string | null;
    image: string | null;
    reply: number | null;
}