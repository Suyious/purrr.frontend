import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react"
import { useState } from "react";

type NavigationProps = {
    logo: string,
    links: {label: string, href: string}[],
}

export default function Navigation({ logo, links }: NavigationProps) {

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    return (
        <motion.nav
            initial={{ y: "-7em" }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
            className="w-full pt-4 flex justify-center items-center fixed top-0 left-0 z-[99]">
            <div className="max-w-[90vw] w-fit py-1 px-4 bg-[#00000033] backdrop-blur-lg border border-white/20 rounded-xl">
                <div className="flex gap-4 justify-between items-center">
                    <Link href="/">
                        <Image className="mt-2 w-[3.5em] h-auto" src={logo} width="200" height="200" alt="purrr logo"/>
                    </Link>
                    <ul className="hidden md:flex text-white text-[0.95em] gap-2 font-text">
                        { links.map((link, i) => (
                            <li key={i} className="py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-white/10">
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        )) }
                    </ul>
                    <div onClick={() => setMenuOpen(p => !p)} className="w-10 h-10 flex md:hidden flex-col justify-center items-center gap-2 cursor-pointer transition-all duration-500"
                        style={{
                            marginLeft: menuOpen? "2.5em": "1em"
                        }}
                    >
                        <div className="w-8 border-t-[2px] bg-foreground"></div>
                        <div className="w-8 border-t-[2px] bg-foreground"></div>
                    </div>
                    <Link className="bg-accent text-white py-2 font-[500] px-8 rounded-[5px] text-[0.8em] transition-shadow duration-300 ease-in-out hover:shadow-primary" href="/chat">Try Now</Link>
                </div>
                <div className="md:hidden block transition-all duration-500 ease-in-out overflow-hidden"
                    style={{
                        height: menuOpen? "13.5em": 0,
                        width: menuOpen? "80vw": 0,
                    }}
                >
                    <ul className="flex flex-col text-white justify-center items-center text-[0.95em] pt-4 gap-2 font-text">
                        { links.map((link, i) => (
                            <li key={i} className="py-2 px-4 rounded-lg text-center transition-colors duration-300 hover:bg-white/10">
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        )) }
                    </ul>
                </div>
            </div>
        </motion.nav>
    )
}