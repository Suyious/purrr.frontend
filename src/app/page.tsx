"use client"
import Chat from "@/components/sections/Chat";
import Greeting from "@/components/sections/Greeting";
import NotConnected from "@/components/sections/NotConnected";
import StartChatting from "@/components/sections/StartChatting";
import WaitingForChat from "@/components/sections/WaitingForChat";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function Home() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, gender, partner, partnerGender, messages, isConnected, isWaiting, setUserDetails, findPartner, sendMessage } = useChatSocket();

  let content;

  if (!isConnected) {
    content = <NotConnected/>;
  } else {  // if connected to server
    if (!user) {
      content = <Greeting onSubmit={setUserDetails} />;
    } else { // if connected to server and username is set
      if (!isWaiting) {
        if (!partner) { // if user hasn't allowed to find matches
          content = <StartChatting name={user} onConnect={findPartner} />;
        } else { // if matches found
          content = <Chat partner={partner} partnerGender={partnerGender} onMessage={sendMessage} messages={messages}/>;
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
