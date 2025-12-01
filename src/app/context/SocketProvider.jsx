'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";

    const socketInstance = io("http://10.10.20.9:9000", {
      auth: { token },
      query: { token },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

const sendMessageSoket = (messageData) => {
    if (!socket) return;
    const res =  socket.emit("send-message", messageData);
    return res;
  };

  const seenMessage = (messageData) => {
    if (!socket) return;
  console.log("Emitting seen-message:", messageData);
    socket.emit("seen", messageData);
  }
  return (
    <SocketContext.Provider value={{ socket, isConnected ,sendMessageSoket, seenMessage}}>
      {children}
    </SocketContext.Provider>
  );
};
