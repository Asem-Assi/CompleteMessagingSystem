import React, { useRef, useEffect, useContext, useState } from "react";
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
import Context from "../Context";

const PublishingComponent = ({ calle }) => {
  console.log('here is the WEBSOCKET_URL',process.env.WEBSOCKET_URL)
  const [publishing, setPublishing] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [streamId, setStreamId] = useState('stream123'); // Make this dynamic if needed
  const { socket } = useContext(Context);
  
  const webRTCAdaptor = useRef(null);
  const publishedStreamId = useRef(null);

  const handlePublish = () => {
    if (!webRTCAdaptor.current) return;

    setPublishing(true);
    webRTCAdaptor.current.publish(streamId);
    publishedStreamId.current = streamId;
    console.log("Publishing stream with ID:", streamId);

    socket.emit('callUser', { calleSocketId: calle?.socketId, streamId });
  };

  useEffect(() => {
    console.log('here is the WEBSOCKET_URL',process.env.REACT_APP_WEBSOCKET_URL)

    if (webRTCAdaptor.current) return;

    webRTCAdaptor.current = new WebRTCAdaptor({
      websocket_url: process.env.REACT_APP_WEBSOCKET_URL, // Ensure this URL is correct
      mediaConstraints: {
        video: true,
        audio: true,
      },
  
      sdp_constraints: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false,
      },
      localVideoId: 'localVideo',
      dataChannelEnabled: true,
      callback: (info, obj) => {
        if (info === 'initialized') {
          setWebsocketConnected(true);
          console.log("WebRTC initialized");
        }
        else if (info === 'publish_started') {
          console.log("Publish started successfully:", obj);
        }
        else if (info === 'ice_connection_state_changed') {
          console.log("ICE connection state:", obj.state);
          if (obj.state === 'connected') {
            console.log("ICE connection established.");
          }
        }
        else if (info === 'data_channel_opened') {
          console.log("Data channel opened:", obj);
        }
        else if (info === 'stream_information') {
          console.log("Stream information received:", obj);
        }
        else if (info === 'pong') {
         // console.log("Pong received:", obj);
        }
       // console.log(info, obj);
      },
      callbackError: function (error, message) {
        console.error("WebRTC Error:", error, message);
      },
    });

    return () => {
      if (webRTCAdaptor.current) {
        console.log('Stopping WebRTC streaming and cleaning up');
        webRTCAdaptor.current.stop(publishedStreamId.current);
      }
    };
  }, [streamId]);
  useEffect(()=>{             handlePublish();  // Publish the stream once opened
  },[])

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <video
        id="localVideo"
        controls
        autoPlay
        muted
        style={{
          width: '40vw',
          height: '60vh',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      ></video>
    </div>
  );
};

export default PublishingComponent;
