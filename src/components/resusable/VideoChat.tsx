import { type WebRTCState } from "@/hooks/useWebRTC";

type VideoChatProps = {
    webRTCState: WebRTCState,
    endVideoCall: (localEvent: boolean) => void
};

export function VideoChat({ webRTCState, endVideoCall }: VideoChatProps) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row relative">
                {webRTCState.remoteStream && (
                    <video
                        className="rounded-md mx-2 my-3"
                        autoPlay
                        playsInline
                        ref={video => {
                            if (video) video.srcObject = webRTCState.remoteStream;
                        }}
                    />
                )}

                {webRTCState.localStream && (
                    <video
                        className="rounded-md mx-2 my-3 absolute bottom-5 right-5 w-28"
                        autoPlay
                        playsInline
                        muted
                        ref={video => {
                            if (video) video.srcObject = webRTCState.localStream;
                        }}
                    />
                )}

            </div>
            <button
                className="px-3 py-2 bg-red-600 hover:bg-red-400 transition-colors rounded-3xl text-white"
                onClick={() => endVideoCall(true)}>
                End Call
            </button>
        </div>
    )
}
