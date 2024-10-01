import { useEffect } from "react"

type StartChattingProps = {
    name: string,
    onConnect: () => void
}

export default function StartChatting({ name, onConnect }: StartChattingProps) {

    useEffect(() => {
        document.title = "Purrr.chat | Connect Now with a Random Stranger";
    }, [])

    return (
        <section className="w-full h-full flex justify-center items-center">
            <div className="text-center max-w-[80vw]">
                <h2 className="text-[1.4em]">Hi, { name }</h2>
                <h1 className="text-[3em] leading-[1em]">Connect Now to Chat</h1>
                <button onClick={onConnect} className="mt-4 py-2 px-16 border-2 border-foreground rounded-lg text-[1.1em]">Connect Now</button>
                <p className="mt-4">You can connect to a random stranger and start chatting now.</p>
            </div>
        </section>
    )
}