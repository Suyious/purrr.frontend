import { Message } from "@/types/messages";
import { FormEvent, useRef } from "react"

type ChatProps = {
    partner: string,
    messages: Message[],
    onMessage: (message: string) => void,
}

export default function Chat({ partner, onMessage, messages }: ChatProps) {

    const message = useRef<HTMLInputElement>(null);

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if(message.current){
            onMessage(message.current.value);
            message.current.value = "";
        }
    }

    return (
        <section className="w-full flex justify-center items-center relative">

            <div className="flex flex-col justify-end w-full min-h-full py-[5em]">
                {messages.map((message, i) => (
                    <div key={i} className="flex flex-col p-4" style={{ textAlign: message.from === "You" ? "right": "left"}}>
                        <h5 className="text-[0.8em]">{message.from}</h5>
                        <h3>{message.body}</h3>
                    </div>
                ))}
            </div>

            <header className="fixed top-0 left-0 w-full p-4 bg-background">
                <h4>You&apos;re connected to</h4>
                <h2>{partner}</h2>
            </header>

            <form onSubmit={onSubmit} className="fixed bg-background bottom-[1em] border-[1px] border-foreground p-4 w-[95vw] flex">
                <input ref={message} className="bg-inherit flex-1 outline-none" type="text" placeholder="Send a message"/>
                <button>Send</button>
            </form>
        </section>
    )
}