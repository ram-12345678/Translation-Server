import React, { useEffect, useCallback, useState } from "react";
import peer from "./peer";
import { useSocket } from "./SocketProvider";
import { message } from "antd";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  useEffect(() => {
    if (remoteSocketId) {
      handleCallUser();
    }
  }, [socket, remoteSocketId, handleCallUser]);

  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
  }, []);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setMyStream(stream);
      // console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      // console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
    console.log("GOT TRACKS!!");
    setRemoteStream(remoteStream[0]);
    });
    if (remoteSocketId)
      message.success('Both are successfully connected.');
  }, [remoteSocketId]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const toggleMute = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
  };

  return (
    <div>
      <h1>Host Room Page</h1>
      <h4>{remoteSocketId ? message.success("Both are successfully connected.") : "No one in room"}</h4>
     
      {myStream && (
        <>
          <audio
            controls
            autoPlay={false}
            muted={!isSpeakerEnabled}
            ref={(audio) => {
              if (audio && myStream) {
                audio.srcObject = myStream;
              }
            }}
          />
           <button onClick={toggleSpeaker}>{isSpeakerEnabled ? "Disable Speaker" : "Enable Speaker"}</button>
        </>
      )}
    </div>
  );
};

export default RoomPage;