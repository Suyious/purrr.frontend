export default function WaitingForChat() {
    return (
        <section className="w-full h-full flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-[3em]">Waiting to Connect ...</h1>
                <button disabled className="mt-4 py-2 px-16 border-2 border-foreground rounded-lg text-[1.1em] disabled:text-foreground">Connect Now</button>
                <p className="mt-4">You will soon be connected to a random stranger and can start chatting</p>
            </div>
        </section>
    )
}