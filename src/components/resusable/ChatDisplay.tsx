import ReplyIcon from "@/assets/icons/reply";
import { Message } from "@/types/messages"
import { setEmojiSize, truncate } from "@/utils";
import Image from "next/image";
import { RefObject } from "react";

type ChatDisplayProps = {
    chatHeightOffset: number;
    messages: Message[];
    replyTo(messageId: number | null): void;
    partner: string;
    readIndex: number | null;
    chatBottom: RefObject<HTMLDivElement>;
}

export function ChatDisplay({chatHeightOffset, messages, replyTo, partner, readIndex, chatBottom}: ChatDisplayProps) {
    return (
        <div className="flex flex-col justify-end max-w-full min-h-full pt-[5em]" style={{
            paddingBottom: chatHeightOffset + "px",
        }}>
            {messages.map((message, i) => (
                (message.body || message.image) &&
                <div key={i} className="group flex flex-col px-4" style={{
                    alignItems: message.from === "You" ? "end" : "start"
                }}>
                    {(i === 0 || message.from !== messages[i - 1].from) &&
                        <h5 className="text-[0.8em] pt-4">{message.from}</h5>}
                    {message.reply !== null &&
                        <div className="flex flex-col border-foreground px-2" style={{
                            alignItems: message.from === "You" ? "end" : "start",
                            borderRightWidth: message.from === "You" ? "3px" : "0",
                            borderLeftWidth: message.from === "You" ? "0" : "3px",
                        }}>
                            <h3 className="text-[0.7em]">Replying to {messages[message.reply].from}</h3>
                            <p className="text-[0.8em]">{messages[message.reply].image && "(Attachment)"}{truncate(messages[message.reply].body)}</p>
                        </div>}
                    {message.image &&
                        <div className="flex items-center gap-4" style={{ flexDirection: message.from === "You" ? "row-reverse" : "row" }}>
                            <Image src={decodeURIComponent(message.image)} alt="Image" width="0" height="0" sizes="100vw" className="w-[10em] h-auto max-h-[20em]" />
                            <div className="hidden group-hover:flex items-center gap-2">
                                <button onClick={() => replyTo(i)}><ReplyIcon width="18" /></button>
                                {/* <button><MenuIcon width="20" /></button> */}
                            </div>
                        </div>}
                    {message.body && message.body.trim() !== "" &&
                        <div className="flex items-center gap-4" style={{ flexDirection: message.from === "You" ? "row-reverse" : "row" }}>
                            <h3 className="max-w-[70vw] break-words whitespace-pre-line" style={{ fontSize: setEmojiSize(message.body) }}>{message.body}</h3>
                            {!message.image && <div className="hidden group-hover:flex items-center gap-2">
                                <button onClick={() => replyTo(i)}><ReplyIcon width="18" /></button>
                                {/* <button><MenuIcon width="20" /></button> */}
                            </div>}
                        </div>}
                    {i === readIndex && (message.from === "You" ?
                        <p className="text-[0.7em] self-end">Read by {partner}</p> :
                        <div className="h-[1em]" />)}
                </div>
            ))}
            <div ref={chatBottom}></div>
        </div>
    )
}