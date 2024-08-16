import React, { useState } from "react";
import axios from "axios";
import { getAuthToken } from "../Services/auth";

const Streaming = () => {
  const [streamUrl, setStreamUrl] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = async () => {
    try {
      const token = await getAuthToken();

      const response = await axios.post(
        "https://api.dolby.io/v1/streaming/start",
        {
          streamName: "my-live-stream",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStreamUrl(response.data.url);
      setIsStreaming(true);
    } catch (error) {
      console.error("Error starting the stream:", error);
    }
  };

  const stopStreaming = async () => {
    try {
      const token = await getAuthToken();

      await axios.post(
        "https://api.dolby.io/v1/streaming/stop",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsStreaming(false);
      setStreamUrl("");
    } catch (error) {
      console.error("Error stopping the stream:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dolby.io Live Streaming
      </h1>
      {isStreaming ? (
        <>
          <p className="text-lg mb-4">
            Streaming URL:{" "}
            <a href={streamUrl} className="text-blue-500">
              {streamUrl}
            </a>
          </p>
          <button
            onClick={stopStreaming}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Stop Streaming
          </button>
        </>
      ) : (
        <button
          onClick={startStreaming}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Start Streaming
        </button>
      )}
    </div>
  );
};

export default Streaming;
