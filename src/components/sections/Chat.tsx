import ExitIcon from "@/assets/icons/exit";
import RefreshIcon from "@/assets/icons/refresh";
import VideoIcon from "@/assets/icons/video";
import AudioIcon from "@/assets/icons/audio";
import ScrollDown from "@/assets/icons/scrollDown";
import MenuIcon from "@/assets/icons/menu";
import ChatIcon from "@/assets/icons/chat";
import PhoneIcon from "@/assets/icons/phone";
import { Message } from "@/types/messages";
import { ChangeEvent, FormEvent, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "../resusable/ChatInput";
import { ChatDisplay } from "../resusable/ChatDisplay";
import MirrorIcon from "@/assets/icons/mirror";

type ChatProps = {
    partner: string,
    messages: Message[],
    readIndex: number | null,
    partnerTyping: boolean,
    videoIncoming: boolean,
    videoShow: boolean,
    localStream: MediaStream | null,
    remoteStream: MediaStream | null,
    connected: boolean,
    onMessage: (message: string | null, image: string | null, reply: number | null) => void,
    onStop: () => void,
    onReconnect: () => void,
    readMessage: (messageId: number) => void,
    startTyping: () => void,
    stopTyping: () => void,
    startVideoCall: () => void,
    refuseIncomingVideoCall: () => void, 
    acceptIncomingVideoCall: () => void,
    hangOngoingVideoCal: () => void,
}

export default function Chat({ 
    partner, messages, readIndex, partnerTyping, videoIncoming, videoShow, onMessage, onStop,
    onReconnect, readMessage, startTyping, stopTyping,
    startVideoCall, refuseIncomingVideoCall, acceptIncomingVideoCall,
    localStream, remoteStream, connected, hangOngoingVideoCal }: ChatProps
) {

    const message = useRef<HTMLTextAreaElement>(null);
    const fileinput = useRef<HTMLInputElement>(null);
    const chatBottom = useRef<HTMLDivElement>(null);
    const chatInput = useRef<HTMLFormElement>(null)
    const timer = useRef<number>();

    const localVideoFeed = useRef<HTMLVideoElement>(null);
    const remoteVideoFeed = useRef<HTMLVideoElement>(null);

    const TYPINGTIMEOUT = 500;

    const [attachment, setAttachment] = useState<string>("");
    const [unread, setUnread] = useState<number>(0);
    const [typing, setTyping] = useState<boolean>(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [chatHeightOffset, setChatHeightOffset] = useState<number>(80);

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
        if(chatInput.current) {
            observer.observe(chatInput.current)
            ref = chatInput.current;
        }

        return () => {
            if(ref) observer.unobserve(ref)
        }
    }, [chatInput.current?.height, scrollToBottom])

    const onMessageChange: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if(e.key === "Enter" && e.shiftKey === false) {
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

        if(replyingTo !== null) {
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
        if(fileinput.current) fileinput.current.value = "";
        message.current?.focus();
    }

    function replyTo(messageId: number | null) {
        setReplyingTo(messageId);
        message.current?.focus();
    }

    useEffect(() => {
        if (localVideoFeed.current) {
            localVideoFeed.current.srcObject = localStream;
        }
    }, [localStream, videoShow])

    useEffect(() => {
        if (remoteVideoFeed.current) {
            remoteVideoFeed.current.srcObject = remoteStream;
        }
    }, [remoteStream, connected, videoShow])

    function onVideoCallStart() {
        if(!connected) {
            startVideoCall();
        }
    }

    const [videoTrackEnabled, setVideoTrackEnabled] = useState<boolean>(true);
    const [audioTrackEnabled, setAudioTrackEnabled] = useState<boolean>(true);

    useEffect(() => {
        if(localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = videoTrackEnabled;
        }
    }, [localStream, videoTrackEnabled])

    useEffect(() => {
        if(localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = audioTrackEnabled;
        }

    }, [localStream, audioTrackEnabled])

    const [videoFlipped, setVideoFlipped] = useState<boolean>(true);

    return (
        <div className="flex w-full h-full justify-between">

            <header className="fixed z-[99] bg-background top-0 left-0 w-full">
                <div className="relative w-[1080px] h-[4em] max-w-full m-auto px-4 flex justify-between items-center">
                    <div className="">
                        <h4 className="text-[0.8em] font-text leading-3">You&apos;re connected to</h4>
                        <h2>{partner} {partnerTyping && <small className="font-text">Typing...</small>}</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="relative" onClick={onVideoCallStart}><VideoIcon /> { connected && <div className="w-2 h-2 absolute -top-1 -right-1 bg-green-400 rounded-full"></div>}</button>
                        <button onClick={onRefresh}><RefreshIcon /></button>
                        <button onClick={onStop}><ExitIcon /></button>
                    </div>
                    { videoIncoming && <div className="absolute bg-background -bottom-3/4 right-5 rounded-lg border-2 border-white p-2 font-text flex gap-2">
                        <div className="">Video Incoming</div>
                        <button onClick={acceptIncomingVideoCall} className="text-sm bg-green-600 px-2 rounded-lg">Accept</button>
                        <button onClick={refuseIncomingVideoCall} className="text-sm bg-red-400 px-2 rounded-lg">Refuse</button>
                    </div>}
                </div>
            </header>

            { videoShow && <section className="flex-[2] h-dvh relative">
                <div className="w-full max-w-[800px] h-[calc(100dvh-7em)] md:h-[30em] mt-[6em] px-4 m-auto relative">
                    <video ref={remoteVideoFeed} id='remote-video' className='rounded-lg w-full h-full' loop autoPlay playsInline
                        style={{ objectFit: "cover" }}
                    ></video>

                    <div className="absolute group bottom-[6em] md:-bottom-5 right-7 md:-right-5 w-[20vw] transition-all duration-150 hover:w-[30vw] hover:md:w-[25vw] h-[20vh] hover:h-[30vh] hover:md:h-[25vh] rounded-lg overflow-hidden">
                        <video ref={localVideoFeed} id='local-video' className='w-full h-full object-cover'
                            style={{
                                transform: videoFlipped? "rotateY(180deg)": "rotateY(0)",
                            }}
                            muted loop autoPlay playsInline
                        ></video>
                        <button onClick={() => setVideoFlipped(p => !p)} className="hidden group-hover:block absolute top-2 right-2">
                            <MirrorIcon/>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-[1em] w-full left-1/2 px-4 -translate-x-1/2">
                    <div className="bg-slate-500/60 w-full max-w-[800px] m-auto h-[5em] rounded-3xl flex justify-between items-center px-4">
                        <div className="">
                            <button className="w-[3em] h-[3em] sm:w-[4em] sm:h-[4em] flex justify-center items-center bg-white/40 rounded-[50px]">
                                <MenuIcon width="30"/>
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setVideoTrackEnabled(p => !p)}
                                className={`w-[3em] h-[3em] sm:w-[4em] sm:h-[4em] flex justify-center items-center rounded-[50px] ${ videoTrackEnabled ? "bg-blue-600": "bg-white/40"}`}>
                                <VideoIcon width="30"/>
                            </button>
                            <button onClick={hangOngoingVideoCal} className="w-[3em] h-[3em] sm:w-[4em] sm:h-[4em] flex justify-center items-center bg-red-500 rounded-[50px]">
                                <PhoneIcon width="30"/>
                            </button>
                            <button onClick={() => setAudioTrackEnabled(p => !p)}
                                className={`w-[3em] h-[3em] sm:w-[4em] sm:h-[4em] flex justify-center items-center rounded-[50px] ${ audioTrackEnabled ? "bg-blue-500": "bg-white/40"}`}>
                                <AudioIcon width="30"/>
                            </button>
                        </div>
                        <div className="">
                            <button className="w-[3em] h-[3em] sm:w-[4em] sm:h-[4em] flex justify-center items-center bg-white/40 rounded-[50px]">
                                <ChatIcon width="30"/>
                            </button>
                        </div>
                    </div>
                </div>

            </section>}

            <section className={`flex-[1] relative w-full font-text  ${videoShow ? "hidden lg:block": "block"}`}>

                <div className="h-dvh w-full overflow-y-scroll">
                    <div className="w-full max-w-[1080px] m-auto">
                        <ChatDisplay chatBottom={chatBottom} chatHeightOffset={chatHeightOffset} messages={messages} partner={partner} readIndex={readIndex} replyTo={replyTo}/>
                    </div>
                </div>

                {unread > 0 && <button onClick={scrollToBottom} className="absolute bottom-[5em] left-1/2 -translate-x-1/2">
                    <div className="bg-foreground font-[800] font-mono text-background text-[0.8em] w-5 h-5 flex justify-center items-center rounded-[50%] absolute right-0">{unread}</div>
                    <ScrollDown />
                </button>}


                <div className="absolute bottom-[1em] w-full left-1/2 px-4 -translate-x-1/2">
                    <div className="w-full max-w-[1080px] m-auto">
                        <ChatInput
                            replyingTo={replyingTo} onSubmit={onSubmit}
                            attachment={attachment} messages={messages} chatInput={chatInput}
                            fileinput={fileinput} message={message}
                            onFileChange={onFileChange} onMessageChange={onMessageChange}
                            clearAttachment={clearAttachment} replyTo={replyTo}
                        />
                    </div>
                </div>

            </section>
        </div>
    )
}
