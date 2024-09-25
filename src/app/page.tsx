"use client"
import Chat from "@/components/sections/Chat";
import Greeting from "@/components/sections/Greeting";
import NotConnected from "@/components/sections/NotConnected";
import StartChatting from "@/components/sections/StartChatting";
import WaitingForChat from "@/components/sections/WaitingForChat";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function Home() {

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
          content = <StartChatting name={user} onConnect={findPartner} />;
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
