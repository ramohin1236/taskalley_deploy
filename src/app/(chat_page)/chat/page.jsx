// components/chat/ChatInterface.jsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { FaImage } from "react-icons/fa6";
import { useSocket } from "@/components/context/socketProvider";

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: "received", text: `Hello ${user?.Name || "there"}` },
    { id: 2, type: "received", text: "How are you doing?" },
    { id: 3, type: "received", text: "Are you free now?" },
    { id: 4, type: "sent", text: "Hello!" },
    { id: 5, type: "sent", text: "I'm doing great, thanks!" },
    { id: 6, type: "sent", text: "Yes, I'm available" },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      type: "sent",
      text: input
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  const { socket, isConnected } = useSocket();
  console.log(socket, isConnected);

  return (
    <div className="flex flex-col h-[750px] max-w-4xl mx-auto bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-4 bg-gray-50">
        <img
          src={user?.image || "https://randomuser.me/api/portraits/women/45.jpg"}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{user?.Name || "Unknown User"}</p>
          <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
        </div>
      </div>

      {/* Profile Center */}
      <div className="flex flex-col items-center py-6 border-b">
        <img
          src={user?.image || "https://randomuser.me/api/portraits/women/45.jpg"}
          alt="profile"
          className="w-20 h-20 rounded-full"
        />
        <p className="mt-3 text-lg font-bold">{user?.Name || "Unknown User"}</p>
        <p className="text-sm text-gray-500">{user?.location || "Location not available"}</p>
      </div>

      {/* Messages Section (scrollable only here) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-xs text-gray-400 text-center">TODAY AT {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

        {messages.map((msg) =>
          msg.type === "received" ? (
            <div key={msg.id} className="flex items-start gap-2">
              <img
                src={user?.image || "https://randomuser.me/api/portraits/women/45.jpg"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <p className="bg-green-100 px-4 py-2 rounded-2xl max-w-xs">{msg.text}</p>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end">
              <p className="bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-xs">
                {msg.text}
              </p>
            </div>
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="flex items-center gap-2 p-4 border-t">
        <button className="text-gray-500 hover:text-green-600 cursor-pointer">
          <FaImage size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-full bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="text-green-600 hover:text-green-800 cursor-pointer"
        >
          <FiSend size={22} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;