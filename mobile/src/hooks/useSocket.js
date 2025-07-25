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

export default function useSocket({ onCompanionRequest }) {
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
