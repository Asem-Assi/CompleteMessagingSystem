import React, { useState } from 'react';

const MediaPermissions = () => {
  const [hasPermissions, setHasPermissions] = useState(null);
  const [error, setError] = useState(null);

  const requestMediaPermissions = async () => {
    try {
      // Request access to both the microphone and camera
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      // If successful, set permissions status
      setHasPermissions(true);

      // Stop the media tracks to avoid keeping the camera/microphone on
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      // If there's an error, set permissions status and error
      setHasPermissions(false);
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={requestMediaPermissions}>Request Media Permissions</button>
      {hasPermissions !== null && (
        <p>{hasPermissions ? 'Permissions granted' : `Permissions denied: ${error}`}</p>
      )}
    </div>
  );
};

export default MediaPermissions;
