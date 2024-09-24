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
    partnerGone,
    messages,
    isConnected,
    isWaiting,
    readIndex,
    setUserName,
    findPartner,
    sendMessage,
    disconnect,
    readMessage,
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

          if (partnerGone) {  // if the partner left, show the chat history
            content = <Chat partner={""} partnerGone={partnerGone}
              onMessage={sendMessage} messages={messages}
              onStop={disconnect} onReconnect={findPartner}
              readIndex={readIndex} readMessage={readMessage} />;
          }
        } else { // if matches found
          content = <Chat partner={partner} partnerGone={partnerGone}
                          onMessage={sendMessage} messages={messages}
                          onStop={disconnect} onReconnect={findPartner}
                          readIndex={readIndex} readMessage={readMessage} />;
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
