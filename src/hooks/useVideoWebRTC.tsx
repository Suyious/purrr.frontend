import iceServers from "@/data/ice";
import { useRef, useState } from "react";

export const useVideoWebRTC = () => {
    const servers = {
        iceServers
    }

    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    const init = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        setLocalStream(stream);
        return stream;
    }

    const destroy = () => {
        if(localStream) {
            localStream?.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    }

    const createPeerConnection = (stream: MediaStream, callback: (value: RTCSessionDescriptionInit | null) => void) => {

        peerConnection.current = new RTCPeerConnection(servers);
        const newRemoteStream = new MediaStream();
        setRemoteStream(newRemoteStream);

        if(stream) {
            stream.getTracks().forEach(track => {
                peerConnection.current?.addTrack(track, stream);
            })
        }

        if(peerConnection.current) {
            peerConnection.current.ontrack = async (event) => {
                event.streams[0].getTracks().forEach(track => {
                    newRemoteStream.addTrack(track);
                })
            }
        }

        peerConnection.current.onicecandidate = async (event) => {
            if (event.candidate && peerConnection.current?.localDescription) {
                callback(peerConnection.current.localDescription);
            }
        }
    }

    const createOffer = async (callback: (value: RTCSessionDescriptionInit | null) => void) => {
        const stream = await init();
        createPeerConnection(stream, callback)
        const offer = await peerConnection.current?.createOffer();
        await peerConnection.current?.setLocalDescription(offer);
    }

    const createAnswer = async (offer: RTCSessionDescriptionInit | null ,callback: (value: RTCSessionDescriptionInit | null) => void) => {
        const stream = await init();
        createPeerConnection(stream, callback);

        if (!offer) return alert("NO OFFER");

        await peerConnection.current?.setRemoteDescription(offer);

        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
    }
    
    const addAnswer = async (answer: RTCSessionDescriptionInit | null) => {
        if (!answer) return alert('NO ANSWER');

        if (peerConnection.current) {
            if (!peerConnection.current.currentRemoteDescription) {
                await peerConnection.current.setRemoteDescription(answer);
                setConnected(true);
            }
        }
    }

    const disconnect = () => {
        if(peerConnection.current) {
            peerConnection.current.close();
            setRemoteStream(null);
            setConnected(false);
        }
        destroy();
    }

    return {
        init,
        destroy,
        localStream,
        remoteStream,
        createOffer,
        createAnswer,
        addAnswer,
        connected,
        setConnected,
        disconnect,
    }
}