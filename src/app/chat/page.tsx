"use client"
import Chat from "@/components/sections/Chat";
import Greeting from "@/components/sections/Greeting";
import NotConnected from "@/components/sections/NotConnected";
import StartChatting from "@/components/sections/StartChatting";
import WaitingForChat from "@/components/sections/WaitingForChat";
import { VideoChat } from "@/components/resusable/VideoChat";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function ChatPage() {

    const {
        socket,
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

    const {
        requestVideoCall,
        incomingCall,
        declineIncomingCall,
        webRTCState,
        startVideoCall,
        // endVideoCall
    } = useWebRTC(socket, partner);

    let content;

    if (!isConnected) {
        content = <NotConnected />;
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
                        onVideoCall={requestVideoCall} incomingCall={incomingCall}
                        declineIncomingCall={declineIncomingCall}
                        startVideoCall={startVideoCall} onStop={disconnect}
                        onReconnect={findPartner} readIndex={readIndex}
                        readMessage={readMessage} startTyping={startTyping}
                        stopTyping={stopTyping} partnerTyping={partnerTyping} />;
                }
            } else { // if user is waiting for a partner
                content = <WaitingForChat />;
            }
        }
    }

    return (
        <main className="w-full h-full font-display">
            {content}
            {webRTCState.connected && <VideoChat webRTCState={webRTCState} />}
        </main>
    );
}
