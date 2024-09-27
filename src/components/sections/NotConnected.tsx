import Image from "next/image";

export default function NotConnected() {
    return (
        <section className="w-full h-full flex justify-center items-center">
            <div className="text-center flex flex-col items-center">
                <h2 className="text-[1.4em]">Welcome</h2>
                <Image className="dark:hidden" src="/mascot-light.png" width="100" height="100" alt="purrr.chat Mascot"/>
                <Image className="light:hidden" src="/mascot.png" width="100" height="100" alt="purrr.chat Mascot"/>
                <h1 className="text-[3em]">Connecting You to</h1>
                <Image className="dark:hidden" src="/logo-light.png" width="200" height="200" alt="purrr.chat Logo"/>
                <Image className="light:hidden" src="/logo.png" width="200" height="200" alt="purrr.chat Logo"/>
                <p className="mt-4">You can connect to a random stranger and start chatting once we connect.</p>
            </div>
        </section>
    )
}