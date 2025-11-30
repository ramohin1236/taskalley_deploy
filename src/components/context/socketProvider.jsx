// contexts/SocketContext.js
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketLoading, setSocketLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "https://rnj64vmh-9000.inc1.devtunnels.ms";

  useEffect(() => {
 
    if (!accessToken || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    setSocketLoading(true);

    // Initialize socket with token in URL query parameter
    const socket = io(`${socketUrl}?token=${accessToken}`, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    // Connection success
    socket.on("connect", () => {
      setSocketLoading(false);
      setIsConnected(true);
      console.log("Socket connected ");
    });

    // Disconnected
    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected ");
    });

    // Error handler
    socket.on("socket-error", (error) => {
      console.error("Socket error:", error);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, user]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        socketLoading,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
