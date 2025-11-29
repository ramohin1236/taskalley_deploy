"use client";
import React, { useRef, useEffect, useState, useCallback, Suspense } from "react";
import { FiSend } from "react-icons/fi";
import { FaImage } from "react-icons/fa6";
import { useSocket } from "@/components/context/socketProvider";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useGetMyProfileQuery } from "@/lib/features/auth/authApi";

const ChatContent = ({ user }) => {
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
  const params = useSearchParams();
  const queryReceiverId = params?.get("receiverId");
  const queryConversationId = params?.get("conversationId");
  const [conversationId, setConversationId] = useState(queryConversationId || null);
  const [receiverId, setReceiverId] = useState(queryReceiverId || null);
  const [conversation, setConversation] = useState(null);
  const [pendingMessage, setPendingMessage] = useState(null);
  const { data: profileData } = useGetMyProfileQuery();
  const myUserId = profileData?.data?._id;

  const { socket, isConnected } = useSocket();
  const refetchMessages = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit("get_messages", { conversationId, page: 1, limit: 50 });
  }, [socket, conversationId]);

  const sendMessage = useCallback(
    (messageData) => {
      if (!socket || !isConnected) return;

        const canSend = (() => {
          if (conversation?.task?.status) return conversation.task.status === "IN_PROGRESS";
          if (conversation?.bid?.status) return conversation.bid.status === "IN_PROGRESS";
          return true;
        })();
        if (!canSend) {
          toast.error("Chat is only available while the related task/bid is In Progress.");
          return;
        }

      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        id: `temp-${Date.now()}`,
        text: messageData.text,
        imageUrl: messageData.imageUrl || [],
        videoUrl: messageData.videoUrl || [],
        pdfUrl: messageData.pdfUrl || [],
        receiver: receiverId,
        msgByUserId: myUserId || undefined,
        isMyMessage: true,
        conversationId: conversationId,
        createdAt: new Date().toISOString(),
        seen: false,
      };

      setMessages((prev) => {
        if (prev.some((m) => m._id === optimisticMessage._id)) return prev;
        return [...prev, optimisticMessage];
      });

      if (!conversationId && receiverId) {
        // Find or create a conversation then queue message
        setPendingMessage(messageData);
        socket.emit("create_conversation", { receiver: receiverId });
        socket.emit("find_or_create_conversation", { receiver: receiverId });
      } else {
        socket.emit("send-message", {
          ...messageData,
          conversationId,
          receiver: receiverId,
        });
        // also emit underscore variant for compatibility
        socket.emit("send_message", {
          ...messageData,
          conversationId,
          receiver: receiverId,
        });
      }

      setTimeout(() => {
        refetchMessages();
      }, 200);
    },
    [socket, isConnected, conversationId, receiverId, refetchMessages, myUserId]
  );

  const handleSendClick = () => {
    const txt = input.trim();
    if (!txt) return;
    sendMessage({ text: txt });
    setInput("");
  };

  console.log(socket, isConnected);

  useEffect(() => {
    if (queryConversationId) setConversationId(queryConversationId);
    if (queryReceiverId) setReceiverId(queryReceiverId);
  }, [queryConversationId, queryReceiverId]);

  useEffect(() => {
    if (!socket) return;

    const onConversation = (data) => {
      const conv = data?.data || data;
      if (!conv) return;
      setConversation(conv);
      const cid = conv._id || conv.id;
      setConversationId(cid);
      // send queued message if present
      if (pendingMessage && cid) {
        socket.emit("send-message", { ...pendingMessage, conversationId: cid, receiver: receiverId });
        socket.emit("send_message", { ...pendingMessage, conversationId: cid, receiver: receiverId });
        setPendingMessage(null);
        setTimeout(() => refetchMessages(), 200);
      }
    };

    const onMessages = (data) => {
      const arr = data?.data || data;
      if (!Array.isArray(arr)) return;
      setMessages(
        arr.map((e) => ({
          ...e,
          _id: e._id || e.id,
          id: e._id || e.id,
          type: e.sender === myUserId ? "sent" : "received",
        }))
      );
    };

    const onNewMessage = (e) => {
      const mapped = { ...e, _id: e._id || e.id, id: e._id || e.id, type: e.sender === myUserId ? "sent" : "received" };
      setMessages((prev) => [...prev, mapped]);
    };

    socket.on("conversation_data", onConversation);
    socket.on("messages_data", onMessages);
    socket.on("new_message", onNewMessage);
    socket.on("conversation_created", onConversation);

    // try to fetch messages if we already have a conversationId
    if (conversationId) {
      refetchMessages();
    } else if (receiverId) {
      // find or create conversation with receiver
      socket.emit("find_or_create_conversation", { receiver: receiverId });
    }

    return () => {
      socket.off("conversation_data", onConversation);
      socket.off("messages_data", onMessages);
      socket.off("new_message", onNewMessage);
      socket.off("conversation_created", onConversation);
    };
  }, [socket, conversationId, receiverId, refetchMessages, pendingMessage, myUserId]);

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
      {conversation && ((conversation?.task?.status && conversation.task.status !== "IN_PROGRESS") || (conversation?.bid?.status && conversation.bid.status !== "IN_PROGRESS")) && (
        <div className="p-3 bg-yellow-50 text-yellow-800 border-b border-yellow-100 text-sm text-center">
          Chat is available only while the related task/bid is In Progress.
        </div>
      )}
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
          onKeyDown={(e) => e.key === "Enter" && handleSendClick()}
          className="flex-1 px-4 py-2 rounded-full bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={conversation && ((conversation?.task?.status && conversation.task.status !== "IN_PROGRESS") || (conversation?.bid?.status && conversation.bid.status !== "IN_PROGRESS"))}
        />
        <button
          onClick={handleSendClick}
          className="text-green-600 hover:text-green-800 cursor-pointer"
        >
          <FiSend size={22} />
        </button>
      </div>
    </div>
  );
};

const ChatInterface = ({ user }) => {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent user={user} />
    </Suspense>
  );
};

export default ChatInterface;