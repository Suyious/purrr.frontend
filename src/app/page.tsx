"use client"
import Chat from "@/components/sections/Chat";
import Greeting from "@/components/sections/Greeting";
import NotConnected from "@/components/sections/NotConnected";
import StartChatting from "@/components/sections/StartChatting";
import WaitingForChat from "@/components/sections/WaitingForChat";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function Home() {

  const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL ? process.env.SOCKET_SERVER_URL: 'http://localhost:3007'; 
  const { user, partner, messages, isConnected, isWaiting, setUserName, findPartner, sendMessage } = useChatSocket(SOCKET_SERVER_URL);

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
          content = <Chat partner={partner} onMessage={sendMessage} messages={messages}/>;
        }
      } else { // if user is waiting for a partner
        content = <WaitingForChat />;
      }
    }
  }

  return (
    <main className="w-full h-full">
      {content}
    </main>
  );
}
