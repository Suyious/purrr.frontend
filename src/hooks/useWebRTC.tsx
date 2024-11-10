import { ClientEvents, ClientToServerEvents, ServerEvents, ServerToClientEvents } from "@/types/events";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

export type WebRTCState = {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    peerConnection: RTCPeerConnection | null;
    connected: boolean;
}

export const useWebRTC = (socket: Socket<ServerToClientEvents, ClientToServerEvents> | null, partner: string | null) => {
    const [webRTCState, setWebRTCState] = useState<WebRTCState>({
        localStream: null,
        remoteStream: null,
        peerConnection: null,
        connected: false
    });

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const [incomingCall, setIncomingCall] = useState(false);
    const [ongoingCall, setOngoingCall] = useState(false);

    const setupLocalStream = useCallback(async () => {
        try {
            console.log("Accessing Local Streams")
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            setWebRTCState(prev => ({ ...prev, localStream: stream }));

            stream.getTracks().forEach(track => {
                if (peerConnectionRef.current) {
                    peerConnectionRef.current.addTrack(track, stream);
                }
            });
        } catch (error) {
            console.error('Error getting local stream:', error);
        }
    }, [peerConnectionRef]);

    const setupPeerConnection = useCallback(() => {
        console.log("Setting up WebRTC Peer Connection");

        const iceServers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
            ],
        };

        const peerConnection = new RTCPeerConnection(iceServers);
        peerConnectionRef.current = peerConnection;

        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit(ClientEvents.SEND_CANDIDATE, event.candidate);
            }
        };

        peerConnection.ontrack = (event) => {
            setWebRTCState(prev => ({
                ...prev,
                remoteStream: event.streams[0]
            }));
        };

        peerConnection.onconnectionstatechange = () => {
            setWebRTCState(prev => ({
                ...prev,
                connected: peerConnection.connectionState === 'connected'
            }));
        };

        setWebRTCState(state => ({ ...state, peerConnection }));

        return peerConnection;
    }, [socket]);

    const endVideoCall = useCallback((localEvent: boolean) => {
        console.log("Closing Video Call: localEvent =", localEvent);
        setIncomingCall(false);
        setOngoingCall(false);
        console.log("Stopping localtracks", webRTCState.localStream);
        webRTCState.localStream?.getTracks().forEach(track => track.stop());

        setWebRTCState({
            localStream: null,
            remoteStream: null,
            peerConnection: null,
            connected: false,
        });

        if (socket && localEvent) {
            console.log("Emitted End Video Call to Partner");
            socket.emit(ClientEvents.END_VIDEO_CALL);
        }
    }, [webRTCState, socket]);

    useEffect(() => {
        if (!socket) return;

        const peerConnection = setupPeerConnection();

        socket.on(ServerEvents.INCOMING_CALL, () => {
            console.log("Incoming Call!");
            setIncomingCall(true);
        });

        socket.on(ServerEvents.CALL_DECLINED, ({ reason }) => {
            switch (reason) {
                case 'reject':
                    setIncomingCall(false);
                    console.log("Somehow Tell the user that whom you called declined your call!");
                    break;
                case 'hangup':
                    setOngoingCall(false);
                    endVideoCall(false);
                    console.log("Oh No! They hanged up the call!");
                    break;
            }
        });

        socket.on(ServerEvents.SET_OFFER, async (offer) => {
            try {
                console.log("Setting Offer..., Sending Answer..., Starting Ongoing Call...");
                setOngoingCall(true);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                await setupLocalStream();
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit(ClientEvents.SEND_ANSWER, answer);
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        })

        socket.on(ServerEvents.SET_ANSWER, async (answer) => {
            try {
                console.log("Setting Answer...");
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        })

        socket.on(ServerEvents.SET_CANDIDATE, async (candidate) => {
            try {
                console.log("Adding ICE Candidate...");
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error handling ice candidate:', error);
            }
        });

        return () => {
            console.log("Cleanup... closing connection peer");
            peerConnection.close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setupLocalStream, setupPeerConnection, socket]);

    const requestVideoCall = useCallback(() => {
        if (socket && partner) {
            console.log("Requesting Video Call to Partner");
            socket.emit(ClientEvents.REQUEST_VIDEO_CALL);
        }
    }, [socket, partner]);

    const declineIncomingCall = useCallback(() => {
        if (socket && partner) {
            console.log("Declined Incoming Call");
            socket.emit(ClientEvents.DECLINE_INCOMING_CALL);
            setIncomingCall(false);
        }
    }, [socket, partner]);

    const startVideoCall = useCallback(async () => {
        console.log("Accepted Incoming Call... Starting Video Call");
        setIncomingCall(false);
        setOngoingCall(true);
        try {
            if (peerConnectionRef.current && socket) {
                await setupLocalStream();

                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                socket.emit(ClientEvents.SEND_OFFER, offer);
            }
        } catch (error) {
            console.error('Error starting video call:', error);
            throw error;
        }
    }, [setupLocalStream, socket]);

    return {
        requestVideoCall,
        incomingCall,
        ongoingCall,
        declineIncomingCall,
        webRTCState,
        startVideoCall,
        endVideoCall,
    };
}
