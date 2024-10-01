import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="w-full h-24 fixed top-0 left-0 z-[99]">
            <div className="max-w-[90vw] m-auto h-full flex justify-between items-center">
                <Link href="/">
                    <Image className="w-[5em] h-auto" src="/logo.png" width="200" height="200" alt="purrr logo"/>
                </Link>
                <ul className="hidden sm:flex gap-4 text-[0.9em]">
                    <li><Link href="/how-it-works">How it Works</Link></li>
                    <li><Link href="/features">Features</Link></li>
                    <li><Link href="/feedback">Feedback</Link></li>
                    <li><Link href="/blog">Blog</Link></li>
                </ul>
                <Link className="bg-accent text-white py-2 font-[500] px-10 rounded-[50px] text-[0.8em] display-text" href="/chat">Try Now</Link>
            </div>
        </nav>
    )
}