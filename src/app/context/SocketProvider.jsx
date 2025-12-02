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
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";

    const socketInstance = io("https://rnj64vmh-9000.inc1.devtunnels.ms", {
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

    // Listen for incoming messages - use 'on' instead of 'once' for continuous listening
    socketInstance.on("receive-message", (data) => {
      console.log("New message received via socket:", data);
      setNewMessage(data);
    });

    return () => {
      socketInstance.off("receive-message");
      socketInstance.disconnect();
    };
  }, []);

const sendMessageSoket = (messageData) => {
    if (!socket) return;
    console.log(messageData)
    const res =  socket.emit("send-message", messageData);
    return res;
  };

 const getMessage = (userId) => {
  return new Promise((resolve) => {
    if (!socket) return resolve(null);

    // Use 'on' instead of 'once' for continuous listening to incoming messages
    socket.on(`message-${userId}`, (data) => {
      console.log("Message received:", data);
      resolve(data);
    });
  });
};

  const seenMessage = (messageData) => {
    if (!socket) return;
  console.log("Emitting seen-message:", messageData);
    socket.emit("seen", messageData);
  }

  const onMessageReceived = (callback) => {
    if (!socket) return;
    socket.on("receive-message", callback);
    return () => socket.off("receive-message", callback);
  };

  const onMessageReceivedForUser = (userId, callback) => {
    if (!socket) return;
    const eventName = `new-message-for-${userId}`;
    socket.on(eventName, callback);
    return () => socket.off(eventName, callback);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessageSoket, seenMessage, getMessage, newMessage, setNewMessage, onMessageReceived, onMessageReceivedForUser }}>
      {children}
    </SocketContext.Provider>
  );
};
