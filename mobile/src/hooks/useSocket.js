import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const WS_URL = API_URL;

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    return token;
  } catch (error) {
    console.error("Failed to get token", error);
    return null;
  }
};

export default function useSocket({ onCompanionRequest, onCompanionUpdate }) {
  const socketRef = useRef(null);

  useEffect(() => {
    let socket;
    async function connect() {
      const token = await getToken();
      socket = io(WS_URL, {
        auth: {
          token,
        },
        transports: ["websocket"],
      });

      socketRef.current = socket;

      if (onCompanionRequest) {
        socket.on("companion-request", (data) => {
          onCompanionRequest(data?.request);
        });
      }

      // Handle companion measurement updates
      socket.on("body-measure-created", (data) => {
        console.log("Body measure created:", data);
        if (onCompanionUpdate) {
          onCompanionUpdate(data);
        }
      });

      socket.on("body-measure-updated", (data) => {
        console.log("Body measure updated:", data);
        if (onCompanionUpdate) {
          onCompanionUpdate(data);
        }
      });

      socket.on("body-measure-deleted", (data) => {
        console.log("Body measure deleted:", data);
        if (onCompanionUpdate) {
          onCompanionUpdate(data);
        }
      });

      // Handle exercise updates
      socket.on("exercise-created", (data) => {
        console.log("Exercise created:", data);
        if (onCompanionUpdate) {
          onCompanionUpdate(data);
        }
      });

      socket.on("exercise-updated", (data) => {
        console.log("Exercise updated:", data);
        if (onCompanionUpdate) {
          onCompanionUpdate(data);
        }
      });

      socket.on("exercise-deleted", (data) => {
        console.log("Exercise deleted:", data);
        if (onCompanionUpdate) {
          onCompanionUpdate(data);
        }
      });

      // Handle companion updates for exercises
      socket.on("companion-exercise-update", (data) => {
        console.log("Companion exercise update:", data);
        if (onCompanionUpdate) {
          onCompanionUpdate(data);
        }
      });
    }
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}
