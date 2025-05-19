"use client";
import Footer from "@/components/partials/Footer";
import Navigation from "@/components/layout/Navigation";
import StaggerredSpans from "@/components/utils/Splitintospans";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const MotionLink = motion.create(Link);
  const MotionImage = motion.create(Image);

  return (
    <main className="w-full h-full">
      <Navigation
        logo="/logo.png"
        links={[
          { label: "How it works", href: "/how-it-works"},
          { label: "Features", href: "/features"},
          { label: "Feedback", href: "/feedback"},
          { label: "Blog", href: "/blog"},
        ]}
      />

      <header className="relative">
        <div className="relative">
          <MotionImage
           className="min-h-dvh h-full" src="/landingbg.jpg" width="3436" height="2811" style={{
            objectFit: "cover",
            objectPosition: "40%",
          }} alt="background for the landing page"/>
          <div className="absolute top-0 w-full h-full bg-[linear-gradient(180deg,rgba(0,0,0,0.2)29.6%,rgba(0,0,0,0)100%)]"></div>
          <div className="absolute bottom-0 w-full h-[10em] bg-[linear-gradient(180deg,_rgba(255,_255,_255,_0)_0%,var(--background))]"></div>
        </div>

        <div className="absolute top-[30dvh] md:top-[40dvh] w-full">
          <div className="max-w-[90vw] m-auto flex flex-col items-center text-center font-text">
            <h2 className="w-full text-[1.5em] md:text-[2.5em] leading-8">
              <StaggerredSpans delay={0.2}>
                Connect, Chat, and Explore
              </StaggerredSpans>
              </h2>
            <h1 className="w-full text-[2em] md:text-[4em] font-[700]">
              <StaggerredSpans delay={1} className={(word) => (word === "Conversations," || word === "Way") ? "font-display font-normal": ""}>
                Your Conversations, Your Way
              </StaggerredSpans>
              </h1>
            <p className="font-text w-[580px] max-w-full m-auto text-[1em] md:text-[1.2em]">
              <StaggerredSpans delay={2} duration={0.5}>
                Meet new people, share moments, and chat with total freedom. No sign-ups, no data logs, no limits.
              </StaggerredSpans>
            </p>
            <MotionLink
             initial={{ opacity: 0, filter: "blur(16px)" }} whileInView={{ opacity: 1, filter: "blur(0)"}} transition={{delay: 1.5, duration: 0.2 }} viewport={{ once: true }}
             className="bg-accent text-white font-text font-[700] text-[1em] md:text-[1.2em] px-16 py-3 mt-8 rounded-xl transition-shadow duration-300 ease-in-out hover:shadow-primary"
             href="/chat">Start Chatting Now</MotionLink>
          </div>
        </div>
      </header>

      <section className="py-24 display flex flex-col justify-center items-center">
        <div className="text-center">
          <h3 className="w-full text-[1.3em] md:text-[2.2em] leading-8">
            <StaggerredSpans className={(word) => (word === "purrr.chat") ? "font-display font-normal": ""}>
              How purrr.chat works?
            </StaggerredSpans>
          </h3>
          <h4 className="w-full text-[1.9em] md:text-[3.8em] font-[700]">
            <StaggerredSpans delay={1} className={(word) => (word === "Simple" || word === "Straight-forward") ? "font-display font-normal": ""}>
              {"It's Simple and Straight-forward"}
            </StaggerredSpans>
          </h4>
        </div>
        
        <motion.ul
          initial={{ opacity: 0, filter: "blur(16px)" }} whileInView={{ opacity: 1, filter: "blur(0)"}} transition={{delay: 1.5, duration: 0.2 }} viewport={{ once: true }}
          className="max-w-[90vw] w-[1080px] grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 my-8 font-text">
          <li className="min-h-[15em] max-w-[25em] w-full bg-[#00161F] rounded-md py-4 px-8">
            <div className="text-[2.5em] lg:text-[3em] text-accent font-black">01</div>
            <h5 className="text-[1.8em] lg:text-[2.1em] font-bold">Choose a name</h5>
            <p className="text-[1em] lg:text-[1.1em]">Simply choose any name to identify yourself on purrr.chat. No need to login or signup.</p>
          </li>
          <li className="min-h-[15em] max-w-[25em] w-full bg-[#00161F] rounded-md py-4 px-8 justify-self-end">
            <div className="text-[2.5em] lg:text-[3em] text-accent font-black">02</div>
            <h5 className="text-[1.8em] lg:text-[2.1em] font-bold">Find someone</h5>
            <p className="text-[1em] lg:text-[1.1em]">Randomly connect with someone to chat with in one click and leave or reconnect also in one click.</p>
          </li>
          <li className="min-h-[15em] max-w-[25em] w-full bg-[#00161F] rounded-md py-4 px-8">
            <div className="text-[2.5em] lg:text-[3em] text-accent font-black">03</div>
            <h5 className="text-[1.8em] lg:text-[2.1em] font-bold">Total Privacy</h5>
            <p className="text-[1em] lg:text-[1.1em]">Once you leave the chat, all messages are gone. We {"don't"} keep any records.</p>
          </li>
        </motion.ul>

        <MotionLink
          initial={{ opacity: 0, filter: "blur(16px)" }} whileInView={{ opacity: 1, filter: "blur(0)"}} transition={{delay: 2, duration: 0.2 }} viewport={{ once: true }}
          className="bg-accent text-white font-text font-[700] text-[0.9em] md:text-[1.1em] px-14 py-3 rounded-xl transition-shadow duration-300 ease-in-out hover:shadow-primary"
          href="/chat">Hop on to step 01</MotionLink>
        <motion.p
          initial={{ opacity: 0, filter: "blur(16px)" }} whileInView={{ opacity: 1, filter: "blur(0)"}} transition={{delay: 2, duration: 0.2 }} viewport={{ once: true }}
          className="my-1 text-[0.9em]">Get Started Now</motion.p>

      </section>

      <Footer/>
    </main>
  );
}
