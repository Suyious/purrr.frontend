import AttachmentIcon from "@/assets/icons/attachment";
import ExitIcon from "@/assets/icons/exit";
import RefreshIcon from "@/assets/icons/refresh";
import SmileyIcon from "@/assets/icons/smiley";
import { Message } from "@/types/messages";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

type ChatProps = {
    partner: string,
    messages: Message[],
    onMessage: (message: string|null, image: string|null) => void,
    onStop: () => void,
    onReconnect: () => void,
}

export default function Chat({ partner, onMessage, messages, onStop, onReconnect }: ChatProps) {

    const message = useRef<HTMLInputElement>(null);
    const fileinput = useRef<HTMLInputElement>(null);
    const [attachment, setAttachment] = useState<string>("");

    const messagesEnd = useRef<HTMLDivElement>(null);

    function scrollToBottom() {
      messagesEnd.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
      const rect = messagesEnd.current?.getBoundingClientRect();
      if (rect
          && rect.top >= 0 && rect.left >= 0
          && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          && rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
            scrollToBottom();
          }
    }, [messages]);

    function onSubmit(e: FormEvent) {
        e.preventDefault();

        let msg: string|null = null, img:string|null = null;

        if(message.current){
            if(message.current.value.trim() !== "") msg = message.current.value;
            message.current.value = "";
        }

        if(attachment.length !== 0) {
            img = attachment;
            setAttachment("");
        }
        onMessage(msg, img);
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

    return (
        <section className="w-full flex justify-center items-center relative">

            <div className="flex flex-col justify-end w-[1080px] max-w-full min-h-full py-[5em]">
                {messages.map((message, i) => (
                    (message.body || message.image) && <div key={i} className="flex flex-col p-4" style={{ alignItems: message.from === "You" ? "end": "start"}}>
                        <h5 className="text-[0.8em]">{message.from}</h5>
                        {message.body && message.body.trim() !== "" && <h3>{message.body}</h3>}
                        {message.image && <Image src={decodeURIComponent(message.image)} alt="Image" width="0" height="0" sizes="100vw" className="w-full h-auto"/>}
                    </div>
                ))}
                <div className="messages-end" ref={messagesEnd}></div>
            </div>

            <header className="fixed top-0 left-0 w-full bg-background">
                <div className="w-[1080px] max-w-full p-4 m-auto flex justify-between items-end">
                    <div className="">
                        <h4 className="text-[0.8em]">You&apos;re connected to</h4>
                        <h2>{partner}</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onRefresh}><RefreshIcon/></button>
                        <button onClick={onStop}><ExitIcon/></button>
                    </div>
                </div>
            </header>

            <form onSubmit={onSubmit} className="fixed bg-background bottom-[1em] border-[1px] border-foreground p-2 w-[1080px] max-w-[95vw] flex">
                <button type="button" className="mr-2 w-[30px] h-[30px] flex justify-center items-center rounded-md">
                    <SmileyIcon/>
                </button>
                <button onClick={() => fileinput.current?.click()} type="button" className="mr-2 w-[25px] h-[25px] flex justify-center items-center rounded-md">
                    <input accept="image/*" onChange={onFileChange} ref={fileinput} type="file" className="hidden"/>
                    <AttachmentIcon width="20"/>
                </button>
                <input ref={message} className="bg-inherit flex-1 outline-none text-sm" type="text" placeholder="Send a message"/>
                <button className="text-sm px-4 rounded-md hover:bg-slate-400" type="submit">Send</button>
            </form>
        </section>
    )
}
