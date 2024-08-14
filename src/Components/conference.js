import React, { useState, useEffect, useRef } from "react";
import VoxeetSDK from "@voxeet/voxeet-web-sdk";

VoxeetSDK.initialize("YOUR_CONSUMER_KEY", "YOUR_CONSUMER_SECRET");

const Conference = () => {
  const [participants, setParticipants] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setCameraStream(stream);
      setCameraEnabled(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setCameraEnabled(false);
    }
  };

  const toggleCamera = () => {
    if (cameraEnabled) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const joinConference = async () => {
    if (!cameraStream) {
      alert("Please enable your camera and microphone first.");
      return;
    }

    const userName = "User";
    await VoxeetSDK.session.open({ name: userName });

    const conference = await VoxeetSDK.conference.create({
      alias: "my-conference",
    });

    await VoxeetSDK.conference.join(conference, {
      constraints: {
        audio: true,
        video: true,
      },
    });
  };

  useEffect(() => {
    const updateParticipants = () => {
      setParticipants(VoxeetSDK.conference.participants.size);
    };

    VoxeetSDK.conference.on("participantAdded", updateParticipants);
    VoxeetSDK.conference.on("participantRemoved", updateParticipants);

    return () => {
      console.log("data----------------");
      // VoxeetSDK.conference.off("participantAdded", updateParticipants);
      // VoxeetSDK.conference.off("participantRemoved", updateParticipants);
    };
  }, []);

  return (
    <div className="text-center">
      <button
        className={`px-6 py-3 ${
          cameraEnabled ? "bg-red-600" : "bg-blue-600"
        } text-white rounded-lg`}
        onClick={toggleCamera}
      >
        {cameraEnabled ? "Stop Camera" : "Start Camera"}
      </button>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg mt-4"
        onClick={joinConference}
      >
        Join Conference
      </button>
      <p className="mt-4 text-xl">Participants: {participants}</p>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="mt-4"
        style={{ width: "100%", maxWidth: "500px" }}
      />
    </div>
  );
};

export default Conference;
