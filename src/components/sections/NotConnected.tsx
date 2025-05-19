export default function NotConnected() {
    return (
        <section className="w-full h-full flex justify-center items-center font-text">
            <div className="text-center flex flex-col items-center">
                <h2 className="text-[1.4em] font-display">Welcome</h2>
                <h1 className="text-[3em]">Connecting You to <span className="font-display">Purrr.chat</span></h1>
                <p className="mt-4 max-w-[80vw] font-display">You can connect to a random stranger and start chatting once we connect.</p>
            </div>
        </section>
    )
}