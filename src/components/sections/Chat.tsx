import ExitIcon from "@/assets/icons/exit";
import RefreshIcon from "@/assets/icons/refresh";
import ScrollDown from "@/assets/icons/scrollDown";
import { Message } from "@/types/messages";
import { ChangeEvent, FormEvent, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "../resusable/ChatInput";
import { ChatDisplay } from "../resusable/ChatDisplay";
import CallIcon from "@/assets/icons/call";

type ChatProps = {
    partner: string,
    messages: Message[],
    readIndex: number | null,
    partnerTyping: boolean,
    onMessage: (message: string | null, image: string | null, reply: number | null) => void,
    onVideoCall: () => void,
    startVideoCall: () => void,
    incomingCall: boolean,
    ongoingCall: boolean,
    declineIncomingCall: () => void,
    onStop: () => void,
    onReconnect: () => void,
    readMessage: (messageId: number) => void,
    startTyping: () => void,
    stopTyping: () => void,
}

export default function Chat({
    partner, messages, readIndex, partnerTyping, onMessage, onVideoCall, incomingCall, ongoingCall, startVideoCall, declineIncomingCall,
    onStop, onReconnect, readMessage, startTyping, stopTyping }: ChatProps
) {

    const message = useRef<HTMLTextAreaElement>(null);
    const fileinput = useRef<HTMLInputElement>(null);
    const chatBottom = useRef<HTMLDivElement>(null);
    const chatInput = useRef<HTMLFormElement>(null)
    const timer = useRef<number>();

    const TYPINGTIMEOUT = 500;

    const [attachment, setAttachment] = useState<string>("");
    const [unread, setUnread] = useState<number>(0);
    const [typing, setTyping] = useState<boolean>(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [chatHeightOffset, setChatHeightOffset] = useState<number>(5);

    const scrollToBottom = useCallback(() => {
        if (!document.hidden) {
            setUnread(0);
            readMessage(messages.length - 1);
        }
        chatBottom.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, readMessage])

    function isScrolledToBottom(offsetBefore = 60, offsetAfter = 350) {
        const rect = chatBottom.current?.getBoundingClientRect();
        return (rect && rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) - offsetBefore
            && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offsetAfter);
    }

    function isScrollAvailable(offset = 60) {
        const rect = chatBottom.current?.getBoundingClientRect();
        return (rect && !(rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - offset))
    }

    useEffect(() => {
        if (messages.length > 0) {
            const last_message = messages[messages.length - 1];
            if (!isScrollAvailable()) {
                if (!document.hidden) {
                    readMessage(messages.length - 1);
                } else {
                    setUnread(n => n + 1);
                }
            } else {
                if (isScrolledToBottom() || last_message.from === "You") {
                    scrollToBottom();
                    if (document.hidden) setUnread(n => n + 1);
                } else if (last_message.from !== "You") {
                    setUnread(n => n + 1);
                }
            }
        }
    }, [messages, readMessage, scrollToBottom]);

    const markReadIfViewed = useCallback(() => {
        if (isScrolledToBottom() || !isScrollAvailable()) {
            setUnread(0);
            if (!document.hidden) readMessage(messages.length - 1);
        }
    }, [messages.length, readMessage])

    useEffect(() => {
        if (unread > 0) {
            document.title = `${partner}: ${unread} New Message(s) | On Purrr.chat`
            window.addEventListener('scroll', markReadIfViewed);
        } else {
            document.title = `Connected with ${partner} | On Purrr.chat`
            window.removeEventListener('scroll', markReadIfViewed);
        }

        return () => {
            window.removeEventListener('scroll', markReadIfViewed);
        }
    }, [markReadIfViewed, partner, unread])

    useEffect(() => {
        document.addEventListener("visibilitychange", markReadIfViewed);

        return () => {
            document.removeEventListener("visibilitychange", markReadIfViewed);
        }
    }, [markReadIfViewed])

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            setChatHeightOffset(entries[0].contentRect.height + 32)
            scrollToBottom();
        });
        let ref = null;
        if (chatInput.current) {
            observer.observe(chatInput.current)
            ref = chatInput.current;
        }

        return () => {
            if (ref) observer.unobserve(ref)
        }
    }, [chatInput.current?.height, scrollToBottom])

    const onMessageChange: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            submitMessage();
            return;
        }
        window.clearTimeout(timer.current);
        if (!typing) {
            startTyping();
            setTyping(true);
        }
        timer.current = window.setTimeout(() => {
            stopTyping();
            setTyping(false);
        }, TYPINGTIMEOUT)
    }

    function submitMessage() {
        let msg: string | null = null, img: string | null = null, reply: number | null = null;

        if (message.current) {
            if (message.current.value.trim() !== "") msg = message.current.value;
            message.current.value = "";
            message.current.focus();
        }

        if (attachment.length !== 0) {
            img = attachment;
            setAttachment("");
        }

        if (replyingTo !== null) {
            reply = replyingTo;
            setReplyingTo(null);
        }

        if (msg || img) onMessage(msg, img, reply);
        stopTyping();
        setTyping(false);
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        submitMessage();
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            // Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target?.result as string;
                // setAttachments(attachs => [...attachs, base64Image]);
                setAttachment(base64Image);
                event.target.value = "";
            };
            reader.readAsDataURL(file);
            // })
        }
        message.current?.focus();
    }

    function onRefresh() {
        onStop();
        onReconnect();
    }

    function clearAttachment() {
        setAttachment("");
        if (fileinput.current) fileinput.current.value = "";
        message.current?.focus();
    }

    function replyTo(messageId: number | null) {
        setReplyingTo(messageId);
        message.current?.focus();
    }

    return (
        <section className={"w-full flex justify-center items-end relative font-text"}>

            <ChatDisplay chatBottom={chatBottom} chatHeightOffset={chatHeightOffset} messages={messages} partner={partner} readIndex={readIndex} replyTo={replyTo} />

            {unread > 0 && <button onClick={scrollToBottom} className="fixed bottom-[5em]">
                <div className="bg-foreground font-[800] font-mono text-background text-[0.8em] w-5 h-5 flex justify-center items-center rounded-[50%] absolute right-0">{unread}</div>
                <ScrollDown />
            </button>}

            <header className="fixed top-0 left-0 w-full bg-background font-display">
                <div className="w-[1080px] max-w-full p-4 m-auto flex justify-between items-end">
                    <div className="">
                        <h4 className="text-[0.8em]">You&apos;re connected to</h4>
                        <h2>{partner} {partnerTyping && <small className="font-text">Typing...</small>}</h2>
                    </div>
                    {incomingCall && <div className="flex gap-2 ml-auto">
                        Incoming Video Call
                        <button className="p-2 rounded-full bg-green-500" onClick={startVideoCall}>Yes</button>
                        <button className="p-2 rounded-full bg-red-500" onClick={declineIncomingCall}>No</button>
                    </div>}
                    {ongoingCall && <div className="flex gap-2 ml-auto">
                        In a Video Call 00:00 (insert dynamic counter here)
                    </div>}
                    <div className="flex gap-2 ml-auto mr-8">
                        {!(incomingCall || ongoingCall) && <button onClick={onVideoCall}>
                            <CallIcon />
                        </button>
                        }
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onRefresh}><RefreshIcon /></button>
                        <button onClick={onStop}><ExitIcon /></button>
                    </div>
                </div>
            </header>

            <ChatInput
                replyingTo={replyingTo} onSubmit={onSubmit}
                attachment={attachment} messages={messages} chatInput={chatInput}
                fileinput={fileinput} message={message}
                onFileChange={onFileChange} onMessageChange={onMessageChange}
                clearAttachment={clearAttachment} replyTo={replyTo}
            />

        </section>
    )
}
