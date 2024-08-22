import React, { useState, useEffect, useRef } from 'react';
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';

const PlayingComponent = () => {
  const [playing, setPlaying] = useState(false);
  const [streamId, setStreamId] = useState('stream123'); // Consider making this dynamic
  const webRTCAdaptor = useRef(null);
  const playingStream = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    if (webRTCAdaptor.current) {
      webRTCAdaptor.current.play('stream123');
      playingStream.current = streamId;
    }
  };

  const handleStopPlaying = () => {
    setPlaying(false);
    if (webRTCAdaptor.current) {
      webRTCAdaptor.current.stop(playingStream.current);
    }
  };

  useEffect(() => {
    if (webRTCAdaptor.current) return;

    webRTCAdaptor.current = new WebRTCAdaptor({
      websocket_url: process.env.REACT_APP_WEBSOCKET_URL,
      mediaConstraints: {
        video: true,
        audio: true,
      },
      peerconnection_config: {
        //iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
      },
      sdp_constraints: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      },
      remoteVideoId: 'remoteVideo',
      callback: (info, obj) => {
        if (info === 'initialized') {
          console.log('its initialize correctly at calle')

          handlePlay(); // Trigger play when initialized
        }
       // console.log(info, obj);
      },
      callbackError: function (error, message) {
        console.log(error, message);
        if (error === 'no_stream_exist') {
          handleStopPlaying();
          setPlaying(false);
          alert(error);
        }
      },
    });

    return () => {
      if (webRTCAdaptor.current) {
        webRTCAdaptor.current.stop(playingStream.current);
      }
    };
  }, []);

  return (
    <div className="flex items-start justify-center">
      <video
        id="remoteVideo"
        controls
        autoPlay
        muted="muted"
        playsInline
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

export default PlayingComponent;
