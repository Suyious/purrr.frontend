import Footer from "@/components/partials/Footer";
import Navigation from "@/components/partials/Navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-full">
      <Navigation/>
      <header className="relative">
        <div className="relative">
          <Image className="min-h-dvh h-full" src="/landingbg.jpg" width="3596" height="1280" style={{
            objectFit: "cover",
            objectPosition: "40%",
          }} alt="background for the landing page"/>
          <div className="absolute top-0 w-full h-full bg-[linear-gradient(180deg,rgba(0,0,0,0.2)29.6%,rgba(0,0,0,0)100%)]"></div>
          <div className="absolute bottom-0 w-full h-[10em] bg-[linear-gradient(180deg,_rgba(255,_255,_255,_0)_0%,var(--background))]"></div>
        </div>
        <div className="absolute top-[20em] w-full">
          <div className="max-w-[90vw] m-auto flex flex-col items-center text-center font-text">
            <h2 className="w-full text-[1.5em] md:text-[2.5em] leading-8">Connect, Chat, and Explore</h2>
            <h1 className="w-full text-[2.5em] md:text-[4em] font-[700]">Your <span className="font-display font-[400]">Conversations</span>, Your <span className="font-display font-[400]">Way</span></h1>
            <p className="font-text w-[580px] max-w-full m-auto text-[1em] md:text-[1.2em]">Meet new people, share moments, and chat with total freedom. No sign-ups, no data logs, no limits.</p>
            <Link className="bg-accent text-white font-text font-[700] text-[1em] md:text-[1.2em] px-16 py-3 mt-8 rounded-xl transition-shadow duration-300 ease-in-out hover:shadow-primary" href="/chat">Start Chatting Now</Link>
          </div>
        </div>
      </header>
      <Footer/>
    </main>
  );
}
