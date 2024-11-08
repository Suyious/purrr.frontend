import { WebRTCState } from "@/hooks/useWebRTC";

type VideoChatProps = {
    webRTCState: WebRTCState
};

export function VideoChat({ webRTCState }: VideoChatProps) {
    return (
        <div className="flex flex-row">
            {
                webRTCState.localStream && (
                    <video
                        autoPlay
                        playsInline
                        muted
                        ref={video => {
                            if (video) video.srcObject = webRTCState.localStream;
                        }}
                    />
                )
            }

            {
                webRTCState.remoteStream && (
                    <video
                        autoPlay
                        playsInline
                        muted
                        ref={video => {
                            if (video) video.srcObject = webRTCState.remoteStream;
                        }}
                    />
                )
            }
        </div>
    )
}
