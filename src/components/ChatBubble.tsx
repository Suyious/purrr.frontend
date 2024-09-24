import Image from "next/image";
import { Message } from "@/types/messages";

type ChatBubbleProps = {
  messages: Message[],
  i: number,
  readIndex: number | null,
  partner: string
}

export default function ChatBubble({ messages, i, partner, readIndex }: ChatBubbleProps) {
    const message = messages[i];
    return (
      (message.body || message.image) && <div key={i} className="flex flex-col px-4" style={{ alignItems: message.from === "You" ? "end": "start"}}>
          { (i === 0 || message.from !== messages[i - 1].from) && <h5 className="text-[0.8em] pt-4">{message.from}</h5> }
          {message.image && <Image src={decodeURIComponent(message.image)} alt="Image" width="0" height="0" sizes="100vw" className="w-[10em] h-auto max-h-[20em]"/>}
          {message.body && message.body.trim() !== "" && <h3 className="max-w-[20em] break-words">{message.body}</h3>}
          { i === readIndex && <p className="text-[0.7em] self-end">Read by {partner}</p>}
      </div>
    )
}
