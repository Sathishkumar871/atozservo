import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaVideo as FaVideoIcon } from "react-icons/fa";
import "./VideoCallMobile.css";
import socket from "../socket";

const VideoCallMobile: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [callTime, setCallTime] = useState(0);
  const [ringing, setRinging] = useState(true);
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    let timer: any;

    const initCall = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection();
      peerRef.current = peer;

      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate);
        }
      };

      peer.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRinging(false);
          setCallStarted(true);
          timer = setInterval(() => setCallTime(t => t + 1), 1000);
        }
      };

      socket.emit("join-call");

      socket.on("offer", async (offer) => {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", answer);
      });

      socket.on("answer", async (answer) => {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async (candidate) => {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("ICE error:", e);
        }
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("offer", offer);
    };

    initCall();

    return () => {
      clearInterval(timer);
      peerRef.current?.close();
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !micOn);
      setMicOn(prev => !prev);
    }
  };

  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !camOn);
      setCamOn(prev => !prev);
    }
  };

  const endCall = () => {
    peerRef.current?.close();
    localStream?.getTracks().forEach(track => track.stop());
    navigate("/chatroom");
  };

  const answerCall = () => {
    setRinging(false);
    setCallStarted(true);
  };

  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="video-call-wrapper full-screen">
      {!callStarted && ringing && (
        <div className="incoming-call-screen">
          <div className="caller-info">
            <img src="/profile.jpg" className="caller-pic" alt="profile" />
            <h2>Okazaki Suzuko</h2>
            <p>Incoming video call...</p>
          </div>
          <div className="call-action">
            <button className="video-icon" onClick={answerCall}><FaVideoIcon /></button>
            <p>Swipe up to answer</p>
            <p>Swipe down to decline</p>
          </div>
        </div>
      )}

      {callStarted && (
        <>
          <div className="video-header">
            <div className="profile-pic">
              <img src="/profile.jpg" alt="user" />
            </div>
            <div className="call-time">{formatTime(callTime)}</div>
          </div>

          <div className="video-area">
            <video ref={remoteVideoRef} autoPlay className="caller-video" />
            <video ref={localVideoRef} autoPlay muted className="local-video" />
          </div>

          <div className="call-controls">
            <button className={`control-btn ${micOn ? "" : "off"}`} onClick={toggleMic}>
              {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>

            <button className="end-call-btn" onClick={endCall}>
              <FaPhoneSlash />
            </button>

            <button className={`control-btn ${camOn ? "" : "off"}`} onClick={toggleCam}>
              {camOn ? <FaVideo /> : <FaVideoSlash />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCallMobile;