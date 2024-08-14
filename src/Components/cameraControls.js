import React, { useState } from "react";

const CameraControls = ({ cameraEnabled, toggleCamera, joinConference }) => {

  return (
    <div className="mt-4">
      <button
        className={`px-6 py-3 ${
          cameraEnabled ? "bg-red-600" : "bg-blue-600"
        } text-white rounded-lg`}
        onClick={toggleCamera}
      >
        {cameraEnabled ? "Stop Camera" : "Start Camera"}
      </button>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg m-4"
        onClick={joinConference}
      >
        Join Meeting
      </button>
    </div>
  );
};

export default CameraControls;
