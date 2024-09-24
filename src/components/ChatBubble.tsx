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
            <div className="w-fit">
              {message.image && <Image src={decodeURIComponent(message.image)} alt="Image" width="0" height="0" sizes="100vw" className="w-[20em] h-auto max-h-[20em] rounded-tl-xl rounded-tr-xl mt-1"/>}
              {message.body &&
                <div
                  className={`mb-1 mt-1 py-3 px-4 ${message.from === "You" ? "bg-blue-400 rounded-bl-2xl rounded-tl-2xl rounded-tr-xl" : "bg-gray-600 rounded-br-2xl rounded-tr-2xl rounded-tl-xl"} text-white`}
                  style={{ borderTopLeftRadius: message.image ? '0' : '', borderTopRightRadius: message.image ? '0' : '', marginTop: message.image ? '0': '' }}>
                    {message.body && message.body.trim() !== "" && <h3 className="max-w-[20em] break-words">{message.body}</h3>}
                </div>
              }
            </div>
            { i === readIndex && <p className="text-[0.7em] self-end">Read by {partner}</p>}
      </div>
    )
}
