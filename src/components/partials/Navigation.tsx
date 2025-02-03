import Image from "next/image";
import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="w-full h-28 flex justify-center items-center fixed top-0 left-0 z-[99]">
            <div className="max-w-[90vw] w-fit py-1 px-4 flex gap-4 justify-between items-center bg-[#00000033] backdrop-blur-lg border border-white/20 rounded-xl">
                <Link href="/">
                    <Image className="mt-2 w-[3.5em] h-auto" src="/logo.png" width="200" height="200" alt="purrr logo"/>
                </Link>
                <ul className="hidden md:flex text-white text-[0.95em] gap-2 font-text">
                    <li className="py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-white/10"><Link href="/how-it-works">How it works</Link></li>
                    <li className="py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-white/10"><Link href="/features">Features</Link></li>
                    <li className="py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-white/10"><Link href="/feedback">Feedback</Link></li>
                    <li className="py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-white/10"><Link href="/blog">Blog</Link></li>
                </ul>
                <div className="w-10 h-10 ml-4 flex md:hidden flex-col justify-center items-center gap-2 cursor-pointer">
                    <div className="w-8 border-t-[2px] bg-foreground"></div>
                    <div className="w-8 border-t-[2px] bg-foreground"></div>
                </div>
                <Link className="bg-accent text-white py-2 font-[500] px-8 rounded-[5px] text-[0.8em] transition-shadow duration-300 ease-in-out hover:shadow-primary" href="/chat">Try Now</Link>
            </div>
        </nav>
    )
}