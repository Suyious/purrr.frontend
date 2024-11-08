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

    const setupLocalStream = useCallback(async () => {
        try {
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

    useEffect(() => {
        if (!socket) return;

        const peerConnection = setupPeerConnection();

        socket.on(ServerEvents.INCOMING_CALL, () => {
            setIncomingCall(true);
        });

        socket.on(ServerEvents.SET_OFFER, async (offer) => {
            try {
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
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        })

        socket.on(ServerEvents.SET_CANDIDATE, async (candidate) => {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error handling ice candidate:', error);
            }
        });

        return () => {
            peerConnection.close();
        }
    }, [setupLocalStream, setupPeerConnection, socket]);

    const requestVideoCall = useCallback(() => {
        if (socket && partner) {
            socket.emit(ClientEvents.REQUEST_VIDEO_CALL);
        }
    }, [socket, partner]);

    const declineIncomingCall = useCallback(() => {
        if (socket && partner) {
            if (incomingCall) {
                socket.emit(ClientEvents.DECLINE_INCOMING_CALL);
                setIncomingCall(false);
            }
        }
    }, [socket, partner, incomingCall]);

    const startVideoCall = useCallback(async () => {
        setIncomingCall(false);
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

    const endVideoCall = useCallback(() => {
        webRTCState.localStream?.getTracks().forEach(track => track.stop());
        peerConnectionRef.current?.close();

        setWebRTCState({
            localStream: null,
            remoteStream: null,
            peerConnection: null,
            connected: false,
        });

        setupPeerConnection();
    }, [setupPeerConnection, webRTCState]);

    return {
        requestVideoCall,
        incomingCall,
        declineIncomingCall,
        webRTCState,
        startVideoCall,
        endVideoCall,
    };
}
