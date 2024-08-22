import React, { useRef, useEffect, useContext } from "react";
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
import Context from "../Context";

const Calling = ({ isCaller, calle }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const webrtcAdaptor = useRef();
  const { socket } = useContext(Context);

  useEffect(() => {
    console.log('Initializing WebRTCAdaptor...');

    webrtcAdaptor.current = new WebRTCAdaptor({
      websocket_url: 'wss://ant.topuphost.com:5443/WebRTCApp/websocket',
      mediaConstraints: {
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: "user", // Can be "environment" for rear camera
        },
      },
      peerconnection_config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
      sdp_constraints: { OfferToReceiveAudio: true, OfferToReceiveVideo: true },
      localVideoId: 'localVideo',
      remoteVideoId: 'remoteVideo',
      callback: (info, obj) => {
        console.log("Callback info:", info, "Object:", obj);
        if (info === "initialized") {
          console.log("WebRTCAdaptor initialized successfully");
          if (isCaller) {
            console.log("Attempting to publish stream...");
            socket.emit('callUser', { calleSocketId: calle.socketId });
            webrtcAdaptor.current.publish("123", );
          } else {
            console.log('Callee is waiting for the stream to play.');
            webrtcAdaptor.current.play("123");
          }
        } else if (info === "publish_started") {
          console.log("Publishing started successfully.");
        } else if (info === "publish_finished") {
          console.log("Publishing finished.");
        } else if (info === "play_started") {
          console.log("Playing started successfully.");
        } else if (info === "play_finished") {
          console.log("Playing finished.");
        } else if (info === "closed") {
          console.log("WebSocket connection closed.");
        } else {
          console.log("Unhandled callback info:", info);
        }
      },
      
      callbackError: (error) => {
        console.error("Error:", error);
      },
      onRemoteStream: (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }
    });

    return () => {
      if (webrtcAdaptor.current) {
        console.log('Cleaning up WebRTCAdaptor...');
        webrtcAdaptor.current?.stop();
      }
    };
  }, [isCaller, calle, socket]);

  return (
    <div>
      <video ref={localVideoRef} id="localVideo" autoPlay muted playsInline />
      <video ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline />
    </div>
  );
};

export default Calling;
