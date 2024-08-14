import React, { useState, useEffect } from "react";
import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import Header from "./header";
import VideoDisplay from "./videoDisplay";
import CameraControls from "./cameraControls";
import ParticipantCount from "./participantCount";
import Modal from "../utils/modal";

VoxeetSDK.initialize("YOUR_CONSUMER_KEY", "YOUR_CONSUMER_SECRET");

const Conference = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participants, setParticipants] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setCameraStream(stream);
      setCameraEnabled(true);
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };
  const handleInputChange = (e) => {
    setAccessToken(e.target.value);
  };

  const handleAuthenticate = () => {
  
    console.log('Access Token:', accessToken);
    closeModal(); 
  };

  const closeModal = () => 
    setIsModalOpen(false);

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

  const joinConference =  async() => {
    setIsModalOpen(true);
    
    const userName = "User";
    await VoxeetSDK.session.open({ name: userName });

    const conference =  VoxeetSDK.conference.create({
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
    startCamera(); 

    const updateParticipants = () => {
      setParticipants(VoxeetSDK.conference.participants.size);
    };

    VoxeetSDK.conference.on("participantAdded", updateParticipants);
    VoxeetSDK.conference.on("participantRemoved", updateParticipants);

    return () => {
      console.log("data----");
      // VoxeetSDK.conference.off("participantAdded", updateParticipants);
      // VoxeetSDK.conference.off("participantRemoved", updateParticipants);
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <VideoDisplay cameraStream={cameraStream} />
        <CameraControls
          cameraEnabled={cameraEnabled}
          toggleCamera={toggleCamera}
          joinConference={joinConference}
        />
      <Modal isOpen={isModalOpen} >
        <h2 className="text-xl font-bold mb-4"> Client Access Token:</h2>
       <input
          type="text"
          value={accessToken}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-4"
          onClick={handleAuthenticate}
        >
          Authenticate
        </button>
      </Modal>

        <ParticipantCount participants={participants} />
      </div>
    </div>
  );
};

export default Conference;
