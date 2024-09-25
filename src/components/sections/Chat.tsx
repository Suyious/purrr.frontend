import AttachmentIcon from "@/assets/icons/attachment";
import CloseIcon from "@/assets/icons/close";
import ExitIcon from "@/assets/icons/exit";
import RefreshIcon from "@/assets/icons/refresh";
import ScrollDown from "@/assets/icons/scrollDown";
import SmileyIcon from "@/assets/icons/smiley";
import { Message } from "@/types/messages";
import Image from "next/image";
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react"

type ChatProps = {
    partner: string,
    partnerGone: boolean,
    messages: Message[],
    onMessage: (message: string|null, image: string|null) => void,
    onStop: () => void,
    onReconnect: () => void,
    readIndex: number | null,
    readMessage: (messageId: number) => void,
}

export default function Chat({ partner, partnerGone, onMessage, messages, onStop, onReconnect, readIndex, readMessage }: ChatProps) {

    const message = useRef<HTMLInputElement>(null);
    const fileinput = useRef<HTMLInputElement>(null);
    const chatBottom = useRef<HTMLDivElement>(null);

    const [attachment, setAttachment] = useState<string>("");
    const [unread, setUnread] = useState<number>(0);

    const scrollToBottom = useCallback(() => {
        if(!document.hidden) {
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
        if(messages.length > 0) {
            const last_message = messages[messages.length - 1];
            if(!isScrollAvailable()) {
                if(!document.hidden) {
                    readMessage(messages.length - 1);
                } else {
                    setUnread(n => n + 1);
                }
            } else {
                if (isScrolledToBottom() || last_message.from === "You") {
                    scrollToBottom();
                    if(document.hidden) setUnread(n => n + 1);
                } else if(last_message.from !== "You"){
                    setUnread(n => n + 1);
                }
            }
        }
    }, [messages, readMessage, scrollToBottom]);

    const markReadIfViewed = useCallback(() => {
        if(isScrolledToBottom() || !isScrollAvailable()) {
            setUnread(0);
            if(!document.hidden) readMessage(messages.length - 1);
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
    
    function onSubmit(e: FormEvent) {
        e.preventDefault();

        let msg: string|null = null, img:string|null = null;

        if(message.current){
            if(message.current.value.trim() !== "") msg = message.current.value;
            message.current.value = "";
            message.current.focus();
        }

        if(attachment.length !== 0) {
            img = attachment;
            setAttachment("");
        }
        if(msg || img) onMessage(msg, img);
    }

    function onFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        console.log(file);
        if(file) {
            // Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target?.result as string;
                // setAttachments(attachs => [...attachs, base64Image]);
                setAttachment(base64Image);
            };
            reader.readAsDataURL(file);
            // })
        }
    }

    function onRefresh() {
        onStop();
        onReconnect();
    }

    function clearAttachment() {
        setAttachment("");
    }

    return (
        <section className={"w-full flex justify-center items-end relative font-text"}>

            <div className="flex flex-col justify-end w-[1080px] max-w-full min-h-full py-[5em]">
                {messages.map((message, i) => (
                    (message.body || message.image) && <div key={i} className="flex flex-col px-4" style={{ alignItems: message.from === "You" ? "end": "start"}}>
                        { (i === 0 || message.from !== messages[i - 1].from) && <h5 className="text-[0.8em] pt-4">{message.from}</h5> }
                        {message.image && <Image src={decodeURIComponent(message.image)} alt="Image" width="0" height="0" sizes="100vw" className="w-[10em] h-auto max-h-[20em]"/>}
                        {message.body && message.body.trim() !== "" && <h3 className="max-w-[20em] break-words">{message.body}</h3>}
                        { i === readIndex && (message.from === "You" ? <p className="text-[0.7em] self-end">Read by {partner}</p>: <div className="h-[1em]"/>)}
                    </div>
                ))}
                <div ref={chatBottom}></div>
            </div>

            { unread > 0 && <button onClick={scrollToBottom} className="fixed bottom-[5em]">
                <div className="bg-foreground font-[800] font-mono text-background text-[0.8em] w-5 h-5 flex justify-center items-center rounded-[50%] absolute right-0">{unread}</div>
                <ScrollDown/>
            </button> }

            <header className="fixed top-0 left-0 w-full bg-background font-display">
                <div className="w-[1080px] max-w-full p-4 m-auto flex justify-between items-end">
                  { partnerGone ?
                    <div className="">
                        <h4 className="text-[0.8em]">You are no longer connected to anyone</h4>
                        <button onClick={onRefresh}>Reconnect</button>
                    </div>
                    :
                    <div className="">
                        <h4 className="text-[0.8em]">You&apos;re connected to</h4>
                        <h2>{partner}</h2>
                    </div>
                  }
                    <div className="flex gap-2">
                        <button onClick={onRefresh}><RefreshIcon/></button>
                        <button onClick={onStop}><ExitIcon/></button>
                    </div>
                </div>
            </header>

            <form onSubmit={onSubmit} className="fixed bg-background bottom-[1em] border-[1px] border-foreground p-2 w-[1080px] max-w-[95vw] flex rounded-[50px]">
              <fieldset disabled={partnerGone}>
                { attachment.length > 0 && <div className="absolute -top-24 border-[1px] border-foreground rounded-lg">
                    <button type="button" onClick={clearAttachment} className="bg-foreground font-[800] font-mono text-background text-[0.8em] w-5 h-5 flex justify-center items-center rounded-[50%] absolute -top-2 -right-2">
                        <CloseIcon width="18" fill="background"/>
                    </button>
                    <Image src={decodeURIComponent(attachment)} alt="Image" width="0" height="0" sizes="100vw" className="w-[5em] h-[5em] rounded-lg object-cover" />
                </div> }
                <button type="button" className="mr-2 w-[30px] h-[30px] flex justify-center items-center rounded-md">
                    <SmileyIcon/>
                </button>
                <button onClick={() => fileinput.current?.click()} type="button" className="mr-2 w-[25px] h-[25px] flex justify-center items-center rounded-md">
                    <input accept="image/*" onChange={onFileChange} ref={fileinput} type="file" className="hidden"/>
                    <AttachmentIcon width="20"/>
                </button>
                <input ref={message} disabled={partnerGone} autoFocus className="bg-inherit flex-1 outline-none text-base" type="text" placeholder="Send a message"/>
                <button className="text-sm px-4 rounded-md" type="submit">Send</button>
              </fieldset>
            </form>

        </section>
    )
}
