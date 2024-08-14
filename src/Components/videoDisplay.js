import React, { useRef, useEffect } from "react";

const VideoDisplay = ({ cameraStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="mt-4"
      style={{ width: "100%", maxWidth: "400px" }}
    />
  );
};

export default VideoDisplay;
