"use client"
import Chat from "@/components/sections/Chat";
import Greeting from "@/components/sections/Greeting";
import NotConnected from "@/components/sections/NotConnected";
import StartChatting from "@/components/sections/StartChatting";
import WaitingForChat from "@/components/sections/WaitingForChat";
import { useChatSocket } from "@/hooks/useChatSocket";
import Link from "next/link";
import Image from "next/image";
import SettingsDropdown from "@/components/layout/SettingsDropdown";

export default function ChatPage() {

  const {
    user,
    partner,
    messages,
    isConnected,
    isWaiting,
    readIndex,
    setUserName,
    findPartner,
    sendMessage,
    readMessage,
    startTyping,
    stopTyping,
    partnerTyping,
    disconnect,
  } = useChatSocket();

  let content;

  if (!isConnected) {
    content = <NotConnected/>;
  } else {  // if connected to server
    if (!user) {
      content = <Greeting onSubmit={setUserName} />;
    } else { // if connected to server and username is set
      if (!isWaiting) {
        if (!partner) { // if user hasn't allowed to find matches
          content = (<>
            <nav className="w-full h-24 fixed top-0 left-0 z-[99]">
                <div className="max-w-[90vw] m-auto h-full flex justify-between items-center">
                    <Link href="/">
                        <Image className="w-[5em] h-auto" src="/logo.png" width="200" height="200" alt="purrr logo"/>
                    </Link>
                    <SettingsDropdown setUserName={setUserName}  />
                </div>
            </nav>
            <StartChatting name={user} onConnect={findPartner} />
          </>
          );
        } else { // if matches found
          content = <Chat partner={partner}
                          onMessage={sendMessage} messages={messages}
                          onStop={disconnect} onReconnect={findPartner}
                          readIndex={readIndex} readMessage={readMessage}
                          startTyping={startTyping} stopTyping={stopTyping} partnerTyping={partnerTyping} />;
        }
      } else { // if user is waiting for a partner
        content = <WaitingForChat />;
      }
    }
  }

  return (
    <main className="w-full h-full font-display">
      {content}
    </main>
  );
}
